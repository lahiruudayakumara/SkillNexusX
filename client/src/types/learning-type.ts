export interface LearningPlan {
    id: string;
    userId: string;
    title: string;
    description?: string;
    startDate?: string; // Added startDate as an optional property
    endDate: string;
    topics: string[];
    resources: string[];
    shared: boolean;
    createdAt: string;
    updatedAt: string;
}