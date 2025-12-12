import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import journalRoutes from './routes/journal.js';
import goalRoutes from './routes/goal.js';
import feedbackRoutes from './routes/feedback.js';
import specialistRoutes from './routes/specialist.js';
import chatbotRoutes from './routes/chatbot.js';
import userRoutes from './routes/user.js';
import kahaniyanRoutes from './routes/kahaniyan.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kahaniyan', kahaniyanRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Neuro Verse API',
    version: '1.0.0',
    status: 'Active'
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Neuro Verse Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
