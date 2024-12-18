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

      {/* Text Inputs for Plan Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Monthly Plan Text"
          value={data.plans[0]?.monthlyplanText || ''}
          onChange={(value) => {
            const updatedPlan = { ...data.plans[0], monthlyplanText: value };
            const newPlans = [...data.plans];
            newPlans[0] = updatedPlan;
            onChange({ ...data, plans: newPlans });
          }}
        />
        <TextInput
          label="Yearly Plan Text"
          value={data.plans[0]?.yearlyPlanText || ''}
          onChange={(value) => {
            const updatedPlan = { ...data.plans[0], yearlyPlanText: value };
            const newPlans = [...data.plans];
            newPlans[0] = updatedPlan;
            onChange({ ...data, plans: newPlans });
          }}
        />
        <TextInput
          label="Yearly Promo Message"
          value={data.plans[0]?.planText || ''}
          onChange={(value) => {
            const updatedPlan = { ...data.plans[0], planText: value };
            const newPlans = [...data.plans];
            newPlans[0] = updatedPlan;
            onChange({ ...data, plans: newPlans });
          }}
        />
      </div>

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
                label="Monthly Price"
                value={plan.monthlyPrice}
                onChange={(value) => updatePlan(plan.id, 'monthlyPrice', value)}
              />
              <TextInput
                label="Yearly Price"
                value={plan.yearlyPrice}
                onChange={(value) => updatePlan(plan.id, 'yearlyPrice', value)}
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
              <ColorPicker
                label="Glow Color"
                value={plan.glowColor}
                onChange={(value) => updatePlan(plan.id, 'glowColor', value)}
              />
              <div className="col-span-2">
                <label className="block text-md font-medium text-[#D3D3DF] mb-2">Enable Gradient</label>
                <input
                  type="checkbox"
                  checked={plan.isGradient}
                  onChange={(e) => updatePlan(plan.id, 'isGradient', e.target.checked)}
                />
              </div>
              {plan.isGradient && (
                <>
                  <ColorPicker
                    label="Gradient Start Color"
                    value={plan.gradientStart}
                    onChange={(value) => updatePlan(plan.id, 'gradientStart', value)}
                  />
                  <ColorPicker
                    label="Gradient End Color"
                    value={plan.gradientEnd}
                    onChange={(value) => updatePlan(plan.id, 'gradientEnd', value)}
                  />
                  <div>
                    <label className="block text-md font-medium text-[#D3D3DF] mb-2">Gradient Direction</label>
                    <select
                      className="bg-[#232329] text-white p-2 rounded-lg w-full"
                      value={plan.gradientDirection || 'to right'}
                      onChange={(e) => updatePlan(plan.id, 'gradientDirection', e.target.value)}
                    >
                      <option value="to right">To Right</option>
                      <option value="to left">To Left</option>
                      <option value="to top">To Top</option>
                      <option value="to bottom">To Bottom</option>
                    </select>
                  </div>
                </>
              )}
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
