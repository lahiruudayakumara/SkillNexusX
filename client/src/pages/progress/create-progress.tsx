import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressForm from '../../sections/main/progress/progress-form';

const CreateProgress = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  }) => {
    // In a real app, make an API call to create progress
    console.log('Creating progress:', data);
    navigate('/progress'); // Redirect to progress dashboard
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Progress</h1>
      <ProgressForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateProgress;