import { usePathname } from "next/navigation";
import {
  BoxIcon,
  GalleryVerticalEnd,
  HouseIcon,
  Package,
  User,
} from "lucide-react";

function DashboardSidebar() {
  const pathname = usePathname();
  const currentUrl = pathname.split("/")[pathname.split("/").length - 1];
  return (
    <div className="w-1/4 h-full p-6 bg-gray-50 flex flex-col space-y-6">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <GalleryVerticalEnd className="size-4" />
        <p className="font-bold text-xl">Bartr Inc.</p>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col space-y-4">
        <p className="text-sm opacity-50">Main Menu</p>
        <div
          className={`flex items-center space-x-2 hover:bg-gray-50 ${
            currentUrl === "dashboard" ? "text-purple-500" : ""
          }`}
        >
          <HouseIcon className="size-4" />
          <p>Dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <BoxIcon className="size-4" />
          <p>Products</p>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="size-4" />
          <p>Orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="size-4" />
          <p>Customers</p>
        </div>
      </div>
    </div>
  );
}
export default DashboardSidebar;
