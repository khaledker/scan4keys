import { useState, useCallback } from 'react';
import { searchGames, fetchPrices } from '../utils/api';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [lastSelected, setLastSelected] = useState(null);

  const handleSearch = useCallback(async (sfx, addLog) => {
    if (!query) return;
    sfx('click');
    setSearchLoading(true);
    setResults(null);
    setSuggestions(null);
    setScanError(false);
    addLog(`SEARCH: "${query}"`, 'process');
    try {
      const data = await searchGames(query);
      if (!data?.results?.items?.length) throw new Error();
      setSuggestions(data.results.items);
      sfx('deal_found');
      addLog(`FOUND ${data.results.items.length} MATCHES.`, 'success');
    } catch {
      sfx('no_deal');
      addLog('TITLE NOT FOUND.', 'error');
    }
    setSearchLoading(false);
  }, [query]);

  const clearSearch = useCallback((sfx) => {
    setQuery('');
    setSuggestions(null);
    setResults(null);
    sfx('click');
  }, []);

  const selectGame = useCallback(async (id, title, image, sfx, addLog, scanCallback) => {
    setLastSelected({ id, title, thumb: image });
    setSuggestions(null);
    setScanError(false);
    sfx('click');
    addLog(`ANALYZING: ${title}`, 'process');
    const success = await scanCallback();
    if (!success) { return; }
    try {
      const data = await fetchPrices(id);
      const available = data?.prices?.list?.filter(d => d.available && d.price > 0) || [];
      if (!available.length) {
        setResults({ error: 'none', title, thumb: image, gameID: id });
        sfx('no_deal');
        addLog('NO DISCOUNTS DETECTED.', 'error');
      } else {
        const deals = available.map(d => ({
          store: d.store.name,
          storeImage: d.store.image,
          price: d.price,
          retail: data.prices.highest,
          savings: Math.round(((data.prices.highest - d.price) / data.prices.highest) * 100),
          url: d.url,
          coupon: d.coupon
        })).sort((a, b) => a.price - b.price);
        setResults({ gameID: id, title, thumb: image, deals });
        sfx('deal_found');
        addLog('DEAL REPORT GENERATED.', 'success');
      }
    } catch {
      addLog('API TIMEOUT.', 'error');
    }
  }, []);

  return {
    query, setQuery,
    suggestions, setSuggestions,
    results, setResults,
    loading: loading || searchLoading,
    searchLoading,
    scanError, setScanError,
    lastSelected,
    handleSearch, clearSearch, selectGame,
    setLoading
  };
}
