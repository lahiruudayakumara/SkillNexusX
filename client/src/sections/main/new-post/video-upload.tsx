import { useRef, useState } from "react";

interface VideoUploadProps {
  setSelectedVideo: (file: File | null) => void;
}

const VideoUpload = ({ setSelectedVideo }: VideoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > 30) {
        alert("Video must be 30 seconds or less.");
        return;
      }
      setSelectedVideo(file);
      setPreviewUrl(URL.createObjectURL(file));
    };
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("video/")) handleFile(file);
        }}
        className={`w-full min-h-[250px] lg:min-h-[350px] border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Drag & drop or click to upload a video (max 30s)
          </p>
        )}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          ref={fileInputRef}
          className="hidden"
        />
      </button>
    </div>
  );
};

export default VideoUpload;
