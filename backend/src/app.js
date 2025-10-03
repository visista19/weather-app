const express = require('express');
const app = express();
const cors = require('cors');
const requestRoutes = require('./routes/requestRoutes');

app.use(cors());
app.use(express.json());

// Attach routes
app.use('/api', requestRoutes); // now your frontend calls /api/requests

module.exports = app; // export the app
