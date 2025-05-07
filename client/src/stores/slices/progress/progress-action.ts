import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProgress,
  updateProgress,
  deleteProgress,
  getAllProgress,
  getProgressById,
  ProgressDTO,
} from "../../../api/api-progress";

export const fetchAllProgress = createAsyncThunk(
  "progress/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllProgress();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch progress");
    }
  }
);

export const fetchProgressById = createAsyncThunk(
  "progress/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProgressById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch progress by ID");
    }
  }
);

export const addProgress = createAsyncThunk(
  "progress/add",
  async (data: ProgressDTO, { rejectWithValue }) => {
    try {
      return await createProgress(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to create progress");
    }
  }
);

export const editProgress = createAsyncThunk(
  "progress/edit",
  async ({ id, data }: { id: string; data: ProgressDTO }, { rejectWithValue }) => {
    try {
      return await updateProgress(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update progress");
    }
  }
);

export const removeProgress = createAsyncThunk(
  "progress/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteProgress(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete progress");
    }
  }
);
