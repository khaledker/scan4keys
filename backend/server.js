const express = require('express');
const cors = require('cors');
const searchRoute = require('./routes/search');
const pricesRoute = require('./routes/prices');
const retailersRoute = require('./routes/retailers');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

app.use('/search', searchRoute);
app.use('/prices', pricesRoute);
app.use('/retailers', retailersRoute);

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
