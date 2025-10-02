const express = require('express');
const cors = require('cors');
require('dotenv').config();
const requestsRouter = require('./routes/requests');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/requests', requestsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;
