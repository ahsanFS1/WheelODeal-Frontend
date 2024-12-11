import React from 'react';
import { TextInput } from '../shared/TextInput';

interface Props {
  videoId: string;
  onChange: (videoId: string) => void;
}

export const VideoEditor: React.FC<Props> = ({ videoId, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#D3D3DF]">Edit Video</h3>

      {/* Explanation Section */}
      <div className="bg-[#1B1B21] p-4 rounded-lg shadow-md">
        <h4 className="text-md font-semibold text-[#C33AFF]">What is a YouTube Video ID?</h4>
        <p className="text-[#D3D3DF] text-sm mt-2">
          A YouTube Video ID is a unique string of characters used to identify videos on YouTube. It can be found in the video URL as shown below:
        </p>
        <div className="bg-[#121218] p-3 rounded-lg mt-4 text-[#D3D3DF]">
          Example URL: <code>https://www.youtube.com/watch?v=<strong>VIDEO_ID</strong></code>
        </div>
        <img
          src="https://via.placeholder.com/600x300?text=Example+of+a+YouTube+Video+ID"
          alt="YouTube Video ID Example"
          className="mt-4 rounded-lg shadow-lg"
        />
      </div>

      {/* Video ID Input */}
      <TextInput
        label="YouTube Video ID"
        value={videoId}
        onChange={onChange}
      />
    </div>
  );
};
