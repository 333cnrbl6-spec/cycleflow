import { useRef, useEffect } from 'react';
import { ROUTE_PATH } from '@/hooks/useRideSimulation';

export default function RideMapCanvas({ position, progress, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,64,175,0.18)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Completed path (bright)
    const toDone = Math.ceil(progress * (ROUTE_PATH.length - 1));
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(59,130,246,0.7)';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ROUTE_PATH.slice(0, toDone + 1).forEach(([nx, ny], i) => {
      const px = nx * W, py = ny * H;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Remaining path (dim)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(59,130,246,0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ROUTE_PATH.slice(toDone).forEach(([nx, ny], i) => {
      const px = nx * W, py = ny * H;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Start marker
    const [sx, sy] = ROUTE_PATH[0];
    ctx.beginPath();
    ctx.arc(sx * W, sy * H, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.fill();

    // End marker
    const [ex, ey] = ROUTE_PATH[ROUTE_PATH.length - 1];
    ctx.beginPath();
    ctx.arc(ex * W, ey * H, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Rider position
    if (position) {
      const [px, py] = position;
      // Outer glow ring
      const grad = ctx.createRadialGradient(px * W, py * H, 4, px * W, py * H, 16);
      grad.addColorStop(0, 'rgba(59,130,246,0.5)');
      grad.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.beginPath();
      ctx.arc(px * W, py * H, 16, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(px * W, py * H, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px * W, py * H, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    }
  }, [position, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={340}
      className={`w-full h-full rounded-lg ${className}`}
    />
  );
}