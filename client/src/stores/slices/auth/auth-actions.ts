import { LoginRequest, RegisterRequest } from "@/types/auth-types";
import { loginUser, refreshToken, registerUser, socialLoginCallback } from "@/api/auth-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refresh_token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();
      localStorage.setItem("token", response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to refresh token");
    }
  }
);

export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await socialLoginCallback(token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refresh_token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Social login failed");
    }
  }
);


export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);