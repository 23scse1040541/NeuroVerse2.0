import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes_fs/auth.js';
import moodRoutes from './routes_fs/mood.js';
import chatbotRoutes from './routes_fs/chatbot.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Neuro Verse API (FS Mode)', version: '1.0.0', status: 'Active' });
});

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/chatbot', chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Neuro Verse (FS) Server running on port ${PORT}`);
});
