import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import {
  findOrCreateUser,
  getUserById,
  getUsers,
  updateUserRole,
  getRecordsByModule,
  getAllModules,
  saveChat,
  getChatHistory,
  getStatsOverview
} from './db.js';
import { generateAiResponse } from './ai.js';

dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

const __dirname = process.cwd();
const rootDir = path.join(__dirname, '..');
const clientDist = path.join(rootDir, 'client', 'dist');
const app = express();
const port = process.env.PORT || 8080;
const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const moduleMeta = {
  Marketing: {
    title: 'Marketing Intelligence',
    description: 'Conversion Rate, CAC, ROAS, campaign efficiency',
    gradient: 'from-cyan-500 to-blue-600',
    kpis: [
      { label: 'Conversion Rate', value: '68.7%', delta: '+5.2%' },
      { label: 'CAC', value: '฿3,420', delta: '-8.1%' },
      { label: 'ROAS', value: '4.8x', delta: '+0.6x' }
    ]
  },
  Facial: {
    title: 'Facial Insight',
    description: 'Demographic mix, sentiment, repeat visitor, dwell time',
    gradient: 'from-fuchsia-500 to-violet-600',
    kpis: [
      { label: 'Positive Sentiment', value: '94.3%', delta: '+2.4%' },
      { label: 'Repeat Visitor', value: '32%', delta: '+4.8%' },
      { label: 'Dwell Time', value: '8.2m', delta: '+0.7m' }
    ]
  },
  Robotics: {
    title: 'Robotics Control',
    description: 'Active/Idle state, task success, battery, error logs',
    gradient: 'from-emerald-400 to-teal-600',
    kpis: [
      { label: 'Active Robots', value: '24', delta: '+3' },
      { label: 'Task Success', value: '97.9%', delta: '+1.1%' },
      { label: 'Battery Avg', value: '82%', delta: '-2%' }
    ]
  },
  Inventory: {
    title: 'Inventory Pulse',
    description: 'Low stock alert, turnover ratio, aging stock, cycle time',
    gradient: 'from-orange-400 to-red-500',
    kpis: [
      { label: 'Available SKUs', value: '8,190', delta: '+312' },
      { label: 'Low Stock Alert', value: '126', delta: '-18' },
      { label: 'Turnover Ratio', value: '5.6', delta: '+0.4' }
    ]
  },
  Product: {
    title: 'Product Performance',
    description: 'Top 5, return rate, reviews, stock-to-sales ratio',
    gradient: 'from-pink-500 to-rose-500',
    kpis: [
      { label: 'Top Rated', value: '4.8', delta: '+0.2' },
      { label: 'Return Rate', value: '2.1%', delta: '-0.4%' },
      { label: 'Stock/Sales', value: '1.7', delta: '+0.1' }
    ]
  }
};

const trendSeries = [
  { month: 'Jan', marketing: 2400, facial: 3200, robotics: 2600, inventory: 3800, product: 2900 },
  { month: 'Feb', marketing: 2600, facial: 2800, robotics: 3100, inventory: 3400, product: 3000 },
  { month: 'Mar', marketing: 2000, facial: 9800, robotics: 2400, inventory: 3400, product: 2700 },
  { month: 'Apr', marketing: 3100, facial: 4200, robotics: 2700, inventory: 2300, product: 2900 },
  { month: 'May', marketing: 3500, facial: 5100, robotics: 2900, inventory: 2600, product: 3100 },
  { month: 'Jun', marketing: 3900, facial: 4300, robotics: 3400, inventory: 3000, product: 3500 }
];

const systemStatus = [
  { service: 'Marketing Engine', status: 'ออนไลน์', uptime: '99.9%', updated: '2 นาทีที่แล้ว' },
  { service: 'Facial Analytics', status: 'ออนไลน์', uptime: '99.7%', updated: '5 นาทีที่แล้ว' },
  { service: 'Robotics Gateway', status: 'ออนไลน์', uptime: '98.9%', updated: '1 นาทีที่แล้ว' },
  { service: 'Inventory Sync', status: 'ซิงก์อยู่', uptime: '99.4%', updated: 'ไม่เกิน 30 วินาที' },
  { service: 'Product Insights', status: 'ออนไลน์', uptime: '99.8%', updated: '3 นาทีที่แล้ว' }
];

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, getUserById(id)));

if (googleEnabled) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/auth/google/callback'
    },
    (_accessToken, _refreshToken, profile, done) => {
      const user = findOrCreateUser({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        provider: 'google',
        role: 'viewer'
      });
      return done(null, user);
    }
  ));
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'oga-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

function ensureAuth(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

function optionalAuth(req, _res, next) {
  req.user = req.user || null;
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, googleEnabled, defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'mock' });
});

app.get('/api/auth/config', (_req, res) => {
  res.json({ googleEnabled, demoEnabled: true });
});

app.post('/api/auth/demo-login', (req, res) => {
  const name = req.body?.name?.trim() || 'OGA Demo User';
  const emailBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '.') || 'demo.user';
  const user = findOrCreateUser({
    name,
    email: `${emailBase}@oga.local`,
    avatar: 'https://ui-avatars.com/api/?name=OGA&background=0B1A3A&color=fff',
    provider: 'demo',
    role: 'viewer'
  });
  req.session.passport = { user: user.id };
  req.user = user;
  return res.json({ user });
});

app.get('/auth/google', (req, res, next) => {
  if (!googleEnabled) return res.redirect('/?login=demo');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  if (!googleEnabled) return res.redirect('/?login=demo');
  passport.authenticate('google', { failureRedirect: '/?login=failed' }, (_err, user) => {
    req.session.passport = { user: user.id };
    req.user = user;
    return res.redirect('/');
  })(req, res, next);
});

app.get('/api/auth/me', optionalAuth, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', (req, res) => {
  req.logout?.(() => {});
  req.session.destroy?.(() => res.json({ ok: true }));
  if (!req.session.destroy) res.json({ ok: true });
});

app.get('/api/dashboard', optionalAuth, (_req, res) => {
  const stats = getStatsOverview();
  const modules = getAllModules().map((module) => ({
    name: module,
    ...moduleMeta[module],
    records: getRecordsByModule(module)
  }));
  res.json({
    company: 'OGA International',
    modules,
    trendSeries,
    systemStatus,
    overview: {
      totalUsers: stats.totalUsers,
      totalChats: stats.totalChats,
      totalRecords: stats.totalRecords,
      activeModules: modules.length,
      aiCoverage: 'Hybrid AI + Mock'
    }
  });
});

app.get('/api/users', ensureAuth, (_req, res) => {
  res.json({ users: getUsers() });
});

app.patch('/api/users/:id/role', ensureAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const user = updateUserRole(Number(req.params.id), req.body?.role || 'viewer');
  res.json({ user });
});

app.get('/api/chat/history', ensureAuth, (_req, res) => {
  res.json({ history: getChatHistory(40).reverse() });
});

app.post('/api/chat', ensureAuth, async (req, res) => {
  const { message, module = 'Marketing', provider = process.env.DEFAULT_AI_PROVIDER || 'mock' } = req.body || {};
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
  const response = await generateAiResponse({ message, module, provider });
  saveChat({ userId: req.user.id, module, question: message, answer: response.text, provider: response.provider });
  res.json({ reply: response.text, provider: response.provider });
});

app.get('/api/export/excel', ensureAuth, async (req, res) => {
  const module = req.query.module || 'Inventory';
  const records = getRecordsByModule(module);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${module}`);
  sheet.columns = [
    { header: 'Code', key: 'code', width: 16 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Primary Metric', key: 'metric_primary', width: 18 },
    { header: 'Secondary Metric', key: 'metric_secondary', width: 18 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Details', key: 'details', width: 42 }
  ];
  records.forEach((item) => sheet.addRow(item));
  sheet.getRow(1).font = { bold: true };
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${module.toLowerCase()}-export.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
});

app.get('/api/export/pdf', ensureAuth, (req, res) => {
  const module = req.query.module || 'Inventory';
  const records = getRecordsByModule(module);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${module.toLowerCase()}-summary.pdf`);
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);
  doc.fontSize(22).fillColor('#0F172A').text(`OGA International - ${module} Summary`);
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#475569').text(moduleMeta[module]?.description || 'Enterprise module report');
  doc.moveDown();
  records.forEach((record, index) => {
    doc.roundedRect(40, doc.y, 515, 68, 10).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fillColor('#0F172A').fontSize(13).text(`${index + 1}. ${record.name}`, 56, doc.y - 58);
    doc.fillColor('#334155').fontSize(10).text(`Code: ${record.code} • Status: ${record.status}`, 56, doc.y + 4);
    doc.fillColor('#64748B').fontSize(10).text(record.details || '-', 56, doc.y + 8, { width: 470 });
    doc.moveDown(4.5);
  });
  doc.end();
});

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(port, () => {
  console.log(`OGA app running on http://localhost:${port}`);
});
