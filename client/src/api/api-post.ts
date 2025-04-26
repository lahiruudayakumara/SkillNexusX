import { FormData } from "@/types/post";
import API from "@/api/api-instance";

export const createPost = async (postData: FormData): Promise<{ message: string, postId: string }> => {
  const response = await API.post<{ message: string, postId: string }>("/posts", postData);
  return response.data;
};

export const getAllPublishedPosts = async (): Promise<any[]> => {
  const response = await API.get("/posts");
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await API.delete(`/posts/${postId}`);
};