require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./middleware/AppError');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger); // global logger: runs for every request

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));
app.use('/api/v1/tickets', require('./routes/ticketRoutes'));

// unknown route -> 404 JSON
app.use((req, res, next) => next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404)));

// global error handler - always the LAST middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`EventHub API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });

module.exports = app;
