import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPublishedPosts } from "@/api/api-post";
import {
  getAllLearningPlans,
  updateLearningPlan,
  createLearningPlan,
} from "@/api/learning-plan-api";
import { ListPlus, X } from "lucide-react";
import { LearningPlan } from "../../../../types/learning-type";
import PostBox from "./post-card";

// Header Component
const Header = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">SkillNexus</h1>
            <p className="text-sm">Connect. Learn. Grow.</p>
          </div>

          <div className="w-full md:w-96">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search posts by title..."
                className="block w-full pl-10 pr-3 py-2 border border-blue-400 bg-blue-500 rounded-md shadow-sm placeholder-blue-200 focus:outline-none focus:ring-white focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

      // Store both the post path and title
      const postResource = {
        path: `/posts/${selectedPost.id || Date.now()}`,
        title: selectedPost.title,
        type: 'post'
      };

      const updatedPlan = {
        ...selectedPlan,
        resources: [
          ...(selectedPlan.resources || []).map((res: { path: string } | string) =>
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

    // Store the selected post details in session storage to use it on the create plan page
    sessionStorage.setItem('pendingPostToAdd', JSON.stringify({
      id: selectedPost.id || Date.now(),
      title: selectedPost.title,
      type: 'post'
    }));

    // Close the modal
    setShowPlanSelector(false);

    // Redirect to the plan creation page
    navigate('/plans/create');
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPublishedPosts();
        setPosts(data);
      } catch (e) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (posts.length === 0) fetchPosts();
  }, []);

  return (
    <div className="flex flex-col relative">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-full md:w-2/3 space-y-8 py-8 divide-y-[1px] divide-slate-200">
          {success && (
            <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
              {success}
            </div>
          )}

          {loading && <p>Loading posts...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {posts
            .filter((post) =>
              post.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((post) => (
              <div key={post.id} className="max-w-3xl mx-auto py-10 px-4 space-y-8">
                <PostBox post={post} onAddToList={handleAddToList} />
              </div>
            ))}
        </div>

        {showPlanSelector && (
          <div
            className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-40"
            onClick={() => setShowPlanSelector(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add to List</h2>
                <button
                  onClick={() => {
                    setShowPlanSelector(false);
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {plans.length > 0 ? (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="plan-selector"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select a list:
                    </label>
                    <select
                      id="plan-selector"
                      value={selectedPlanId || ""}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- Select a list --</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlanSelector(false);
                        setError(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addPostToExistingPlan}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add to List
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">You don't have any lists yet.</p>
                  <button
                    type="button"
                    onClick={createNewPlanWithPost}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create a New List
                  </button>
                </div>
              )}

              {plans.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={createNewPlanWithPost}
                    className="w-full text-blue-600 hover:underline text-center"
                  >
                    Create a new list instead
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default HomeView;
