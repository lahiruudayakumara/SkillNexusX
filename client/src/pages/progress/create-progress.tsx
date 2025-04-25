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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create Progress</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Post Completion
        </button>
      </form>
    </div>
  );
};

export default CreateProgress;