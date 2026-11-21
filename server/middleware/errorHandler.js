// Wrap async controller functions so thrown errors reach this handler
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[request-error]', {
    method: req.method,
    path: req.originalUrl,
    code: err.code,
    message: err.message
  });

  if (err.message === 'Origin is not allowed by CORS policy.') {
    return res.status(403).json({ message: 'Origin is not allowed.' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ message: 'This action conflicts with related records.' });
  }
  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENETUNREACH', 'EHOSTUNREACH', 'PROTOCOL_CONNECTION_LOST'].includes(err.code)) {
    return res.status(503).json({ message: 'Database is temporarily unavailable. Please try again later.' });
  }
  if (['ER_ACCESS_DENIED_ERROR', 'ER_DBACCESS_DENIED_ERROR'].includes(err.code)) {
    return res.status(503).json({ message: 'Database authentication failed. Check the server database configuration.' });
  }
  if (err.code === 'ER_BAD_DB_ERROR') {
    return res.status(503).json({ message: 'Configured database was not found. Check the server database configuration.' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong on the server.' });
}

module.exports = { asyncHandler, notFound, errorHandler };
