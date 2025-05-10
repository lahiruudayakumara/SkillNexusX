import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProgressDTO } from "../../../api/api-progress";
import {
  fetchAllProgress,
  fetchProgressById,
  addProgress,
  editProgress,
  removeProgress,
} from "../../slices/progress/progress-action";

interface ProgressState {
  items: ProgressDTO[];
  selected: ProgressDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    resetProgressState: (state) => {
      state.items = [];
      state.selected = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch all
      .addCase(fetchAllProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProgress.fulfilled, (state, action: PayloadAction<ProgressDTO[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by ID
      .addCase(fetchProgressById.fulfilled, (state, action: PayloadAction<ProgressDTO>) => {
        state.selected = action.payload;
      })

      // Add
      .addCase(addProgress.fulfilled, (state, action: PayloadAction<ProgressDTO>) => {
        state.items.push(action.payload);
      })

      // Edit
      .addCase(editProgress.fulfilled, (state, action: PayloadAction<ProgressDTO>) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // Remove
      .addCase(removeProgress.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { resetProgressState } = progressSlice.actions;
export default progressSlice.reducer;
