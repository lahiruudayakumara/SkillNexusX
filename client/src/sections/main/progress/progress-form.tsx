import React, { useState, useEffect } from 'react';

interface ProgressFormProps {
  initialData?: {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  };
  onSubmit: (data: {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  }) => void;
  isSubmitting?: boolean;
}

const ProgressForm: React.FC<ProgressFormProps> = ({ 
  initialData, 
  onSubmit,
  isSubmitting = false
}) => {
  // Format date strings to YYYY-MM-DD format for date inputs
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Handle ISO format or any valid date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Invalid date
      
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    startDate: formatDateForInput(initialData?.startDate || ''),
    endDate: formatDateForInput(initialData?.endDate || ''),
    shared: initialData?.shared || false,
  });

  // Update form if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        startDate: formatDateForInput(initialData.startDate || ''),
        endDate: formatDateForInput(initialData.endDate || ''),
        shared: initialData.shared || false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Start date cannot be after end date');
      return;
    }
    
    onSubmit(formData);
  };

  return (
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
            disabled={isSubmitting}
            maxLength={100} // Reasonable title length limit
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
              disabled={isSubmitting}
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
          disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
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
            disabled={isSubmitting}
            min={formData.startDate} // Prevent selecting end date before start date
          />
          <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button 
          type="button" 
          onClick={() => window.history.back()} 
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Progress'}
        </button>
      </div>
    </form>
  );
};

export default ProgressForm;