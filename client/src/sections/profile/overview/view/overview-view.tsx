import { useState, useCallback, memo, FC, useEffect } from "react";
import clsx from "clsx";
import { DotsVerticalIcon, IconButton } from "../icon";
import ArticleCard from "../post-card";
import FollowItem from "../follow-item";
import Avatar from "@assets/avatar.svg";
import { getAllPublishedPosts } from "@/api/api-post";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AboutView: FC = memo(() => (
  <section className="w-full">
    <h2 className="text-2xl font-bold mb-4"></h2>
  </section>
));

// Icon Components



const Overview: FC = () => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [activeView, setActiveView] = useState<"home" | "about" | "plans">("home");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  const handleViewChange = useCallback((view: "home" | "about" | "plans") => {
    if (view === "plans") {
      navigate("/plans"); // Navigate to /plans when the My Learning Plans tab is clicked
    } else {
      setActiveView(view);
    }
  }, [navigate]);

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

  type FollowItem = {
    name: string;
    avatar: string;
  };
  
  const following: FollowItem[] = [
    {
      name: "Jane Doe",
      avatar: "https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg",
    },
    {
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    {
      name: "Emily Chen",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];
  

  const handlePostDelete = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Lahiru Udayakumara</h1>
        <IconButton aria-label="More options">
          <DotsVerticalIcon className="h-6 w-6" />
        </IconButton>
      </header>

      <nav className="border-b border-gray-200 mb-8">
        <div className="flex space-x-6">
          <button
            onClick={() => handleViewChange("home")}
            className={clsx(
              "pb-2 font-medium cursor-pointer",
              activeView === "home"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            )}
          >
            Publish
          </button>
          <button
            onClick={() => handleViewChange("about")}
            className={clsx(
              "pb-2 font-medium cursor-pointer",
              activeView === "about"
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
          {activeView === "home" ? (
            posts.map((post, index) => (
              <ArticleCard key={index} {...post} onDelete={handlePostDelete} />
            ))
          ) : (
            <AboutView />
          )}
        </section>

        <aside className="w-full md:w-1/3">
          <div className="mb-10 flex flex-col items-center">
            <img
              src={Avatar}
              alt="user-name"
              className="w-20 h-20 rounded-full mb-2"
            />
            <h2 className="text-lg font-medium mb-1">Lahiru Udayakumara</h2>
            <p className="text-gray-600 mb-2">4 Followers</p>
            <p className="text-gray-700 text-sm text-center mb-4"></p>
            <div className="flex space-x-2">
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
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-medium mb-4">Following</h3>
            <div className="space-y-4">
              {following.map((item, index) => (
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