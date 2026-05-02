import { useState, useEffect, useCallback } from 'react';

export const useBasketball = (
  activeGame: string | null,
  gameOver: boolean,
  setScore: (s: number) => void,
  setGameOver: (b: boolean) => void,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onInit: () => void
) => {
  const [basketTime, setBasketTime] = useState(0);

  const initBasketball = useCallback(() => {
    setBasketTime(0);
    onInit();
  }, [onInit]);

  useEffect(() => {
    if (activeGame !== 'basketball' || gameOver) return;
    const t = setInterval(() => setBasketTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [activeGame, gameOver]);

  useEffect(() => {
    if (activeGame !== 'basketball' || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const W = canvas.width;
    const H = canvas.height;
    const hoop = { x: W / 2, y: 110, radius: 44 };
    let ball = { x: W / 2, y: H - 50, radius: 22, dx: 5, dy: 0, isShooting: false };
    let currentScore = 0;
    let goalFlash = 0;
    let particles: { x: number; y: number; dx: number; dy: number; life: number; color: string }[] = [];

    const spawnParticles = (cx: number, cy: number) => {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: cx, y: cy,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          life: 30 + Math.random() * 20,
          color: ['#f59e0b', '#ea580c', '#ef4444', '#fbbf24'][Math.floor(Math.random() * 4)]
        });
      }
    };

    const drawNet = () => {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      const netDepth = 40;
      const segments = 8;
      for (let row = 0; row < 4; row++) {
        const y1 = hoop.y + row * (netDepth / 4);
        const y2 = hoop.y + (row + 1) * (netDepth / 4);
        const shrink1 = row * 5;
        const shrink2 = (row + 1) * 5;
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x1 = (hoop.x - hoop.radius + shrink1) + t * ((hoop.radius - shrink1) * 2);
          const x2 = (hoop.x - hoop.radius + shrink2) + t * ((hoop.radius - shrink2) * 2);
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = (hoop.x - hoop.radius + shrink1) + t * ((hoop.radius - shrink1) * 2);
          const xNext = (hoop.x - hoop.radius + shrink1) + ((i + 1) / segments) * ((hoop.radius - shrink1) * 2);
          if (i < segments) {
            ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(xNext, y1); ctx.stroke();
          }
        }
      }
    };

    const drawBall = (bx: number, by: number, r: number) => {
      // Ball shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(bx + 4, by + 4, r, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ball gradient
      const grad = ctx.createRadialGradient(bx - r * 0.3, by - r * 0.3, r * 0.1, bx, by, r);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(0.5, '#ea580c');
      grad.addColorStop(1, '#9a3412');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();

      // Seam lines
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx - r, by); ctx.lineTo(bx + r, by); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx, by - r); ctx.lineTo(bx, by + r); ctx.stroke();
      // Curved seams
      ctx.beginPath();
      ctx.arc(bx - r * 0.15, by, r * 0.85, -0.8, 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx + r * 0.15, by, r * 0.85, Math.PI - 0.8, Math.PI + 0.8);
      ctx.stroke();

      // Shine highlight
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.arc(bx - r * 0.3, by - r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();
    };

    const draw = () => {
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0c1222');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Court floor
      const floorY = H - 80;
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
      floorGrad.addColorStop(0, 'rgba(139,92,42,0.15)');
      floorGrad.addColorStop(1, 'rgba(139,92,42,0.05)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, W, 80);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();

      // Goal flash overlay
      if (goalFlash > 0) {
        ctx.fillStyle = `rgba(245,158,11,${goalFlash * 0.12})`;
        ctx.fillRect(0, 0, W, H);
        goalFlash -= 0.8;
      }

      // Backboard
      const boardGrad = ctx.createLinearGradient(W / 2 - 70, hoop.y - 70, W / 2 + 70, hoop.y + 30);
      boardGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
      boardGrad.addColorStop(1, 'rgba(255,255,255,0.02)');
      ctx.fillStyle = boardGrad;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 70, hoop.y - 70, 140, 90, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Backboard target square
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 28, hoop.y - 35, 56, 38, 3);
      ctx.stroke();

      // Back rim
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(hoop.x, hoop.y, hoop.radius, 0.05, Math.PI - 0.05); ctx.stroke();

      // Net
      drawNet();

      // Ball
      drawBall(ball.x, ball.y, ball.radius);

      // Front rim (draw on top of ball when ball is behind)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(hoop.x, hoop.y, hoop.radius, Math.PI + 0.05, -0.05); ctx.stroke();
      ctx.shadowBlur = 0;

      // Rim caps (small circles at ends)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(hoop.x - hoop.radius, hoop.y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hoop.x + hoop.radius, hoop.y, 5, 0, Math.PI * 2); ctx.fill();

      // Particles
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy; p.life--;
        p.dy += 0.1;
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Aim guide (subtle dotted line when not shooting)
      if (!ball.isShooting) {
        ctx.setLineDash([4, 8]);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ball.x, ball.y - ball.radius); ctx.lineTo(ball.x, hoop.y); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ball movement
      if (!ball.isShooting) {
        ball.x += ball.dx;
        if (ball.x + ball.radius > W - 10 || ball.x - ball.radius < 10) ball.dx *= -1;
      } else {
        ball.y -= ball.dy;
        ball.dy *= 0.99; // slight deceleration
        if (ball.y <= hoop.y) {
          if (Math.abs(ball.x - hoop.x) < hoop.radius - ball.radius + 12) {
            currentScore++;
            setScore(currentScore);
            goalFlash = 10;
            spawnParticles(hoop.x, hoop.y);
            if (currentScore >= 3) { setGameOver(true); return; }
          }
          ball.isShooting = false;
          ball.y = H - 50;
          ball.x = Math.random() * (W - 120) + 60;
          ball.dx = (Math.random() > 0.5 ? 1 : -1) * (5 + currentScore * 0.8);
        }
      }

      if (!gameOver) animationId = requestAnimationFrame(draw);
    };

    const handleClick = () => {
      if (!ball.isShooting) {
        ball.isShooting = true;
        ball.dy = 16 + currentScore * 0.6;
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); handleClick(); }
    };

    canvas.addEventListener('mousedown', handleClick);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleClick(); });
    window.addEventListener('keydown', handleKey);

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [activeGame, gameOver, setScore, setGameOver, canvasRef]);

  return { basketTime, initBasketball };
};
