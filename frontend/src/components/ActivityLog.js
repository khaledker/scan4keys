import { useEffect, useRef } from 'react';

export default function ActivityLog({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <aside className="lg:col-span-1 border border-green-900/40 p-4 bg-black/60 h-48 lg:h-auto flex flex-col overflow-hidden rounded-lg relative order-2 lg:order-1 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
      <div className="text-[10px] font-black bg-green-900/20 p-2 mb-2 text-center uppercase text-green-600 border-b border-green-900/30">
        Activity Log
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-bold pr-2 custom-scrollbar" ref={scrollRef}>
        {logs.map(l => (
          <div
            key={l.id}
            className={`${l.type === 'error' ? 'text-red-500' : l.type === 'process' ? 'text-yellow-500' : 'text-green-600'} border-l-2 border-current pl-2`}
          >
            {`> ${l.text}`}
          </div>
        ))}
      </div>
    </aside>
  );
}
