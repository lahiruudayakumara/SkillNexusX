import authReducer from "@/stores/slices/auth/auth-slice";
import { combineReducers } from "@reduxjs/toolkit";
import progressReducer from "../stores/slices/progress/progress-slice";
import learningReducer from "../stores/slices/learning-plan/learning-slice";
import feedPostReducer from '@stores/slices/post/feed-slice'

const Reducer = combineReducers({
    auth: authReducer,
    progress: progressReducer,
    learning: learningReducer,
    feed: feedPostReducer
});

export default Reducer;