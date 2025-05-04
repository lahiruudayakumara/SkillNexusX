import authReducer from "@/stores/slices/auth/auth-slice";
import { combineReducers } from "@reduxjs/toolkit";
import progressReducer from "../stores/slices/progress/progress-slice";

const Reducer = combineReducers({
    auth: authReducer,
    progress: progressReducer,
});

export default Reducer;