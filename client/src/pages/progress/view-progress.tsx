import React, { useEffect, useState } from 'react';
import { getAllProgress, updateProgress, deleteProgress, ProgressDTO } from '@/api/api-progress';
import { useNavigate } from 'react-router-dom';

const ViewProgress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const data = await getAllProgress();
        setProgressData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch progress data.');
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleUpdatePost = (id: string) => {
    const progressToUpdate = progressData.find(p => p.id === id);
    if (progressToUpdate) {
      navigate('/progress/update', { state: { progress: progressToUpdate } });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteProgress(id);
      setProgressData(prevData => prevData.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete progress:', err);
      setError('Failed to delete progress.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  // Filter to only show shared completions
  const sharedCompletions = progressData.filter(progress => progress.shared);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Progress Overview</h1>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shared Completions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sharedCompletions.length > 0 ? (
            sharedCompletions.map((progress) => (
              <div key={progress.id} className="bg-white rounded-lg shadow p-6">
                <div className="mb-2">
                  <span className="bg-green-100 text-green-800 text-sm font-medium py-1 px-2 rounded-full">
                    Completed
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-1">{progress.title}</h3>
                <p className="text-gray-600 mb-4">{progress.content}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500 w-full"></div>
                  </div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm">{new Date(progress.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm">{new Date(progress.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1"
                    onClick={() => navigate(`/view-plan/${progress.planId}`)}
                  >
                    View Plan
                  </button>
                  <button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded"
                    onClick={() => progress.id && handleUpdatePost(progress.id)}
                  >
                    Update Post
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded"
                    onClick={() => progress.id && handleDeletePost(progress.id)}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No shared completions yet.</p>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">All Progress Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Content</th>
                <th className="px-4 py-2 border">Shared</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((progress) => (
                <tr key={progress.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{progress.title}</td>
                  <td className="px-4 py-2 border">{progress.content}</td>
                  <td className="px-4 py-2 border">{progress.shared ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border">{new Date(progress.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{new Date(progress.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProgress;