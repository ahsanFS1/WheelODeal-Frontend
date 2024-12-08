import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { Button } from '../../ui/button';
import { Plus, Trash } from 'lucide-react';

interface Props {
  data: LandingPageConfig['features'];
  onChange: (data: LandingPageConfig['features']) => void;
}

export const FeaturesEditor: React.FC<Props> = ({ data, onChange }) => {
  const addFeature = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          icon: 'Star',
          title: 'New Feature',
          titleLevel: 'h3',
          titleFont: 'Montserrat',
          titleSize: 'xl',
          description: 'Feature description'
        }
      ]
    });
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const removeFeature = (index: number) => {
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

      <div className="space-y-4">
        {data.items.map((feature, index) => (
          <div key={index} className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#D3D3DF]">Feature {index + 1}</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Icon Name"
                value={feature.icon}
                onChange={(value) => updateFeature(index, 'icon', value)}
              />
              <TextInput
                label="Title"
                value={feature.title}
                onChange={(value) => updateFeature(index, 'title', value)}
              />
              <TextInput
                label="Description"
                value={feature.description}
                onChange={(value) => updateFeature(index, 'description', value)}
                textArea
              />
            </div>
          </div>
        ))}

        <Button
          onClick={addFeature}
          className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white hover:bg-purple-900/90"
        >
          <Plus className="w-4 h-4" />
          Add Feature
        </Button>
      </div>
    </div>
  );
};