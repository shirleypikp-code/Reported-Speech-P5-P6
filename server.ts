import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DuelQuestion {
  id: string;
  category: string;
  directSpeech: string;
  promptPrefix?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface DuelPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  currentRound: number;
  answers: { round: number; selectedIndex: number; isCorrect: boolean; timeMs: number }[];
  isReady: boolean;
}

interface DuelRoom {
  code: string;
  createdAt: number;
  host: DuelPlayer;
  guest?: DuelPlayer;
  status: 'waiting' | 'in_progress' | 'completed';
  questions: DuelQuestion[];
  currentRound: number;
}

const duelRooms: Map<string, DuelRoom> = new Map();

// Clean up old rooms after 2 hours
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of duelRooms.entries()) {
    if (now - room.createdAt > 2 * 60 * 60 * 1000) {
      duelRooms.delete(code);
    }
  }
}, 15 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Endpoints for Duel
  // 1. Create room
  app.post('/api/duel/create', (req, res) => {
    const { host, questions } = req.body;
    if (!host || !questions) {
      return res.status(400).json({ error: 'Host and questions are required' });
    }

    // Generate 6-char room code like CAM-842
    let code = 'CAM-' + Math.floor(100 + Math.random() * 900);
    while (duelRooms.has(code)) {
      code = 'CAM-' + Math.floor(100 + Math.random() * 900);
    }

    const room: DuelRoom = {
      code,
      createdAt: Date.now(),
      host: {
        ...host,
        score: 0,
        currentRound: 0,
        answers: [],
        isReady: true
      },
      status: 'waiting',
      questions,
      currentRound: 0
    };

    duelRooms.set(code, room);
    res.json({ success: true, room });
  });

  // 2. Get room info
  app.get('/api/duel/:code', (req, res) => {
    const code = req.params.code.toUpperCase();
    const room = duelRooms.get(code);
    if (!room) {
      return res.status(404).json({ error: 'Duel room not found' });
    }
    res.json({ success: true, room });
  });

  // 3. Join room
  app.post('/api/duel/join', (req, res) => {
    const { code, guest } = req.body;
    if (!code || !guest) {
      return res.status(400).json({ error: 'Code and guest info are required' });
    }

    const room = duelRooms.get(code.toUpperCase());
    if (!room) {
      return res.status(404).json({ error: 'Duel room not found' });
    }

    if (room.guest && room.guest.id !== guest.id) {
      return res.status(400).json({ error: 'Duel room is already full (2/2 players)' });
    }

    room.guest = {
      ...guest,
      score: 0,
      currentRound: 0,
      answers: [],
      isReady: true
    };
    room.status = 'in_progress';

    duelRooms.set(room.code, room);
    res.json({ success: true, room });
  });

  // 4. Submit round answer
  app.post('/api/duel/submit-answer', (req, res) => {
    const { code, playerId, round, selectedIndex, timeMs } = req.body;
    const room = duelRooms.get(code.toUpperCase());
    if (!room) {
      return res.status(404).json({ error: 'Duel room not found' });
    }

    const player = room.host.id === playerId ? room.host : room.guest?.id === playerId ? room.guest : null;
    if (!player) {
      return res.status(403).json({ error: 'Player not part of this duel' });
    }

    const question = room.questions[round];
    if (!question) {
      return res.status(400).json({ error: 'Invalid round index' });
    }

    const isCorrect = question.correctIndex === selectedIndex;
    const speedBonus = isCorrect ? Math.max(0, Math.floor((15000 - timeMs) / 15)) : 0;
    const earnedPoints = isCorrect ? 500 + speedBonus : 0;

    player.score += earnedPoints;
    player.currentRound = round + 1;
    player.answers.push({
      round,
      selectedIndex,
      isCorrect,
      timeMs
    });

    // Check if both players finished all questions
    const maxRounds = room.questions.length;
    if (player.currentRound >= maxRounds) {
      if (room.guest && (room.host.currentRound >= maxRounds && room.guest.currentRound >= maxRounds)) {
        room.status = 'completed';
      }
    }

    duelRooms.set(room.code, room);
    res.json({ success: true, room, isCorrect, earnedPoints, explanation: question.explanation });
  });

  // Vite development middleware
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reported Speech Master server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
