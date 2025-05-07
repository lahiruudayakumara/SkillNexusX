import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createProgress, ProgressDTO } from '@/api/api-progress';
import ProgressForm from '../../sections/main/progress/progress-form';

const CreateProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preFilledPlan = location.state?.plan;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the current user ID from your auth system
      const userId = "12345"; // Replace with your actual user ID from auth context/state
      
      // Format dates to match the expected backend format (ISO string)
      const startDateISO = new Date(formData.startDate).toISOString();
      const endDateISO = new Date(formData.endDate).toISOString();
      
      // Create the progress data object to match backend API
      const progressData: ProgressDTO = {
        id: String(Date.now()), // Generate a temporary ID (backend might override this)
        userId: userId,
        planId: preFilledPlan?.id || "67890", // Use the plan ID if available or default
        title: formData.title,
        content: formData.content,
        shared: formData.shared,
        startDate: startDateISO,
        endDate: endDateISO,
      };

      // Send the data to the API using the imported createProgress function
      await createProgress(progressData);
      
      // Navigate back to the progress overview
      navigate('/progress/view');
    } catch (err) {
      console.error('Failed to create progress:', err);
      setError('Failed to create progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Document Learning Progress</h2>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-700">
              Track your learning journey by documenting your progress. Your completed progress will also be shared as a post on your profile if you choose to share it.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <ProgressForm 
            initialData={{
              title: preFilledPlan?.title || '',
              content: preFilledPlan?.description || '',
              startDate: preFilledPlan?.startDate || '',
              endDate: preFilledPlan?.endDate || '',
              shared: false
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
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

export default CreateProgressPage;