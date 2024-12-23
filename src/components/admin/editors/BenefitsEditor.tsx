import React from 'react';
import { LandingPageConfig } from '../../../types';
import { Button } from '../../ui/button';
import { Plus, Trash } from 'lucide-react';
import  TiptapEditor  from '../shared/TiptapEditor'; // Ensure this path is correct
import { TextInput } from '../shared/TextInput';

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
      {/* Section Title with TiptapEditor */}
      <div>
        <h3 className="text-sm font-medium text-[#D3D3DF] mb-2">Section Title</h3>
        <TiptapEditor
          content={data.title}
          onContentChange={(content) => onChange({ ...data, title: content })}
        />
      </div>

      {/* Description with TiptapEditor */}
      <div>
        <h3 className="text-sm font-medium text-[#D3D3DF] mb-2">Description</h3>
        <TiptapEditor
          content={data.description}
          onContentChange={(content) => onChange({ ...data, description: content })}
        />
      </div>

      {/* Benefits List */}
      <div className="space-y-4">
        {data.items.map((benefit, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[#D3D3DF] mb-2">
                Benefit {index + 1}
              </h3>
              <TextInput
               label="Benefits"
               value={benefit}
               onChange={(value) => updateBenefit(index,value)}
              />
            </div>
            <button
              
              size="sm"
              onClick={() => removeBenefit(index)}
              className=" mt-12 items-center flex px-4 py-4 bg-red-700  text-black  text-sm rounded-lg hover:bg-red-700/60 hover:text-black transition-all duration-200"
            >
              <Trash className="w-4 h-4" />
            </button>
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
