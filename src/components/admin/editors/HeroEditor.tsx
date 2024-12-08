import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { ColorPicker } from '../shared/ColorPicker';
import { ImageUpload } from '../shared/ImageUpload';

interface Props {
  data: LandingPageConfig['hero'];
  onChange: (data: LandingPageConfig['hero']) => void;
}

export const HeroEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedData = {
      ...data,
      [field]: value
    };
    onChange(updatedData);
  };

  const handleButtonChange = (field: string, value: any) => {
    const updatedData = {
      ...data,
      ctaButton: {
        ...data.ctaButton,
        [field]: value
      }
    };
    onChange(updatedData);
  };

  return (
    <div className="space-y-6 p-6 bg-[#232329] rounded-lg shadow-lg border border-purple-900/20">
      <h3 className="text-lg font-semibold mb-4 text-[#D3D3DF]">Hero Section Settings</h3>
      
      <div className="space-y-4">
        <TextInput
          label="Headline"
          value={data.headline}
          onChange={(value) => handleChange('headline', value)}
          multiline
        />

        <TextInput
          label="Subheadline"
          value={data.subheadline}
          onChange={(value) => handleChange('subheadline', value)}
          multiline
        />

        <div className="border-t border-purple-900/20 pt-4 mt-4">
          <h4 className="text-md font-medium mb-3 text-[#D3D3DF]">Call-to-Action Button</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Button Text"
              value={data.ctaButton.text}
              onChange={(value) => handleButtonChange('text', value)}
            />

            <TextInput
              label="Button Link"
              value={data.ctaButton.link}
              onChange={(value) => handleButtonChange('link', value)}
            />

            <ColorPicker
              label="Button Color"
              value={data.ctaButton.color}
              onChange={(value) => handleButtonChange('color', value)}
            />

            <ColorPicker
              label="Text Color"
              value={data.ctaButton.textColor}
              onChange={(value) => handleButtonChange('textColor', value)}
            />
          </div>
        </div>

        <div className="border-t border-purple-900/20 pt-4 mt-4">
          <ImageUpload
            label="Background Image"
            currentImage={data.backgroundImage}
            onUpload={(url) => handleChange('backgroundImage', url)}
            recommendations={{
              maxSize: "2MB",
              dimensions: "1920x1080px",
              format: "JPG, PNG"
            }}
            
          />
          
        </div>
      </div>
    </div>
  );
};