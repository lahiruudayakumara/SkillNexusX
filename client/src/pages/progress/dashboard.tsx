import React from 'react';
import ProgressSummary from '../../sections/main/progress/progress-summary';

const ProgressDashboard = () => {
  const mockProgressList = [
    {
      id: '1',
      title: 'React Fundamentals',
      content:
        'Completed chapters 1-3 of React course. The fundamentals covered component creation, props, state management, and event handling.',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      shared: true,
    },
    {
      id: '2',
      title: 'TypeScript Basics',
      content:
        'Working through TypeScript documentation. Completed sections on basic types, interfaces, and functions.',
      startDate: '2025-04-05',
      endDate: '2025-05-05',
      shared: false,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress Dashboard</h1>
      <ProgressSummary progressList={mockProgressList} />
    </div>
  );
};

export default ProgressDashboard;