const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const https = require('https');

const app = express();
app.use(cors());

const API_KEY = 'scan4keys_65artfarvvFRTA4DRTA';
const BASE = 'https://www.nexarda.com/api/v3';
const agent = new https.Agent({ rejectUnauthorized: false });

// Search games
app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Searching for:', q);
    const r = await fetch(`${BASE}/search?type=games&q=${encodeURIComponent(q)}`, {
      headers: { 'x-api-key': API_KEY },
      agent
    });
    console.log('Status:', r.status);
    const text = await r.text();
    console.log('Response:', text.substring(0, 200));
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get game prices by id
app.get('/prices', async (req, res) => {
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

app.listen(4000, () => console.log('Proxy running on http://localhost:4000'));