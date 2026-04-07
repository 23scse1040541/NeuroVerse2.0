import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const dataFile = path.join(dataDir, 'data.json');

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    const initial = {
      users: [],
      moods: [],
      journals: [],
      goals: [],
      feedback: [],
      specialists: [],
      sequences: { user: 1, mood: 1, journal: 1, goal: 1, feedback: 1, specialist: 1 }
    };
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
  }
}

export function readDB() {
  ensureFile();
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw || '{}');
}

export function writeDB(db) {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

export function getCollection(name) {
  const db = readDB();
  if (!db[name]) db[name] = [];
  return db[name];
}

export function setCollection(name, value) {
  const db = readDB();
  db[name] = value;
  writeDB(db);
}

export function nextId(type) {
  const db = readDB();
  db.sequences[type] = (db.sequences[type] || 0) + 1;
  writeDB(db);
  return String(db.sequences[type]);
}