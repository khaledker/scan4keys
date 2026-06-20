const express = require('express');
const fetch = require('node-fetch');
const https = require('https');

const router = express.Router();

const API_KEY = process.env.NEXARDA_API_KEY;
const BASE = 'https://www.nexarda.com/api/v3';
const agent = new https.Agent({ rejectUnauthorized: true });

router.get('/', async (req, res) => {
  try {
    const r = await fetch(`${BASE}/retailers`, {
      headers: { 'x-api-key': API_KEY },
      agent
    });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
