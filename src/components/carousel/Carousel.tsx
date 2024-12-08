import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselImage } from '../../types';

interface Props {
  images: CarouselImage[];
  autoPlayInterval?: number;
  onInteraction?: (action: string, index: number) => void; // Optional callback for tracking interactions
}

export const Carousel: React.FC<Props> = ({ images, autoPlayInterval = 5000, onInteraction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play effect
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      const newIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(newIndex);
      onInteraction?.('auto_play', newIndex); // Track auto-play interaction
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, currentIndex, autoPlayInterval, onInteraction]);

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    onInteraction?.('previous', newIndex); // Track previous button click
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    onInteraction?.('next', newIndex); // Track next button click
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    onInteraction?.('dot_click', index); // Track dot navigation
  };

  // Log a warning if no images are provided
  if (!images.length) {
    console.error('No images provided to the Carousel component.');
    return null;
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
      {/* Animated image transitions */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
