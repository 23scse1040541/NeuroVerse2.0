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
    const userId = req.user._id;

    const moodCount = await Mood.countDocuments({ user: userId });
    const journalCount = await Journal.countDocuments({ user: userId });
    const goalCount = await Goal.countDocuments({ user: userId, status: 'active' });
    const completedGoals = await Goal.countDocuments({ user: userId, status: 'completed' });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMoods = await Mood.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 }).limit(7);

    const recentJournals = await Journal.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalMoodEntries: moodCount,
          totalJournalEntries: journalCount,
          activeGoals: goalCount,
          completedGoals
        },
        streaks: user.streaks,
        recentMoods,
        recentJournals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

export default router;
