import Reducer from "@stores/reducer";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"

const store = configureStore({
    reducer: Reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;