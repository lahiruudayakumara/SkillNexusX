import { memo, FC, useState, useRef, useEffect } from "react";
import { EyeIcon, ListPlus } from "lucide-react";
import { BookmarkIcon, DotsVerticalIcon, IconButton } from "./icon";
import ReactMarkdown from "react-markdown";
import { deletePost } from "@/api/api-post";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

type ContentBlock = {
  id: number;
  type: string;
  content: string | null;
  url: string | null;
  videoDuration: string | null;
  position: number;
};

interface Post {
  id: number;
  userId: number;
  title: string;
  contentBlocks: ContentBlock[];
  createdAt: string;
  isPublished: boolean;
  onDelete: (id: number) => void;
}

const PostCard: FC<Post> = memo(
  ({ id, userId, title, contentBlocks, createdAt, isPublished, onDelete }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const imageBlock = contentBlocks.find(
      (block) => block.type === "IMAGE" && block.url
    );
    const paragraphBlock = contentBlocks.find(
      (block) => block.type === "PARAGRAPH" && block.content
    );

    const description = paragraphBlock?.content
      ? paragraphBlock.content.split("\n").slice(0, 3).join("\n")
      : "";

    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

    const handleEdit = () => {
      console.log("Edit post:", id);
    };

    const handleDelete = () => {
      deletePost(id.toString())
        .then(() => {
          toast.success("Post deleted successfully!");
          onDelete(id);
        })
        .catch((error) => {
          toast.error("Failed to delete post. Please try again later.");
        });
      setIsDropdownOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDropdownOpen]);


    return (
      <article className="mb-12 flex gap-4 relative">
        <div className="flex-grow">
          <Link to={`/post/${id}`}>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
          </Link>
          <p className="text-gray-700 mb-2">
            {new Date(createdAt).toLocaleDateString()}
          </p>
          {description && (
            <div
              className="text-gray-600 mb-4 line-clamp-3"
              style={{ whiteSpace: "pre-line" }}
            >
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>
          )}
          <div className="flex items-center text-gray-500 text-sm">
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <span className="mx-2">·</span>
            <span className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              Views
            </span>
            <div className="ml-auto flex gap-2 relative" ref={dropdownRef}>
              <IconButton aria-label="Bookmark">
                <ListPlus className="h-5 w-5" />
              </IconButton>
              <IconButton aria-label="More options" onClick={toggleDropdown}>
                <DotsVerticalIcon className="h-5 w-5 cursor-pointer" />
              </IconButton>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 w-32 z-10">
                  {/* <button
                    onClick={handleEdit}
                    className="block w-full cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={handleDelete}
                    className="block w-full cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {imageBlock && imageBlock.url && (
          <img
            src={imageBlock.url}
            alt={`${title} thumbnail`}
            className="w-24 h-24 object-cover rounded flex-shrink-0"
          />
        )}
      </article>
    );
  }
);

export default PostCard;
