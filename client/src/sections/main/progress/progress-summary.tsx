import React from 'react';
import ProgressCard from './progress-card';

interface ProgressSummaryProps {
  progressList: {
    id: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    shared: boolean;
  }[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ progressList }) => {
  if (progressList.length === 0) {
    return <p className="text-gray-500">No progress items available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {progressList.map((progress) => (
        <ProgressCard
          key={progress.id}
          id={progress.id}
          title={progress.title}
          content={progress.content}
          startDate={progress.startDate}
          endDate={progress.endDate}
          shared={progress.shared}
        />
      ))}
    </div>
  );
};

export default ProgressSummary;