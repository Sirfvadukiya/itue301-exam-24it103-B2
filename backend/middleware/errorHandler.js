// Global error handler - MUST be the last middleware.
// Always returns structured JSON, never a raw stack trace or raw Mongoose error.
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors;

  if (err.name === 'ValidationError') {
    status = 400;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value: ${field} already exists`;
  } else if (err instanceof SyntaxError && err.status === 400) {
    message = 'Malformed JSON in request body';
  }

  if (status === 500) {
    console.error('Server error:', err);
    message = 'Something went wrong on the server';
  }

  res.status(status).json({ success: false, status, message, ...(errors && { errors }) });
};

module.exports = errorHandler;
