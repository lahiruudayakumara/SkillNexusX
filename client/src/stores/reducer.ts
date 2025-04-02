import authReducer from "@/stores/slices/auth/auth-slice";
import { combineReducers } from "@reduxjs/toolkit";

const Reducer = combineReducers({
    auth: authReducer,
});

export default Reducer;