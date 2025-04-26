<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
<<<<<<< HEAD
import PostCard from "./post-card";
=======
import { getAllPublishedPosts } from "@/api/api-post";
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)
import { BookOpen, X } from "lucide-react";
import { LearningPlan } from "../../../../types/learning-type";
import PostBox from "./post-card";

const HomeView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [completionPosts, setCompletionPosts] = useState<any[]>([]);

  // Fetch available plans and completion posts on component mount
  useEffect(() => {
    const fetchPlansAndPosts = () => {
      try {
<<<<<<< HEAD
        const storedPlans = JSON.parse(localStorage.getItem("learning-plans") || "[]");
        const storedCompletionPosts = JSON.parse(localStorage.getItem("posts") || "[]");
=======
        const storedPlans = JSON.parse(
          localStorage.getItem("learning-plans") || "[]"
        );
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)
        setPlans(storedPlans);
        setCompletionPosts(storedCompletionPosts);
      } catch (err) {
<<<<<<< HEAD
        console.error("Failed to fetch plans or posts:", err);
=======
        console.error("Failed to fetch plans:", err);
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)
      }
    };

<<<<<<< HEAD
    fetchPlansAndPosts();
  }, []);
=======
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
>>>>>>> 29c0476 (refactor: enhance CreatePlanView with resource and tag management, and improve HomeView for plan selection)

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
<<<<<<< HEAD
      const existingPlans = JSON.parse(localStorage.getItem("learning-plans") || "[]");
      const planIndex = existingPlans.findIndex((p: LearningPlan) => p.id === selectedPlanId);
=======
      const existingPlans = JSON.parse(
        localStorage.getItem("learning-plans") || "[]"
      );
      const planIndex = existingPlans.findIndex(
        (p: LearningPlan) => p.id === selectedPlanId
      );
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)

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
        postResource,
      ];

      // Update the plan in localStorage
      localStorage.setItem("learning-plans", JSON.stringify(updatedPlans));

      setSuccess(`Post added to "${updatedPlans[planIndex].title}" plan!`);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      setShowPlanSelector(false);
    } catch (err) {
      console.error("Failed to add post to plan:", err);
      setError("Failed to add post to plan");
    }
  };

  const createNewPlanWithPost = () => {
    // Store the current post data in sessionStorage
<<<<<<< HEAD
    sessionStorage.setItem("pending-post-for-plan", JSON.stringify(selectedPost));
    navigate("/plans/create");
=======
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
>>>>>>> 29c0476 (refactor: enhance CreatePlanView with resource and tag management, and improve HomeView for plan selection)
  };

<<<<<<< HEAD
  const posts = [
    {
      id: 1,
      username: "John Doe",
      avatar: "https://via.placeholder.com/50",
      content: "Check out this awesome view!",
      mediaUrl: "https://via.placeholder.com/600",
      mediaType: "image",
    },
    {
      id: 2,
      username: "Jane Smith",
      avatar: "https://via.placeholder.com/50",
      content: "Learning React has been an amazing journey!",
      mediaUrl: "https://via.placeholder.com/600",
      mediaType: "image",
    },
    {
      id: 3,
      username: "Alex Johnson",
      avatar: "https://via.placeholder.com/50",
      content: "Just finished a great coding tutorial",
      mediaUrl: "https://via.placeholder.com/600",
      mediaType: "image",
    },
  ];
=======
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

    fetchPosts();
  }, []);
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)

  return (
    <div className="flex relative">
      <div className="w-full md:w-2/3 space-y-8 py-8 divide-y-[1px] divide-slate-400">
        {success && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {success}
          </div>
        )}

<<<<<<< HEAD
        {/* Display normal posts */}
        {posts.map((post) => (
          <div key={post.id} className="pt-8 first:pt-0">
            <PostCard
              username={post.username}
              avatar={post.avatar}
              content={post.content}
              mediaUrl={post.mediaUrl}
              mediaType={post.mediaType as "image" | "video" | undefined}
            />
=======
        {posts.map((post) => (
          <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
            {loading && <p>Loading posts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {posts.map((post) => (
              <PostBox key={post.id} post={post} />
            ))}
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)
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

        {/* Display completion posts */}
        {completionPosts.map((post) => (
          <div key={post.id} className="pt-8 first:pt-0">
            <PostCard
              username="You"
              avatar="https://via.placeholder.com/50"
              content={post.content}
              mediaUrl={undefined}
              mediaType={undefined}
            />
            <div className="mt-2 text-gray-500 text-sm">
              <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
            </div>
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
              <h2 className="text-xl font-semibold">Add to Learning Plan</h2>
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
                    Select a learning plan:
                  </label>
                  <select
                    id="plan-selector"
                    value={selectedPlanId || ""}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select a plan --</option>
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
                    Add to Plan
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  You don't have any learning plans yet.
                </p>
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
<<<<<<< HEAD
=======
import { useEffect, useState } from "react";
import { getAllPublishedPosts } from "@/api/api-post";
import PostBox from "./post-card";


const HomeView = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {posts.map((post) => (
        <PostBox key={post.id} post={post} />
      ))}
>>>>>>> b20d558 (add post creation and content management features with image and video uploads)
=======
>>>>>>> 071ef34 (refactor: improve HomeView structure and enhance plan fetching logic)
    </div>
  );
};

export default HomeView;
