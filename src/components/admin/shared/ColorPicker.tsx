import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<Props> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#D3D3DF]">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 p-1 bg-[#1B1B21] border border-purple-900/20 rounded-md cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#1B1B21] border border-purple-900/20 rounded-md text-[#D3D3DF] focus:outline-none focus:ring-2 focus:ring-purple-900/50 focus:border-transparent placeholder-gray-500"
        />
      </div>
    </div>
  );
};