import { ContentBlock, FormData } from "@/types/post";
import React, { ChangeEvent, FormEvent, useState } from "react";
import ContentBlockEditor from "../content-block-editor";
import { Code, Heading, ImageIcon, Text, Video } from "lucide-react";
import { createDraftPost, createPost } from "@/api/api-post";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

const CreatePost: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user_id);
  const [formData, setFormData] = useState<FormData>({
    userId: userId,
    title: "",
    isPublished: true,
  });

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const navigate = useNavigate();

  const blockIcons: Record<ContentBlock["type"], React.ReactNode> = {
    SECTION: <Heading size={18} />,
    PARAGRAPH: <Text size={18} />,
    IMAGE: <ImageIcon size={18} />,
    VIDEO: <Video size={18} />,
    CODE: <Code size={18} />,
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      type,
      content: "",
      url: "",
      position: contentBlocks.length,
    };

    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateContentBlock = (
    index: number,
    field: keyof ContentBlock,
    value: string
  ) => {
    const updated = [...contentBlocks];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setContentBlocks(updated);
  };

  const removeContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    const updated = contentBlocks
      .filter((_, i) => i !== index)
      .map((block, idx) => ({ ...block, position: idx }));
    setContentBlocks(updated);
  };

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    const payload = {
      ...formData,
      contentBlocks,
    };

    try {
      isDraft ? await createDraftPost(payload) : await createPost(payload);
      toast.success("Post created successfully!");
      navigate("/me");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <textarea
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full text-4xl font-serif font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none mb-6"
            placeholder="Title"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          {contentBlocks.map((block, index) => (
            <ContentBlockEditor
              key={index}
              block={block}
              index={index}
              updateContentBlock={updateContentBlock}
              removeContentBlock={removeContentBlock}
              execCommand={execCommand}
            />
          ))}

          <div className="flex gap-4 mt-6 mb-8">
            {["SECTION", "PARAGRAPH", "IMAGE", "VIDEO", "CODE"].map((type) => (
              <button
                key={type}
                disabled={
                  (type === "IMAGE" &&
                    contentBlocks.filter((b) => b.type === "IMAGE").length >=
                      3) ||
                  (type === "VIDEO" &&
                    contentBlocks.filter((b) => b.type === "VIDEO").length >= 1)
                }
                type="button"
                className="flex w-full justify-center cursor-pointer items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded"
                onClick={() => addContentBlock(type as ContentBlock["type"])}
              >
                {blockIcons[type as ContentBlock["type"]]}
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              onClick={() => setIsDraft(true)}
              className="w-[250px] cursor-pointer shadow hover:shadow-lg border border-slate-400 text-primary py-3 rounded font-medium hover:bg-slate-50"
            >
              Draft Save
            </button>
            <button
              type="submit"
              onClick={() => setIsDraft(false)}
              className="w-full bg-primary cursor-pointer text-white py-3 rounded font-medium hover:bg-secondary"
            >
              Publish
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
