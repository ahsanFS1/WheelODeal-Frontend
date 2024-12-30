import React from 'react';
import { TextInput } from '../shared/TextInput';
import { ColorPicker } from '../shared/ColorPicker';
import { ImageUpload } from '../shared/ImageUpload';

interface Props {
  data: {
    title: string;
    images: {
      url: string;
      alt: string;
    }[];
    ctaButton: {
      text: string;
      link: string;
      color: string;
      textColor: string;
      glowColor: string;
      isGradient: boolean;
      gradientStart: string;
      gradientEnd: string;
      gradientDirection: string;
    };
  };
  onChange: (data: any) => void;
}

export const CarouselEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleButtonChange = (field: string, value: any) => {
    onChange({
      ...data,
      ctaButton: { ...data.ctaButton, [field]: value },
    });
  };

  const handleImageUpload = (url: string, alt: string) => {
    onChange({
      ...data,
      images: [...(data.images || []), { url, alt }],
    });
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    handleFieldChange('images', newImages);
  };

  return (
    <div className="space-y-6 p-6 bg-[#232329] rounded-lg shadow-lg border border-purple-900/20">
      <h3 className="text-lg font-semibold mb-4 text-[#D3D3DF]">Carousel Settings</h3>

      <div className="space-y-4">
        <TextInput
          label="Section Title"
          value={data.title || ''}
          onChange={(value) => handleFieldChange('title', value)}
        />

        <div>
          <label className="block text-sm font-medium text-[#D3D3DF] mb-2">Carousel Images</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {data.images?.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt={image.alt} className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <ImageUpload
            label="Add Image"
            type="carousel"
            onUpload={handleImageUpload}
          />
        </div>

        <div className="border-t border-purple-900/20 pt-4 mt-4">
          <h4 className="text-md font-medium mb-3 text-[#D3D3DF]">Call-to-Action Button</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Button Text"
              value={data.ctaButton?.text || ''}
              onChange={(value) => handleButtonChange('text', value)}
            />
            <TextInput
              label="Button Link"
              value={data.ctaButton?.link || ''}
              onChange={(value) => handleButtonChange('link', value)}
            />
            <ColorPicker
              label="Button Color"
              value={data.ctaButton?.color || '#C33AFF'}
              onChange={(value) => handleButtonChange('color', value)}
            />
            <ColorPicker
              label="Text Color"
              value={data.ctaButton?.textColor || '#FFFFFF'}
              onChange={(value) => handleButtonChange('textColor', value)}
            />
            <ColorPicker
              label="Glow Color"
              value={data.ctaButton?.glowColor || '#C33AFF'}
              onChange={(value) => handleButtonChange('glowColor', value)}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isGradient"
                checked={data.ctaButton?.isGradient || false}
                onChange={(e) => handleButtonChange('isGradient', e.target.checked)}
                className="form-checkbox h-5 w-5 text-[#C33AFF] rounded"
              />
              <label htmlFor="isGradient" className="text-sm text-[#D3D3DF] font-medium">
                Enable Gradient
              </label>
            </div>

            {data.ctaButton?.isGradient && (
              <>
                <ColorPicker
                  label="Gradient Start"
                  value={data.ctaButton?.gradientStart || '#C33AFF'}
                  onChange={(value) => handleButtonChange('gradientStart', value)}
                />
                <ColorPicker
                  label="Gradient End"
                  value={data.ctaButton?.gradientEnd || '#7B1FA2'}
                  onChange={(value) => handleButtonChange('gradientEnd', value)}
                />
                <div>
                  <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                    Gradient Direction
                  </label>
                  <select
                    value={data.ctaButton?.gradientDirection || 'to right'}
                    onChange={(e) => handleButtonChange('gradientDirection', e.target.value)}
                    className="w-full p-2 bg-[#2A2A32] text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="to right">To Right</option>
                    <option value="to left">To Left</option>
                    <option value="to bottom">To Bottom</option>
                    <option value="to top">To Top</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};