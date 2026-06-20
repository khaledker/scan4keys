import { ChevronRight } from 'lucide-react';

export default function GameCard({ game, onSelect, sfx }) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => sfx('hover')}
      className="aspect-[21/9] w-full relative group overflow-hidden rounded-lg border border-green-900/40 hover:border-green-500 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
    >
      <img
        src={game.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
        <span className="text-sm font-black uppercase truncate flex-1 text-green-500 group-hover:text-white drop-shadow-md text-left">
          {game.external}
        </span>
        <ChevronRight className="text-green-600 group-hover:text-green-400" size={16} />
      </div>
    </button>
  );
}
