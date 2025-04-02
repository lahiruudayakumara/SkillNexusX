import "./index.css";

import MainRoute from "./routes/main-route.tsx";
import { Provider } from "react-redux";
import { StrictMode } from "react";
import { ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";
import store from "./stores/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MainRoute />
      <ToastContainer position="bottom-center" />
    </Provider>
  </StrictMode>
);
