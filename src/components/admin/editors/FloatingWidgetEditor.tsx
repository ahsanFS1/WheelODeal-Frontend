import React from 'react';
import { TextInput } from '../shared/TextInput';
import { ColorPicker } from '../shared/ColorPicker';

interface Props {
  data: {
    text: string;
    link: string;
    gradientStart: string;
    gradientEnd: string;
    enabled: boolean;
    position: {
      side: 'left' | 'right';
      offset: number;
      topOffset: number;
    };
  };
  onChange: (data: any) => void;
}

export const FloatingWidgetEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handlePositionChange = (field: string, value: any) => {
    onChange({
      ...data,
      position: { ...data.position, [field]: value }
    });
  };

  return (
    <div className="space-y-6 p-6 bg-[#232329] rounded-lg shadow-lg border border-purple-900/20">
      <h3 className="text-lg font-semibold mb-4 text-[#D3D3DF]">Floating Widget Settings</h3>
      
      <div className="flex items-center space-x-4 mb-6">
        <label className="text-sm font-medium text-[#D3D3DF]">Enable Widget</label>
        <input
          type="checkbox"
          checked={data.enabled ?? true}
          onChange={(e) => handleFieldChange("enabled", e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Widget Text"
          value={data.text || ''}
          onChange={(value) => handleFieldChange("text", value)}
        />
        <TextInput
          label="Widget Link"
          value={data.link || ''}
          onChange={(value) => handleFieldChange("link", value)}
        />
        <ColorPicker
          label="Gradient Start Color"
          value={data.gradientStart || '#C33AFF'}
          onChange={(value) => handleFieldChange("gradientStart", value)}
        />
        <ColorPicker
          label="Gradient End Color"
          value={data.gradientEnd || '#7B1FA2'}
          onChange={(value) => handleFieldChange("gradientEnd", value)}
        />
        
        <div>
          <label className="block text-sm font-medium text-[#D3D3DF] mb-2">Position Side</label>
          <select
            value={data.position?.side || 'right'}
            onChange={(e) => handlePositionChange("side", e.target.value)}
            className="w-full p-2 bg-[#2A2A32] text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>

        <TextInput
          label="Top Offset (%)"
          type="number"
          value={data.position?.topOffset?.toString() || '50'}
          onChange={(value) => handlePositionChange("topOffset", parseInt(value))}
        />
        
        <TextInput
          label="Side Offset (px)"
          type="number"
          value={data.position?.offset?.toString() || '0'}
          onChange={(value) => handlePositionChange("offset", parseInt(value))}
        />
      </div>
    </div>
  );
};