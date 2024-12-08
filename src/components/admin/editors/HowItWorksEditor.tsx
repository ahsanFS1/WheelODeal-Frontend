import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';

interface Props {
  data: LandingPageConfig['howItWorks'];
  onChange: (data: LandingPageConfig['howItWorks']) => void;
}

export const HowItWorksEditor: React.FC<Props> = ({ data, onChange }) => {
  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange({ ...data, steps: newSteps });
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title}
        onChange={(value) => onChange({ ...data, title: value })}
      />

      <div className="space-y-8">
        {data.steps.map((step, index) => (
          <div key={index} className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-[#D3D3DF]">Step {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Title"
                value={step.title}
                onChange={(value) => updateStep(index, 'title', value)}
              />
              <TextInput
                label="Icon"
                value={step.icon}
                onChange={(value) => updateStep(index, 'icon', value)}
              />
              <TextInput
                label="Description"
                value={step.description}
                onChange={(value) => updateStep(index, 'description', value)}
                textArea
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};