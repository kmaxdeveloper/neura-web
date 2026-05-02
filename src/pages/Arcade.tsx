import React, { useState, useRef, useCallback } from 'react';
import { Gamepad2, Trophy, RotateCcw } from 'lucide-react';
import client from '../api/client';
import toast from 'react-hot-toast';

import GameSelection from './arcade/components/GameSelection';
import { use2048 } from './arcade/hooks/use2048';
import { useMemory } from './arcade/hooks/useMemory';
import { useSnake } from './arcade/hooks/useSnake';
import { useBasketball } from './arcade/hooks/useBasketball';

const Arcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasClaimedSmall, setHasClaimedSmall] = useState(false);
  const [hasClaimedBig, setHasClaimedBig] = useState(false);

  const onInitGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setHasClaimedSmall(false);
    setHasClaimedBig(false);
  }, []);

  const { grid2048, init2048 } = use2048(activeGame, gameOver, score, setScore, setGameOver, onInitGame);
  const { memCards, matched, memTime, initMemory, handleCardClick } = useMemory(activeGame, gameOver, setScore, setGameOver, onInitGame);
  const { initSnake } = useSnake(activeGame, gameOver, setScore, setGameOver, canvasRef, onInitGame);
  const { basketTime, initBasketball } = useBasketball(activeGame, gameOver, setScore, setGameOver, canvasRef, onInitGame);

  const checkSmallGoal = () => {
    if (activeGame === '2048') return score >= 500;
    if (activeGame === 'memory') return gameOver && memTime > 60;
    if (activeGame === 'basketball') return gameOver && basketTime > 15;
    return false;
  };

  const checkBigGoal = () => {
    if (activeGame === 'snake') return score >= 100;
    if (activeGame === '2048') return grid2048.some(row => row.some(val => val >= 1024));
    if (activeGame === 'memory') return gameOver && memTime <= 60;
    if (activeGame === 'basketball') return gameOver && basketTime <= 15;
    return false;
  };

  const claimReward = async (type: 'small' | 'big') => {
    try {
      await client.post(`/api/v1/iris/games/reward?type=${type}`);
      if (type === 'small') setHasClaimedSmall(true);
      if (type === 'big') {
        setHasClaimedBig(true);
        setActiveGame(null);
      }
      toast.success(`Muborak bo'lsin! +${type === 'small' ? '0.01' : '0.05'} IRIS ball qo'shildi.`, {
        icon: '💎',
        style: { borderRadius: '20px', background: '#1e293b', color: '#fff', border: '1px solid #06b6d4' }
      });
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const resetGame = () => {
    onInitGame();
    if (activeGame === '2048') init2048();
    if (activeGame === 'memory') initMemory();
    if (activeGame === 'snake') initSnake();
    if (activeGame === 'basketball') initBasketball();
  };

  const get2048Color = (val: number) => {
    const colors: any = {
      2: 'bg-slate-700 text-white',
      4: 'bg-slate-600 text-white',
      8: 'bg-orange-500 text-white',
      16: 'bg-orange-600 text-white',
      32: 'bg-red-500 text-white',
      64: 'bg-red-600 text-white',
      128: 'bg-yellow-500 text-black',
      256: 'bg-yellow-400 text-black',
      512: 'bg-cyan-500 text-black',
      1024: 'bg-purple-500 text-white shadow-[0_0_20px_#a855f7]',
      2048: 'bg-emerald-500 text-white shadow-[0_0_20px_#10b981]'
    };
    return colors[val] || 'bg-slate-800 text-white';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-[var(--surface-card)] p-12 rounded-[50px] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/[0.03] blur-[120px] -mr-48 -mt-48" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-6">
                  <Gamepad2 size={40} className="text-white" />
               </div>
               <div>
                  <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">
                     Neura <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Arcade</span>
                  </h1>
                  <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
                     Play // Compete // Earn IRIS
                  </p>
               </div>
            </div>
         </div>
      </div>

      {!activeGame ? (
        <GameSelection setActiveGame={setActiveGame} init2048={init2048} initMemory={initMemory} initBasketball={initBasketball} initSnake={initSnake} />
      ) : (
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500 w-full px-2 md:px-4">
           <div className="w-full max-w-xl bg-[var(--surface-card)] p-4 pt-16 md:p-12 rounded-[30px] md:rounded-[60px] border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center gap-6 md:gap-8 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 mt-4 md:mt-0">
                 <div className="px-4 py-2 md:px-8 md:py-3 bg-black/30 rounded-full border border-white/5">
                    <span className="text-[10px] md:text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest">Score: </span>
                    <span className="text-xl md:text-2xl font-black text-cyan-500 italic ml-1 md:ml-2">{activeGame === 'memory' ? `${matched}/8` : score}</span>
                 </div>
                 <div className="px-4 py-2 md:px-8 md:py-3 bg-black/30 rounded-full border border-white/5">
                    <span className="text-[10px] md:text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest">Goal: </span>
                    <span className="text-xl md:text-2xl font-black text-white italic ml-1 md:ml-2">{activeGame === 'snake' ? '100 pts' : activeGame === 'memory' ? `${memTime}s / 60s` : activeGame === 'basketball' ? `${score}/3 | ${basketTime}s` : '1024 Tile'}</span>
                 </div>
              </div>

              <button 
                onClick={() => setActiveGame(null)}
                className="absolute top-4 right-4 md:top-8 md:right-12 text-[var(--text-muted)] hover:text-white transition-colors uppercase text-[10px] md:text-[12px] font-black tracking-widest bg-black/20 p-2 md:p-0 rounded-lg md:rounded-none"
              >
                Chiqish
              </button>

              <div className="mt-8 md:mt-16 relative w-full flex justify-center">
                {activeGame === 'snake' || activeGame === 'basketball' ? (
                  <canvas ref={canvasRef} width={600} height={600} className="rounded-[20px] md:rounded-[40px] border-4 md:border-8 border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.6)] bg-[#0f172a] w-full max-w-[500px] aspect-square touch-none" />
                ) : activeGame === 'memory' ? (
                  <div className="grid grid-cols-4 gap-3 w-full max-w-[500px] aspect-square p-2">
                    {memCards.map((card, idx) => (
                      <div key={card.id} onClick={() => handleCardClick(idx)}
                        className={`cursor-pointer rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border-2 select-none
                          ${card.matched ? 'bg-emerald-500/20 border-emerald-500/50 scale-95' :
                            card.flipped ? 'bg-cyan-500/20 border-cyan-500/50' :
                            'bg-slate-800 border-white/5 hover:border-white/20 hover:scale-105'}`}>
                        {card.flipped || card.matched ? card.emoji : '❓'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3 md:gap-6 bg-slate-900 p-3 md:p-6 rounded-[20px] md:rounded-[40px] border-4 md:border-8 border-white/5 shadow-2xl w-full max-w-[500px] aspect-square">
                     {grid2048.map((row, i) => row.map((val, j) => (
                       <div key={`${i}-${j}`} className={`w-full h-full rounded-lg md:rounded-2xl flex items-center justify-center text-xl md:text-3xl font-black transition-all duration-100 ${get2048Color(val)}`}>
                          {val !== 0 ? val : ''}
                       </div>
                     )))}
                  </div>
                )}
                
                {checkSmallGoal() && !hasClaimedSmall && (
                  <div className="absolute top-4 right-4 bg-yellow-500 p-4 rounded-2xl shadow-lg flex flex-col items-center gap-2 animate-in slide-in-from-right duration-500 z-40">
                    <p className="text-[8px] font-black uppercase text-black tracking-widest leading-none">Goal Reached!</p>
                    <button 
                      onClick={() => claimReward('small')} 
                      className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase italic hover:scale-105 transition-transform"
                    >
                      Claim +0.01 IRIS
                    </button>
                  </div>
                )}
                
                {gameOver && !checkBigGoal() && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-[40px] flex flex-col items-center justify-center p-16 text-center animate-in fade-in duration-300 z-40">
                     <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-8">
                        <RotateCcw size={48} />
                     </div>
                     <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">O'yin tugadi!</h2>
                     <p className="text-xl text-[var(--text-secondary)] mt-4 font-medium italic">Sizning natijangiz: <span className="text-cyan-500 font-black">{score}</span></p>
                     
                     <div className="flex gap-6 mt-12">
                        <button 
                          onClick={resetGame}
                          className="px-12 py-5 bg-white text-black rounded-3xl font-black uppercase text-sm italic flex items-center gap-3 shadow-xl hover:scale-105 transition-transform"
                        >
                          Qayta boshlash
                        </button>
                        <button 
                          onClick={() => setActiveGame(null)}
                          className="px-12 py-5 bg-white/10 text-white rounded-3xl font-black uppercase text-sm italic border border-white/10 hover:bg-white/20 transition-all"
                        >
                          Menu
                        </button>
                     </div>
                  </div>
                )}

                {checkBigGoal() && !hasClaimedBig && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] bg-cyan-500 p-10 rounded-[40px] shadow-[0_0_100px_rgba(6,182,212,0.5)] flex flex-col items-center gap-6 animate-in zoom-in duration-500 z-50">
                      <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center text-white">
                         <Trophy size={40} />
                      </div>
                      <div className="text-center">
                         <h3 className="text-3xl font-black text-black uppercase italic leading-none">Mega Yutuq!</h3>
                         <p className="text-black/70 font-bold uppercase text-[10px] mt-2 tracking-widest">Maqsadga erishildi. +0.05 IRIS ballini oling!</p>
                      </div>
                      <button 
                        onClick={() => claimReward('big')}
                        className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-sm tracking-widest italic hover:scale-105 transition-transform"
                      >
                         Ballarni olish
                      </button>
                   </div>
                )}
              </div>
           </div>
           
           <p className="text-[12px] text-[var(--text-muted)] uppercase tracking-widest font-mono text-center max-w-lg mt-4 italic">
             * Maqsadga erishganingizda "Ballarni olish" tugmasi chiqadi. Har bir o'yin sessiyasi uchun faqat bir marta ball olish mumkin.
           </p>
        </div>
      )}
    </div>
  );
};

export default Arcade;
