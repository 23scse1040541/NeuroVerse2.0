import express from 'express';
import User from '../models/User.js';
import Mood from '../models/Mood.js';
import Journal from '../models/Journal.js';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard statistics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Validate req.user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id;

    // Parallel queries for better performance
    const [
      moodCount,
      journalCount,
      goalCount,
      completedGoals,
      recentMoods,
      recentJournals,
      user
    ] = await Promise.all([
      Mood.countDocuments({ user: userId }).catch(() => 0),
      Journal.countDocuments({ user: userId }).catch(() => 0),
      Goal.countDocuments({ user: userId, status: 'active' }).catch(() => 0),
      Goal.countDocuments({ user: userId, status: 'completed' }).catch(() => 0),
      (async () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return Mood.find({
          user: userId,
          date: { $gte: sevenDaysAgo }
        }).sort({ date: -1 }).limit(7).catch(() => []);
      })(),
      Journal.find({ user: userId })
        .sort({ date: -1 })
        .limit(5)
        .catch(() => []),
      User.findById(userId).catch(() => null)
    ]);

    // Safe defaults if user not found
    const safeUser = user || { streaks: { journalStreak: 0, moodStreak: 0, meditationStreak: 0 } };

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalMoodEntries: moodCount || 0,
          totalJournalEntries: journalCount || 0,
          activeGoals: goalCount || 0,
          completedGoals: completedGoals || 0
        },
        streaks: safeUser.streaks || { journalStreak: 0, moodStreak: 0, meditationStreak: 0 },
        recentMoods: recentMoods || [],
        recentJournals: recentJournals || []
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

export default router;
