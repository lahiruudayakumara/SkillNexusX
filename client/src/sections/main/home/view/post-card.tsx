import { MessageCircle, Share2, ThumbsUp, Shapes} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: number;
  text: string;
}

interface PostCardProps {
  username: string;
  avatar: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

const PostCard: React.FC<PostCardProps> = ({ username, avatar, content, mediaUrl, mediaType }) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

  const handleLike = () => setLikes(likes + 1);
  
  const handleCollaborate = () => {
    navigate('/mentor-collaboration');
  };

  return (
    <div className="mx-auto bg-white p-4 my-4">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <img src={avatar} alt={username} className="w-10 h-10 rounded-full" />
        <span className="font-semibold">{username}</span>
      </div>

      {/* Post Content */}
      <p className="mt-3 text-gray-800">{content}</p>

      {/* Media (Image/Video) */}
      {mediaUrl && mediaType === "image" && (
        <img src={mediaUrl} alt="Post" className="mt-3 w-full rounded-lg" />
      )}
      {mediaUrl && mediaType === "video" && (
        <video controls className="mt-3 w-full rounded-lg">
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Like, Comment, Share */}
      <div className="flex items-center justify-between mt-4 text-gray-600">
        <button className="flex items-center space-x-1 hover:text-blue-500" onClick={handleLike}>
          <ThumbsUp size={18} />
          <span>{likes} Likes</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-500">
          <MessageCircle size={18} />
          <span>{comments.length} Comments</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-500">
          <Share2 size={18} />
          <span>Share</span>
        </button>
        <button 
          className="flex items-center space-x-1 hover:text-blue-500" 
          onClick={handleCollaborate}
        >
          <Shapes size={18} />
          <span>Collaborate</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
