import { createAsyncThunk } from '@reduxjs/toolkit';
import { addComment, replyToComment, getComments, deleteReplyAPI, deleteCommentAPI } from '@api/api-post';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId: string) => {
    const response = await getComments(postId);
    return response;
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, userId, content }: { postId: string; userId: number; content: string }) => {
    const response = await addComment(postId, userId, content);
    return response;
  }
);

export const createReply = createAsyncThunk(
  'comments/createReply',
  async ({
    postId,
    parentCommentId,
    userId,
    content,
  }: {
    postId: string;
    parentCommentId: number;
    userId: string;
    content: string;
  }) => {
    const response = await replyToComment(postId, parentCommentId, userId, content);
    return response;
  }
);

export const deleteComment = createAsyncThunk<number, number>(
  'comments/deleteComment',
  async (commentId: number) => {
    await deleteCommentAPI(commentId.toString());
    return commentId;
  }
);

export const deleteReply = createAsyncThunk<number, number>(
  'comments/deleteReply',
  async (replyId: number) => {
    await deleteReplyAPI(replyId.toString());
    return replyId;
  }
);