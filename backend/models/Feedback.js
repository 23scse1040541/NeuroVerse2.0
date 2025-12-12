import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  category: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'general', 'other'],
    default: 'general'
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Please provide feedback message'],
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'closed'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for admin queries
feedbackSchema.index({ status: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
