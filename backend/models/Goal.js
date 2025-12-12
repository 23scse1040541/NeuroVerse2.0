import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['meditation', 'journal', 'exercise', 'sleep', 'mindfulness', 'social', 'custom'],
    default: 'custom'
  },
  targetFrequency: {
    type: Number,
    required: true,
    min: 1
  },
  frequencyUnit: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly'
  },
  currentProgress: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  streak: {
    type: Number,
    default: 0
  },
  completionDates: [{
    type: Date
  }],
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    time: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Index for user queries
goalSchema.index({ user: 1, status: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
