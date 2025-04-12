"use client";

import DashboardSidebar from "./components/DashboardSidebar";
import AddItemDialog from "./components/AddItemDialog";

function Page() {
  return (
    <div className="h-screen w-full flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Area */}
      <div className="w-3/4 h-full">
        {/* Top bar */}
        <div className="p-6 flex justify-end">
          <AddItemDialog />
        </div>
      </div>
    </div>
  );
}
export default Page;
