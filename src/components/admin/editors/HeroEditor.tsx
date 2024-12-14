import React, { useEffect, useState } from "react";
import TiptapEditor from "../shared/TiptapEditor";
import { ColorPicker } from "../shared/ColorPicker";
import { ImageUpload } from "../shared/ImageUpload";
import { TextInput } from "../shared/TextInput";

interface Props {
  data: {
    headline: string;
    subheadline: string;
    ctaButton: { text: string; link: string; color: string; textColor: string };
    logo: string;
    backgroundImage: string;
  };
  onChange: (data: any) => void;
}

export const HeroEditor: React.FC<Props> = ({ data, onChange }) => {
  const [headlineContent, setHeadlineContent] = useState(data.headline);
  const [subheadlineContent, setSubheadlineContent] = useState(data.subheadline);

  useEffect(() => {
    // Update the content if `data.headline` or `data.subheadline` changes
    setHeadlineContent(data.headline);
    setSubheadlineContent(data.subheadline);
  }, [data.headline, data.subheadline]);

  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleButtonChange = (field: string, value: any) => {
    onChange({ ...data, ctaButton: { ...data.ctaButton, [field]: value } });
  };

  return (
    <div className="space-y-6 p-6 bg-[#232329] rounded-lg shadow-lg border border-purple-900/20">
      <h3 className="text-lg font-semibold mb-4 text-[#D3D3DF]">Hero Section Settings</h3>

      {/* Headline Editor */}
      <div>
        <label className="block text-md font-medium text-[#D3D3DF] mb-2">Headline</label>
        <TiptapEditor
          content={headlineContent} // Pass updated content
          onContentChange={(content) => handleFieldChange("headline", content)}
          simulateTransparent={true} // Enable white simulation for transparent text
          applyGradient={true}
        />
      </div>

      {/* Subheadline Editor */}
      <div>
        <label className="block text-md font-medium text-[#D3D3DF] mb-2">Subheadline</label>
        <TiptapEditor
          content={subheadlineContent} // Pass updated content
          onContentChange={(content) => handleFieldChange("subheadline", content)}
          simulateTransparent={true} // Enable white simulation for transparent text
        />
      </div>

      {/* Call-to-Action Button Settings */}
      <div className="border-t border-purple-900/20 pt-4 mt-4">
        <h4 className="text-md font-medium mb-3 text-[#D3D3DF]">Call-to-Action Button</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Button Text"
            value={data.ctaButton.text}
            onChange={(value) => handleButtonChange("text", value)}
          />
          <TextInput
            label="Button Link"
            value={data.ctaButton.link}
            onChange={(value) => handleButtonChange("link", value)}
          />
          <ColorPicker
            label="Button Color"
            value={data.ctaButton.color}
            onChange={(value) => handleButtonChange("color", value)}
          />
          <ColorPicker
            label="Text Color"
            value={data.ctaButton.textColor}
            onChange={(value) => handleButtonChange("textColor", value)}
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="border-t border-purple-900/20 pt-4 mt-4">
        <ImageUpload
          label="Logo"
          type="mlp"
          currentImage={data.logo}
          onUpload={(url) => handleFieldChange("logo", url)}
        />
        <ImageUpload
          label="Background Image"
          type="mlp"
          currentImage={data.backgroundImage}
          onUpload={(url) => handleFieldChange("backgroundImage", url)}
        />
      </div>
    </div>
  );
};
