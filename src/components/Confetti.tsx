import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
}

interface Piece {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationAmount: number;
  oscillationX: number;
}

export default function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    const colors = [
      "#EAB308", // Golden Yellow
      "#F59E0B", // Solid Amber
      "#3B82F6", // Celestial Blue
      "#60A5FA", // Soft Blue
      "#F8FAFC", // Off-white
      "#FCD34D", // Pastel Yellow
      "#2563EB", // Cobalt Blue
    ];

    const pieces: Piece[] = [];
    const count = 150;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * width,
        y: Math.random() * -height - 20,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 3 - 1.5,
        oscillationSpeed: Math.random() * 0.03 + 0.01,
        oscillationAmount: Math.random() * 20 + 5,
        oscillationX: Math.random() * 100,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      pieces.forEach((p) => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;
        p.oscillationX += p.oscillationSpeed;
        const currentX = p.x + Math.sin(p.oscillationX) * p.oscillationAmount;

        // Reset if out of bounds
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        // Random shape: rectangle or circle or triangle
        if (parseInt(p.color[1], 16) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (parseInt(p.color[1], 16) % 3 === 1) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-50 w-full h-full"
    />
  );
}
