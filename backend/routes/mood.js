import express from 'express';
import Mood from '../models/Mood.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/mood
// @desc    Create a new mood entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { emotion, intensity, note, trackingType, source, challengeType, helpedBy } = req.body;

    const mood = await Mood.create({
      user: req.user._id,
      emotion,
      intensity,
      note,
      trackingType,
      source,
      challengeType,
      helpedBy,
    });

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      mood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating mood entry',
      error: error.message
    });
  }
});

// @route   GET /api/mood
// @desc    Get all mood entries for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;

    let query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: moods.length,
      moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entries',
      error: error.message
    });
  }
});

// @route   GET /api/mood/analytics
// @desc    Get mood analytics and trends
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: daysAgo }
    }).sort({ date: 1 });

    const emotionCounts = {};
    let totalIntensity = 0;

    moods.forEach(mood => {
      emotionCounts[mood.emotion] = (emotionCounts[mood.emotion] || 0) + 1;
      totalIntensity += mood.intensity;
    });

    const averageIntensity = moods.length > 0 ? (totalIntensity / moods.length).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalEntries: moods.length,
        period: `${period} days`,
        emotionDistribution: emotionCounts,
        averageIntensity,
        recentMoods: moods.slice(-10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood analytics',
      error: error.message
    });
  }
});

// @route   DELETE /api/mood/:id
// @desc    Delete mood entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    if (mood.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this mood entry'
      });
    }

    await mood.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting mood entry',
      error: error.message
    });
  }
});

export default router;
