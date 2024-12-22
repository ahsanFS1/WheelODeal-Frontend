import React, { useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  PaintBucket,
  Moon,
  Eye,
  Sun,
  Link,
  Type,
  RotateCcw,
  Contrast
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  isGrayscale: boolean;
  isHighContrast: boolean;
  isNegativeContrast: boolean;
  isLightBackground: boolean;
  isLinksUnderlined: boolean;
  isReadableFont: boolean;
}

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    isGrayscale: false,
    isHighContrast: false,
    isNegativeContrast: false,
    isLightBackground: false,
    isLinksUnderlined: false,
    isReadableFont: false,
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    const classList = document.documentElement.classList;
    classList.toggle('grayscale', settings.isGrayscale);
    classList.toggle('high-contrast', settings.isHighContrast);
    classList.toggle('negative-contrast', settings.isNegativeContrast);
    classList.toggle('light-background', settings.isLightBackground);
    classList.toggle('links-underlined', settings.isLinksUnderlined);
    classList.toggle('readable-font', settings.isReadableFont);
  }, [settings]);

  const handleReset = () => {
    setSettings({
      fontSize: 100,
      isGrayscale: false,
      isHighContrast: false,
      isNegativeContrast: false,
      isLightBackground: false,
      isLinksUnderlined: false,
      isReadableFont: false,
    });
  };

  return (
    <div className="fixed right-4 top-24 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle Accessibility Menu"
      >
        <Eye className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl text-gray-800">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Accessibility Tools</h2>
            <div className="space-y-4">
              <button
                onClick={() => setSettings(s => ({ ...s, fontSize: s.fontSize + 10 }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <ZoomIn className="w-5 h-5" />
                <span>Zoom +</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, fontSize: s.fontSize - 10 }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <ZoomOut className="w-5 h-5" />
                <span>Zoom -</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, isGrayscale: !s.isGrayscale }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <PaintBucket className="w-5 h-5" />
                <span>Grayscale</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, isHighContrast: !s.isHighContrast }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <Contrast className="w-5 h-5" />
                <span>High Contrast</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, isNegativeContrast: !s.isNegativeContrast }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <Moon className="w-5 h-5" />
                <span>Negative Contrast</span>
              </button>

            
              <button
                onClick={() => setSettings(s => ({ ...s, isLinksUnderlined: !s.isLinksUnderlined }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <Link className="w-5 h-5" />
                <span>Links Underline</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, isReadableFont: !s.isReadableFont }))}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <Type className="w-5 h-5" />
                <span>Readable Font</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};