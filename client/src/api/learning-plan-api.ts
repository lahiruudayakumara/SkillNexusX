import API from "./api-instance";

// Updated interface to match your data structure
export interface LearningPlan {
  id?: string;
  userId: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  topics?: string[];
  resources?: string[];
  shared?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all learning plans
export const getAllLearningPlans = async () => {
  try {
    const response = await API.get('/plans');
    return response.data;
  } catch (error) {
    console.error("Error fetching learning plans:", error);
    throw error;
  }
};

// Get a specific learning plan by ID
export const getLearningPlanById = async (id: string) => {
  try {
    const response = await API.get(`/plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching learning plan with ID ${id}:`, error);
    throw error;
  }
};

// Create a new learning plan
export const createLearningPlan = async (planData: Omit<LearningPlan, 'id'>) => {
  try {
    const response = await API.post('/plans', planData);
    return response.data;
  } catch (error) {
    console.error("Error creating learning plan:", error);
    throw error;
  }
};

// Update an existing learning plan
export const updateLearningPlan = async (id: string, planData: Partial<LearningPlan>) => {
  try {
    const response = await API.put(`/plans/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating learning plan with ID ${id}:`, error);
    throw error;
  }
};

// Delete a learning plan
export const deleteLearningPlan = async (id: string) => {
  try {
    const response = await API.delete(`/plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting learning plan with ID ${id}:`, error);
    throw error;
  }
};
