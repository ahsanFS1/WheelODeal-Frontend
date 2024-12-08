import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Prize, SpinResult } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  prizes: Prize[];
  onSpinEnd: (result: SpinResult) => void;
  disabled?: boolean;
  style?: {
    borderColor: string;
    stopperColor: string;
    centerColor: string;
    glassEffect: boolean;
  };
}

export const LuxuryWheel: React.FC<Props> = ({
  prizes,
  onSpinEnd,
  disabled,
  style = {
    borderColor: 'violet',
    stopperColor: 'teal',
    centerColor: '#FFD700',
    glassEffect: true,
  },
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomPrize = () => {
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
  
    if (totalProbability === 0) {
      throw new Error("Total probability cannot be zero.");
    }
  
    const random = Math.random() * totalProbability;
    let cumulativeProbability = 0;
  
    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        return prize;
      }
    }
  
    // Fallback in case of floating-point imprecision
    return prizes[prizes.length - 1];
  };
  
  const spin = () => {
    if (isSpinning || disabled) return;
  
    setIsSpinning(true);
  
    const prize = getRandomPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);
  
    const sliceAngle = 360 / prizes.length;
    const baseRotation = 2160; // 6 full rotations
    const randomExtraRotation = Math.random() * sliceAngle; // Add randomness within the slice
    const targetRotation = baseRotation + prizeIndex * sliceAngle + randomExtraRotation;
  
    gsap.to(wheelRef.current, {
      rotation: targetRotation,
      duration: 6,
      ease: "elastic.out(1, 0.3)",
      onComplete: () => {
        setIsSpinning(false);
        onSpinEnd({ prize, rotation: targetRotation });
      },
    });
  };

  
  
  const renderSlices = () => {
    const sliceAngle = 360 / prizes.length;
    const radius = 350; // Larger radius for a bigger wheel
    const center = 400; // Adjust the center point

    return prizes.map((prize, i) => {
      const angle = (i * sliceAngle * Math.PI) / 180;
      const nextAngle = ((i + 1) * sliceAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(angle);
      const y1 = center + radius * Math.sin(angle);
      const x2 = center + radius * Math.cos(nextAngle);
      const y2 = center + radius * Math.sin(nextAngle);

      const path = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;

      return (
        <g key={prize.id}>
          <path
            d={path}
            fill={prize.color}
            stroke={style.borderColor}
            strokeWidth="3"
            className="transition-all duration-300"
          />
          <text
            x={center + radius * 0.6 * Math.cos(angle + (sliceAngle / 2) * (Math.PI / 180))}
            y={center + radius * 0.6 * Math.sin(angle + (sliceAngle / 2) * (Math.PI / 180))}
            fill="white"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {prize.text}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        ref={wheelRef}
        viewBox="0 0 800 800" // Larger viewBox for a bigger wheel
        className="w-full max-w-[600px] mx-auto filter drop-shadow-xl"
      >
        {/* Outer ring */}
        <circle
          cx="400"
          cy="400"
          r="370"
          fill="none"
          stroke={style.borderColor}
          strokeWidth="15"
        />

        {/* Wheel sections */}
        {renderSlices()}

        {/* Center decoration */}
        <circle cx="400" cy="400" r="40" fill={style.centerColor} className="filter drop-shadow-lg" />
      </svg>

      {/* Stopper */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-12 h-16"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
      >
        <div
          className="w-0 h-0 border-l-[24px] border-l-transparent border-t-[36px] border-r-[24px] border-r-transparent mx-auto"
          style={{ borderTopColor: style.stopperColor }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-900',
          'shadow-lg transform hover:scale-105 transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'border-4 border-yellow-400',
          'flex items-center justify-center',
          'font-bold text-white text-lg'
        )}
      >
        SPIN
      </button>
    </div>
  );
};
