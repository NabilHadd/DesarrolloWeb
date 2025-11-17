import { useMemo } from 'react';

const gradients = [
  'linear-gradient(45deg,#f0e7ff,#c3b5ff)',
  'linear-gradient(45deg,#fcd1e6,#f9a8d4)',
  'linear-gradient(45deg,#c7f9ff,#9ae6ff)',
  'linear-gradient(45deg,#fdecc8,#f9d29d)',
  'linear-gradient(45deg,#d7f5d3,#a5e4c7)',
  'linear-gradient(45deg,#f3e8ff,#d8b4fe)',
];

const animations = ['float-up-down', 'float-left-right', 'float-diagonal'];

const randomBetween = (min, max) => Math.random() * (max - min) + min;

export default function FloatingBackground() {
  const circles = useMemo(() => {
    const total = 26;
    return Array.from({ length: total }).map((_, index) => {
      const animation = animations[index % animations.length];
      const gradient = gradients[index % gradients.length];
      const size = randomBetween(55, 120);
      const duration = `${randomBetween(6, 12).toFixed(2)}s`;
      const delay = `${-randomBetween(0, 6).toFixed(2)}s`;
      return {
        id: index,
        size,
        gradient,
        animation,
        duration,
        delay,
        top: `${randomBetween(-5, 95)}%`,
        left: `${randomBetween(-5, 95)}%`,
      };
    });
  }, []);

  return (
    <div className="floating-background">
      {circles.map((circle) => (
        <span
          key={circle.id}
          className={`floating-element ${circle.animation}`}
          style={{
            width: circle.size,
            height: circle.size,
            background: circle.gradient,
            top: circle.top,
            left: circle.left,
            animationDuration: circle.duration,
            animationDelay: circle.delay,
          }}
        />
      ))}
    </div>
  );
}
