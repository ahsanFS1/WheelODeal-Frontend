import React from "react";
import TiptapEditor from "../shared/TiptapEditor";
import { TextInput } from "../shared/TextInput";
import { ColorPicker } from "../shared/ColorPicker";

interface Props {
  data: {
    title: string;
    caption: string;
    secondaryCta: {
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

export const DemoEditor: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateButton = (field: string, value: any) => {
    onChange({
      ...data,
      secondaryCta: { ...data.secondaryCta, [field]: value },
    });
  };

  return (
    <div className="space-y-6 p-6 bg-[#232329] rounded-lg shadow-lg border border-purple-900/20">
      {/* Title Editor */}
      <div>
        <label className="block text-md font-medium text-[#D3D3DF] mb-2">Title</label>
        <TiptapEditor
          content={data.title}
          onContentChange={(content) => updateField("title", content)}
        />
      </div>

      {/* Caption Editor */}
      <div>
        <label className="block text-md font-medium text-[#D3D3DF] mb-2">Caption</label>
        <TiptapEditor
          content={data.caption}
          onContentChange={(content) => updateField("caption", content)}
        />
      </div>

      {/* Secondary Call-to-Action Button */}
      <div className="border-t border-purple-900/20 pt-4 mt-4">
        <h4 className="text-md font-medium mb-3 text-[#D3D3DF]">Secondary Call-to-Action</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Button Text"
            value={data.secondaryCta.text}
            onChange={(value) => updateButton("text", value)}
          />
          <TextInput
            label="Button Link"
            value={data.secondaryCta.link}
            onChange={(value) => updateButton("link", value)}
          />
          <ColorPicker
            label="Button Color"
            value={data.secondaryCta.color}
            onChange={(value) => updateButton("color", value)}
          />
          <ColorPicker
            label="Text Color"
            value={data.secondaryCta.textColor}
            onChange={(value) => updateButton("textColor", value)}
          />

          {/* Glow Color */}
          <ColorPicker
            label="Glow Color"
            value={data.secondaryCta.glowColor}
            onChange={(value) => updateButton("glowColor", value)}
          />

          {/* Gradient Checkbox */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isGradient"
              checked={data.secondaryCta.isGradient}
              onChange={(e) => updateButton("isGradient", e.target.checked)}
              className="form-checkbox h-5 w-5 text-[#C33AFF] rounded"
            />
            <label htmlFor="isGradient" className="text-sm text-[#D3D3DF] font-medium">
              Enable Gradient
            </label>
          </div>

          {/* Gradient Options */}
          {data.secondaryCta.isGradient && (
            <>
              <ColorPicker
                label="Gradient Start Color"
                value={data.secondaryCta.gradientStart}
                onChange={(value) => updateButton("gradientStart", value)}
              />
              <ColorPicker
                label="Gradient End Color"
                value={data.secondaryCta.gradientEnd}
                onChange={(value) => updateButton("gradientEnd", value)}
              />
              <div>
                <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                  Gradient Direction
                </label>
                <select
                  value={data.secondaryCta.gradientDirection}
                  onChange={(e) => updateButton("gradientDirection", e.target.value)}
                  className="w-full p-2 bg-[#2A2A32] text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="to right">To Right</option>
                  <option value="to left">To Left</option>
                  <option value="to bottom">To Bottom</option>
                  <option value="to top">To Top</option>
                  <option value="to top right">To Top Right</option>
                  <option value="to top left">To Top Left</option>
                  <option value="to bottom right">To Bottom Right</option>
                  <option value="to bottom left">To Bottom Left</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
