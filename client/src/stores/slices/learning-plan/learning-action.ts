import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getAllLearningPlans, 
  getLearningPlanById, 
  createLearningPlan as apiCreateLearningPlan,
  updateLearningPlan as apiUpdateLearningPlan,
  deleteLearningPlan as apiDeleteLearningPlan
} from "@/api/learning-plan-api";
import { LearningPlan } from "./learning-slice";

// Fetch all learning plans
export const fetchLearningPlans = createAsyncThunk(
  "learning/fetchLearningPlans",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllLearningPlans();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch a learning plan by ID
export const fetchLearningPlanById = createAsyncThunk(
  "learning/fetchLearningPlanById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getLearningPlanById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create a new learning plan
export const createLearningPlan = createAsyncThunk(
  "learning/createLearningPlan",
  async (planData: Omit<LearningPlan, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const data = await apiCreateLearningPlan(planData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an existing learning plan
export const updateLearningPlan = createAsyncThunk(
  "learning/updateLearningPlan",
  async ({ id, planData }: { id: string; planData: Partial<LearningPlan> }, { rejectWithValue }) => {
    try {
      const transformedPlanData = {
        ...planData,
        createdAt: planData.createdAt ? new Date(planData.createdAt).toISOString() : undefined,
        updatedAt: planData.updatedAt ? new Date(planData.updatedAt).toISOString() : undefined,
      };
      const data = await apiUpdateLearningPlan(id, transformedPlanData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a learning plan
export const deleteLearningPlan = createAsyncThunk(
  "learning/deleteLearningPlan",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteLearningPlan(id);
      return id; // Return the ID to remove it from the state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);