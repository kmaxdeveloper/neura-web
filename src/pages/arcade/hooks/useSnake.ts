import { useEffect, useCallback } from 'react';

export const useSnake = (
  activeGame: string | null,
  gameOver: boolean,
  setScore: (s: number) => void,
  setGameOver: (b: boolean) => void,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onInit: () => void
) => {

  const initSnake = useCallback(() => {
    onInit();
  }, [onInit]);

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
          setScore(currentScore);
          
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

      // Draw Food
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(food.x * 30 + 15, food.y * 30 + 15, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#fff' : '#06b6d4';
        if (index === 0) {
           ctx.shadowColor = '#fff';
           ctx.shadowBlur = 10;
        } else {
           ctx.shadowBlur = 0;
        }
        ctx.fillRect(segment.x * 30 + 2, segment.y * 30 + 2, 26, 26);
      });
      ctx.shadowBlur = 0;
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
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!touchStartX || !touchStartY) return;
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      const xDiff = touchStartX - touchEndX;
      const yDiff = touchStartY - touchEndY;
      
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && dx === 0) { dx = -1; dy = 0; }
        else if (xDiff < 0 && dx === 0) { dx = 1; dy = 0; }
      } else {
        if (yDiff > 0 && dy === 0) { dx = 0; dy = -1; }
        else if (yDiff < 0 && dy === 0) { dx = 0; dy = 1; }
      }
      touchStartX = 0;
      touchStartY = 0;
    });

    const gameLoop = setInterval(draw, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKey);
    };
  }, [activeGame, gameOver, setScore, setGameOver, canvasRef]);

  return { initSnake };
};
