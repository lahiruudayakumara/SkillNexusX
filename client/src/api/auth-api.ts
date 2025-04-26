import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth-types";

import API from "@/api/api-instance";

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/register", userData);
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await API.post<AuthResponse>("/auth/refresh-token", {
    refreshToken: `${refreshToken}`,
  });
  return response.data;
};

export const socialLoginCallback = async (token: string) => {
  const response = await API.get(`/api/auth/oauth2/callback?token=${token}`);
  return response.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};