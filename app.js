
const express = require('express');
const app = express();
const router=require('./src/routes/api.js');
const db = require('./src/config/db.js');

// Security imports
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// Test database connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

// Routing
app.use('/api/v1', router);

// Undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', data: 'not found' });
});

module.exports = app;
