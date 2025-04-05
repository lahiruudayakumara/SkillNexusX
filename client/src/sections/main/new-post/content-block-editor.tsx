import { ContentBlock } from "@/types/post";
import React from "react";
import RichTextToolbar from "./rich-text-toolbar";
import { Trash2 } from "lucide-react";

interface Props {
  block: ContentBlock;
  index: number;
  updateContentBlock: (index: number, field: keyof ContentBlock, value: string) => void;
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
  return (
    <div className="mb-6 relative group">
      <button
        type="button"
        onClick={() => removeContentBlock(index)}
        className="absolute right-0 top-0 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={18} />
      </button>

      {block.type === "SECTION" && (
        <input
          type="text"
          value={block.content}
          onChange={(e) => updateContentBlock(index, "content", e.target.value)}
          placeholder="Section Heading"
          className="w-full text-2xl font-semibold border-b pb-2 outline-none"
        />
      )}

      {block.type === "PARAGRAPH" && (
        <>
          <RichTextToolbar execCommand={execCommand} />
          <div
            className="border p-3 rounded bg-white min-h-[100px] text-gray-800 prose max-w-none"
            contentEditable
            dangerouslySetInnerHTML={{ __html: block.content }}
            onInput={(e) =>
              updateContentBlock(index, "content", e.currentTarget.innerHTML)
            }
            suppressContentEditableWarning
          />
        </>
      )}

      {block.type === "CODE" && (
        <textarea
          value={block.content}
          onChange={(e) => updateContentBlock(index, "content", e.target.value)}
          placeholder="Enter code..."
          className="w-full font-mono text-sm bg-gray-100 p-3 rounded resize-y min-h-[100px]"
        />
      )}

      {block.type === "IMAGE" && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={block.url}
            onChange={(e) => updateContentBlock(index, "url", e.target.value)}
            placeholder="Image URL"
            className="border rounded p-2"
          />
          {block.url && (
            <img
              src={block.url}
              alt="Preview"
              className="rounded max-w-full max-h-[300px] object-contain border"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ContentBlockEditor;
