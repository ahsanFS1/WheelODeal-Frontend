import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { ColorPicker } from '../shared/ColorPicker';
import TiptapEditor from '../shared/TiptapEditor';

interface Props {
  data: LandingPageConfig['finalCta'];
  onChange: (data: LandingPageConfig['finalCta']) => void;
}

export const FinalCtaEditor: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 p-6 bg-[#232329] rounded-lg shadow-lg border border-purple-900/20">
      <h3 className="text-lg font-semibold mb-4 text-[#D3D3DF]">Final CTA Section</h3>
      
      {/* Title Editor */}
      <div>
        <TiptapEditor
          content={data.title}
          onContentChange={(content) => onChange({ ...data, title: content })}
        />
      </div>

      {/* Button Text & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Button Text"
          value={data.buttonText}
          onChange={(value) => updateField('buttonText', value)}
        />
        <TextInput
          label="Button Link"
          value={data.buttonLink}
          onChange={(value) => updateField('buttonLink', value)}
        />
      </div>

      {/* Button Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorPicker
          label="Button Color"
          value={data.buttonColor}
          onChange={(value) => updateField('buttonColor', value)}
        />
        <ColorPicker
          label="Text Color"
          value={data.buttonTextColor}
          onChange={(value) => updateField('buttonTextColor', value)}
        />
      </div>

      {/* Glow Color */}
      <ColorPicker
        label="Glow Color"
        value={data.glowColor}
        onChange={(value) => updateField('glowColor', value)}
      />

      {/* Gradient Options */}
      <div className="border-t border-purple-900/20 pt-4 mt-4">
        <h4 className="text-md font-medium mb-3 text-[#D3D3DF]">Gradient Settings</h4>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isGradient"
            checked={data.isGradient}
            onChange={(e) => updateField('isGradient', e.target.checked)}
            className="form-checkbox h-5 w-5 text-[#C33AFF] rounded"
          />
          <label htmlFor="isGradient" className="text-sm text-[#D3D3DF] font-medium">
            Enable Gradient
          </label>
        </div>

        {data.isGradient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ColorPicker
              label="Gradient Start Color"
              value={data.gradientStart}
              onChange={(value) => updateField('gradientStart', value)}
            />
            <ColorPicker
              label="Gradient End Color"
              value={data.gradientEnd}
              onChange={(value) => updateField('gradientEnd', value)}
            />
            <div>
              <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                Gradient Direction
              </label>
              <select
                value={data.gradientDirection}
                onChange={(e) => updateField('gradientDirection', e.target.value)}
                className="w-full p-2 bg-[#2A2A32] text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="to right">To Right</option>
                <option value="to left">To Left</option>
                <option value="to bottom">To Bottom</option>
                <option value="to top">To Top</option>
                <option value="to top right">To Top Right</option>
                <option value="to top left">To Top Left</option>
                <option value="to bottom right">To Bottom Right</option>
                <option value="to bottom left">To Bottom Left</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Guarantee Text */}
      <TextInput
        label="Guarantee Text"
        value={data.guarantee}
        onChange={(value) => updateField('guarantee', value)}
      />
    </div>
  );
};
