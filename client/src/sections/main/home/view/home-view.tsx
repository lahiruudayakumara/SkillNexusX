import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPublishedPosts } from "@/api/api-post";
import { ListPlus, X } from "lucide-react";
import { LearningPlan } from "../../../../types/learning-type";
import PostBox from "./post-card";

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

  // Fetch available plans on component mount
  useEffect(() => {
    const fetchPlans = () => {
      try {
        const storedPlans = JSON.parse(
          localStorage.getItem("learning-plans") || "[]"
        );
        setPlans(storedPlans);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };

    fetchPlans();

    // Check for newly created plan from redirect
    const successMessage = new URLSearchParams(location.search).get("success");
    if (successMessage) {
      setSuccess(successMessage);
      // Clear the success parameter after showing the message
      setTimeout(() => {
        setSuccess(null);
        navigate(location.pathname, { replace: true });
      }, 3000);
    }
  }, [location, navigate]);

  // Prevent scrolling when modal is open
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

  const addPostToExistingPlan = () => {
    if (!selectedPlanId || !selectedPost) {
      setError("Please select a list");
      return;
    }

    try {
      // Get the selected plan
      const existingPlans = JSON.parse(
        localStorage.getItem("learning-plans") || "[]"
      );
      const planIndex = existingPlans.findIndex(
        (p: LearningPlan) => p.id === selectedPlanId
      );

      if (planIndex === -1) {
        setError("Selected list not found");
        return;
      }

      // Create a resource URL for this post (in a real app, this would be the post's URL)
      const postResource = `/posts/${selectedPost.id || Date.now()}`; // Using post ID or timestamp

      // Add the post to the plan's resources
      const updatedPlans = [...existingPlans];
      updatedPlans[planIndex].resources = [
        ...updatedPlans[planIndex].resources,
        postResource,
      ];

      // Update the plan in localStorage
      localStorage.setItem("learning-plans", JSON.stringify(updatedPlans));

      setSuccess(`Post added to "${updatedPlans[planIndex].title}" list!`);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      setShowPlanSelector(false);
    } catch (err) {
      console.error("Failed to add post to list:", err);
      setError("Failed to add post to list");
    }
  };

  const createNewPlanWithPost = () => {
    // Store the current post data in sessionStorage
    if (selectedPost) {
      const postResource = `/posts/${selectedPost.id || Date.now()}`;
      sessionStorage.setItem(
        "pending-post-for-plan",
        JSON.stringify({
          post: selectedPost,
          resourceUrl: postResource,
        })
      );
      navigate("/plans/create?from=home");
    }
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

    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  return (
    <div className="flex relative">
      <div className="w-full md:w-2/3 space-y-8 py-8 divide-y-[1px] divide-slate-200">
        {success && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {success}
          </div>
        )}

        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {posts.map((post) => (
          <div key={post.id} className="max-w-3xl mx-auto py-10 px-4 space-y-8">
            <PostBox
              post={post}
              onAddToList={handleAddToList}
            />
          </div>
        ))}
      </div>

      <div className="hidden md:block md:w-1/3">{/* Sidebar content */}</div>

      {/* Backdrop with blur effect */}
      {showPlanSelector && (
        <div
          className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-40"
          onClick={() => setShowPlanSelector(false)}
        >
          {/* Prevent clicks on the modal from closing the backdrop */}
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                <p className="text-gray-600 mb-4">
                  You don't have any lists yet.
                </p>
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
  );
};

export default HomeView;