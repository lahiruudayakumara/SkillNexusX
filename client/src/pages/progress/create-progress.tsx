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
  const [success, setSuccess] = useState<string | null>(null); // New success state

  // New state variables for title and content
  const [title, setTitle] = useState(preFilledPlan ? `${preFilledPlan.title}` : "");
  const [content, setContent] = useState(preFilledPlan
    ? `Hey, I just completed the “${preFilledPlan.title}” learning plan! 🎉\n\n**What I learned:**`
    : "");

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  }) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError("Please provide valid start and end dates.");
      setIsSubmitting(false);
      return;
    }
    if (startDate > endDate) {
      setError("Start date cannot be after the end date.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = "12345"; // Replace with your actual user ID from auth context/state
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();

      const progressData: ProgressDTO = {
        id: String(Date.now()),
        userId: userId,
        planId: preFilledPlan?.id || "67890",
        title: formData.title,
        content: formData.content,
        shared: formData.shared,
        startDate: startDateISO,
        endDate: endDateISO,
      };

      await createProgress(progressData);

      // Store progress in localStorage for the home page
      if (formData.shared) {
        localStorage.setItem("sharedProgress", JSON.stringify(progressData));
      }

      // Show success message and redirect
      setSuccess("Progress created successfully!");
      setTimeout(() => navigate('/progress/view')); // Redirect to home after 2 seconds
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
            <h2 className="text-2xl font-bold text-gray-800">Share Your Learning Progress</h2>
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

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <ProgressForm 
            initialData={{
              title: title,
              content: content,
              startDate: preFilledPlan?.startDate || '',
              endDate: preFilledPlan?.endDate || '',
              shared: false
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      
      
    </div>
  );
};

export default CreateProgressPage;