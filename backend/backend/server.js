const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database setup ---
// DB_PATH should point to a persistent disk/volume in production
// (e.g. /data/conference.db on Render or Railway with a mounted volume).
// Falls back to a local file for quick local testing.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'conference.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    type TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    email TEXT,
    heard TEXT,
    reason TEXT,
    free_time TEXT,
    interest TEXT
  )
`);

const insertStmt = db.prepare(`
  INSERT INTO submissions (type, name, phone, email, heard, reason, free_time, interest)
  VALUES (@type, @name, @phone, @email, @heard, @reason, @freeTime, @interest)
`);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Public API: receive form submissions ---
app.post('/api/submit', (req, res) => {
  try {
    const {
      type = '',
      name = '',
      phone = '',
      email = '',
      heard = '',
      reason = '',
      freeTime = '',
      interest = ''
    } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ status: 'error', message: 'name and phone are required' });
    }

    insertStmt.run({ type, name, phone, email, heard, reason, freeTime, interest });
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
});

// --- Protected admin routes ---
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'changeme';

const adminAuth = basicAuth({
  users: { [adminUser]: adminPass },
  challenge: true,
  realm: 'Ibadan Prayer Conference Admin'
});

app.get('/api/submissions', adminAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
  res.json(rows);
});

app.use('/admin', adminAuth, express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Ibadan Prayer Conference backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Database file: ${DB_PATH}`);
});
