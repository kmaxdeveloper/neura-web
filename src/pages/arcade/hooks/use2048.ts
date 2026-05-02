import { useState, useEffect, useCallback } from 'react';

export const use2048 = (
  activeGame: string | null,
  gameOver: boolean,
  score: number,
  setScore: (s: number) => void,
  setGameOver: (b: boolean) => void,
  onInit: () => void
) => {
  const [grid2048, setGrid2048] = useState<number[][]>([]);

  const init2048 = useCallback(() => {
    let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    addNumber2048(newGrid);
    addNumber2048(newGrid);
    setGrid2048(newGrid);
    onInit();
  }, [onInit]);

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

  const move2048 = useCallback((direction: string) => {
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
      setScore(score + pointsThisMove);
      if (isGameOver2048(newGrid)) setGameOver(true);
    }
  }, [activeGame, gameOver, grid2048, score, setScore, setGameOver]);

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
  }, [activeGame, move2048]);

  return { grid2048, init2048 };
};
