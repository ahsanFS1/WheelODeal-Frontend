import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export const TextInput: React.FC<Props> = ({ label, value, onChange, multiline }) => {
  const inputClasses = "w-full px-3 py-2 bg-[#1B1B21] border-2 border-purple-900/20 rounded-md text-[#D3D3DF] focus:outline-none focus:ring-2 focus:ring-purple-900/50 focus:border-transparent placeholder-gray-500";
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#D3D3DF]">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} min-h-[100px] resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}
    </div>
  );
};