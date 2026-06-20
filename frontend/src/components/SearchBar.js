import { Search, X } from 'lucide-react';

export default function SearchBar({ query, setQuery, onSubmit, onClear, sfx }) {
  const handleChange = (e) => {
    setQuery(e.target.value);
    sfx('typing');
  };

  return (
    <form onSubmit={onSubmit} className="relative group">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
        <Search className="w-6 h-6 text-green-700 group-hover:text-green-400 transition-colors" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="ENTER GAME TITLE (e.g. Watch Dogs)..."
        className="w-full bg-black/60 border-2 border-green-900/60 p-6 pl-16 pr-12 text-green-400 focus:border-green-500 outline-none uppercase text-lg font-bold tracking-widest rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] relative z-0"
      />
      {query && (
        <button
          type="button"
          onClick={onClear}
          onMouseEnter={() => sfx('hover')}
          className="absolute inset-y-0 right-4 z-20 flex items-center text-green-700 hover:text-green-400 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </form>
  );
}
