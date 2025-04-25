import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CompletionPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

const ViewProgress = () => {
  const [completionPosts, setCompletionPosts] = useState<CompletionPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletionPosts = () => {
      setLoading(true);
      // Fetch completion posts from local storage
      const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      setCompletionPosts(storedPosts);
      setLoading(false);
    };

    fetchCompletionPosts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this completion update?')) {
      // Remove the post from local storage
      const updatedPosts = completionPosts.filter((post) => post.id !== id);
      setCompletionPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      console.log(`Deleted post with ID: ${id}`);
    }
  };

  const handleUpdate = (id: string) => {
    // Navigate to the update page for the specific progress
    navigate(`/progress/update/${id}`);
  };

  if (loading) {
    return <div className="p-4">Loading completion updates...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Completion Updates</h1>
      {completionPosts.length === 0 ? (
        <p className="text-gray-500">No completion updates available.</p>
      ) : (
        <div className="space-y-4">
          {completionPosts.map((post) => (
            <div key={post.id} className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>{post.content}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleUpdate(post.id)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProgress;