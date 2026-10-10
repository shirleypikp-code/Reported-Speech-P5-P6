import React, { useState, useEffect } from 'react';
import { UserProfile, UserProgress } from '../types';
import { DuelService, DuelRoomData } from '../services/duelService';
import { StorageService } from '../services/storageService';
import { 
  Swords, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Zap,
  HelpCircle,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DuelArenaProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  onProgressUpdate: (updated: UserProgress) => void;
  initialDuelCode?: string | null;
}

export const DuelArena: React.FC<DuelArenaProps> = ({
  userProfile,
  userProgress,
  onProgressUpdate,
  initialDuelCode
}) => {
  // Duel flow state: 'lobby' | 'waiting_guest' | 'playing' | 'round_feedback' | 'finished'
  const [stage, setStage] = useState<'lobby' | 'waiting_guest' | 'playing' | 'round_feedback' | 'finished'>('lobby');
  const [room, setRoom] = useState<DuelRoomData | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState(initialDuelCode || '');
  const [joinError, setJoinError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Round play state
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [roundTimer, setRoundTimer] = useState(15);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [lastRoundResult, setLastRoundResult] = useState<{
    isCorrect: boolean;
    earnedPoints: number;
    explanation: string;
  } | null>(null);

  // Check initialDuelCode on mount
  useEffect(() => {
    if (initialDuelCode) {
      setJoinCodeInput(initialDuelCode);
      handleJoinRoom(initialDuelCode);
    }
  }, [initialDuelCode]);

  // Polling for guest joining when waiting
  useEffect(() => {
    let interval: any = null;
    if (stage === 'waiting_guest' && room) {
      interval = setInterval(async () => {
        const latest = await DuelService.getRoom(room.code);
        if (latest && latest.guest) {
          setRoom(latest);
          setStage('playing');
          setCurrentRoundIndex(0);
          setRoundTimer(15);
          setRoundStartTime(Date.now());
          StorageService.playChime('combo');
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [stage, room]);

  // Round 15s Countdown
  useEffect(() => {
    let timer: any = null;
    if (stage === 'playing' && selectedOptionIndex === null && roundTimer > 0) {
      timer = setInterval(() => {
        setRoundTimer(t => {
          if (t <= 1) {
            handleTimeExpired();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, selectedOptionIndex, roundTimer]);

  const handleCreateRoom = async () => {
    setJoinError('');
    const newRoom = await DuelService.createRoom(userProfile, 5);
    setRoom(newRoom);
    setStage('waiting_guest');
    StorageService.playChime('click');
  };

  const handleStartBotDuel = () => {
    const botRoom = DuelService.createBotMatch(userProfile);
    setRoom(botRoom);
    setStage('playing');
    setCurrentRoundIndex(0);
    setRoundTimer(15);
    setRoundStartTime(Date.now());
    StorageService.playChime('combo');
  };

  const handleJoinRoom = async (codeToJoin?: string) => {
    const code = (codeToJoin || joinCodeInput).trim().toUpperCase();
    if (!code) return;
    setJoinError('');

    const res = await DuelService.joinRoom(code, userProfile);
    if (res.success && res.room) {
      setRoom(res.room);
      setStage('playing');
      setCurrentRoundIndex(0);
      setRoundTimer(15);
      setRoundStartTime(Date.now());
      StorageService.playChime('combo');
    } else {
      setJoinError(res.error || 'Failed to join duel room.');
    }
  };

  const handleCopyLink = () => {
    if (!room) return;
    const url = DuelService.getShareableLink(room.code);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOptionSelect = async (index: number) => {
    if (selectedOptionIndex !== null || !room) return;
    setSelectedOptionIndex(index);
    const elapsedMs = Date.now() - roundStartTime;

    const result = await DuelService.submitAnswer(
      room.code,
      userProfile.id,
      currentRoundIndex,
      index,
      elapsedMs
    );

    setRoom(result.room);
    setLastRoundResult(result);
    setStage('round_feedback');

    if (result.isCorrect) {
      StorageService.playChime('correct');
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      StorageService.playChime('wrong');
    }
  };

  const handleTimeExpired = async () => {
    if (!room) return;
    setSelectedOptionIndex(-1); // Timed out

    const result = await DuelService.submitAnswer(
      room.code,
      userProfile.id,
      currentRoundIndex,
      -1,
      15000
    );

    setRoom(result.room);
    setLastRoundResult(result);
    setStage('round_feedback');
    StorageService.playChime('wrong');
  };

  const handleNextRound = () => {
    if (!room) return;
    if (currentRoundIndex < room.questions.length - 1) {
      setCurrentRoundIndex(i => i + 1);
      setSelectedOptionIndex(null);
      setLastRoundResult(null);
      setRoundTimer(15);
      setRoundStartTime(Date.now());
      setStage('playing');
    } else {
      setStage('finished');
      StorageService.playChime('levelUp');
      try {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
      } catch (e) {}

      // Award XP
      const me = room.host.id === userProfile.id ? room.host : room.guest;
      const isWinner = me && room.guest ? me.score >= (room.host.id === userProfile.id ? room.guest.score : room.host.score) : true;
      const xpEarned = isWinner ? 150 : 75;
      const updated = {
        ...userProgress,
        xp: (userProgress.xp || 0) + xpEarned
      };
      onProgressUpdate(updated);
    }
  };

  const currentQ = room ? room.questions[currentRoundIndex] : null;

  const myState = room ? (room.host.id === userProfile.id ? room.host : room.guest) : null;
  const opponentState = room ? (room.host.id === userProfile.id ? room.guest : room.host) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            1v1 Grammar Duel Arena
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Challenge a Classmate or Friend
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Share a code or link, duel head-to-head, and master reported speech with answer explanations
          </p>
        </div>
      </div>

      {/* STAGE 1: LOBBY */}
      {stage === 'lobby' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Host Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mb-2">
                ⚔️
              </div>
              <h3 className="text-lg font-bold text-slate-900">Host a Duel Room</h3>
              <p className="text-xs text-slate-600">
                Create a 5-round Cambridge English duel and invite a friend by sending them a 6-character room code or instant link.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={handleCreateRoom}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Create Duel Room & Share Link
              </button>

              <button
                onClick={handleStartBotDuel}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4 text-slate-500" />
                Or Practice vs Inspector Lestrade (Bot)
              </button>
            </div>
          </div>

          {/* Join Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-2">
                🎯
              </div>
              <h3 className="text-lg font-bold text-slate-900">Join a Friend's Match</h3>
              <p className="text-xs text-slate-600">
                Received a code from your classmate? Type the 6-character code below to enter the battle!
              </p>
              <div>
                <input
                  type="text"
                  placeholder="e.g. CAM-842"
                  value={joinCodeInput}
                  onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-mono uppercase tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                {joinError && <p className="text-xs text-rose-500 mt-1.5 text-center">{joinError}</p>}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleJoinRoom()}
                disabled={!joinCodeInput.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Join Duel Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: WAITING GUEST IN LOBBY */}
      {stage === 'waiting_guest' && room && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-3xl animate-pulse">
            ⏳
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Room Ready! Waiting for Opponent...</h2>
            <p className="text-xs text-slate-500 mt-1">
              Share the Room Code or copy the Instant Duel Link for your classmate
            </p>
          </div>

          {/* Code & Link Box */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duel Room Code:</span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div className="text-3xl font-mono font-black tracking-widest text-slate-900 select-all">
              {room.code}
            </div>

            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedLink ? 'Link Copied!' : 'Copy Duel Link'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Host: <strong>{room.host.name}</strong></span>
            </div>
            <span>vs</span>
            <span className="italic text-slate-400">Waiting for guest to join...</span>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => handleStartBotDuel()}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl cursor-pointer"
            >
              Don't want to wait? Duel Bot Instead
            </button>
            <button
              onClick={() => setStage('lobby')}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel Room
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3 & 4: PLAYING & ROUND FEEDBACK */}
      {(stage === 'playing' || stage === 'round_feedback') && room && currentQ && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          {/* Duel Scoreboard Header */}
          <div className="grid grid-cols-3 items-center pb-4 border-b border-slate-100">
            {/* Player 1 (Left) */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl shrink-0">
                {myState?.avatar || '🎓'}
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                  {myState?.name} (You)
                </span>
                <span className="text-sm font-black font-mono text-blue-600">
                  {myState?.score || 0} pts
                </span>
              </div>
            </div>

            {/* Round & Countdown Timer (Center) */}
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Round {currentRoundIndex + 1} of {room.questions.length}
              </div>
              {stage === 'playing' ? (
                <div className={`text-2xl font-black font-mono ${roundTimer <= 4 ? 'text-rose-600 animate-bounce' : 'text-slate-900'}`}>
                  {roundTimer}s
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-600">Round Review</span>
              )}
            </div>

            {/* Player 2 (Right) */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                  {opponentState?.name || 'Opponent'}
                </span>
                <span className="text-sm font-black font-mono text-rose-600">
                  {opponentState?.score || 0} pts
                </span>
              </div>
              <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl shrink-0">
                {opponentState?.avatar || '⚔️'}
              </span>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {currentQ.category}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {currentQ.prompt}
            </h3>

            {/* Direct Speech Prompt Card */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 font-serif italic text-base sm:text-lg text-slate-900">
              {currentQ.directSpeech}
            </div>
          </div>

          {/* 4 Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;

              let btnStyle = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/20 text-slate-800';
              if (stage === 'round_feedback') {
                if (isCorrectOpt) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                } else {
                  btnStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={stage === 'round_feedback'}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition cursor-pointer flex items-center justify-between shadow-2xs ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {stage === 'round_feedback' && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {stage === 'round_feedback' && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Round Feedback & Comprehensive Answer Explanation */}
          {stage === 'round_feedback' && lastRoundResult && (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm ${
                  lastRoundResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1.5">
                  {lastRoundResult.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Round Won! +{lastRoundResult.earnedPoints} pts awarded!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>Round Lost! Inspect the Cambridge rule below:</span>
                    </>
                  )}
                </div>

                {/* Explanation text */}
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {lastRoundResult.explanation}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Rule takeaway: {currentQ.cambridgeRule}</span>
                </div>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {currentRoundIndex < room.questions.length - 1 ? (
                  <>
                    Next Round ({currentRoundIndex + 2}/{room.questions.length})
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View Final Duel Results 🏆
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE 5: FINISHED MATCH & COMPLETE BREAKDOWN REVIEW */}
      {stage === 'finished' && room && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          {/* Winner Banner */}
          <div className="text-center space-y-3 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {myState && opponentState
                ? myState.score > opponentState.score
                  ? 'Victory! You Won the Cambridge Duel! 👑'
                  : myState.score === opponentState.score
                  ? 'It\'s a Draw! Both Players Tied! 🤝'
                  : `${opponentState.name} Won the Duel!`
                : 'Match Concluded!'}
            </h2>
            <p className="text-xs text-slate-500">
              Great match! Both players practiced essential reported speech rules.
            </p>
          </div>

          {/* Final Score Comparison */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-around text-center">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                {myState?.name} (You)
              </span>
              <span className="text-2xl font-black font-mono text-blue-600">
                {myState?.score || 0} pts
              </span>
            </div>
            <div className="text-lg font-bold text-slate-300">VS</div>
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                {opponentState?.name || 'Opponent'}
              </span>
              <span className="text-2xl font-black font-mono text-rose-600">
                {opponentState?.score || 0} pts
              </span>
            </div>
          </div>

          {/* Comprehensive Question-by-Question Review with Explanations */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Itemized Match Breakdown & Explanations:
            </h3>

            <div className="space-y-3">
              {room.questions.map((q, qIdx) => {
                const myAns = myState?.answers[qIdx];
                const isCorrect = myAns?.isCorrect;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-blue-700">Round {qIdx + 1}: {q.category}</span>
                      <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                      </span>
                    </div>

                    <p className="text-xs font-serif italic text-slate-800">
                      {q.directSpeech}
                    </p>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-900">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Correct Conversion:</span>
                      {q.options[q.correctIndex]}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Grammar Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => {
                setStage('lobby');
                setRoom(null);
                setLastRoundResult(null);
                setSelectedOptionIndex(null);
              }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Duel Another Friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
