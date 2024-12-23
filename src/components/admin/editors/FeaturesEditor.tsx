import React from 'react';
import { LandingPageConfig } from '../../../types';
import { Button } from '../../ui/button';
import { Plus, Trash } from 'lucide-react';
import  TiptapEditor  from '../shared/TiptapEditor';

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
          description: 'Feature description',
        },
      ],
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
      {/* Section Title with TiptapEditor */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#D3D3DF]">Section Title</h3>
        <TiptapEditor
          content={data.title} // Pass the section title content
          onContentChange={(content) => onChange({ ...data, title: content })} // Update the title in the parent state
        />
      </div>

      {/* Features List */}
      <div className="space-y-4">
        {data.items.map((feature, index) => (
          <div
            key={index}
            className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#D3D3DF]">
                Feature {index + 1}
              </h3>
              <button
                variant="destructive"
                size="sm"
                onClick={() => removeFeature(index)}
                className=" items-center  gap-2 px-4 py-4 bg-red-700  text-black  text-sm rounded-lg hover:bg-red-700/60 hover:text-black transition-all duration-200"
            
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#D3D3DF] mb-2">
                  Icon Name
                </label>
                <input
                  type="text"
                  value={feature.icon}
                  onChange={(e) =>
                    updateFeature(index, 'icon', e.target.value)
                  }
                  className="p-2 text-gray-400 bg-[#232329] border border-purple-900/20 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D3D3DF] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) =>
                    updateFeature(index, 'title', e.target.value)
                  }
                  className="p-2 text-gray-400 bg-[#232329] border border-purple-900/20 rounded w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#D3D3DF] mb-2">
                  Description
                </label>
                <textarea
                  value={feature.description}
                  onChange={(e) =>
                    updateFeature(index, 'description', e.target.value)
                  }
                  className="p-2 text-gray-400 bg-[#232329] border border-purple-900/20 rounded w-full"
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Feature Button */}
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
