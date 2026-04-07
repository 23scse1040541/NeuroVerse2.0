import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Trophy, Target, Zap, TrendingUp, Timer, Shield,
  AlertTriangle, ChevronRight, BarChart3, Calendar, Users,
  Star, Lock, Unlock, RotateCcw, CheckCircle, XCircle,
  Lightbulb, Puzzle, Eye, Clock, Activity, Award, Flame,
  Gamepad2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGameStore, GAMES, BADGES } from '../store/gameStore';

// ==================== UTILITY COMPONENTS ====================

const Card = ({ children, className = '', onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 ${className}`}
  >
    {children}
  </motion.div>
);

const Button = ({ children, onClick, variant = 'primary', disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  };
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold transition-all ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const ProgressBar = ({ value, max, color = 'indigo', label }) => {
  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-sm mb-1"><span>{label}</span><span>{value}/{max}</span></div>}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-3 rounded-full ${colors[color]}`}
        />
      </div>
    </div>
  );
};

// ==================== GAME 1: LOGIC PUZZLE ====================

const LogicPuzzle = ({ difficulty, riskLevel, onComplete, onFail }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);

  const generatePuzzle = useCallback(() => {
    const puzzles = {
      beginner: [
        {
          question: "If all Bloops are Bleeps, and all Bleeps are Blops, are all Bloops Blops?",
          options: ["Yes", "No", "Cannot determine"],
          correct: 0,
          hint: "Think about transitive relationships",
          points: 50,
        },
        {
          question: "What comes next in the sequence: 2, 4, 8, 16, ?",
          options: ["24", "32", "30", "20"],
          correct: 1,
          hint: "Each number doubles the previous",
          points: 40,
        },
      ],
      intermediate: [
        {
          question: "Three people (Alice, Bob, Charlie) are in a line. Alice is not first. Bob is not last. Charlie is not in the middle. Who is first?",
          options: ["Alice", "Bob", "Charlie"],
          correct: 2,
          hint: "Eliminate impossible positions",
          points: 80,
        },
        {
          question: "If A > B, B < C, and C = D, which statement is true?",
          options: ["A > D", "D > B", "A = C", "Cannot determine"],
          correct: 1,
          hint: "Compare each pair carefully",
          points: 70,
        },
      ],
      advanced: [
        {
          question: "In a coded language, COMPUTER is written as RFUVQNPC. How is MEDICINE written?",
          options: ["EOJDJEFM", "FNKEKFGN", "DNIDJDFM", "FOJFKFGN"],
          correct: 0,
          hint: "Each letter shifts by +1, -1 alternately",
          points: 120,
        },
        {
          question: "Five houses in a row. The red house is left of green. Blue is right of yellow. Green is not next to blue. Yellow is first. Where is green?",
          options: ["2nd", "3rd", "4th", "5th"],
          correct: 2,
          hint: "Yellow-?-Red-Green-?-Blue pattern",
          points: 100,
        },
      ],
      expert: [
        {
          question: "You have 12 balls, one is heavier. Using a balance scale only 3 times, how do you find the heavy ball?",
          options: ["Compare 4 vs 4, then 1 vs 1, then 1 vs 1", "Compare 6 vs 6, then 3 vs 3", "Compare 4 vs 4, then 2 vs 2, then 1 vs 1", "Compare 3 vs 3, then 2 vs 2, then 1 vs 1"],
          correct: 2,
          hint: "Divide into groups of 4",
          points: 200,
        },
        {
          question: "A logician sees two perfect logicians, A and B. A says: 'At least one of us is a liar.' B says: 'A is a liar.' Who is telling the truth?",
          options: ["A only", "B only", "Both", "Neither"],
          correct: 0,
          hint: "If A is truthful, B must be lying",
          points: 180,
        },
      ],
    };
    const puzzleList = puzzles[difficulty] || puzzles.beginner;
    return puzzleList[Math.floor(Math.random() * puzzleList.length)];
  }, [difficulty]);

  useEffect(() => {
    setPuzzle(generatePuzzle());
    setTimeLeft(difficulty === 'beginner' ? 60 : difficulty === 'intermediate' ? 45 : difficulty === 'advanced' ? 30 : 20);
  }, [generatePuzzle, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      onFail(puzzle?.points * riskLevel.penalty / 100 || 0);
    }
  }, [timeLeft, selectedAnswer, onFail, puzzle, riskLevel]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === puzzle.correct;
    if (isCorrect) {
      const bonus = Math.floor(timeLeft / 10) * 5;
      onComplete(puzzle.points + bonus);
    } else {
      onFail(puzzle.points * riskLevel.penalty / 100);
    }
  };

  if (!puzzle) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className={`font-mono text-xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-gray-700'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-bold">{puzzle.points} pts</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{puzzle.question}</h3>
      </div>

      <div className="grid gap-3">
        {puzzle.options.map((option, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: selectedAnswer !== null ? 1 : 1.02 }}
            whileTap={{ scale: selectedAnswer !== null ? 1 : 0.98 }}
            onClick={() => selectedAnswer === null && handleAnswer(idx)}
            disabled={selectedAnswer !== null}
            className={`p-4 rounded-xl text-left font-medium transition-all ${
              selectedAnswer === null
                ? 'bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300'
                : selectedAnswer === idx
                  ? idx === puzzle.correct
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : 'bg-red-100 border-2 border-red-500 text-red-700'
                  : idx === puzzle.correct
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : 'bg-gray-100 border-2 border-gray-200'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {!selectedAnswer && (
        <button
          onClick={() => setShowHint(true)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <Lightbulb className="w-4 h-4" />
          Need a hint? (-10 pts)
        </button>
      )}

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl"
        >
          <p className="text-yellow-800">💡 {puzzle.hint}</p>
        </motion.div>
      )}
    </div>
  );
};

// ==================== GAME 2: PATTERN DECODER ====================

const PatternDecoder = ({ difficulty, riskLevel, onComplete, onFail }) => {
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);

  const generatePattern = useCallback(() => {
    const patterns = {
      beginner: () => {
        const start = Math.floor(Math.random() * 10);
        const diff = Math.floor(Math.random() * 5) + 1;
        return Array.from({ length: 4 }, (_, i) => start + diff * i);
      },
      intermediate: () => {
        const a = Math.floor(Math.random() * 5) + 1;
        return [a, a * 2, a * 4, a * 8];
      },
      advanced: () => {
        const a = Math.floor(Math.random() * 10) + 1;
        return [a, a + 2, a + 5, a + 9];
      },
      expert: () => {
        const a = Math.floor(Math.random() * 20) + 1;
        return [a, a * a, a * a * a];
      },
    };

    const seq = patterns[difficulty]();
    const correct = seq[seq.length - 1];
    const wrong = [correct + Math.floor(Math.random() * 10) + 1, correct - Math.floor(Math.random() * 5) - 1, correct * 2];
    const opts = [correct, ...wrong].sort(() => Math.random() - 0.5);
    
    setSequence(seq.slice(0, -1));
    setOptions(opts);
    setCorrectAnswer(correct);
    setSelected(null);
    setTimeLeft(difficulty === 'beginner' ? 30 : difficulty === 'intermediate' ? 25 : difficulty === 'advanced' ? 20 : 15);
  }, [difficulty]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  useEffect(() => {
    if (timeLeft > 0 && selected === null) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selected === null) {
      onFail(30 * riskLevel.penalty / 100);
    }
  }, [timeLeft, selected, onFail, riskLevel]);

  const handleSelect = (val) => {
    setSelected(val);
    const isCorrect = val === correctAnswer;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak * 10 + Math.floor(timeLeft / 5) * 5;
      onComplete(50 + bonus);
      setTimeout(generatePattern, 1500);
    } else {
      setStreak(0);
      onFail(50 * riskLevel.penalty / 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span className={`font-mono text-xl font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-gray-700'}`}>
              {timeLeft}s
            </span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{streak}x</span>
            </div>
          )}
        </div>
        <div className="text-gray-500">Streak: {streak}</div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl">
        <p className="text-center text-gray-600 mb-2">What comes next?</p>
        <div className="flex justify-center items-center gap-4">
          {sequence.map((num, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-indigo-600"
            >
              {num}
            </motion.div>
          ))}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl"
          >
            ?
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: selected !== null ? 1 : 1.05 }}
            whileTap={{ scale: selected !== null ? 1 : 0.95 }}
            onClick={() => selected === null && handleSelect(opt)}
            disabled={selected !== null}
            className={`p-6 rounded-xl text-2xl font-bold transition-all ${
              selected === null
                ? 'bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300 shadow-sm'
                : selected === opt
                  ? opt === correctAnswer
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : 'bg-red-100 border-2 border-red-500 text-red-700'
                  : opt === correctAnswer
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : 'bg-gray-100 border-2 border-gray-200'
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ==================== GAME 3: MEMORY MATRIX ====================

const MemoryMatrix = ({ difficulty, riskLevel, onComplete, onFail }) => {
  const [grid, setGrid] = useState([]);
  const [showPattern, setShowPattern] = useState(true);
  const [selectedCells, setSelectedCells] = useState([]);
  const [patternCells, setPatternCells] = useState([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  const getGridSize = () => {
    switch (difficulty) {
      case 'beginner': return { rows: 3, cols: 3, time: 3000 };
      case 'intermediate': return { rows: 4, cols: 4, time: 2500 };
      case 'advanced': return { rows: 5, cols: 5, time: 2000 };
      case 'expert': return { rows: 6, cols: 6, time: 1500 };
      default: return { rows: 3, cols: 3, time: 3000 };
    }
  };

  const generatePattern = useCallback(() => {
    const { rows, cols, time } = getGridSize();
    const totalCells = rows * cols;
    const patternCount = Math.min(level + 2, Math.floor(totalCells * 0.6));
    
    const pattern = [];
    while (pattern.length < patternCount) {
      const cell = Math.floor(Math.random() * totalCells);
      if (!pattern.includes(cell)) pattern.push(cell);
    }
    
    setGrid(Array(totalCells).fill(false));
    setPatternCells(pattern);
    setSelectedCells([]);
    setShowPattern(true);
    
    setTimeout(() => setShowPattern(false), time);
  }, [difficulty, level]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  const handleCellClick = (idx) => {
    if (showPattern || selectedCells.includes(idx)) return;
    
    const newSelected = [...selectedCells, idx];
    setSelectedCells(newSelected);
    
    if (!patternCells.includes(idx)) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        onFail(level * 20 * riskLevel.penalty / 100);
      }
      return;
    }
    
    const remaining = patternCells.filter(p => !newSelected.includes(p));
    if (remaining.length === 0) {
      const points = level * 30 + (difficulty === 'expert' ? 50 : difficulty === 'advanced' ? 30 : 0);
      onComplete(points);
      setLevel(l => l + 1);
      setTimeout(generatePattern, 500);
    }
  };

  const { rows, cols } = getGridSize();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">Level {level}</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-3 rounded-full ${i < lives ? 'bg-red-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {showPattern ? 'Memorize the pattern!' : `Find ${patternCells.filter(p => !selectedCells.includes(p)).length} more`}
        </div>
      </div>

      <div
        className="grid gap-2 mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: `${cols * 80}px` }}
      >
        {grid.map((_, idx) => {
          const isPattern = patternCells.includes(idx);
          const isSelected = selectedCells.includes(idx);
          const showActive = showPattern ? isPattern : isSelected;
          const isWrong = isSelected && !isPattern;
          
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: showPattern ? 1 : 1.05 }}
              whileTap={{ scale: showPattern ? 1 : 0.95 }}
              onClick={() => !showPattern && handleCellClick(idx)}
              disabled={showPattern}
              className={`w-16 h-16 rounded-xl transition-all ${
                isWrong
                  ? 'bg-red-500'
                  : showActive
                    ? 'bg-indigo-500 shadow-lg shadow-indigo-300'
                    : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isWrong && <XCircle className="w-8 h-8 text-white mx-auto" />}
            </motion.button>
          );
        })}
      </div>

      {showPattern && (
        <div className="text-center text-indigo-600 font-semibold animate-pulse">
          Memorizing... ⌛
        </div>
      )}
    </div>
  );
};

// ==================== MAIN GAMES COMPONENT ====================

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [selectedRisk, setSelectedRisk] = useState('Safe');

  const {
    iqScore,
    totalPoints,
    gamesPlayed,
    currentStreak,
    level,
    cognitiveStats,
    badges,
    addPoints,
    losePoints,
    updateCognitiveStat,
    addGameHistory,
    setRiskMultiplier,
    addBadge,
  } = useGameStore();

  const startGame = (gameId) => {
    const game = GAMES[gameId];
    const risk = game.riskLevels.find(r => r.name === selectedRisk);
    setRiskMultiplier(risk.multiplier);
    setActiveGame(gameId);
  };

  const handleGameComplete = (points) => {
    const game = GAMES[activeGame];
    const result = addPoints(points, activeGame, selectedDifficulty);
    updateCognitiveStat(game.category, 2);
    
    addGameHistory({
      game: activeGame,
      difficulty: selectedDifficulty,
      risk: selectedRisk,
      points: result.points,
      timestamp: new Date(),
      won: true,
    });

    if (gamesPlayed === 0) addBadge(BADGES[0]);
    if (currentStreak + 1 >= 5) addBadge(BADGES[1]);
    if (selectedRisk === 'High Stakes') addBadge(BADGES[3]);
    
    toast.success(`+${result.points} points! ${result.leveledUp ? `Level ${result.newLevel}! 🎉` : ''}`);
    setActiveGame(null);
  };

  const handleGameFail = (penalty) => {
    if (penalty > 0) losePoints(penalty);
    toast.error(`-${penalty} points. Try again!`);
    
    addGameHistory({
      game: activeGame,
      difficulty: selectedDifficulty,
      risk: selectedRisk,
      points: 0,
      timestamp: new Date(),
      won: false,
    });
    
    setActiveGame(null);
  };

  const renderActiveGame = () => {
    const props = {
      difficulty: selectedDifficulty,
      riskLevel: GAMES[activeGame].riskLevels.find(r => r.name === selectedRisk),
      onComplete: handleGameComplete,
      onFail: handleGameFail,
    };

    switch (activeGame) {
      case 'logicPuzzle': return <LogicPuzzle {...props} />;
      case 'patternDecoder': return <PatternDecoder {...props} />;
      case 'memoryMatrix': return <MemoryMatrix {...props} />;
      default: return null;
    }
  };

  if (activeGame) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="secondary" onClick={() => setActiveGame(null)}>
              ← Back
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 capitalize">{selectedDifficulty}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedRisk === 'Safe' ? 'bg-green-100 text-green-700' :
                selectedRisk === 'Risky' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedRisk}
              </span>
            </div>
          </div>
          <Card className="min-h-[400px]">
            {renderActiveGame()}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Brain className="w-10 h-10 text-indigo-600" />
            NeuroVerse IQ Games
          </h1>
          <p className="text-gray-600 mt-2">Train your brain with high-intensity cognitive challenges</p>
        </motion.div>

        <Card className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{iqScore}</div>
              <div className="text-sm opacity-80">IQ Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalPoints.toLocaleString()}</div>
              <div className="text-sm opacity-80">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{level}</div>
              <div className="text-sm opacity-80">Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold flex items-center justify-center gap-1">
                <Flame className="w-6 h-6 text-orange-300" />
                {currentStreak}
              </div>
              <div className="text-sm opacity-80">Win Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{gamesPlayed}</div>
              <div className="text-sm opacity-80">Games Played</div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" /> Difficulty
            </h3>
            <div className="flex gap-2 flex-wrap">
              {['beginner', 'intermediate', 'advanced', 'expert'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Risk Level
            </h3>
            <div className="flex gap-2 flex-wrap">
              {['Safe', 'Risky', 'High Stakes'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSelectedRisk(risk)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedRisk === risk
                      ? risk === 'Safe' ? 'bg-green-500 text-white' :
                        risk === 'Risky' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Cognitive Profile
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(cognitiveStats).map(([stat, value]) => (
              <div key={stat}>
                <div className="flex justify-between text-sm mb-1 capitalize">
                  <span>{stat}</span>
                  <span className="font-bold">{value}</span>
                </div>
                <ProgressBar value={value} max={100} color={
                  stat === 'logic' ? 'indigo' :
                  stat === 'memory' ? 'purple' :
                  stat === 'pattern' ? 'green' :
                  stat === 'speed' ? 'yellow' : 'red'
                } />
              </div>
            ))}
          </div>
        </Card>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" /> Choose Your Challenge
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(GAMES).slice(0, 3).map((game) => (
            <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card onClick={() => startGame(game.id)} className="h-full cursor-pointer hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{game.icon}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    game.category === 'logic' ? 'bg-indigo-100 text-indigo-700' :
                    game.category === 'memory' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {game.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{game.difficultyLevels.length} levels</span>
                  <ChevronRight className="w-5 h-5 text-indigo-600" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="mt-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" /> Achievements
          </h3>
          <div className="flex flex-wrap gap-3">
            {BADGES.slice(0, 6).map((badge) => {
              const earned = badges.find(b => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    earned ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100 opacity-50'
                  }`}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{badge.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
