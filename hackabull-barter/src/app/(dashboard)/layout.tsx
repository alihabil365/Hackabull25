import { PropsWithChildren } from "react";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 md:p-8">{children}</main>
    </div>
  );
}
