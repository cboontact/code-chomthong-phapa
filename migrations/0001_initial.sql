-- D1 schema: one campaign now, extensible for future fundraising events.
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event_date TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO campaigns (id, name) VALUES ('main', 'กองผ้าป่าโรงเรียนจอมทอง');

CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL DEFAULT 'main',
  batch_number TEXT NOT NULL,
  batch_name TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  note TEXT NOT NULL DEFAULT '',
  received_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE INDEX IF NOT EXISTS donations_campaign_received_idx ON donations(campaign_id, received_at DESC);
CREATE INDEX IF NOT EXISTS donations_batch_idx ON donations(batch_number);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  donation_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  snapshot TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
