const express = require('express');
const courseRoutes = require('./courses.routes');
const studentRoutes = require('./students.routes');

const router = express.Router();

router.use(courseRoutes);
router.use(studentRoutes);

// Error handler
router.use((err, req, res, next) => {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'ValidationError', details: err.errors });
  }
  const upstreamStatus = err?.response?.status;
  res.status(upstreamStatus || 502).json({
    error: err.name || 'Error',
    message: err.message,
  });
});

module.exports = router;