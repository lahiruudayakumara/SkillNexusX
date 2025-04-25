import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LearningProgress } from '../../types/progress-types'; // Adjust the path as needed

const ViewProgress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = () => {
      setLoading(true);

      // Mock data - in a real app, you would fetch from API
      if (id === '1') {
        setProgress({
          id: '1',
          userId: 'user123',
          planId: 'plan1',
          title: 'React Fundamentals',
          content:
            'Completed chapters 1-3 of React course. The fundamentals covered component creation, props, state management, and event handling. Next steps include learning about context API and hooks.',
          shared: true,
          startDate: '2025-04-01',
          endDate: '2025-04-30',
          createdAt: '2025-04-10T10:00:00Z',
          updatedAt: '2025-04-10T10:00:00Z',
        });
      } else if (id === '2') {
        setProgress({
          id: '2',
          userId: 'user123',
          planId: 'plan2',
          title: 'TypeScript Basics',
          content:
            'Working through TypeScript documentation. Completed sections on basic types, interfaces, and functions. Need to work on generics and advanced types next.',
          shared: false,
          startDate: '2025-04-05',
          endDate: '2025-05-05',
          createdAt: '2025-04-12T14:30:00Z',
          updatedAt: '2025-04-12T14:30:00Z',
        });
      } else {
        setError('Progress item not found');
      }

      setLoading(false);
    };

    fetchProgress();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this progress item?')) {
      // In a real app, make API call to delete
      console.log('Deleting progress item:', id);
      navigate('/progress');
    }
  };

  if (loading) {
    return <div className="p-4">Loading progress data...</div>;
  }

  if (error || !progress) {
    return (
      <div className="p-4">
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">{error || 'Error loading progress'}</p>
        </div>
        <div className="mt-4">
          <Link to="/progress" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <Link to="/progress" className="text-blue-600 hover:underline flex items-center">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{progress.title}</h1>
          <div className="flex space-x-2">
            <Link
              to={`/progress/update/${progress.id}`}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="font-medium">Start Date:</span> {new Date(progress.startDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">End Date:</span> {new Date(progress.endDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Created:</span> {new Date(progress.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(progress.updatedAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Sharing Status:</span> {progress.shared ? 'Public' : 'Private'}
          </div>
          {progress.planId && (
            <div>
              <span className="font-medium">Learning Plan:</span> {progress.planId}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Progress Details</h2>
          <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
            {progress.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgress;