import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: 5000
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search and filtering
journalSchema.index({ user: 1, date: -1 });

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;
