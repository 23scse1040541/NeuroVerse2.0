import mongoose from 'mongoose';

const kahaniyanProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  lastPage: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  lastOpenedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

kahaniyanProgressSchema.index({ user: 1, bookId: 1 }, { unique: true });

const KahaniyanProgress = mongoose.model('KahaniyanProgress', kahaniyanProgressSchema);

export default KahaniyanProgress;
