import API from "@/api/api-instance";

export interface ProgressDTO {
  id: string;         // Added ID field to match backend
  userId: string;
  planId: string;
  title: string;
  content: string;
  shared: boolean;
  startDate: string;  // ISO format date string
  endDate: string;    // ISO format date string
}

// CREATE progress
export const createProgress = async (data: ProgressDTO): Promise<ProgressDTO> => {
  const response = await API.post<ProgressDTO>("/progress", data);
  return response.data;
};

// UPDATE progress
export const updateProgress = async (id: string, data: ProgressDTO): Promise<ProgressDTO> => {
  const response = await API.put<ProgressDTO>(`/progress/${id}`, data);
  return response.data;
};

// DELETE progress
export const deleteProgress = async (id: string): Promise<void> => {
  await API.delete(`/progress/${id}`);
};

// GET all progress
export const getAllProgress = async (): Promise<ProgressDTO[]> => {
  const response = await API.get<ProgressDTO[]>("/progress");
  return response.data;
};

// GET progress by ID
export const getProgressById = async (id: string): Promise<ProgressDTO> => {
  const response = await API.get<ProgressDTO>(`/progress/${id}`);
  return response.data;
};
