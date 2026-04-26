import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

const ServerTime: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4 px-6 py-3.5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl backdrop-blur-xl group hover:border-cyan-500/40 transition-all">
      <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 group-hover:scale-110 transition-transform duration-500">
        <ClockIcon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black text-[var(--text-primary)] font-mono leading-none tracking-tight">
          {time.toLocaleTimeString([], { hour12: false })}
        </span>
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
          <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
          {time.toLocaleDateString('en-GB').replace(/\//g, '.')} // Server
        </span>
      </div>
    </div>
  );
};

export default ServerTime;
