import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';

interface Props {
  data: LandingPageConfig['demo'];
  onChange: (data: LandingPageConfig['demo']) => void;
}

export const DemoEditor: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateButton = (field: string, value: any) => {
    onChange({
      ...data,
      secondaryCta: { ...data.secondaryCta, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Title"
        value={data.title}
        onChange={(value) => updateField('title', value)}
      />

      <TextInput
        label="Caption"
        value={data.caption}
        onChange={(value) => updateField('caption', value)}
        textArea
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Button Text"
          value={data.secondaryCta.text}
          onChange={(value) => updateButton('text', value)}
        />

        <TextInput
          label="Button Link"
          value={data.secondaryCta.link}
          onChange={(value) => updateButton('link', value)}
        />
      </div>
    </div>
  );
};