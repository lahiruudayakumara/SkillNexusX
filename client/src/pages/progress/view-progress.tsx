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
  const [filter, setFilter] = useState<'all' | 'recent' | 'older'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletionPosts = () => {
      setLoading(true);
      // Fetch completion posts from local storage
      const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      // Sort posts by creation date (newest first)
      const sortedPosts = storedPosts.sort((a: CompletionPost, b: CompletionPost) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCompletionPosts(sortedPosts);
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

  const getFilteredPosts = () => {
    if (filter === 'all') return completionPosts;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    if (filter === 'recent') {
      return completionPosts.filter(post => new Date(post.createdAt) >= thirtyDaysAgo);
    } else {
      return completionPosts.filter(post => new Date(post.createdAt) < thirtyDaysAgo);
    }
  };

  const filteredPosts = getFilteredPosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-white">SkillNexus</h1>
            <p className="text-blue-100">Connect. Learn. Grow.</p>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">SkillNexus</h1>
          <p className="text-blue-100">Connect. Learn. Grow.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Learning Progress</h2>
            <button
              onClick={() => navigate('/progress/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Document New Progress
            </button>
          </div>

          {/* Filters */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setFilter('all')}
                className={`pb-4 px-1 ${
                  filter === 'all'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Updates
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`pb-4 px-1 ${
                  filter === 'recent'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recent (30 days)
              </button>
              <button
                onClick={() => setFilter('older')}
                className={`pb-4 px-1 ${
                  filter === 'older'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Older
              </button>
            </nav>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No completion updates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? "You haven't documented any progress yet."
                  : filter === 'recent'
                  ? "You don't have any updates in the last 30 days."
                  : "You don't have any updates older than 30 days."}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/progress/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Document your first progress
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Posted on {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleUpdate(post.id)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1.5 bg-white border border-red-300 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2025 SkillNexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ViewProgress;