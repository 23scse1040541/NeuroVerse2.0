import express from 'express';
import Specialist from '../models/Specialist.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/specialists
// @desc    Get all specialists
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialization, minRating } = req.query;
    let query = { active: true, verified: true };

    if (specialization) query.specialization = specialization;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const specialists = await Specialist.find(query)
      .populate('user', 'name email avatar')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: specialists.length,
      specialists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching specialists',
      error: error.message
    });
  }
});

// @route   GET /api/specialists/:id
// @desc    Get single specialist
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('reviews.user', 'name avatar');

    if (!specialist) {
      return res.status(404).json({
        success: false,
        message: 'Specialist not found'
      });
    }

    res.status(200).json({
      success: true,
      specialist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching specialist',
      error: error.message
    });
  }
});

// @route   POST /api/specialists
// @desc    Create specialist profile
// @access  Private/Specialist
router.post('/', protect, authorize('specialist', 'admin'), async (req, res) => {
  try {
    const { title, specialization, qualifications, experience, languages, bio, consultationFee, availability } = req.body;

    // Check if specialist profile already exists
    const existingProfile = await Specialist.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Specialist profile already exists'
      });
    }

    const specialist = await Specialist.create({
      user: req.user._id,
      title,
      specialization,
      qualifications,
      experience,
      languages,
      bio,
      consultationFee,
      availability
    });

    res.status(201).json({
      success: true,
      message: 'Specialist profile created successfully',
      specialist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating specialist profile',
      error: error.message
    });
  }
});

// @route   POST /api/specialists/:id/review
// @desc    Add review to specialist
// @access  Private
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const specialist = await Specialist.findById(req.params.id);

    if (!specialist) {
      return res.status(404).json({
        success: false,
        message: 'Specialist not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = specialist.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this specialist'
      });
    }

    specialist.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Calculate new average rating
    const totalRating = specialist.reviews.reduce((acc, review) => acc + review.rating, 0);
    specialist.rating = totalRating / specialist.reviews.length;

    await specialist.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      specialist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

export default router;
