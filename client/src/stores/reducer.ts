import authReducer from "@/stores/slices/auth/auth-slice";
import { combineReducers } from "@reduxjs/toolkit";
import progressReducer from "../stores/slices/progress/progress-slice";
import learningReducer from "../stores/slices/learning-plan/learning-slice";

const Reducer = combineReducers({
    auth: authReducer,
    progress: progressReducer,
    learning: learningReducer,
});



export default Reducer;