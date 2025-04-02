import Header from "./header";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
