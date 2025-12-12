import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'specialist', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=8EC5FC&color=fff&name='
  },
  bio: {
    type: String,
    maxlength: 500
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    moodReminder: {
      type: Boolean,
      default: true
    },
    meditationReminder: {
      type: Boolean,
      default: true
    }
  },
  streaks: {
    journalStreak: {
      type: Number,
      default: 0
    },
    moodStreak: {
      type: Number,
      default: 0
    },
    meditationStreak: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
