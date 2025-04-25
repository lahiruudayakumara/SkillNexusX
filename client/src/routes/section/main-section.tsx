import MainLayout from "@/layouts/main";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../protected-route";

const Main = () => {
  return (
    // <ProtectedRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    // </ProtectedRoute>
  );
};

export default Main;
