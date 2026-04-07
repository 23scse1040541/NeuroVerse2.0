import express from 'express';
import KahaniyanProgress from '../models/KahaniyanProgress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Upsert reading progress for a book
router.post('/progress', protect, async (req, res) => {
  try {
    const { bookId, lastPage = 0, totalPages = 0, completed = false, favorite } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'bookId is required',
      });
    }

    const update = {
      lastPage,
      totalPages,
      completed,
      lastOpenedAt: new Date(),
    };

    if (typeof favorite === 'boolean') {
      update.favorite = favorite;
    }

    const progress = await KahaniyanProgress.findOneAndUpdate(
      { user: req.user._id, bookId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Progress updated',
      progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message,
    });
  }
});

// Get progress for all books for current user
router.get('/progress', protect, async (req, res) => {
  try {
    const items = await KahaniyanProgress.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json({
      success: true,
      count: items.length,
      progress: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
});

// Get progress for a single book
router.get('/progress/:bookId', protect, async (req, res) => {
  try {
    const item = await KahaniyanProgress.findOne({
      user: req.user._id,
      bookId: req.params.bookId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this book',
      });
    }

    return res.status(200).json({
      success: true,
      progress: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
});

export default router;
