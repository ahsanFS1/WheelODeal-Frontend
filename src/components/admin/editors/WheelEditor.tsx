import React from 'react';
import { ColorPicker } from '../shared/ColorPicker';
import { TextInput } from '../shared/TextInput';
import { Button } from '../../ui/button';
import { Select, SelectItem } from '../../ui/select';

interface Prize {
  id: string;
  text: string;
  gradient: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: string;
  color: string;
  probability: number;
  redirectUrl: string;
  glowColor: string;
}

interface WheelEditorProps {
  prizes: Prize[];
  onChange: (updatedPrizes: Prize[]) => void;
}

const WheelEditor: React.FC<WheelEditorProps> = ({ prizes, onChange }) => {
  const handlePrizeChange = (index: number, field: keyof Prize, value: any) => {
    const updatedPrizes = [...prizes];
    updatedPrizes[index] = { ...updatedPrizes[index], [field]: value };
    onChange(updatedPrizes);
  };

  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: `prize-${Date.now()}`,
      text: '',
      gradient: false,
      gradientStart: '#6C63FF',
      gradientEnd: '#4B4AC9',
      gradientDirection: 'to right',
      color: '#ffffff',
      probability: 0,
      redirectUrl: '',
      glowColor: '#ffffff',
    };
    onChange([...prizes, newPrize]);
  };

  const handleRemovePrize = (index: number) => {
    const updatedPrizes = prizes.filter((_, i) => i !== index);
    onChange(updatedPrizes);
  };

  return (
    <div className="space-y-6">
      {prizes.map((prize, index) => (
        <div key={prize.id} className="bg-[#1B1B21] p-4 rounded-lg shadow-md space-y-4 relative">
          {/* Remove Prize Button */}
          <button
            onClick={() => handleRemovePrize(index)}
            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700"
          >
            ✕
          </button>

          {/* Prize Text */}
          <TextInput
            label="Prize Text"
            value={prize.text}
            onChange={(value) => handlePrizeChange(index, 'text', value)}
          />

          {/* Redirect URL */}
          <TextInput
            label="Redirect URL"
            value={prize.redirectUrl}
            onChange={(value) => handlePrizeChange(index, 'redirectUrl', value)}
          />

          {/* Probability */}
          <div>
          <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
            Probability (0-1)
          </label>
          <input
            type="number"
            value={prize.probability}
            step="0.01"
            min="0"
            max="1"
            onChange={(e) => {
              const inputValue = parseFloat(e.target.value);

              if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 1) {
                // Valid input, update prize probability
                handlePrizeChange(index, 'probability', inputValue);
                e.target.setCustomValidity(''); // Clear error message
              } else if (inputValue < 0 || inputValue > 1) {
                // Out of range, show graceful error message
                e.target.setCustomValidity('Probability must be between 0 and 1.');
                e.target.reportValidity(); // Show the message
              } else {
                // Clear invalid input (e.g., empty)
                handlePrizeChange(index, 'probability', 0);
                e.target.setCustomValidity('');
              }
            }}
            className="w-full px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
          />
        </div>


          {/* Glow Color */}
          <ColorPicker
            label="Glow Color"
            value={prize.glowColor}
            onChange={(value) => handlePrizeChange(index, 'glowColor', value)}
          />

          {/* Gradient Toggle */}
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-300">Enable Gradient:</label>
            <input
              type="checkbox"
              checked={prize.gradient}
              onChange={(e) => handlePrizeChange(index, 'gradient', e.target.checked)}
            />
          </div>

          {/* Gradient Options */}
          {prize.gradient && (
            <div className="space-y-4">
              <ColorPicker
                label="Gradient Start Color"
                value={prize.gradientStart}
                onChange={(value) => handlePrizeChange(index, 'gradientStart', value)}
              />
              <ColorPicker
                label="Gradient End Color"
                value={prize.gradientEnd}
                onChange={(value) => handlePrizeChange(index, 'gradientEnd', value)}
              />
            
            </div>
          )}

          {/* Fallback Color */}
          {!prize.gradient && (
            <ColorPicker
              label="Prize Color"
              value={prize.color}
              onChange={(value) => handlePrizeChange(index, 'color', value)}
            />
          )}
        </div>
      ))}

      {/* Add Prize Button */}
      <Button
        onClick={handleAddPrize}
        className="bg-purple-800 hover:bg-purple-950 text-white w-full"
      >
        Add New Prize
      </Button>
    </div>
  );
};

export default WheelEditor;
