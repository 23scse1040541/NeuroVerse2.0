import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // Player Stats
      iqScore: 100,
      totalPoints: 0,
      gamesPlayed: 0,
      winStreak: 0,
      currentStreak: 0,
      level: 1,
      experience: 0,
      
      // Game History
      gameHistory: [],
      
      // Cognitive Stats
      cognitiveStats: {
        logic: 50,
        memory: 50,
        pattern: 50,
        speed: 50,
        strategy: 50,
      },
      
      // Unlocked Content
      unlockedGames: ['logicPuzzle', 'patternDecoder', 'memoryMatrix'],
      badges: [],
      
      // Daily Challenge
      dailyChallenge: null,
      lastDailyDate: null,
      dailyCompleted: false,
      
      // Risk-Reward Multiplier
      riskMultiplier: 1,
      
      // Actions
      addPoints: (points, gameType, difficulty) => {
        const multiplier = get().riskMultiplier;
        const finalPoints = Math.floor(points * multiplier);
        
        set((state) => ({
          totalPoints: state.totalPoints + finalPoints,
          experience: state.experience + finalPoints,
          gamesPlayed: state.gamesPlayed + 1,
          currentStreak: state.currentStreak + 1,
          winStreak: Math.max(state.winStreak, state.currentStreak + 1),
        }));
        
        // Check level up
        const newLevel = Math.floor(get().experience / 1000) + 1;
        if (newLevel > get().level) {
          set({ level: newLevel });
          return { leveledUp: true, newLevel, points: finalPoints };
        }
        
        return { points: finalPoints };
      },
      
      losePoints: (points) => {
        set((state) => ({
          totalPoints: Math.max(0, state.totalPoints - points),
          currentStreak: 0,
        }));
      },
      
      updateCognitiveStat: (stat, value) => {
        set((state) => ({
          cognitiveStats: {
            ...state.cognitiveStats,
            [stat]: Math.min(100, Math.max(0, state.cognitiveStats[stat] + value)),
          },
        }));
      },
      
      addGameHistory: (gameRecord) => {
        set((state) => ({
          gameHistory: [gameRecord, ...state.gameHistory.slice(0, 99)],
        }));
      },
      
      setRiskMultiplier: (multiplier) => set({ riskMultiplier: multiplier }),
      
      unlockGame: (gameId) => {
        set((state) => ({
          unlockedGames: [...new Set([...state.unlockedGames, gameId])],
        }));
      },
      
      addBadge: (badge) => {
        set((state) => ({
          badges: [...state.badges, badge],
        }));
      },
      
      setDailyChallenge: (challenge) => {
        set({
          dailyChallenge: challenge,
          lastDailyDate: new Date().toDateString(),
          dailyCompleted: false,
        });
      },
      
      completeDaily: () => set({ dailyCompleted: true }),
      
      calculateIQ: () => {
        const stats = get().cognitiveStats;
        const avg = (stats.logic + stats.memory + stats.pattern + stats.speed + stats.strategy) / 5;
        const iq = 100 + Math.floor((avg - 50) * 2);
        set({ iqScore: iq });
        return iq;
      },
      
      resetStreak: () => set({ currentStreak: 0 }),
      
      getDifficulty: () => {
        const iq = get().iqScore;
        if (iq < 90) return 'beginner';
        if (iq < 110) return 'intermediate';
        if (iq < 130) return 'advanced';
        return 'expert';
      },
    }),
    {
      name: 'neuroverse-games',
    }
  )
);

// Game definitions
export const GAMES = {
  logicPuzzle: {
    id: 'logicPuzzle',
    name: 'Logic Labyrinth',
    description: 'Solve complex logic puzzles and deductive reasoning challenges',
    icon: '🧩',
    category: 'logic',
    difficultyLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    riskLevels: [
      { name: 'Safe', multiplier: 1, penalty: 0 },
      { name: 'Risky', multiplier: 1.5, penalty: 50 },
      { name: 'High Stakes', multiplier: 2.5, penalty: 150 },
    ],
  },
  patternDecoder: {
    id: 'patternDecoder',
    name: 'Pattern Decoder',
    description: 'Identify hidden patterns and sequences under time pressure',
    icon: '🔮',
    category: 'pattern',
    difficultyLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    riskLevels: [
      { name: 'Safe', multiplier: 1, penalty: 0 },
      { name: 'Risky', multiplier: 1.5, penalty: 50 },
      { name: 'High Stakes', multiplier: 2.5, penalty: 150 },
    ],
  },
  memoryMatrix: {
    id: 'memoryMatrix',
    name: 'Memory Matrix',
    description: 'Memorize and recall complex visual patterns',
    icon: '🧠',
    category: 'memory',
    difficultyLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    riskLevels: [
      { name: 'Safe', multiplier: 1, penalty: 0 },
      { name: 'Risky', multiplier: 1.5, penalty: 50 },
      { name: 'High Stakes', multiplier: 2.5, penalty: 150 },
    ],
  },
  strategySim: {
    id: 'strategySim',
    name: 'Strategy Simulator',
    description: 'Make critical decisions in complex scenarios',
    icon: '⚔️',
    category: 'strategy',
    difficultyLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    riskLevels: [
      { name: 'Safe', multiplier: 1, penalty: 0 },
      { name: 'Risky', multiplier: 1.5, penalty: 50 },
      { name: 'High Stakes', multiplier: 2.5, penalty: 150 },
    ],
  },
  speedDecision: {
    id: 'speedDecision',
    name: 'Speed Decision',
    description: 'Make split-second decisions under pressure',
    icon: '⚡',
    category: 'speed',
    difficultyLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    riskLevels: [
      { name: 'Safe', multiplier: 1, penalty: 0 },
      { name: 'Risky', multiplier: 1.5, penalty: 50 },
      { name: 'High Stakes', multiplier: 2.5, penalty: 150 },
    ],
  },
  mathChallenge: {
    id: 'mathChallenge',
    name: 'Math Master',
    description: 'Solve advanced mathematical problems',
    icon: '🔢',
    category: 'logic',
    difficultyLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    riskLevels: [
      { name: 'Safe', multiplier: 1, penalty: 0 },
      { name: 'Risky', multiplier: 1.5, penalty: 50 },
      { name: 'High Stakes', multiplier: 2.5, penalty: 150 },
    ],
  },
};

// Badges
export const BADGES = [
  { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: '🏆' },
  { id: 'streak_5', name: 'On Fire', description: 'Win 5 games in a row', icon: '🔥' },
  { id: 'streak_10', name: 'Unstoppable', description: 'Win 10 games in a row', icon: '⚡' },
  { id: 'risk_taker', name: 'Risk Taker', description: 'Win a High Stakes game', icon: '🎲' },
  { id: 'logic_master', name: 'Logic Master', description: 'Reach 80+ Logic stat', icon: '🧩' },
  { id: 'memory_master', name: 'Memory Master', description: 'Reach 80+ Memory stat', icon: '🧠' },
  { id: 'pattern_master', name: 'Pattern Master', description: 'Reach 80+ Pattern stat', icon: '🔮' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Reach 80+ Speed stat', icon: '💨' },
  { id: 'strategist', name: 'Master Strategist', description: 'Reach 80+ Strategy stat', icon: '⚔️' },
  { id: 'genius', name: 'Genius', description: 'Reach IQ 150+', icon: '🧠' },
  { id: 'daily_warrior', name: 'Daily Warrior', description: 'Complete 7 daily challenges', icon: '📅' },
  { id: 'point_millionaire', name: 'Point Millionaire', description: 'Earn 1,000,000 points', icon: '💰' },
];
