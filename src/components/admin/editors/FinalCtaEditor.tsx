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
    <div className="space-y-6">
     <TiptapEditor
          content={data.title}
          onContentChange={(content) => onChange({ ...data, title: content })}
        />

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

      <ColorPicker
        label="Button Color"
        value={data.buttonColor}
        onChange={(value) => updateField('buttonColor', value)}
      />

      <ColorPicker
        label="Button Text Color"
        value={data.buttonTextColor}
        onChange={(value) => updateField('buttonTextColor', value)}
      />

      <TextInput
        label="Guarantee Text"
        value={data.guarantee}
        onChange={(value) => updateField('guarantee', value)}
      />
    </div>
  );
};