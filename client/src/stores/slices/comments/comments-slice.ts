// redux/comments/commentsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchComments, createComment, createReply, deleteReply, deleteComment } from '@stores/slices/comments/comments-action';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  parentCommentId: number;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load comments';
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.comments.push(action.payload);
      })
      .addCase(createReply.fulfilled, (state, action: PayloadAction<Reply>) => {
        const reply = action.payload;
        const parentIndex = state.comments.findIndex(
          (comment) => comment.id === reply.parentCommentId
        );
        if (parentIndex !== -1) {
          state.comments[parentIndex].replies = [
            ...(state.comments[parentIndex].replies || []),
            reply,
          ];
        }
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      .addCase(deleteReply.fulfilled, (state, action: PayloadAction<number>) => {
        const parentComment = state.comments.find(comment => 
          comment.replies.some(reply => reply.id === action.payload)
        );
        if (parentComment) {
          parentComment.replies = parentComment.replies.filter(reply => reply.id !== action.payload);
        }
      });

  },
});

export default commentsSlice.reducer;
