const mysql = require('mysql2/promise');
require('dotenv').config();

function envFlag(name, defaultValue = false) {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function buildSslConfig() {
  if (!envFlag('DB_SSL', false)) return undefined;

  const ssl = {
    rejectUnauthorized: envFlag('DB_SSL_REJECT_UNAUTHORIZED', true)
  };

  if (process.env.DB_SSL_CA) {
    ssl.ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
  } else if (process.env.DB_SSL_CA_PATH) {
    ssl.ca = require('fs').readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
  }

  return ssl;
}

function buildConfigFromDatabaseUrl(databaseUrl) {
  const parsed = new URL(databaseUrl);
  if (!['mysql:', 'mysql2:'].includes(parsed.protocol)) {
    throw new Error('DB_DATABASE_URL must use the mysql:// protocol.');
  }

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\/+/, ''))
  };
}

const databaseUrl = process.env.DB_DATABASE_URL || process.env.DATABASE_URL;
let connectionConfig;

if (databaseUrl) {
  connectionConfig = buildConfigFromDatabaseUrl(databaseUrl);
} else {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter((name) => !process.env[name]);

  if (isProduction && missing.length) {
    throw new Error(
      `Missing production database configuration: ${missing.join(', ')}. ` +
      'Set DB_DATABASE_URL or the individual DB_* environment variables.'
    );
  }

  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'volunteer_donor_management'
  };
}

const ssl = buildSslConfig();
const pool = mysql.createPool({
  ...connectionConfig,
  ...(ssl ? { ssl } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000)
});

async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}

function getDatabaseDiagnostics() {
  return {
    host: connectionConfig.host,
    port: connectionConfig.port,
    database: connectionConfig.database,
    ssl: Boolean(ssl)
  };
}

module.exports = pool;
module.exports.testDatabaseConnection = testDatabaseConnection;
module.exports.getDatabaseDiagnostics = getDatabaseDiagnostics;
