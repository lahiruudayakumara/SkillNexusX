import React, { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  ListPlus,
  Shapes,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SharePopupBox from "@/components/share-popup-box";

type ContentBlock = {
  id: number;
  type: string;
  content: string | null;
  url: string | null;
  videoDuration: string | null;
  position: number;
};

type Post = {
  id: number;
  userId: number;
  title: string;
  contentBlocks: ContentBlock[];
  createdAt: string;
  isPublished: boolean;
};

interface PostBoxProps {
  post: Post;
  onAddToList?: (post: Post) => void;
}

const PostBox: React.FC<PostBoxProps> = ({ post, onAddToList }) => {
  const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);

  const handleCollaborate = () => {
    navigate("/mentor-collaboration-post");
  };

  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "SECTION":
        return <h2 className="text-xl font-bold mb-2">{block.content}</h2>;
      case "PARAGRAPH":
        return <p className="text-gray-700 mb-2">{block.content}</p>;
      case "IMAGE":
        return (
          <img
            src={block.url || ""}
            alt="Post Image"
            className="w-full h-auto rounded-md mb-4"
          />
        );
      case "VIDEO":
        return (
          <video
            controls
            src={block.url || ""}
            className="w-full h-auto rounded-md mb-4"
          />
        );
      case "CODE":
        return (
          <pre className="bg-gray-200 text-black p-4 rounded overflow-x-auto mb-4 whitespace-pre-wrap">
            <code>{block.content}</code>
          </pre>
        );
      default:
        return null;
    }
  };

  const handleAddToList = () => {
    if (onAddToList) {
      onAddToList(post);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <Link to={`/post/${post.id}`}>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h1>

        {post.contentBlocks
          .sort((a, b) => a.position - b.position)
          .map((block) => (
            <div key={block.id}>{renderContentBlock(block)}</div>
          ))}

        <div className="text-right text-sm text-gray-400">
          Published on: {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
        <button className="flex items-center gap-2 text-primary cursor-pointer">
          <ThumbsUp size={18} /> Like
        </button>
        <button onClick={() => navigate(`/comments/${post.id}`)} className="flex items-center gap-2 text-primary cursor-pointer">
          <MessageCircle size={18} /> Comment
        </button>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-primary cursor-pointer">
          <Share2 size={18} /> Share
        </button>
        <SharePopupBox open={open} setOpen={() => setOpen(false)} postUrl={`http://localhost:5173/posts/${post.id}`} postTitle={post.title} />
        <button
          onClick={handleAddToList}
          className="flex items-center gap-2 text-primary cursor-pointer hover:text-blue-600"
        >
          <ListPlus size={18} /> Add to List
        </button>
        <button
          className="flex items-center gap-2 text-primary cursor-pointer hover:text-blue-600"
          onClick={handleCollaborate}
        >
          <Shapes size={18} />
          <span>Collaborate</span>
        </button>
      </div>
    </div>
  );
};

export default PostBox;
