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
);
