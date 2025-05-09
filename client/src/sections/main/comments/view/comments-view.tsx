import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getPostById } from "@/api/api-post";
import {
  getAllLearningPlans,
  updateLearningPlan,
  createLearningPlan,
} from "@/api/learning-plan-api";
import {
  ListPlus,
  MessageCircle,
  Shapes,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { LearningPlan } from "../../../../types/learning-type";
import CommentSection from "@/components/comment-section";
import SharePopupBox from "@/components/share-popup-box";

const CommentsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllLearningPlans();
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };

    fetchPlans();

    const successMessage = new URLSearchParams(location.search).get("success");
    if (successMessage) {
      setSuccess(successMessage);
      setTimeout(() => {
        setSuccess(null);
        navigate(location.pathname, { replace: true });
      }, 3000);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (showPlanSelector) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPlanSelector]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) {
          const data = await getPostById(id);
          setPost(data);
        } else {
          setError("Invalid post ID");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddToList = (post: any) => {
    setSelectedPost(post);
    setShowPlanSelector(true);
  };

  const addPostToExistingPlan = async () => {
    if (!selectedPlanId || !selectedPost) {
      setError("Please select a list");
      return;
    }

    try {
      const selectedPlan = plans.find((p) => p.id === selectedPlanId);
      if (!selectedPlan) {
        setError("Selected list not found");
        return;
      }

      const postResource = {
        path: `/posts/${selectedPost.id || Date.now()}`,
        title: selectedPost.title,
        type: "post",
      };

      const updatedPlan = {
        ...selectedPlan,
        resources: [
          ...(selectedPlan.resources || []).map((res: any) =>
            typeof res === "string" ? res : res.path
          ),
          postResource.path,
        ],
      };

      await updateLearningPlan(selectedPlanId, updatedPlan);
      setSuccess(`Post added to "${selectedPlan.title}"!`);
      setTimeout(() => setSuccess(null), 3000);
      setShowPlanSelector(false);
    } catch (err) {
      console.error("Failed to add post to list:", err);
      setError("Failed to update plan");
    }
  };

  const createNewPlanWithPost = () => {
    if (!selectedPost) return;

    sessionStorage.setItem(
      "pendingPostToAdd",
      JSON.stringify({
        id: selectedPost.id || Date.now(),
        title: selectedPost.title,
        type: "post",
      })
    );

    setShowPlanSelector(false);
    navigate("/plans/create");
  };

  const handleCollaborate = () => {
    if (!post) {
      setError("No post selected for collaboration.");
      return;
    }

    sessionStorage.setItem(
      "collaborationPost",
      JSON.stringify({
        id: post.id,
        title: post.title,
        type: "post",
      })
    );

    navigate(`/collaborate/${post.id}`);
  };

  const renderContentBlock = (block: {
    type: string;
    content?: string;
    url?: string;
  }) => {
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

  return (
    <div className="w-full p-4 md:px-8 py-8 max-w-[1200px] mx-auto">
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}
      {loading && <p>Loading post...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && post && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Post */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            {post.contentBlocks
              ?.sort((a: any, b: any) => a.position - b.position)
              .map((block: any) => (
                <div key={block.position}>{renderContentBlock(block)}</div>
              ))}
            <div className="flex flex-wrap gap-4 items-center justify-between mt-6">
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 text-primary cursor-pointer">
                  <ThumbsUp size={18} /> Like
                </button>
                <button className="flex items-center gap-2 text-primary cursor-pointer">
                  <MessageCircle size={18} /> Comment
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 text-primary cursor-pointer"
                >
                  <Share2 size={18} /> Share
                </button>
                <button
                  onClick={() => handleAddToList(post)}
                  className="flex items-center gap-2 text-primary cursor-pointer"
                >
                  <ListPlus size={18} /> Add to List
                </button>
                <button
                  onClick={handleCollaborate}
                  className="flex items-center gap-2 text-primary cursor-pointer"
                >
                  <Shapes size={18} /> Collaborate
                </button>
              </div>
              <div className="text-sm text-gray-400">
                Published on: {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            <SharePopupBox
              open={open}
              setOpen={() => setOpen(false)}
              postUrl={`http://localhost:5173/posts/${id}`}
              postTitle={post.title}
            />
          </div>

          {/* Right Column: Comments */}
          <div className="w-full">
            <CommentSection postId={post.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsView;
