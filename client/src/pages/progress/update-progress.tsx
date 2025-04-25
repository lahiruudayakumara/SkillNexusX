import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressForm from '../../sections/main/progress/progress-form';

interface ProgressData {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  shared: boolean;
}

const UpdateProgress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgressData = () => {
      // Fetch progress data from local storage
      const storedProgress = JSON.parse(localStorage.getItem('posts') || '[]');
      const progressItem = storedProgress.find((item: ProgressData) => item.id === id);

      if (progressItem) {
        setInitialData(progressItem);
      } else {
        console.error('Progress not found');
      }
    };

    fetchProgressData();
  }, [id]);

  const handleSubmit = (data: Omit<ProgressData, 'id'>) => {
    // Fetch existing progress data from local storage
    const storedProgress = JSON.parse(localStorage.getItem('posts') || '[]');

    // Update the specific progress item
    const updatedProgress = storedProgress.map((item: ProgressData) =>
      item.id === id ? { ...item, ...data, id } : item
    );

    // Save the updated progress data back to local storage
    localStorage.setItem('posts', JSON.stringify(updatedProgress));

    console.log('Progress updated:', data);
    navigate('/progress/view'); // Redirect to progress dashboard
  };

  if (!initialData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Progress</h1>
      <ProgressForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default UpdateProgress;