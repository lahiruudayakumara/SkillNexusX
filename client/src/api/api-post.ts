import { FormData } from "@/types/post";
import API from "@/api/api-instance";

export const createPost = async (postData: FormData): Promise<{ message: string, postId: string }> => {
  const response = await API.post<{ message: string, postId: string }>("/posts", postData);
  return response.data;
};

export const createDraftPost = async (postData: FormData): Promise<{ message: string, postId: string }> => {
  const response = await API.post<{ message: string, postId: string }>("/posts?draft=true", postData);
  return response.data;
};

export const getPostById = async (postId: string): Promise<any[]> => {
  const response = await API.get(`posts/${postId}`);
  return response.data;
};

export const getUserAllPublishedPosts = async (): Promise<any[]> => {
  const response = await API.get("/posts");
  return response.data;
};

export const getAllPublishedPosts = async (userId: string): Promise<any[]> => {
  const response = await API.get(`/posts?userId=${1}`);
  return response.data;
};

export const getAllDraftPosts = async (): Promise<any[]> => {
  const response = await API.get("/posts/draft");
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await API.delete(`/posts/${postId}`);
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  await API.post(`/posts/${postId}/like?userId=${userId}`);
};

export const getLikeCount = async (postId: string): Promise<number> => {
  const response = await API.get(`/posts/${postId}/likes`);
  return response.data;
};

export const addComment = async (
  postId: string,
  userId: number,
  content: string
): Promise<any> => {
  const response = await API.post(`/posts/${postId}/comments?userId=${userId}`, { content });
  return response.data;
};

export const replyToComment = async (
  postId: string,
  parentCommentId: number,
  userId: string,
  content: string
): Promise<any> => {
  const response = await API.post(`/posts/${postId}/comments/${parentCommentId}/replies?userId=${userId}`, {
    content,
  });
  return response.data;
};

export const getComments = async (postId: string): Promise<any[]> => {
  const response = await API.get(`/posts/${postId}/comments`);
  return response.data;
};

export const deleteCommentAPI = async (commentId: string): Promise<void> => {
  await API.delete(`/posts/comments/${commentId}`);
};

export const deleteReplyAPI = async (replyId: string): Promise<void> => {
  await API.delete(`/posts/comments/replies/${replyId}`);
};