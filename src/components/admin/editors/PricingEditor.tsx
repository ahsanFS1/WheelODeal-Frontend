import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { Button } from '../../ui/button';
import { Plus, Trash } from 'lucide-react';
import { ColorPicker } from '../shared/ColorPicker';
import TiptapEditor from '../shared/TiptapEditor';
interface Props {
  data: LandingPageConfig['pricing'];
  onChange: (data: LandingPageConfig['pricing']) => void;
}

export const PricingEditor: React.FC<Props> = ({ data, onChange }) => {
  const updatePlan = (id: string, field: string, value: any) => {
    const newPlans = data.plans.map(plan =>
      plan.id === id ? { ...plan, [field]: value } : plan
    );
    onChange({ ...data, plans: newPlans });
  };

  const addFeature = (planId: string) => {
    const plan = data.plans.find(p => p.id === planId);
    if (plan) {
      updatePlan(planId, 'features', [...plan.features, 'New feature']);
    }
  };

  const updateFeature = (planId: string, index: number, value: string) => {
    const plan = data.plans.find(p => p.id === planId);
    if (plan) {
      const newFeatures = [...plan.features];
      newFeatures[index] = value;
      updatePlan(planId, 'features', newFeatures);
    }
  };

  const removeFeature = (planId: string, index: number) => {
    const plan = data.plans.find(p => p.id === planId);
    if (plan) {
      const newFeatures = plan.features.filter((_, i) => i !== index);
      updatePlan(planId, 'features', newFeatures);
    }
  };

  return (
    <div className="space-y-6">
       <TiptapEditor
          content={data.title}
          onContentChange={(content) => onChange({ ...data, title: content })}
        />

      <div className="space-y-8">
        {data.plans.map((plan) => (
          <div key={plan.id} className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-[#D3D3DF]">{plan.name} Plan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Name"
                value={plan.name}
                onChange={(value) => updatePlan(plan.id, 'name', value)}
              />
              <TextInput
                label="Price"
                value={plan.price}
                onChange={(value) => updatePlan(plan.id, 'price', value)}
              />
              <TextInput
                label="Button Text"
                value={plan.buttonText}
                onChange={(value) => updatePlan(plan.id, 'buttonText', value)}
              />
              <TextInput
                label="Button Link"
                value={plan.buttonLink}
                onChange={(value) => updatePlan(plan.id, 'buttonLink', value)}
              />
              <ColorPicker
                label="Button Color"
                value={plan.buttonColor}
                onChange={(value) => updatePlan(plan.id, 'buttonColor', value)}
              />
              <ColorPicker
                label="Button Text Color"
                value={plan.buttonTextColor}
                onChange={(value) => updatePlan(plan.id, 'buttonTextColor', value)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-[#D3D3DF]">Features</h4>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <TextInput
                    label={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(value) => updateFeature(plan.id, index, value)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFeature(plan.id, index)}
                    className="mt-8"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => addFeature(plan.id)}
                className="w-full flex items-center justify-center gap-2 bg-[#C33AFF]/20 text-[#C33AFF] hover:bg-[#C33AFF]/30"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};