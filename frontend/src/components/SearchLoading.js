import { RefreshCw } from 'lucide-react';

export default function SearchLoading() {
  return (
    <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
      <RefreshCw className="w-12 h-12 text-green-500 animate-spin mb-4" />
      <span className="font-black uppercase tracking-widest text-sm">Searching...</span>
    </div>
  );
}
