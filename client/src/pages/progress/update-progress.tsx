import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressForm from '../../sections/main/progress/progress-form';

const UpdateProgress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<{
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  } | null>(null);

  useEffect(() => {
    // In a real app, fetch the progress data by ID from the API
    if (id === '1') {
      setInitialData({
        title: 'React Fundamentals',
        content:
          'Completed chapters 1-3 of React course. The fundamentals covered component creation, props, state management, and event handling.',
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        shared: true,
      });
    } else {
      console.error('Progress not found');
    }
  }, [id]);

  const handleSubmit = (data: {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  }) => {
    // In a real app, make an API call to update progress
    console.log('Updating progress:', data);
    navigate('/progress'); // Redirect to progress dashboard
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Progress</h1>
      <ProgressForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default UpdateProgress;