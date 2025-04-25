import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LearningProgress } from '../../types/progress-types';

const CreateProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preFilledPlan = location.state?.plan;

  const [formData, setFormData] = useState<LearningProgress>({
    id: `${Date.now()}`, // Unique ID for the progress
    userId: 'user123', // Replace with actual user ID
    planId: preFilledPlan?.id || '',
    title: preFilledPlan?.title || '',
    content: preFilledPlan?.description || '',
    shared: false,
    startDate: preFilledPlan?.startDate || '',
    endDate: preFilledPlan?.endDate || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save progress to local storage
    const storedProgress = JSON.parse(localStorage.getItem('learning-progress') || '[]');
    localStorage.setItem('learning-progress', JSON.stringify([...storedProgress, formData]));

    // Save the completion as a post
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
      id: `${Date.now()}`, // Unique ID for the post
      title: `Completed: ${formData.title}`,
      content: formData.content,
      createdAt: new Date().toISOString(),
      userId: formData.userId,
    };
    localStorage.setItem('posts', JSON.stringify([...storedPosts, newPost]));

    // Navigate back to the progress dashboard
    navigate('/');
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
              Track your learning journey by documenting your progress. Your completed progress will also be shared as a post on your profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learning Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the title of your learning"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <div className="flex items-center space-x-2 h-10">
                  <input
                    type="checkbox"
                    id="shared"
                    name="shared"
                    checked={formData.shared}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="shared" className="text-gray-700">Share with community</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Learning Details</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder="Describe what you've learned, key insights, and how you plan to apply this knowledge"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Post Progress
              </button>
            </div>
          </form>
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

export default CreateProgress;