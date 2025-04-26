export interface LearningProgress {
    id: string;
    userId: string;
    planId?: string;
    title: string;
    content: string;
    shared?: boolean;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
  }
  