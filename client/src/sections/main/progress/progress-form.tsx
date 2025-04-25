import React, { useState } from 'react';

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
}

const ProgressForm: React.FC<ProgressFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    shared: initialData?.shared || false,
  });

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
    onSubmit(formData);
  };

  return (
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
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="shared"
            checked={formData.shared}
            onChange={handleCheckboxChange}
          />
          <span>Shared</span>
        </label>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default ProgressForm;