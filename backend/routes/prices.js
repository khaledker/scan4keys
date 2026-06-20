const express = require('express');
const fetch = require('node-fetch');
const https = require('https');

const router = express.Router();

const API_KEY = process.env.NEXARDA_API_KEY;
if (!API_KEY) {
  console.error('NEXARDA_API_KEY environment variable is required');
  process.exit(1);
}

const BASE = 'https://www.nexarda.com/api/v3';
const agent = new https.Agent({ rejectUnauthorized: true });

router.get('/', async (req, res) => {
  try {
    const { id } = req.query;
    const r = await fetch(`${BASE}/prices?type=game&id=${id}&currency=USD`, {
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
