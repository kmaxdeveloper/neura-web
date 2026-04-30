import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2, Trophy,
  RotateCcw, Zap, Sparkles,
  ChevronRight, Star, Brain
} from 'lucide-react';
import client from '../api/client';
import toast from 'react-hot-toast';

const Arcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [grid2048, setGrid2048] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasClaimedSmall, setHasClaimedSmall] = useState(false);
  const [hasClaimedBig, setHasClaimedBig] = useState(false);

  // Memory Match state
  const EMOJIS = ['🎯','🔥','⚡','🎮','💎','🏆','🌟','🚀'];
  type MemCard = { id: number; emoji: string; flipped: boolean; matched: boolean };
  const [memCards, setMemCards] = useState<MemCard[]>([]);
  const [flipped, setFlipped]   = useState<number[]>([]);
  const [matched, setMatched]   = useState(0);
  const [memTime, setMemTime]   = useState(0);
  const memLockRef = useRef(false);

  const initMemory = useCallback(() => {
    const pairs = [...EMOJIS, ...EMOJIS]
      .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, id: i }));
    setMemCards(pairs);
    setFlipped([]);
    setMatched(0);
    setMemTime(0);
    setScore(0);
    setGameOver(false);
    setHasClaimedSmall(false);
    setHasClaimedBig(false);
    memLockRef.current = false;
  }, []);

  // Memory timer
  useEffect(() => {
    if (activeGame !== 'memory' || gameOver) return;
    const t = setInterval(() => setMemTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [activeGame, gameOver]);

  const handleCardClick = (idx: number) => {
    if (memLockRef.current) return;
    if (memCards[idx].flipped || memCards[idx].matched) return;
    const newCards = memCards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, idx];
    setMemCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      memLockRef.current = true;
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        const resolved = newCards.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        );
        setMemCards(resolved);
        const newMatched = matched + 1;
        setMatched(newMatched);
        setScore(newMatched * 10);
        if (newMatched === EMOJIS.length) setGameOver(true);
        setFlipped([]);
        memLockRef.current = false;
      } else {
        setTimeout(() => {
          setMemCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          memLockRef.current = false;
        }, 900);
      }
    }
  };

  // 2048 Logic
  const init2048 = () => {
    let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    addNumber2048(newGrid);
    addNumber2048(newGrid);
    setGrid2048(newGrid);
    setScore(0);
    setGameOver(false);
    setHasClaimedSmall(false);
    setHasClaimedBig(false);
  };

  const addNumber2048 = (grid: number[][]) => {
    let options = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) options.push({ x: i, y: j });
      }
    }
    if (options.length > 0) {
      let spot = options[Math.floor(Math.random() * options.length)];
      grid[spot.x][spot.y] = Math.random() > 0.1 ? 2 : 4;
    }
  };

  const move2048 = (direction: string) => {
    if (activeGame !== '2048' || gameOver) return;
    let newGrid = JSON.parse(JSON.stringify(grid2048));
    let moved = false;

    const rotate = (m: number[][]) => m[0].map((_, i) => m.map(row => row[i]).reverse());

    let rotations = direction === 'left' ? 0 : direction === 'up' ? 1 : direction === 'right' ? 2 : 3;
    for (let i = 0; i < rotations; i++) newGrid = rotate(newGrid);

    let pointsThisMove = 0;

    for (let i = 0; i < 4; i++) {
      let row = newGrid[i].filter((v: number) => v !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          pointsThisMove += row[j];
          row.splice(j + 1, 1);
          moved = true;
        }
      }
      while (row.length < 4) row.push(0);
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) moved = true;
      newGrid[i] = row;
    }

    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotate(newGrid);

    if (moved) {
      addNumber2048(newGrid);
      setGrid2048(newGrid);
      const newTotalScore = score + pointsThisMove;
      setScore(newTotalScore);
      if (isGameOver2048(newGrid)) setGameOver(true);
    }
  };

  const isGameOver2048 = (grid: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
      }
    }
    return true;
  };

  const checkSmallGoal = () => {
    if (activeGame === '2048') return score >= 500;
    if (activeGame === 'memory') return gameOver && memTime > 60;
    return false;
  };

  const checkBigGoal = () => {
    if (activeGame === 'snake') return score >= 100;
    if (activeGame === '2048') return grid2048.some(row => row.some(val => val >= 1024));
    if (activeGame === 'memory') return gameOver && memTime <= 60;
    return false;
  };

  // Handle Controls for 2048
  useEffect(() => {
    if (activeGame !== '2048') return;
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') move2048('left');
      if (e.key === 'ArrowRight') move2048('right');
      if (e.key === 'ArrowUp') move2048('up');
      if (e.key === 'ArrowDown') move2048('down');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeGame, grid2048, gameOver]);

  // Snake Game Logic
  useEffect(() => {
    if (activeGame !== 'snake' || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let currentScore = 0;

    const draw = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      if (dx === 0 && dy === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("YO'NALISH TUGMALARINI BOSING", canvas.width / 2, canvas.height / 2);
      } else {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Wall Passthrough Logic
        const gridW = canvas.width / 30;
        const gridH = canvas.height / 30;
        
        if (head.x < 0) head.x = gridW - 1;
        if (head.x >= gridW) head.x = 0;
        if (head.y < 0) head.y = gridH - 1;
        if (head.y >= gridH) head.y = 0;
        
        // Self Collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) { 
          setGameOver(true); 
          return; 
        }

        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
          currentScore += 10;
          setScore(currentScore); // UI update
          
          // New food location (not on snake)
          let newFood;
          while(true) {
            newFood = { 
              x: Math.floor(Math.random() * gridW), 
              y: Math.floor(Math.random() * gridH) 
            };
            if (!snake.some(s => s.x === newFood!.x && s.y === newFood!.y)) break;
          }
          food = newFood;
        } else { 
          snake.pop(); 
        }
      }

      ctx.fillStyle = '#ef4444'; ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444'; ctx.beginPath(); ctx.roundRect(food.x * 30 + 3, food.y * 30 + 3, 24, 24, 6); ctx.fill();
      snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? '#06b6d4' : '#0891b2'; ctx.shadowBlur = i === 0 ? 20 : 0; ctx.shadowColor = '#06b6d4'; ctx.beginPath(); ctx.roundRect(segment.x * 30 + 2, segment.y * 30 + 2, 26, 26, 8); ctx.fill();
      });
    };

    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
      if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
      if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    };
    window.addEventListener('keydown', handleKey);
    const interval = setInterval(draw, 100);
    return () => { clearInterval(interval); window.removeEventListener('keydown', handleKey); };
  }, [activeGame, gameOver]);

  const claimReward = async (type: 'small' | 'big') => {
    if (type === 'small' && hasClaimedSmall) return;
    if (type === 'big' && hasClaimedBig) return;
    try {
      await client.post(`/api/v1/iris/games/reward?type=${type}`);
      if (type === 'small') setHasClaimedSmall(true);
      if (type === 'big') {
        setHasClaimedBig(true);
        setActiveGame(null);
      }
      toast.success(`Muborak bo'lsin! +${type === 'small' ? '0.1' : '2'} IRIS ball qo'shildi.`, {
        icon: '💎',
        style: { borderRadius: '20px', background: '#1e293b', color: '#fff', border: '1px solid #06b6d4' }
      });
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setHasClaimedSmall(false);
    setHasClaimedBig(false);
    if (activeGame === '2048') init2048();
    if (activeGame === 'memory') initMemory();
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
      
      {/* Header */}
      <div className="bg-[var(--surface-card)] p-12 rounded-[50px] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/[0.03] blur-[120px] -mr-48 -mt-48" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-6">
                  <Gamepad2 size={40} className="text-white" />
               </div>
               <div>
                  <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none">
                     Neura <span className="text-purple-500">Arcade</span>
                  </h1>
                  <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                     <Sparkles size={12} className="text-yellow-500" /> Play & Earn IRIS Points
                  </p>
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="px-8 py-4 bg-black/20 rounded-3xl border border-white/5 flex items-center gap-4 shadow-inner">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                     <Trophy size={20} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest">Reward</p>
                     <p className="text-xl font-black text-[var(--text-primary)] italic">+2 XP</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {!activeGame ? (
        /* Game Selection */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div 
             onClick={() => setActiveGame('snake')}
             className="group relative p-1 bg-[var(--surface-card)] rounded-[48px] border border-[var(--border-subtle)] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
           >
              <div className="p-10 space-y-6">
                 <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                    <Zap size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">Neon Snake</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">Klassik ilon o'yini. 100 ball yig'ing va +2 IRIS qo'lga kiriting!</p>
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
                    <p className="text-xs text-[var(--text-muted)] mt-2">1024 katagiga yeting va +2 IRIS ballini qo'lga kiriting!</p>
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
                    <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">Kartochkalarni juftlashtiring! 60 soniyada tugatsangiz +2 IRIS ball!</p>
                 </div>
                 <button className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest italic flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
                    O'ynash <ChevronRight size={16} />
                 </button>
              </div>
            </div>
        </div>
      ) : (
        /* Game Screen */
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500 w-full px-2 md:px-4">
           <div className="w-full max-w-xl bg-[var(--surface-card)] p-4 pt-16 md:p-12 rounded-[30px] md:rounded-[60px] border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center gap-6 md:gap-8 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 mt-4 md:mt-0">
                 <div className="px-4 py-2 md:px-8 md:py-3 bg-black/30 rounded-full border border-white/5">
                    <span className="text-[10px] md:text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest">Score: </span>
                    <span className="text-xl md:text-2xl font-black text-cyan-500 italic ml-1 md:ml-2">{activeGame === 'memory' ? `${matched}/8` : score}</span>
                 </div>
                 <div className="px-4 py-2 md:px-8 md:py-3 bg-black/30 rounded-full border border-white/5">
                    <span className="text-[10px] md:text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest">Goal: </span>
                    <span className="text-xl md:text-2xl font-black text-white italic ml-1 md:ml-2">{activeGame === 'snake' ? '100 pts' : activeGame === 'memory' ? `${memTime}s / 60s` : '1024 Tile'}</span>
                 </div>
              </div>

              <button 
                onClick={() => setActiveGame(null)}
                className="absolute top-4 right-4 md:top-8 md:right-12 text-[var(--text-muted)] hover:text-white transition-colors uppercase text-[10px] md:text-[12px] font-black tracking-widest bg-black/20 p-2 md:p-0 rounded-lg md:rounded-none"
              >
                Chiqish
              </button>

              <div className="mt-8 md:mt-16 relative w-full flex justify-center">
                {activeGame === 'snake' ? (
                  <canvas ref={canvasRef} width={600} height={600} className="rounded-[20px] md:rounded-[40px] border-4 md:border-8 border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.6)] bg-[#0f172a] w-full max-w-[500px] aspect-square" />
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
                  /* 2048 Grid - Larger */
                  <div className="grid grid-cols-4 gap-3 md:gap-6 bg-slate-900 p-3 md:p-6 rounded-[20px] md:rounded-[40px] border-4 md:border-8 border-white/5 shadow-2xl w-full max-w-[500px] aspect-square">
                     {grid2048.map((row, i) => row.map((val, j) => (
                       <div key={`${i}-${j}`} className={`w-full h-full rounded-lg md:rounded-2xl flex items-center justify-center text-xl md:text-3xl font-black transition-all duration-100 ${get2048Color(val)}`}>
                          {val !== 0 ? val : ''}
                       </div>
                     )))}
                  </div>
                )}
                
                {/* Small Reward Claim Overlay (2048 only) */}
                {checkSmallGoal() && !hasClaimedSmall && (
                  <div className="absolute top-4 right-4 bg-yellow-500 p-4 rounded-2xl shadow-lg flex flex-col items-center gap-2 animate-in slide-in-from-right duration-500 z-40">
                    <p className="text-[8px] font-black uppercase text-black tracking-widest leading-none">Goal Reached!</p>
                    <button 
                      onClick={() => claimReward('small')} 
                      className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase italic hover:scale-105 transition-transform"
                    >
                      Claim +0.1 IRIS
                    </button>
                  </div>
                )}
                
                {gameOver && !checkBigGoal() && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-[40px] flex flex-col items-center justify-center p-16 text-center animate-in fade-in duration-300">
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
                         <p className="text-black/70 font-bold uppercase text-[10px] mt-2 tracking-widest">Maqsadga erishildi. +2.0 IRIS ballini oling!</p>
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
