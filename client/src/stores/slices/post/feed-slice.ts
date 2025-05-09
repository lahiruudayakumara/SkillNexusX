// src/features/feed/feedSlice.ts

import { FeedPost } from '@/types/post';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFeedPosts } from './feed-action';


interface FeedState {
  posts: FeedPost[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<FeedPost[]>) {
      state.posts = action.payload;
    },
    likePost(state, action: PayloadAction<number>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post && !post.liked) {
        post.liked = true;
        post.likeCount += 1;
      }
    },
    unlikePost(state, action: PayloadAction<number>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post && post.liked) {
        post.liked = false;
        post.likeCount = Math.max(0, post.likeCount - 1);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPosts, likePost, unlikePost } = feedSlice.actions;
export default feedSlice.reducer;
