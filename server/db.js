import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'oga.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar TEXT,
    role TEXT DEFAULT 'viewer',
    provider TEXT DEFAULT 'demo',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    module TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    provider TEXT DEFAULT 'mock',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS module_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module TEXT NOT NULL,
    code TEXT,
    name TEXT NOT NULL,
    metric_primary REAL,
    metric_secondary REAL,
    status TEXT,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const moduleCount = db.prepare('SELECT COUNT(*) as count FROM module_records').get().count;
if (!moduleCount) {
  const seed = db.prepare(`
    INSERT INTO module_records (module, code, name, metric_primary, metric_secondary, status, details)
    VALUES (@module, @code, @name, @metric_primary, @metric_secondary, @status, @details)
  `);

  const rows = [
    { module: 'Marketing', code: 'MKT-001', name: 'Q1 Awareness Campaign', metric_primary: 6.8, metric_secondary: 3.2, status: 'Scaling', details: 'ROAS 6.8 • CAC 3.2k • Conversion trending upward' },
    { module: 'Marketing', code: 'MKT-002', name: 'Retail Lead Funnel', metric_primary: 4.5, metric_secondary: 2.4, status: 'Healthy', details: 'ROAS 4.5 • CAC 2.4k • Strong paid search' },
    { module: 'Facial', code: 'FAC-101', name: 'Bangkok Flagship Visitors', metric_primary: 62, metric_secondary: 78, status: 'Insight Ready', details: 'Positive sentiment 78% • Repeat visitors 62%' },
    { module: 'Facial', code: 'FAC-102', name: 'Event Crowd Mood Scan', metric_primary: 7.3, metric_secondary: 44, status: 'Monitoring', details: 'Avg dwell time 7.3 min • Female demographic 44%' },
    { module: 'Robotics', code: 'ROB-009', name: 'Warehouse Picker R1', metric_primary: 97.9, metric_secondary: 82, status: 'Active', details: 'Task success 97.9% • Battery 82%' },
    { module: 'Robotics', code: 'ROB-010', name: 'Delivery Rover R2', metric_primary: 91.3, metric_secondary: 46, status: 'Idle', details: 'Task success 91.3% • Battery 46%' },
    { module: 'Inventory', code: 'INV-001', name: 'Surgical Mask', metric_primary: 1500, metric_secondary: 5.6, status: 'Available', details: 'Turnover 5.6 • Healthy stock' },
    { module: 'Inventory', code: 'INV-002', name: 'Hand Sanitizer', metric_primary: 300, metric_secondary: 1.9, status: 'Low Stock', details: 'Turnover 1.9 • Restock recommended' },
    { module: 'Inventory', code: 'INV-003', name: 'Safety Gloves', metric_primary: 1200, metric_secondary: 4.2, status: 'Reserved', details: 'Turnover 4.2 • Reserved for contracts' },
    { module: 'Product', code: 'PRD-701', name: 'OGA Smart Kiosk', metric_primary: 4.8, metric_secondary: 2.1, status: 'Top 5', details: 'Rating 4.8 • Return rate 2.1%' },
    { module: 'Product', code: 'PRD-702', name: 'Vision Analytics Sensor', metric_primary: 4.6, metric_secondary: 1.4, status: 'Growing', details: 'Rating 4.6 • Return rate 1.4%' }
  ];
  const insertMany = db.transaction((entries) => entries.forEach((row) => seed.run(row)));
  insertMany(rows);

  db.prepare(`INSERT OR IGNORE INTO users (name, email, role, provider) VALUES (?, ?, ?, ?)`)
    .run('OGA Administrator', 'admin@oga.local', 'admin', 'demo');
}

export function findOrCreateUser(profile) {
  const existing = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(profile.googleId || null, profile.email || null);
  if (existing) {
    db.prepare('UPDATE users SET name = ?, avatar = ?, provider = ? WHERE id = ?').run(profile.name, profile.avatar, profile.provider, existing.id);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(existing.id);
  }
  const result = db.prepare(`
    INSERT INTO users (google_id, name, email, avatar, role, provider)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(profile.googleId || null, profile.name, profile.email || null, profile.avatar || null, profile.role || 'viewer', profile.provider || 'demo');
  return db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function getUsers() {
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
}

export function updateUserRole(id, role) {
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  return getUserById(id);
}

export function getRecordsByModule(module) {
  return db.prepare('SELECT * FROM module_records WHERE module = ? ORDER BY id').all(module);
}

export function getAllModules() {
  return db.prepare('SELECT DISTINCT module FROM module_records ORDER BY module').all().map((r) => r.module);
}

export function saveChat({ userId, module, question, answer, provider }) {
  db.prepare(`INSERT INTO chat_history (user_id, module, question, answer, provider) VALUES (?, ?, ?, ?, ?)`)
    .run(userId || null, module, question, answer, provider);
}

export function getChatHistory(limit = 30) {
  return db.prepare(`
    SELECT ch.*, u.name as user_name
    FROM chat_history ch
    LEFT JOIN users u ON ch.user_id = u.id
    ORDER BY ch.id DESC
    LIMIT ?
  `).all(limit);
}

export function getStatsOverview() {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalChats = db.prepare('SELECT COUNT(*) as count FROM chat_history').get().count;
  const totalRecords = db.prepare('SELECT COUNT(*) as count FROM module_records').get().count;
  return { totalUsers, totalChats, totalRecords };
}

export default db;
