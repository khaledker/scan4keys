const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export async function searchGames(query) {
  const res = await fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data;
}

export async function fetchPrices(gameId) {
  const res = await fetch(`${BACKEND_URL}/prices?id=${gameId}`);
  const data = await res.json();
  return data;
}

export async function fetchStores() {
  const res = await fetch(`${BACKEND_URL}/retailers`);
  const data = await res.json();
  return data;
}
