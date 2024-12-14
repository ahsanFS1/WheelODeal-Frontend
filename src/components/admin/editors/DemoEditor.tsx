import React from "react";
import TiptapEditor from "../shared/TiptapEditor";
import { TextInput } from "../shared/TextInput";

interface Props {
  data: {
    title: string;
    caption: string;
    secondaryCta: {
      text: string;
      link: string;
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
    <div className="space-y-6">
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

      {/* Secondary Call-to-Action */}
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
      </div>
    </div>
  );
};
