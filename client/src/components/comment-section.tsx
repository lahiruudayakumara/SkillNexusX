import { fetchComments, createComment, createReply, deleteComment, deleteReply } from "@/stores/slices/comments/comments-action";
import { AppDispatch, RootState } from "@/stores/store";
import { ReplyAll, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  parentCommentId?: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  userId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error } = useSelector((state: RootState) => state.comments);
  const { user_id } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch,  postId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
  
    const newCommentPayload = {
      postId,
      userId: Number(user_id),
      content: newComment.trim(),
    };
  
    dispatch(createComment(newCommentPayload))
      .then((action) => {
        if (action.payload) {
          dispatch(fetchComments(postId));
        }
      });
  
    setNewComment("");
  };
  

  const handleReplyChange = (commentId: number, text: string) => {
    setReplyMap((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleAddReply = (parentId: number) => {
    const replyText = replyMap[parentId]?.trim();
    if (!replyText) return;
  
    const newReplyPayload = {
      postId,
      parentCommentId: parentId,
      userId: String(user_id),
      content: replyText,
    };
  
    dispatch(createReply(newReplyPayload))
      .then((action) => {
        if (action.payload) {
          dispatch(fetchComments(postId));
        }
      });
  
    setReplyMap((prev) => ({ ...prev, [parentId]: "" }));
  };

  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment(commentId)).then(() => {
      dispatch(fetchComments(postId));
    });
  };

  const handleDeleteReply = (replyId: number) => {
    dispatch(deleteReply(replyId)).then(() => {
      dispatch(fetchComments(postId));
    });
  };  

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
      <div className="text-sm font-medium">{comment.author || "Unknown"}</div>
      <div className="text-sm text-gray-700">{comment.content}</div>
      <div className="flex items-center text-gray-400 gap-2">
        <div className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </div>
        <button className="cursor-pointer flex gap-1 items-center">
          <ReplyAll size={16} /> Reply
        </button>
        <button onClick={() => handleDeleteComment(comment.id)} className="cursor-pointer">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-2">
        <textarea
          value={replyMap[comment.id] || ""}
          onChange={(e) => handleReplyChange(comment.id, e.target.value)}
          placeholder="Write a reply..."
          className="mt-2 w-full border outline-0 border-slate-300 rounded p-2 min-h-[60px]"
        />
        <button
          onClick={() => handleAddReply(comment.id)}
          className="mt-2 text-sm items-center flex gap-2 text-white bg-primary hover:bg-secondary px-3 py-1 rounded cursor-pointer"
        >
          <Send size={16} />
          Reply
        </button>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-4 space-y-2">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="border border-gray-200 bg-white rounded p-2"
            >
              <div className="text-sm font-medium">{reply.author}</div>
              <div className="text-sm text-gray-700">{reply.content}</div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="text-xs text-gray-400">
                  {new Date(reply.createdAt).toLocaleString()}
                </div>
                <button onClick={() => handleDeleteReply(reply.id)} className="cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {loading && <p className="text-sm text-gray-500">Loading comments...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
        )}
        {comments.map(renderComment)}
      </div>

      <div className="mt-4 flex flex-col">
        <textarea
          className="border border-slate-300 outline-0 rounded p-2 w-full min-h-[80px]"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 flex gap-2 self-end bg-primary cursor-pointer text-white px-4 py-2 rounded hover:bg-secondary"
        >
          <Send />
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
