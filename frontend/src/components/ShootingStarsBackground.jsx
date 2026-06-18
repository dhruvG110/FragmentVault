import { useEffect, useRef } from "react";

export const ShootingStarsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create a pool of stars
    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.05 + 0.01,
    }));

    // Create a pool of shooting stars
    const shootingStars = [];
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 5,
        angle: Math.PI / 4, // 45 degrees diagonal downward
        opacity: 1,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Static Twinkling Stars
      stars.forEach((star) => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) star.speed = -star.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // 2. Draw & Update Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const p = shootingStars[i];
        ctx.beginPath();
        const grad = ctx.createLinearGradient(p.x, p.y, p.x - Math.cos(p.angle) * p.length, p.y - Math.sin(p.angle) * p.length);
        grad.addColorStop(0, `rgba(59, 130, 246, ${p.opacity})`); // Neon Blue head
        grad.addColorStop(1, "rgba(59, 130, 246, 0)"); // Fading tail
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(p.angle) * p.length, p.y - Math.sin(p.angle) * p.length);
        ctx.stroke();

        // Update positions
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.opacity -= 0.015;

        // Remove dead stars
        if (p.opacity <= 0 || p.x > canvas.width || p.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      }

      // Randomly trigger a new shooting star
      if (Math.random() < 0.015 && shootingStars.length < 3) {
        createShootingStar();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};