import React from 'react';
import { Link } from 'react-router-dom';

interface ProgressCardProps {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  shared: boolean;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ id, title, content, startDate, endDate, shared }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">{content.substring(0, 100)}...</p>
      <div className="text-sm text-gray-500 mb-4">
        <p>
          <span className="font-medium">Start Date:</span> {new Date(startDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">End Date:</span> {new Date(endDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Sharing Status:</span> {shared ? 'Public' : 'Private'}
        </p>
      </div>
      <div className="flex space-x-2">
        <Link
          to={`/progress/view/${id}`}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          View
        </Link>
        <Link
          to={`/progress/update/${id}`}
          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default ProgressCard;