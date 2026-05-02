import React from 'react';
import { Zap, ChevronRight, Star, Brain, CircleDot } from 'lucide-react';

interface GameSelectionProps {
  setActiveGame: (game: string) => void;
  init2048: () => void;
  initMemory: () => void;
  initBasketball: () => void;
  initSnake: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ setActiveGame, init2048, initMemory, initBasketball, initSnake }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div 
        onClick={() => { setActiveGame('snake'); initSnake(); }}
        className="group relative p-1 bg-[var(--surface-card)] rounded-[48px] border border-[var(--border-subtle)] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
      >
        <div className="p-10 space-y-6">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
            <Zap size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">Neon Snake</h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">Klassik ilon o'yini. 100 ball yig'ing va +0.05 IRIS qo'lga kiriting!</p>
          </div>
          <button className="w-full py-4 bg-cyan-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest italic flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
            O'ynash <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        onClick={() => { setActiveGame('2048'); init2048(); }}
        className="group relative p-1 bg-[var(--surface-card)] rounded-[48px] border border-[var(--border-subtle)] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all hover:shadow-2xl hover:shadow-purple-500/10"
      >
        <div className="p-10 space-y-6">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <Star size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">2048 Puzzle</h3>
            <p className="text-xs text-[var(--text-muted)] mt-2">1024 katagiga yeting va +0.05 IRIS ballini qo'lga kiriting!</p>
          </div>
          <button className="w-full py-4 bg-purple-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest italic flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
            O'ynash <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div onClick={() => { setActiveGame('memory'); initMemory(); }}
        className="group relative p-1 bg-[var(--surface-card)] rounded-[48px] border border-[var(--border-subtle)] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all hover:shadow-2xl hover:shadow-amber-500/10">
        <div className="p-10 space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Brain size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">Memory Match</h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">Kartochkalarni juftlashtiring! 60 soniyada tugatsangiz +0.05 IRIS ball!</p>
          </div>
          <button className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest italic flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
            O'ynash <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div onClick={() => { setActiveGame('basketball'); initBasketball(); }}
        className="group relative p-1 bg-[var(--surface-card)] rounded-[48px] border border-[var(--border-subtle)] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all hover:shadow-2xl hover:shadow-orange-500/10">
        <div className="p-10 space-y-6">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <CircleDot size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">Basketball</h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">Topni savatga tushiring! 15 soniyada 3 ta gol = +0.05 IRIS ball!</p>
          </div>
          <button className="w-full py-4 bg-orange-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest italic flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
            O'ynash <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
