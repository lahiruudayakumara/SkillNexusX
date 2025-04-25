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

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (status === 'completed') return 100;
    if (status === 'notStarted') return 0;
    
    // For in-progress, calculate based on resources if available
    if (plan.resources && plan.completedResources) {
      return Math.round((plan.completedResources.length / plan.resources.length) * 100);
    }
    
    // Default to 50% if we can't calculate
    return 50;
  };

  const completionPercentage = getCompletionPercentage();

  // Determine status colors and labels
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-green-700',
          bgLight: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Completed'
        };
      case 'inProgress':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgLight: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'In Progress'
        };
      case 'notStarted':
        return {
          bgColor: 'bg-gray-300',
          textColor: 'text-gray-700',
          bgLight: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Not Started'
        };
      default:
        return {
          bgColor: 'bg-gray-300',
          textColor: 'text-gray-700',
          bgLight: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Calculate dates and remaining time
  const startDate = plan.startDate ? new Date(plan.startDate) : null;
  const endDate = plan.endDate ? new Date(plan.endDate) : null;
  const currentDate = new Date();
  
  let timeRemaining = '';
  if (endDate) {
    const daysRemaining = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysRemaining < 0) {
      timeRemaining = 'Overdue';
    } else if (daysRemaining === 0) {
      timeRemaining = 'Due today';
    } else {
      timeRemaining = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${statusConfig.borderColor}`}>
      {/* Status Indicator */}
      <div className={`${statusConfig.bgLight} px-4 py-2 flex justify-between items-center border-b border-gray-100`}>
        <span className={`text-xs font-medium ${statusConfig.textColor}`}>
          {statusConfig.label}
        </span>
        {timeRemaining && (
          <span className="text-xs text-gray-500">
            {timeRemaining}
          </span>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{plan.title}</h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {plan.description || 'No description provided.'}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${statusConfig.bgColor} rounded-full h-2`} 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Dates */}
        <div className="text-xs text-gray-500 mb-4 grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium text-gray-700">Start Date</p>
            <p>{startDate ? startDate.toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">End Date</p>
            <p>{endDate ? endDate.toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          <Link
            to={`/plans/${plan.id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex-1 text-center"
          >
            View Plan
          </Link>
          {status === 'completed' && (
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex-1"
            >
              Share Completion
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;