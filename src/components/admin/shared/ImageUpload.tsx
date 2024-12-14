import React, { useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { api_Url } from '../../../config';

interface Props {
  label: string;
  type: string;
  currentImage?: string;
  onUpload: (url: string, alt: string) => void;
  recommendations?: {
    maxSize?: number;
    dimensions?: string;
    format?: string;
  };
}

export const ImageUpload: React.FC<Props> = ({ label, currentImage, onUpload, recommendations, type }) => {
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true); // Start loading
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(`${api_Url}/api/upload-image?type=${type}&maxSize=${recommendations?.maxSize}`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          onUpload(result.url, "Prize Image");
        } else {
          alert("Failed to upload image: " + result.message);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#D3D3DF]">
        {label}
      </label>

      <div className="border-2 border-dashed border-purple-900/20 rounded-lg p-4 bg-[#1B1B21]">
        <div className="flex flex-col items-center space-y-2">
          {isLoading ? (
            <div className="flex justify-center items-center w-full aspect-video">
              <Loader className="w-12 h-12 text-purple-900 animate-spin" />
            </div>
          ) : currentImage ? (
            <div className="relative w-full aspect-video">
              <img
                src={currentImage}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <Upload className="w-12 h-12 text-purple-900/50" />
          )}

          <div className="flex flex-col items-center space-y-1">
            <label className="cursor-pointer px-4 py-2 bg-purple-900/20 text-purple-100 rounded-md hover:bg-purple-900/30 transition-colors">
              Choose Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading} // Disable input while loading
              />
            </label>

            {recommendations && (
              <div className="text-xs text-[#D3D3DF]/70 text-center">
                {recommendations.maxSize && <p>Max size: {recommendations.maxSize}MB</p>}
                {recommendations.dimensions && <p>Recommended: {recommendations.dimensions}</p>}
                {recommendations.format && <p>Formats: {recommendations.format}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
