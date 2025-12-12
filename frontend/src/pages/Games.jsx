import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Award, RefreshCw, Hand, X, Circle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const reward = async (amount = 5, reason = 'game_play') => {
  try {
    await axios.post('/api/auth/reward', { amount, reason });
  } catch {}
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const calcWinner = (b) => {
    for (const [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    if (b.every(Boolean)) return 'draw';
    return null;
  };

  const handleClick = async (i) => {
    if (board[i] || winner) return;
    const next = board.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const win = calcWinner(next);
    setBoard(next);
    setXIsNext(!xIsNext);
    if (win) {
      setWinner(win);
      if (win === 'draw') {
        toast('Draw! +2 EXP');
        await reward(2, 'tictactoe_draw');
      } else {
        toast.success(`${win} wins! +5 EXP`);
        await reward(5, 'tictactoe_win');
      }
    }
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); setWinner(null); };

  return (
    <div className="card neuro-hologram-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Tic Tac Toe</h3>
        <button className="btn-secondary" onClick={reset}><RefreshCw className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-3 gap-3 w-64 mx-auto">
        {board.map((cell, i) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-3xl"
          >
            {cell === 'X' ? <X className="w-8 h-8 text-primary"/> : cell === 'O' ? <Circle className="w-8 h-8 text-purple-500"/> : null}
          </motion.button>
        ))}
      </div>
      {winner && (
        <div className="text-center mt-4 font-semibold">
          {winner === 'draw' ? 'It\'s a draw!' : `${winner} wins!`}
        </div>
      )}
    </div>
  );
};

const RPS = () => {
  const options = ['rock', 'paper', 'scissors'];
  const [result, setResult] = useState(null);
  const [choice, setChoice] = useState(null);
  const [bot, setBot] = useState(null);

  const play = async (c) => {
    const b = options[Math.floor(Math.random()*3)];
    setChoice(c); setBot(b);
    let r = 'draw';
    if (
      (c==='rock'&&b==='scissors') ||
      (c==='paper'&&b==='rock') ||
      (c==='scissors'&&b==='paper')
    ) r = 'win';
    else if (c!==b) r='lose';
    setResult(r);
    if (r==='win') { toast.success('You win! +5 EXP'); await reward(5,'rps_win'); }
    if (r==='draw') { toast('Draw! +2 EXP'); await reward(2,'rps_draw'); }
    if (r==='lose') { toast('Good try! +1 EXP'); await reward(1,'rps_play'); }
  };

  const icon = (o) => o==='rock'? '🪨' : o==='paper'? '📄' : '✂️';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Rock Paper Scissors</h3>
      </div>
      <div className="flex items-center justify-center gap-4">
        {options.map(o => (
          <motion.button key={o} whileTap={{ scale: 0.9 }} onClick={() => play(o)} className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-2xl">
            {icon(o)}
          </motion.button>
        ))}
      </div>
      {result && (
        <div className="text-center mt-4 font-semibold capitalize">You {result}! You: {icon(choice)} vs Bot: {icon(bot)}</div>
      )}
    </div>
  );
};

export default function Games() {
  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
            <Gamepad2 className="w-10 h-10 mr-3" /> Games & Rewards
          </h1>
          <p className="text-gray-600">Relax with mini games and earn EXP</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <TicTacToe />
          <RPS />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mt-6">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Award className="w-5 h-5" /> Earn +5 EXP for wins, +2 for draws, +1 for plays.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
