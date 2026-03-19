const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('./db.js'); // Aapka DB connection

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/projects', require('./routes/projects'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
