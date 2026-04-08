const express = require('express');

// Seed in-memory data before any route is registered
require('./db/seed');

const apiRoutes = require('../routes/routes');

const app = express();

app.use(express.json());

app.use(apiRoutes);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
