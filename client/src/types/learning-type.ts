export interface LearningPlan {
    id: string;
    userId: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate: string;
    topics: string[];
    resources: string[];
    completedResources?: string[]; // Added to track completed resources
    shared: boolean;
    createdAt: string;
    updatedAt: string;
    
}