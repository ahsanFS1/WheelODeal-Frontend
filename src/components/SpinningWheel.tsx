import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Howl } from 'howler';
import confetti from 'canvas-confetti';
import { Prize, SpinResult } from '../types';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';



interface Props {
  prizes: Prize[]; // Flexible array of prizes
  onSpinEnd: (result: SpinResult) => void;
  disabled?: boolean;
}



export const SpinningWheel: React.FC<Props> = ({ prizes = [], onSpinEnd, disabled }) => {
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const currentRotation = useRef(0);

  
  // Sound effects
  const sounds = useRef({
    spin: new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'],
      loop: true,
      volume: 0.0,
    }),
    tick: new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3'],
      volume: 0.0,
    }),
    win: new Howl({
      src: ['/assets/prize_won.mp3'],
      volume: 0.7,
    }),
  });

  const getRandomPrize = () => {
    const random = Math.random();
    let probabilitySum = 0;

    for (const prize of prizes) {
      probabilitySum += prize.probability;
      if (random <= probabilitySum) {
        return prize;
      }
    }

    return prizes[prizes.length - 1];
  };

  const drawWheel = () => {
    if (!wheelRef.current || !ctx.current || !prizes || prizes.length === 0) {
      console.warn('No prizes available to draw the wheel.');
      return;
    }

    const canvas = wheelRef.current;
    const context = ctx.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width * 0.45; // Adjusted wheel size

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(centerX, centerY);
    context.rotate(currentRotation.current);

    // Draw wheel sections
    const sliceAngle = (2 * Math.PI) / prizes.length;
    prizes.forEach((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, radius, startAngle, endAngle);
      context.closePath();
      context.fillStyle = prize.color;
      context.fill();
      context.strokeStyle = '#8B5CF6';
      context.lineWidth = 2;
      context.stroke();

      // Highlight winning prize
      if (winningPrize && prize.id === winningPrize.id) {
        context.save();
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, startAngle, endAngle);
        context.closePath();
        context.strokeStyle = prize.glowColor || '#FFFFFF';
        context.lineWidth = 8;
        context.shadowColor = prize.glowColor || '#FFFFFF';
        context.shadowBlur = 30;
        context.stroke();
        context.restore();
      }

      // Draw text
      context.save();
      context.rotate(startAngle + sliceAngle / 2);
      context.textAlign = 'right';
      context.fillStyle = '#FFFFFF';
      context.font = 'bold 24px Arial';
      context.shadowColor = 'rgba(0, 0, 0, 0.5)';
      context.shadowBlur = 4;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.fillText(prize.text, radius - 30, 0);
      context.restore();
    });

    // Draw outer ring
    context.beginPath();
    context.arc(0, 0, radius + 2, 0, 2 * Math.PI);
    context.strokeStyle = '#8B5CF6';
    context.lineWidth = 6;
    context.stroke();

    context.restore();
  };

  const triggerWinAnimation = (prize: Prize) => {
    setWinningPrize(prize);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Play winning sound
    sounds.current.win.play();
  };

  const spin = () => {
    if (isSpinning || disabled || prizes.length === 0) {
      console.warn('Cannot spin: wheel is disabled or no prizes available.');
      return;
    }
  
    setIsSpinning(true);
    const prize = getRandomPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);
  
    // Calculate rotation
    const sliceAngle = (2 * Math.PI) / prizes.length;
    const targetRotation =
      currentRotation.current +
      Math.PI * 16 + // Increased number of full rotations for a longer spin
      (-((prizeIndex * sliceAngle) + sliceAngle / 2) - Math.PI / 2); // Align prize with top
  
    // Start spin sound
    sounds.current.spin.play();
  
    gsap.to(currentRotation, {
      current: targetRotation,
      duration: 9, // Increased duration to 8 seconds
      ease: 'power4.out',
      onUpdate: drawWheel,
      onComplete: () => {
        setIsSpinning(false);
        sounds.current.spin.stop();
        triggerWinAnimation(prize);
        onSpinEnd({ prize, rotation: targetRotation });
      },
    });
  };
  useEffect(() => {
    if (!wheelRef.current) return;
    ctx.current = wheelRef.current.getContext('2d');
    drawWheel();

    // Cleanup sounds
    return () => {
      Object.values(sounds.current).forEach((sound) => sound.unload());
    };
  }, [prizes]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <canvas
        ref={wheelRef}
        width={800}
        height={800}
        className="w-full h-full"
      />

<button
  onClick={spin}
  disabled={disabled || isSpinning}
  className={cn(
    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'w-24 h-24 rounded-full',
    'bg-gradient-to-r from-[#C084FC] via-[#8B5CF6] to-[#7C3AED]',
    'text-white font-bold text-2xl', // Increased font size for the icon
    'shadow-lg hover:scale-105 transition-all duration-300',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'border-4 border-[#C084FC]',
    'flex flex-col items-center justify-center gap-1'
  )}
  style={{
    boxShadow:
      '0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)',
  }}
>
  <span className= {"text-4xl"} style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>⮝</span>
  <span>SPIN</span>
</button>
    </div>
  );
};
