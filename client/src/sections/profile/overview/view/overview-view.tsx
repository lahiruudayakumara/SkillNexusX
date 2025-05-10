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
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state

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
      const user = await getUserById(1);
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
          ? await getAllPublishedPosts()
          : await getAllDraftPosts();
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

  // Create a filtered posts array based on search query
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true; // Show all posts when search is empty

    const query = searchQuery.toLowerCase();
    return (
      (post.title && post.title.toLowerCase().includes(query)) ||
      (post.content && post.content.toLowerCase().includes(query)) ||
      (post.description && post.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="px-4 py-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Lahiru Udayakumara</h1>
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
            {loading ? (
              <p>Loading posts...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredPosts.length === 0 ? (
              <p className="text-gray-500 py-4">No posts found matching "{searchQuery}"</p>
            ) : (
              activeView === "publish" ? (
                filteredPosts.map((post, index) => (
                  <ArticleCard key={index} {...post} onDelete={handlePostDelete} />
                ))
              ) : (
                filteredPosts.map((post, index) => (
                  <ArticleCard key={index} {...post} onDelete={handlePostDelete} />
                ))
              )
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
    </div>
  );
};

// Header Component
const Header = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) => {
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
                placeholder="Search plans by title or description..."
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

export default Overview;