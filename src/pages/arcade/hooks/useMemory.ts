import { useState, useEffect, useRef, useCallback } from 'react';

const EMOJIS = ['🎯','🔥','⚡','🎮','💎','🏆','🌟','🚀'];
export type MemCard = { id: number; emoji: string; flipped: boolean; matched: boolean };

export const useMemory = (
  activeGame: string | null,
  gameOver: boolean,
  setScore: (s: number) => void,
  setGameOver: (b: boolean) => void,
  onInit: () => void
) => {
  const [memCards, setMemCards] = useState<MemCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState(0);
  const [memTime, setMemTime] = useState(0);
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
    memLockRef.current = false;
    onInit();
  }, [onInit]);

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

  return { memCards, matched, memTime, initMemory, handleCardClick };
};
