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

const PostDetailsView = () => {
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
    <div className="flex flex-col items-center justify-center p-4 w-full md:w-2/3 mx-auto space-y-8 py-8 divide-y-[1px] divide-slate-200">
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}

      {loading && <p>Loading post...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && post && (
        <div className="bg-white w-full space-y-4">
          <h1 className="text-4xl font-semibold text-gray-900">{post.title}</h1>

          {post.contentBlocks
            ?.sort((a: any, b: any) => a.position - b.position)
            .map((block: any) => (
              <div key={block.position}>{renderContentBlock(block)}</div>
            ))}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 ">
              <button className="flex items-center gap-2 text-primary cursor-pointer">
                <ThumbsUp size={18} /> Like
              </button>
              <button className="flex items-center gap-2 text-primary cursor-pointer">
                <MessageCircle size={18} /> Comment
              </button>
              <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-primary cursor-pointer">
                <Share2 size={18} /> Share
              </button>
              <SharePopupBox open={open} setOpen={() => setOpen(false)} postUrl={`http://localhost:5173/posts/${id}`} postTitle={post.title} />
              <button
                onClick={() => handleAddToList(post)}
                className="flex items-center gap-2 text-primary cursor-pointer hover:text-blue-600"
              >
                <ListPlus size={18} /> Add to List
              </button>
              <button
                onClick={handleCollaborate}
                className="flex items-center gap-2 text-primary cursor-pointer hover:text-blue-600"
              >
                <Shapes size={18} /> Collaborate
              </button>
            </div>
            <div className="text-right text-sm text-gray-400">
              Published on: {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          {!loading && post && (
            <>
              {/* ...post rendering */}
              <CommentSection postId={post.id} />
            </>
          )}
        </div>
      )}

      {/* Plan Selector Modal Placeholder */}
      {showPlanSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add to Learning Plan</h2>
            <select
              value={selectedPlanId || ""}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.title}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={createNewPlanWithPost}
                className="text-blue-600 hover:underline"
              >
                Create New Plan
              </button>
              <button
                onClick={addPostToExistingPlan}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Plan
              </button>
              <button
                onClick={() => setShowPlanSelector(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailsView;
