require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const donorRoutes = require('./routes/donorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const donationRoutes = require('./routes/donationRoutes');
const skillRoutes = require('./routes/skillRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

const pool = require('./config/db');

const allowedOrigins = (process.env.CLIENT_URL || process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173');
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS policy.'));
  }
}));
app.use(express.json());

let databaseReady = false;

app.get('/api/health', (req, res) => {
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ok' : 'degraded',
    service: 'volunteer-donor-management-api',
    database: databaseReady ? 'connected' : 'unavailable'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await pool.testDatabaseConnection();
    databaseReady = true;
    console.log('[database]', pool.getDatabaseDiagnostics());
  } catch (err) {
    databaseReady = false;
    console.error('[database-startup-error]', {
      code: err.code,
      message: err.message,
      config: pool.getDatabaseDiagnostics()
    });
  }

  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

start();
