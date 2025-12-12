import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotion: {
    type: String,
    required: [true, 'Please select an emotion'],
    enum: ['happy', 'sad', 'anxious', 'stressed', 'calm', 'angry', 'excited', 'tired', 'neutral']
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 5
  },
  note: {
    type: String,
    maxlength: 500
  },
  trackingType: {
    type: String,
    enum: ['question', 'camera'],
    default: 'question'
  },
  source: {
    type: String,
    enum: ['micro-reflection', 'manual', 'imported'],
    default: 'micro-reflection'
  },
  challengeType: {
    type: String,
    enum: ['work', 'social', 'health', 'none', 'other'],
    default: 'none'
  },
  helpedBy: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
moodSchema.index({ user: 1, date: -1 });

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;
