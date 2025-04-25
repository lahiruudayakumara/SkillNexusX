import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LearningPlan } from '../../../types/learning-type';

interface PlanCardProps {
  plan: LearningPlan;
  status: 'inProgress' | 'completed' | 'notStarted';
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, status }) => {
  const navigate = useNavigate();

  const handleShare = () => {
    navigate('/progress/create', { state: { plan } });
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">{plan.title}</h2>
      <p className="text-sm text-gray-600 mb-2">{plan.description || 'No description provided.'}</p>
      <div className="text-sm text-gray-500 mb-4">
        <p>
          <span className="font-medium">Start Date:</span> {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'N/A'}
        </p>
        <p>
          <span className="font-medium">End Date:</span> {new Date(plan.endDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex space-x-2">
        <Link
          to={`/plans/${plan.id}`}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          View
        </Link>
        {status === 'completed' && (
          <button
            onClick={handleShare}
            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Share Completion
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanCard;