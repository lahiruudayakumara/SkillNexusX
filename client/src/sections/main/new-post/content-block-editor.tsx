import React, { useState } from "react";
import { ContentBlock } from "@/types/post";
import RichTextToolbar from "./rich-text-toolbar";
import { Trash2 } from "lucide-react";
import { imageUpload, videoUpload } from "@/api/api-upload";
import ImageUpload from "./image-upload";
import VideoUpload from "./video-upload";

interface Props {
  block: ContentBlock;
  index: number;
  updateContentBlock: (
    index: number,
    field: keyof ContentBlock,
    value: string
  ) => void;
  removeContentBlock: (index: number) => void;
  execCommand: (command: string, value?: string) => void;
}

const ContentBlockEditor: React.FC<Props> = ({
  block,
  index,
  updateContentBlock,
  removeContentBlock,
  execCommand,
}) => {
  const [uploading, setUploading] = useState(false);

  // Helper function to upload file
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      let url = "";

      if (file.type.startsWith("image/")) {
        url = await imageUpload(formData);
      } else if (file.type.startsWith("video/")) {
        // Validate video duration
        const videoDuration = await getVideoDuration(file);
        if (videoDuration > 30) {
          alert("Video must be 30 seconds or less.");
          return;
        }

        url = await videoUpload(formData);
      }

      if (url) {
        updateContentBlock(index, "url", url);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Get duration of video file
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        resolve(video.duration);
      };

      video.onerror = () => {
        reject("Failed to load video.");
      };

      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="mb-6 relative group">
      <button
        type="button"
        onClick={() => removeContentBlock(index)}
        className="absolute right-5 top-0 bottom-0 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={18} />
      </button>

      {block.type === "SECTION" && (
        <input
          type="text"
          value={block.content}
          onChange={(e) => updateContentBlock(index, "content", e.target.value)}
          placeholder="Section Heading"
          className="w-full text-2xl font-semibold  pb-2 outline-none"
        />
      )}

      {block.type === "PARAGRAPH" && (
        <>
          <RichTextToolbar execCommand={execCommand} />
          <div
            className="border border-slate-300 p-3 rounded bg-white min-h-[100px] text-gray-800 prose max-w-none outline-none whitespace-pre-wrap text-left"
            dir="ltr"
            contentEditable
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.execCommand("insertText", false, "\n");
              }
            }}
            onInput={(e) => {
              const text = (e.target as HTMLDivElement).innerText;
              updateContentBlock(index, "content", text);
            }}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={
              !block.content ? { __html: "" } : undefined
            } // 👈 only first time
          />
        </>
      )}

      {block.type === "CODE" && (
        <textarea
          value={block.content}
          onChange={(e) => updateContentBlock(index, "content", e.target.value)}
          placeholder="Enter code..."
          className="w-full font-mono border border-slate-300 outline-0 text-sm bg-gray-white p-3 rounded resize-y min-h-[100px]"
        />
      )}

      {block.type === "IMAGE" && (
        <div className="flex flex-col gap-2">
          <ImageUpload
            setSelectedImage={(file) => {
              if (file instanceof File) handleFileUpload(file);
            }}
          />
          {uploading && <LoadingBar />}
        </div>
      )}

      {block.type === "VIDEO" && (
        <div className="flex flex-col gap-2">
          <VideoUpload
            setSelectedVideo={(file) => {
              if (file instanceof File) handleFileUpload(file);
            }}
          />
          {uploading && <LoadingBar />}
          {/* {block.url && (
            <video
              src={block.url}
              controls
              className="rounded max-w-full max-h-[300px] object-contain border mt-2"
            />
          )} */}
        </div>
      )}
    </div>
  );
};

const LoadingBar = () => (
  <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary animate-[loading_1.5s_linear_infinite]" />
    <style>{`
      @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

export default ContentBlockEditor;
