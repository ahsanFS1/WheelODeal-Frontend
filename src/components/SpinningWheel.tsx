import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import { Prize, SpinResult } from "../types";
import { cn } from "../lib/utils";

interface Props {
  prizes: Prize[]; // Flexible array of prizes
  onSpinEnd: (result: SpinResult) => void;
  disabled?: boolean;
  music: boolean; // Toggle to play winning sound
  button: any,
}

export const SpinningWheel: React.FC<Props> = ({
  prizes = [],
  onSpinEnd,
  disabled,
  music = false,
  button = {
    text: "SPIN",
    textColor: "#FFFFFF" ,
    backgroundColor: "#6C63FF",
    gradient: true,
    gradientStart: "#C084FC", // Start color for gradient
    gradientEnd:  "#7C3AED", // End color for gradient
    gradientDirection: "to top",

  }
}) => {
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const currentRotation = useRef(0);

  // Sound effects
  const sounds = useRef({
    spin: new Howl({
      src: ["/assets/spin_sound.mp3"],
      loop: false,
      volume: 0.3,
    }),
    win: new Howl({
      src: ["/assets/prize_won.mp3"],
      volume: 0.3,
    }),
  });

  // Function to draw the wheel
  const drawWheel = () => {
    if (!wheelRef.current || !ctx.current || !prizes || prizes.length === 0) {
      console.warn("No prizes available to draw the wheel.");
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
  
      // Draw slice with gradient or solid color
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, radius, startAngle, endAngle);
      context.closePath();
  
      if (prize.gradient) {
        // Create gradient fill
        const gradient = context.createLinearGradient(
          Math.cos(startAngle) * radius,
          Math.sin(startAngle) * radius,
          Math.cos(endAngle) * radius,
          Math.sin(endAngle) * radius
        );
        gradient.addColorStop(0, prize.gradientStart || "#FFFFFF");
        gradient.addColorStop(1, prize.gradientEnd || "#000000");
        context.fillStyle = gradient;
      } else {
        context.fillStyle = prize.color || "#FF5733"; // Fallback solid color
      }
      context.fill();
  
      // Draw slice border
      context.strokeStyle = "#d8a63d";
      context.lineWidth = 2;
      context.stroke();
  
      // Highlight winning prize
      if (winningPrize && prize.id === winningPrize.id) {
        context.save();
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, startAngle, endAngle);
        context.closePath();
        context.strokeStyle = prize.glowColor || "#FFFFFF";
        context.lineWidth = 8;
        context.shadowColor = prize.glowColor || "#FFFFFF";
        context.shadowBlur = 30;
        context.stroke();
        context.restore();
      }
  
      // Draw text
      context.save();
      context.rotate(startAngle + sliceAngle / 2);
      context.textAlign = "right";
      context.fillStyle = "#FFFFFF";
      context.font = "bold 24px Arial";
      context.shadowColor = "rgba(0, 0, 0, 0.5)";
      context.shadowBlur = 4;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
  
      // Dynamic text adjustment for better alignment
      const textOffset = radius - 30;
      context.fillText(prize.text, textOffset, 0);
      context.restore();
    });
  
    // Draw outer ring
    context.beginPath();
    context.arc(0, 0, radius + 2, 0, 2 * Math.PI);
    context.strokeStyle = "#d8a63d";
    context.lineWidth = 6;
    context.stroke();
  
    context.restore();
  };
  
  // Get random prize
  const getRandomPrize = () => {
    const random = Math.random();
    let probabilitySum = 0;
    for (const prize of prizes) {
      probabilitySum += prize.probability;
      if (random <= probabilitySum) return prize;
    }
    return prizes[prizes.length - 1];
  };

  // Trigger confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const spin = () => {
    
    if (isSpinning || disabled || !prizes.length) return;
    console.log("Playing: ",sounds.current.spin.play())
    {sounds.current.spin.play()};
    setIsSpinning(true);
    const prize = getRandomPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);

    // Calculate spin rotation
    const sliceAngle = (2 * Math.PI) / prizes.length;
    const targetRotation =
      currentRotation.current +
      Math.PI * 20 + // Full spins
      (-((prizeIndex * sliceAngle) + sliceAngle / 2) - Math.PI / 2);

    

    gsap.to(currentRotation, {
      current: targetRotation,
      
      duration: 11,
      ease: "power4.out",
      onUpdate: drawWheel,
      onComplete: () => {
        setIsSpinning(false);
        sounds.current.spin.stop();
        console.log(music)
        // Conditional music playback
        if (music) {
          
          console.log("Playing Music",sounds.current.win.play());
          sounds.current.win.play()};

        triggerConfetti(); // Fire confetti
        setWinningPrize(prize);
        onSpinEnd({ prize, rotation: targetRotation });
      },
    });
  };

  useEffect(() => {
    if (!wheelRef.current) return;
    ctx.current = wheelRef.current.getContext("2d");
    drawWheel();

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
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "rounded-full flex flex-col items-center justify-center gap-1",
    "shadow-lg hover:scale-105 transition-transform duration-300",
    "disabled:opacity-50 disabled:cursor-not-allowed border-4",
    "text-white font-extrabold tracking-wide"
  )}
  style={{
    width: "clamp(5rem, 12vw, 6.5rem)", // Smaller, responsive width
    height: "clamp(5rem, 12vw, 6.5rem)", // Smaller, responsive height
    background: button?.gradient
      ? `linear-gradient(${button.gradientDirection}, ${button.gradientStart}, ${button.gradientEnd})`
      : button?.backgroundColor || "#8B5CF6",
    color: button?.textColor || "#FFFFFF",
    fontSize: "clamp(1rem, 2.5vw, 1.25rem)", // Text size dynamically adjusts
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
    borderColor: button?.gradientStart || button?.backgroundColor || "#6C63FF",
  }}
>
  {/* Up Arrow */}
  <span
    style={{
      fontSize: "clamp(1.5rem, 3vw, 1.5rem)", // Arrow size adjusts with screen
      lineHeight: "1",
    }}
  >
    &#11165;
  </span>

  {/* Button Text */}
  <span
    style={{
      fontSize: "clamp(1.5rem, 3vw, 1.5rem)", // Slightly smaller responsive text
      lineHeight: "1.2",
      textAlign: "center",
    }}
  >
    {button.text || "SPIN"}
  </span>
</button>



    </div>
  );
};
