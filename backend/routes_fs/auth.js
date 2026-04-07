import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB, nextId } from '../../backend/utils/db.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Reward EXP
router.post('/reward', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Not authorized' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const db = readDB();
    const idx = db.users.findIndex(u => u.id === decoded.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
    const amount = Number(req.body?.amount || 1);
    db.users[idx].exp = Number(db.users[idx].exp || 0) + (isNaN(amount) ? 1 : amount);
    writeDB(db);
    const user = db.users[idx];
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, exp: user.exp };
    res.json({ success: true, message: 'EXP updated', user: safe });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update EXP' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const db = readDB();
    const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const id = nextId('user');
    const user = {
      id,
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'user',
      avatar: `https://ui-avatars.com/api/?background=8EC5FC&color=fff&name=${encodeURIComponent(name)}`,
      bio: '',
      preferences: { notifications: true, moodReminder: true, meditationReminder: true },
      streaks: { journalStreak: 0, moodStreak: 0, meditationStreak: 0 },
      exp: 0,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    const token = generateToken(user.id);
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, exp: user.exp };
    res.status(201).json({ success: true, message: 'Account created', token, user: safeUser });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Signup failed', error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });
    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id);
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, exp: user.exp || 0 };
    res.json({ success: true, message: 'Login successful', token, user: safeUser });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Login failed', error: e.message });
  }
});

// Me
router.get('/me', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Not authorized' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const db = readDB();
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const safe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      preferences: user.preferences,
      streaks: user.streaks,
      exp: user.exp || 0,
      createdAt: user.createdAt
    };
    res.json({ success: true, user: safe });
  } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Update profile
router.put('/update-profile', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Not authorized' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const db = readDB();
    const idx = db.users.findIndex(u => u.id === decoded.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, bio, preferences } = req.body;
    if (name) db.users[idx].name = name;
    if (bio !== undefined) db.users[idx].bio = bio;
    if (preferences) db.users[idx].preferences = { ...db.users[idx].preferences, ...preferences };
    writeDB(db);

    const user = db.users[idx];
    res.json({ success: true, message: 'Profile updated', user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

export default router;
