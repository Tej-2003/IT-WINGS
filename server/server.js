import express from 'express';
import cors from 'cors';
import { dbManager } from './dbManager.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Netlify frontend (and localhost for dev)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://spiffy-meringue-f59fd5.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for now, tighten later
  },
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Health check endpoint (Render uses this to verify server is alive)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 ICCC Survey Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Log middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ═════════════════════ AUTH API ═════════════════════
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password and role are required' });
  }

  const users = dbManager.getCollection('users');
  const matchedUser = users.find(
    (u) =>
      u.user.toLowerCase() === username.trim().toLowerCase() &&
      u.pass === password &&
      u.role === role
  );

  if (!matchedUser) {
    return res.status(401).json({ error: 'Invalid credentials or wrong role' });
  }

  // Remove password from response
  const { pass, ...userResponse } = matchedUser;
  res.json(userResponse);
});

// ═════════════════════ USERS API (Admin settings CRUD) ═════════════════════
app.get('/api/users', (req, res) => {
  const users = dbManager.getCollection('users');
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, user, pass, role, zone, co } = req.body;
  if (!name || !user || !pass || !role) {
    return res.status(400).json({ error: 'Name, username, password and role are required' });
  }

  const users = dbManager.getCollection('users');
  if (users.find((u) => u.user.toLowerCase() === user.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    user: user.trim(),
    pass,
    role,
    zone: role === 'admin' ? '' : zone,
    co: co ? co.trim() : '',
  };

  users.push(newUser);
  dbManager.saveCollection('users', users);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, user, pass, role, zone, co } = req.body;

  if (!name || !user || !pass || !role) {
    return res.status(400).json({ error: 'Name, username, password and role are required' });
  }

  const users = dbManager.getCollection('users');
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check username clash
  const usernameClash = users.find(
    (u) => u.user.toLowerCase() === user.trim().toLowerCase() && u.id !== userId
  );
  if (usernameClash) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const updatedUser = {
    ...users[idx],
    name: name.trim(),
    user: user.trim(),
    pass,
    role,
    zone: role === 'admin' ? '' : zone,
    co: co ? co.trim() : '',
  };

  users[idx] = updatedUser;
  dbManager.saveCollection('users', users);
  res.json(updatedUser);
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = dbManager.getCollection('users');
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent deleting final admin
  if (user.role === 'admin' && users.filter((u) => u.role === 'admin').length <= 1) {
    return res.status(400).json({ error: 'Cannot delete the only remaining Admin account' });
  }

  const filteredUsers = users.filter((u) => u.id !== userId);
  dbManager.saveCollection('users', filteredUsers);
  res.json({ message: 'User deleted successfully' });
});

// ═════════════════════ VISITS API ═════════════════════
app.get('/api/visits', (req, res) => {
  const visits = dbManager.getCollection('visits');
  res.json(visits);
});

app.post('/api/visits', (req, res) => {
  const visit = req.body;
  if (!visit.co || !visit.offName || !visit.offId) {
    return res.status(400).json({ error: 'Invalid visit payload structure' });
  }

  const visits = dbManager.getCollection('visits');
  const newVisit = {
    ...visit,
    id: visit.id || Date.now(),
    date: visit.date || new Date().toISOString().split('T')[0],
    ts: visit.ts || new Date().toISOString(),
  };

  visits.push(newVisit);
  dbManager.saveCollection('visits', visits);
  res.status(201).json(newVisit);
});

app.delete('/api/visits', (req, res) => {
  dbManager.saveCollection('visits', []);
  res.json({ message: 'All visits cleared' });
});

// ═════════════════════ TRACK API (GPS Waypoints) ═════════════════════
app.get('/api/track', (req, res) => {
  const track = dbManager.read().track || {};
  res.json(track);
});

app.post('/api/track', (req, res) => {
  const { userId, name, lat, lng, ts } = req.body;
  if (!userId || !name || !lat || !lng) {
    return res.status(400).json({ error: 'UserId, name, lat, and lng are required' });
  }

  const db = dbManager.read();
  const track = db.track || {};
  
  if (!track[userId]) {
    track[userId] = { name, pts: [] };
  }

  const timestamp = ts || new Date().toISOString();
  track[userId].pts.push({ lat, lng, ts: timestamp });
  
  // Cap at 200 points to save space
  if (track[userId].pts.length > 200) {
    track[userId].pts = track[userId].pts.slice(-200);
  }
  
  track[userId].lastSeen = timestamp;
  db.track = track;
  dbManager.write(db);

  res.status(201).json({ success: true });
});

// ═════════════════════ ALERTS API (Duplicate warnings) ═════════════════════
app.get('/api/alerts', (req, res) => {
  const alerts = dbManager.getCollection('alerts');
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = req.body;
  if (!alert.co || !alert.offName) {
    return res.status(400).json({ error: 'Invalid alert structure' });
  }

  const alerts = dbManager.getCollection('alerts');
  const newAlert = {
    ...alert,
    id: Date.now(),
    ts: new Date().toISOString(),
  };

  alerts.push(newAlert);
  dbManager.saveCollection('alerts', alerts);
  res.status(201).json(newAlert);
});

app.delete('/api/alerts', (req, res) => {
  dbManager.saveCollection('alerts', []);
  res.json({ message: 'All alerts cleared' });
});

// ═════════════════════ ATTENDANCE API ═════════════════════
app.get('/api/attendance', (req, res) => {
  const attendance = dbManager.getCollection('attendance');
  res.json(attendance);
});

app.post('/api/attendance', (req, res) => {
  const record = req.body;
  if (!record.offId || !record.date || !record.status) {
    return res.status(400).json({ error: 'OffId, date, and status are required' });
  }

  const attendance = dbManager.getCollection('attendance');
  const index = attendance.findIndex(
    (a) => a.offId === record.offId && a.date === record.date
  );

  const newRecord = {
    ...record,
    id: record.id || Date.now(),
    ts: record.ts || new Date().toISOString(),
  };

  if (index >= 0) {
    attendance[index] = newRecord;
  } else {
    attendance.push(newRecord);
  }

  dbManager.saveCollection('attendance', attendance);
  res.json(newRecord);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Survey Backend Server running on port ${PORT}`);
});
