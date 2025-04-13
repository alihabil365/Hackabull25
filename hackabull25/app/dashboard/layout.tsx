"use client";

import DashboardSidebar from "./components/DashboardSidebar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      {children}
    </div>
  );
}
export default layout;
