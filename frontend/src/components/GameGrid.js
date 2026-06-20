import GameCard from './GameCard';

export default function GameGrid({ suggestions, onSelect, sfx }) {
  return (
    <div className="space-y-6 animate-in fade-in flex flex-col h-full min-h-0">
      <p className="text-xs text-yellow-500 font-black uppercase border-b border-green-900/50 pb-2">Results:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
        {suggestions.map(s => (
          <GameCard
            key={s.game_info.id}
            game={s}
            onSelect={() => onSelect(s.game_info.id, s.title, s.image)}
            sfx={sfx}
          />
        ))}
      </div>
    </div>
  );
}
