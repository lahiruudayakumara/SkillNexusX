import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./post-card";
import { BookOpen } from "lucide-react";
import { LearningPlan } from "../../../../types/learning-type";

const HomeView = () => {
  const navigate = useNavigate();
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch available plans on component mount
  useEffect(() => {
    const fetchPlans = () => {
      try {
        const storedPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
        setPlans(storedPlans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };

    fetchPlans();
  }, []);

  const handleAddToPlan = (post: any) => {
    setSelectedPost(post);
    setShowPlanSelector(true);
  };

  const addPostToExistingPlan = () => {
    if (!selectedPlanId || !selectedPost) {
      setError("Please select a plan");
      return;
    }

    try {
      // Get the selected plan
      const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
      const planIndex = existingPlans.findIndex((p: LearningPlan) => p.id === selectedPlanId);

      if (planIndex === -1) {
        setError("Selected plan not found");
        return;
      }

      // Create a resource URL for this post (in a real app, this would be the post's URL)
      const postResource = `/posts/${selectedPost.id || Date.now()}`; // Using post ID or timestamp

      // Add the post to the plan's resources
      const updatedPlans = [...existingPlans];
      updatedPlans[planIndex].resources = [
        ...updatedPlans[planIndex].resources,
        postResource
      ];

      // Update the plan in localStorage
      localStorage.setItem('learning-plans', JSON.stringify(updatedPlans));

      setSuccess(`Post added to "${updatedPlans[planIndex].title}" plan!`);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      setShowPlanSelector(false);
    } catch (err) {
      console.error('Failed to add post to plan:', err);
      setError("Failed to add post to plan");
    }
  };

  const createNewPlanWithPost = () => {
    // Store the current post data in sessionStorage
    sessionStorage.setItem('pending-post-for-plan', JSON.stringify(selectedPost));
    navigate('/plans/create');
  };

  const posts = [
    {
      id: 1,
      username: "John Doe",
      avatar: "https://via.placeholder.com/50",
      content: "Check out this awesome view!",
      mediaUrl: "https://via.placeholder.com/600",
      mediaType: "image"
    },
    {
      id: 2,
      username: "Jane Smith",
      avatar: "https://via.placeholder.com/50",
      content: "Learning React has been an amazing journey!",
      mediaUrl: "https://via.placeholder.com/600",
      mediaType: "image"
    },
    {
      id: 3,
      username: "Alex Johnson",
      avatar: "https://via.placeholder.com/50",
      content: "Just finished a great coding tutorial",
      mediaUrl: "https://via.placeholder.com/600",
      mediaType: "image"
    }
  ];

  return (
    <div className="flex">
      <div className="w-full md:w-2/3 space-y-8 py-8 divide-y-[1px] divide-slate-400">
        {success && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {success}
          </div>
        )}

        {posts.map(post => (
          <div key={post.id} className="pt-8 first:pt-0">
            <PostCard
              username={post.username}
              avatar={post.avatar}
              content={post.content}
              mediaUrl={post.mediaUrl}
              mediaType={post.mediaType as "image" | "video" | undefined}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleAddToPlan(post)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <BookOpen size={16} />
                Add to Learning Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block md:w-1/3">
        {/* Sidebar content */}
      </div>

      {/* Plan Selector Modal */}
      {showPlanSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add to Learning Plan</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {plans.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a learning plan:
                  </label>
                  <label htmlFor="plan-selector" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a learning plan:
                  </label>
                  <select
                    id="plan-selector"
                    value={selectedPlanId || ''}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select a plan --</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between">
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
                    Add to Plan
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">You don't have any learning plans yet.</p>
                <button
                  type="button"
                  onClick={createNewPlanWithPost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create a New Plan
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
                  Create a new plan instead
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