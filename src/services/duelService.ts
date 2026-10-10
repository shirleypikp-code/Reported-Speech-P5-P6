import { DuelQuestion, getRandomDuelQuestions } from '../data/duelQuestions';
import { UserProfile } from '../types';

export interface DuelPlayerState {
  id: string;
  name: string;
  avatar: string;
  score: number;
  currentRound: number;
  answers: {
    round: number;
    selectedIndex: number;
    isCorrect: boolean;
    timeMs: number;
  }[];
}

export interface DuelRoomData {
  code: string;
  createdAt: number;
  host: DuelPlayerState;
  guest?: DuelPlayerState;
  status: 'waiting' | 'in_progress' | 'completed';
  questions: DuelQuestion[];
  currentRound: number;
  isBotMatch?: boolean;
}

const LOCAL_ROOM_PREFIX = 'rsm_duel_room_';

export const DuelService = {
  // Generate random room code
  generateCode(): string {
    return 'CAM-' + Math.floor(100 + Math.random() * 900);
  },

  // Generate shareable link
  getShareableLink(code: string): string {
    const origin = window.location.origin;
    return `${origin}?duel=${code.toUpperCase()}`;
  },

  // Create room
  async createRoom(hostProfile: UserProfile, questionCount = 5): Promise<DuelRoomData> {
    const questions = getRandomDuelQuestions(questionCount);
    const code = this.generateCode();

    const hostState: DuelPlayerState = {
      id: hostProfile.id,
      name: hostProfile.name,
      avatar: hostProfile.avatar,
      score: 0,
      currentRound: 0,
      answers: []
    };

    const newRoom: DuelRoomData = {
      code,
      createdAt: Date.now(),
      host: hostState,
      status: 'waiting',
      questions,
      currentRound: 0
    };

    // Save to local storage for instant access / offline capability
    localStorage.setItem(`${LOCAL_ROOM_PREFIX}${code}`, JSON.stringify(newRoom));

    // Also sync to Express server API if available
    try {
      const res = await fetch('/api/duel/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: hostState, questions })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          localStorage.setItem(`${LOCAL_ROOM_PREFIX}${data.room.code}`, JSON.stringify(data.room));
          return data.room;
        }
      }
    } catch (e) {
      console.warn('Backend duel API unavailable, running in local-first room mode', e);
    }

    return newRoom;
  },

  // Get room info
  async getRoom(code: string): Promise<DuelRoomData | null> {
    const cleanCode = code.trim().toUpperCase();

    // Check backend first
    try {
      const res = await fetch(`/api/duel/${cleanCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          localStorage.setItem(`${LOCAL_ROOM_PREFIX}${cleanCode}`, JSON.stringify(data.room));
          return data.room;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    // Check localStorage fallback
    const stored = localStorage.getItem(`${LOCAL_ROOM_PREFIX}${cleanCode}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }

    return null;
  },

  // Join room as guest
  async joinRoom(code: string, guestProfile: UserProfile): Promise<{ success: boolean; room?: DuelRoomData; error?: string }> {
    const cleanCode = code.trim().toUpperCase();
    const guestState: DuelPlayerState = {
      id: guestProfile.id,
      name: guestProfile.name,
      avatar: guestProfile.avatar,
      score: 0,
      currentRound: 0,
      answers: []
    };

    // Try backend
    try {
      const res = await fetch('/api/duel/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, guest: guestState })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          localStorage.setItem(`${LOCAL_ROOM_PREFIX}${cleanCode}`, JSON.stringify(data.room));
          return { success: true, room: data.room };
        }
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Failed to join duel room' };
      }
    } catch (e) {
      // Local fallback
    }

    const room = await this.getRoom(cleanCode);
    if (!room) {
      return { success: false, error: 'Duel code not found. Check the 6-character code with your friend!' };
    }

    room.guest = guestState;
    room.status = 'in_progress';
    localStorage.setItem(`${LOCAL_ROOM_PREFIX}${cleanCode}`, JSON.stringify(room));
    return { success: true, room };
  },

  // Submit answer
  async submitAnswer(
    code: string,
    playerId: string,
    round: number,
    selectedIndex: number,
    timeMs: number
  ): Promise<{
    room: DuelRoomData;
    isCorrect: boolean;
    earnedPoints: number;
    explanation: string;
  }> {
    const cleanCode = code.trim().toUpperCase();

    // Try backend
    try {
      const res = await fetch('/api/duel/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, playerId, round, selectedIndex, timeMs })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          localStorage.setItem(`${LOCAL_ROOM_PREFIX}${cleanCode}`, JSON.stringify(data.room));
          return data;
        }
      }
    } catch (e) {}

    // Local execution fallback
    const room = await this.getRoom(cleanCode);
    if (!room) throw new Error('Room not found');

    const question = room.questions[round];
    const isCorrect = question.correctIndex === selectedIndex;
    const speedBonus = isCorrect ? Math.max(0, Math.floor((15000 - timeMs) / 15)) : 0;
    const earnedPoints = isCorrect ? 500 + speedBonus : 0;

    const player = room.host.id === playerId ? room.host : room.guest?.id === playerId ? room.guest : null;
    if (player) {
      player.score += earnedPoints;
      player.currentRound = round + 1;
      player.answers.push({ round, selectedIndex, isCorrect, timeMs });
    }

    // If opponent is a bot, simulate bot answer
    if (room.isBotMatch && room.guest && player === room.host) {
      const botCorrect = Math.random() > 0.3; // 70% accuracy
      const botTime = Math.floor(4000 + Math.random() * 6000);
      const botBonus = botCorrect ? Math.floor((15000 - botTime) / 15) : 0;
      room.guest.score += botCorrect ? 500 + botBonus : 0;
      room.guest.currentRound = round + 1;
      room.guest.answers.push({
        round,
        selectedIndex: botCorrect ? question.correctIndex : (question.correctIndex + 1) % 4,
        isCorrect: botCorrect,
        timeMs: botTime
      });
    }

    if (player && player.currentRound >= room.questions.length) {
      if (!room.guest || room.guest.currentRound >= room.questions.length) {
        room.status = 'completed';
      }
    }

    localStorage.setItem(`${LOCAL_ROOM_PREFIX}${cleanCode}`, JSON.stringify(room));
    return {
      room,
      isCorrect,
      earnedPoints,
      explanation: question.explanation
    };
  },

  // Create Bot Match
  createBotMatch(hostProfile: UserProfile): DuelRoomData {
    const questions = getRandomDuelQuestions(5);
    const code = this.generateCode();

    const hostState: DuelPlayerState = {
      id: hostProfile.id,
      name: hostProfile.name,
      avatar: hostProfile.avatar,
      score: 0,
      currentRound: 0,
      answers: []
    };

    const botState: DuelPlayerState = {
      id: 'bot_inspector_lestrade',
      name: 'Inspector Lestrade (AI Bot)',
      avatar: '🕵️‍♂️',
      score: 0,
      currentRound: 0,
      answers: []
    };

    const room: DuelRoomData = {
      code,
      createdAt: Date.now(),
      host: hostState,
      guest: botState,
      status: 'in_progress',
      questions,
      currentRound: 0,
      isBotMatch: true
    };

    localStorage.setItem(`${LOCAL_ROOM_PREFIX}${code}`, JSON.stringify(room));
    return room;
  }
};
