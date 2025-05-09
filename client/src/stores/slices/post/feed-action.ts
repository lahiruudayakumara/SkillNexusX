
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPublishedPosts, likePost } from "@/api/api-post";
import { FeedPost } from "@/types/post";


export const fetchFeedPosts = createAsyncThunk<FeedPost[], number | undefined>(
    'feed/fetchFeedPosts',
    async (userId, thunkAPI) => {
      try {
        const response = await getAllPublishedPosts();
        return response;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch posts');
      }
    }
  );

  export const likeFeedPost = createAsyncThunk<void, { postId: string; userId: string }>(
    'feed/likeFeedPost',
    async ({ postId, userId }, thunkAPI) => {
      try {
        await likePost(postId, userId);
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to like post');
      }
    }
  );