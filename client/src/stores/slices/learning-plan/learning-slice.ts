import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  fetchLearningPlans, 
  fetchLearningPlanById, 
  createLearningPlan, 
  updateLearningPlan, 
  deleteLearningPlan 
} from "./learning-action";

// ... existing imports ...

// Update the LearningPlan interface to match your data structure
export interface LearningPlan {
  id: string;
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

// ... rest of the file remains the same ...

// Define the state interface
interface LearningState {
  learningPlans: LearningPlan[];
  currentPlan: LearningPlan | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: LearningState = {
  learningPlans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

// Create the slice
const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
    clearLearningError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all learning plans
      .addCase(fetchLearningPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningPlans.fulfilled, (state, action: PayloadAction<LearningPlan[]>) => {
        state.learningPlans = action.payload;
        state.loading = false;
      })
      .addCase(fetchLearningPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch learning plans";
      })
      
      // Fetch a single learning plan
      .addCase(fetchLearningPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningPlanById.fulfilled, (state, action: PayloadAction<LearningPlan>) => {
        state.currentPlan = action.payload;
        state.loading = false;
      })
      .addCase(fetchLearningPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch learning plan";
      })
      
      // Create a learning plan
      .addCase(createLearningPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLearningPlan.fulfilled, (state, action: PayloadAction<LearningPlan>) => {
        state.learningPlans.push(action.payload);
        state.currentPlan = action.payload;
        state.loading = false;
      })
      .addCase(createLearningPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to create learning plan";
      })
      
      // Update a learning plan
      .addCase(updateLearningPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLearningPlan.fulfilled, (state, action: PayloadAction<LearningPlan>) => {
        const index = state.learningPlans.findIndex(plan => plan.id === action.payload.id);
        if (index !== -1) {
          state.learningPlans[index] = action.payload;
        }
        state.currentPlan = action.payload;
        state.loading = false;
      })
      .addCase(updateLearningPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to update learning plan";
      })
      
      // Delete a learning plan
      .addCase(deleteLearningPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLearningPlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.learningPlans = state.learningPlans.filter(plan => plan.id !== action.payload);
        if (state.currentPlan && state.currentPlan.id === action.payload) {
          state.currentPlan = null;
        }
        state.loading = false;
      })
      .addCase(deleteLearningPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to delete learning plan";
      });
  },
});

export const { clearCurrentPlan, clearLearningError } = learningSlice.actions;
export default learningSlice.reducer;