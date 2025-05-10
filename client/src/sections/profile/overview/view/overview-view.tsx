import { useState, useCallback, memo, FC, useEffect } from "react";
import clsx from "clsx";
import { DotsVerticalIcon, IconButton } from "../icon";
import ArticleCard from "../post-card";
import FollowItem from "../follow-item";
import Avatar from "@assets/avatar.svg";
import { getAllDraftPosts, getAllPublishedPosts } from "@/api/api-post";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getUserById } from "@/api/api-user";
import { User } from "@/types/user";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

const AboutView: FC = memo(() => (
  <section className="w-full">
    <h2 className="text-2xl font-bold mb-4"></h2>
  </section>
));

const Overview: FC = () => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [activeView, setActiveView] = useState<"publish" | "draft">("publish");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState<User>();
  const userId = useSelector((state: RootState) => state.auth.user_id);

  const toggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  const handleViewChange = useCallback((view: "publish" | "draft") => {
    setActiveView(view);
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, [activeView]);

  const fetchUser = async () => {
    try {
      const user = await getUserById(userId);
      setUser(user);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data =
        activeView === "publish"
          ? (await getAllPublishedPosts(userId?.toString() || '')).filter(post => post.userId === userId)
          : await (await getAllDraftPosts()).filter(post => post.userId === userId)
      setPosts(data);
    } catch (e) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };
 

  const handlePostDelete = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{user?.fullName}</h1>
        <IconButton aria-label="More options">
          <DotsVerticalIcon className="h-6 w-6" />
        </IconButton>
      </header>

      <nav className="border-b border-gray-200 mb-8">
        <div className="flex space-x-6">
          <button
            onClick={() => handleViewChange("publish")}
            className={clsx(
              "pb-2 font-medium cursor-pointer",
              activeView === "publish"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            )}
          >
            Publish
          </button>
          <button
            onClick={() => handleViewChange("draft")}
            className={clsx(
              "pb-2 font-medium cursor-pointer",
              activeView === "draft"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            )}
          >
            Draft
          </button>
          {/* <button
            onClick={() => handleViewChange("plans")}
            className={clsx(
              "pb-2 font-medium cursor-pointer",
              activeView === "plans"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            )}
          >
            My Learning Plans
          </button> */}
        </div>
      </nav>

      <div className="flex flex-col md:flex-row gap-10">
        <section className="w-full md:w-2/3">
          {activeView === "publish" ? (
            posts.map((post, index) => (
              <ArticleCard key={index} {...post} onDelete={handlePostDelete} />
            ))
          ) : (
            posts.map((post, index) => (
              <ArticleCard key={index} {...post} onDelete={handlePostDelete} />
            ))
          )}
        </section>

        <aside className="w-full md:w-1/3">
          <div className="mb-10 flex flex-col items-center">
            <img
              src={Avatar}
              alt="user-name"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h2 className="text-lg font-medium mb-1">{user?.fullName}</h2>
            <p className="text-gray-600 mb-2">{user?.followers.length} Followers</p>
            <p className="text-gray-700 text-sm text-center mb-4"></p>
            {/* <div className="flex space-x-2">
              <button
                className={clsx(
                  "px-4 py-1 rounded-full border cursor-pointer",
                  isFollowing
                    ? "bg-white text-primary border-primary"
                    : "bg-primary text-white border-primary"
                )}
                onClick={toggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <IconButton className="border border-primary text-primary">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </IconButton>
            </div> */}
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-medium mb-4">Following</h3>
            <div className="space-y-4">
              {user?.following.map((item, index) => (
                <FollowItem key={index} {...item} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Overview;