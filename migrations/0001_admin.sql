CREATE TABLE tiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  collection TEXT NOT NULL,
  colour TEXT NOT NULL,
  finish TEXT NOT NULL,
  image_key TEXT NOT NULL,
  room_key TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX tiles_category ON tiles (category);
CREATE INDEX tiles_created_at ON tiles (created_at);

CREATE TABLE hidden_tiles (id TEXT PRIMARY KEY);

CREATE TABLE login_attempts (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
