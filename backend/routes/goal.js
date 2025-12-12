import express from 'express';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, targetFrequency, frequencyUnit, endDate, reminders } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      category,
      targetFrequency,
      frequencyUnit,
      endDate,
      reminders
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating goal',
      error: error.message
    });
  }
});

// @route   GET /api/goals
// @desc    Get all goals for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };
    
    if (status) query.status = status;

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching goals',
      error: error.message
    });
  }
});

// @route   PUT /api/goals/:id/progress
// @desc    Update goal progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    goal.currentProgress += 1;
    goal.completionDates.push(new Date());
    
    // Update streak
    const today = new Date();
    const lastCompletion = goal.completionDates[goal.completionDates.length - 2];
    
    if (lastCompletion) {
      const diffDays = Math.floor((today - lastCompletion) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        goal.streak += 1;
      } else if (diffDays > 1) {
        goal.streak = 1;
      }
    } else {
      goal.streak = 1;
    }

    // Check if goal is completed
    if (goal.currentProgress >= goal.targetFrequency) {
      goal.status = 'completed';
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating goal',
      error: error.message
    });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting goal',
      error: error.message
    });
  }
});

export default router;
