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
    </div>
  );
};

export default HomeView;
