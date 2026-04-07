import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  return res.status(410).json({
    success: false,
    message: 'This endpoint is deprecated. Use Firebase Authentication on the client and call /api/auth/me with a Firebase ID token.'
  });
});

// @route   POST /api/auth/reward
// @desc    Add EXP rewards for actions/games
// @access  Private
router.post('/reward', protect, async (req, res) => {
  try {
    const { amount = 0 } = req.body || {};
    const inc = Number(amount) || 0;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { exp: inc } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Reward applied',
      exp: user.exp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error applying reward',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  return res.status(410).json({
    success: false,
    message: 'This endpoint is deprecated. Use Firebase Authentication on the client and call /api/auth/me with a Firebase ID token.'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        authProvider: user.authProvider,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        preferences: user.preferences,
        streaks: user.streaks,
        exp: user.exp,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, bio, preferences } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   POST /api/auth/sync
// @desc    Upsert user profile based on Firebase token and optional client profile payload
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body || {};

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'User synced successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error syncing user',
      error: error.message
    });
  }
});

export default router;
