import API from "./api-instance";

// Interface for learning plan data
interface LearningPlan {
  id?: string;
  title: string;
  description: string;
  goals: string[];
  timeline?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Get all learning plans
export const getAllLearningPlans = async () => {
  try {
    const response = await API.get('/learning-plans');
    return response.data;
  } catch (error) {
    console.error("Error fetching learning plans:", error);
    throw error;
  }
};

// Get a specific learning plan by ID
export const getLearningPlanById = async (id: string) => {
  try {
    const response = await API.get(`/learning-plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching learning plan with ID ${id}:`, error);
    throw error;
  }
};

// Create a new learning plan
export const createLearningPlan = async (planData: Omit<LearningPlan, 'id'>) => {
  try {
    const response = await API.post('/learning-plans', planData);
    return response.data;
  } catch (error) {
    console.error("Error creating learning plan:", error);
    throw error;
  }
};

// Update an existing learning plan
export const updateLearningPlan = async (id: string, planData: Partial<LearningPlan>) => {
  try {
    const response = await API.put(`/learning-plans/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating learning plan with ID ${id}:`, error);
    throw error;
  }
};

// Delete a learning plan
export const deleteLearningPlan = async (id: string) => {
  try {
    const response = await API.delete(`/learning-plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting learning plan with ID ${id}:`, error);
    throw error;
  }
};