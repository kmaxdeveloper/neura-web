import React from 'react';

export const TabButton = ({ active, label, icon: Icon, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-4 rounded-[22px] text-[11px] font-black uppercase transition-all tracking-tighter italic ${active ? 'bg-white text-black shadow-2xl scale-105 shadow-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    <Icon size={16} className={active ? "animate-pulse" : ""} /> {label}
  </button>
);