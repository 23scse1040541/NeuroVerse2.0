import express from 'express';
import jwt from 'jsonwebtoken';
import { readDB, writeDB, nextId } from '../../backend/utils/db.js';

const router = express.Router();

function getUserFromReq(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const db = readDB();
    return db.users.find(u => u.id === decoded.id) || null;
  } catch (e) {
    return null;
  }
}

// Create mood
router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });

  const { emotion, intensity = 5, note = '', activities = [], triggers = [] } = req.body || {};
  if (!emotion) return res.status(400).json({ success: false, message: 'Emotion is required' });

  const db = readDB();
  const entry = {
    id: nextId('mood'),
    user: user.id,
    emotion,
    intensity: Number(intensity),
    note,
    activities,
    triggers,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.moods.push(entry);
  // reward: add EXP for logging mood
  const uIdx = db.users.findIndex(u => u.id === user.id);
  if (uIdx !== -1) {
    db.users[uIdx].exp = Number(db.users[uIdx].exp || 0) + 5;
  }
  writeDB(db);
  res.status(201).json({ success: true, message: 'Mood logged successfully', mood: entry });
});

// List moods
router.get('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });

  const { startDate, endDate, limit = 50 } = req.query;
  const db = readDB();
  let list = db.moods.filter(m => m.user === user.id);
  if (startDate) list = list.filter(m => new Date(m.date) >= new Date(startDate));
  if (endDate) list = list.filter(m => new Date(m.date) <= new Date(endDate));
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ success: true, count: Math.min(list.length, Number(limit)), moods: list.slice(0, Number(limit)) });
});

// Analytics
router.get('/analytics', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });

  const period = Number(req.query.period || '30');
  const since = new Date();
  since.setDate(since.getDate() - period);
  const db = readDB();
  const moods = db.moods
    .filter(m => m.user === user.id && new Date(m.date) >= since)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const emotionCounts = {};
  let totalIntensity = 0;
  moods.forEach(m => { emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1; totalIntensity += Number(m.intensity || 0); });
  const averageIntensity = moods.length ? (totalIntensity / moods.length).toFixed(2) : 0;

  res.json({ success: true, analytics: { totalEntries: moods.length, period: `${period} days`, emotionDistribution: emotionCounts, averageIntensity, recentMoods: moods.slice(-10) } });
});

// Delete mood
router.delete('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });
  const { id } = req.params;
  const db = readDB();
  const idx = db.moods.findIndex(m => m.id === id && m.user === user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Mood not found' });
  const [removed] = db.moods.splice(idx, 1);
  writeDB(db);
  res.json({ success: true, message: 'Mood deleted', mood: removed });
});

export default router;
