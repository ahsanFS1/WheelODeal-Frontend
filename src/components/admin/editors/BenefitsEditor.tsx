import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { Button } from '../../ui/button';
import { Plus, Trash } from 'lucide-react';

interface Props {
  data: LandingPageConfig['benefits'];
  onChange: (data: LandingPageConfig['benefits']) => void;
}

export const BenefitsEditor: React.FC<Props> = ({ data, onChange }) => {
  const addBenefit = () => {
    onChange({
      ...data,
      items: [...data.items, 'New benefit']
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = value;
    onChange({ ...data, items: newItems });
  };

  const removeBenefit = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title}
        onChange={(value) => onChange({ ...data, title: value })}
      />

      <TextInput
        label="Description"
        value={data.description}
        onChange={(value) => onChange({ ...data, description: value })}
        textArea
      />

      <div className="space-y-4">
        {data.items.map((benefit, index) => (
          <div key={index} className="flex items-center gap-4">
            <TextInput
              label={`Benefit ${index + 1}`}
              value={benefit}
              onChange={(value) => updateBenefit(index, value)}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeBenefit(index)}
              className="mt-8"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          onClick={addBenefit}
          className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white hover:bg-purple-900/90"
        >
          <Plus className="w-4 h-4" />
          Add Benefit
        </Button>
      </div>
    </div>
  );
};