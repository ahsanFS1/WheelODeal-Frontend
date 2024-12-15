import React, { useState, useEffect } from 'react';

interface Props {
  expiryTimestamp: number;
}

export const CountdownTimer: React.FC<Props> = ({ expiryTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = expiryTimestamp - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTimestamp]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          {/* Timer Value */}
          <div className="bg-gray-800 px-3 py-2 rounded-md min-w-[50px] text-lg font-bold text-white">
            {String(value).padStart(2, '0')}
          </div>
          {/* Unit Label */}
          <div className="mt-1 text-sm text-gray-400 capitalize">{unit}</div>
        </div>
      ))}
    </div>
  );
};
