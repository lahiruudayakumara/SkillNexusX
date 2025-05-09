import API from "@/api/api-instance";
import { User } from "@/types/user";

export const getUserById = async (id: number): Promise<User> => {
  const response = await API.get<User>(`/users/${id}`);
  return response.data;
};

