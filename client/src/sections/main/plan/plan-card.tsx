import { Link } from 'react-router-dom';
import { LearningPlan } from '../../../types/learning-type';

// Extended type to track completed resources
interface ExtendedPlan extends LearningPlan {
    completedResources?: string[];
}

interface PlanCardProps {
    plan: ExtendedPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
    // Format date for display
    const formatDateString = (dateString?: string) => {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Calculate progress based on completed resources
    const calculateProgress = () => {
        if (!plan.resources || plan.resources.length === 0) return 0;

        const totalResources = plan.resources.length;
        const completedCount = plan.completedResources?.length || 0;

        return Math.round((completedCount / totalResources) * 100);
    };

    const progress = calculateProgress();

    // Get status text based on resource completion
    const getStatusText = () => {
        if (!plan.resources || plan.resources.length === 0) return 'No resources';

        if (!plan.completedResources || plan.completedResources.length === 0) return 'Not started';
        if (plan.completedResources.length === plan.resources.length) return 'Completed';
        return 'In progress';
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 truncate">{plan.title || 'Untitled Plan'}</h3>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{getStatusText()}</span>
                    <span>
                        {plan.resources && plan.resources.length > 0 ? (
                            <>
                                {plan.completedResources?.length || 0}/{plan.resources.length} resources • {progress}%
                            </>
                        ) : 'No resources added'}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {formatDateString(plan.startDate)} - {formatDateString(plan.endDate)}
                </p>
            </div>

            <div className="mb-4">
                {Array.isArray(plan.topics) && plan.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {plan.topics.slice(0, 3).map((topic, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {topic}
                            </span>
                        ))}
                        {plan.topics.length > 3 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                +{plan.topics.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Link
                    to={`/plans/${plan.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}