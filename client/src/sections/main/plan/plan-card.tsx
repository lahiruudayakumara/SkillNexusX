import { Link } from 'react-router-dom';
import { LearningPlan } from '../../../types/learning-type';

interface PlanCardProps {
    plan: LearningPlan;
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

    // Calculate progress based on dates
    const calculateProgress = () => {
        const now = new Date();

        // If start date isn't set, default to creation date
        const start = plan.startDate ? new Date(plan.startDate) : new Date(plan.createdAt);
        const end = new Date(plan.endDate);

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

        // If plan hasn't started yet
        if (now < start) return 0;

        // If plan has ended
        if (now > end) return 100;

        // Calculate progress percentage
        const totalDuration = end.getTime() - start.getTime();
        // Avoid division by zero
        if (totalDuration <= 0) return 0;

        const elapsed = now.getTime() - start.getTime();
        return Math.round((elapsed / totalDuration) * 100);
    };

    const progress = calculateProgress();

    // Get status text
    const getStatusText = () => {
        const now = new Date();
        const start = plan.startDate ? new Date(plan.startDate) : new Date(plan.createdAt);
        const end = new Date(plan.endDate);

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime()))
            return 'Invalid dates';

        if (now < start) return 'Not started';
        if (now > end) return 'Completed';
        return 'In progress';
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 truncate">{plan.title || 'Untitled Plan'}</h3>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{getStatusText()}</span>
                    <span>{progress}% complete</span>
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