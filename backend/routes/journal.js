import express from 'express';
import Journal from '../models/Journal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, mood, tags, isPrivate } = req.body;

    const journal = await Journal.create({
      user: req.user._id,
      title,
      content,
      mood,
      tags,
      isPrivate
    });

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      journal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating journal entry',
      error: error.message
    });
  }
});

// @route   GET /api/journal
// @desc    Get all journal entries for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { tag, startDate, endDate, limit = 20, page = 1 } = req.query;

    let query = { user: req.user._id };

    if (tag) query.tags = tag;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const journals = await Journal.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Journal.countDocuments(query);

    res.status(200).json({
      success: true,
      count: journals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      journals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entries',
      error: error.message
    });
  }
});

// @route   GET /api/journal/:id
// @desc    Get single journal entry
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this journal entry'
      });
    }

    res.status(200).json({
      success: true,
      journal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entry',
      error: error.message
    });
  }
});

// @route   PUT /api/journal/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this journal entry'
      });
    }

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      journal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating journal entry',
      error: error.message
    });
  }
});

// @route   DELETE /api/journal/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this journal entry'
      });
    }

    await journal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting journal entry',
      error: error.message
    });
  }
});

export default router;
