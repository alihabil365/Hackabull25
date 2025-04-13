import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BoxIcon,
  GalleryVerticalEnd,
  HouseIcon,
  Package,
  User,
} from "lucide-react";

function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-1/4 h-full p-6 bg-gray-50 flex flex-col space-y-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-4">
        <GalleryVerticalEnd className="size-4" />
        <p className="font-bold text-xl">Bartr Inc.</p>
      </Link>

      {/* Main Menu */}
      <div className="flex flex-col space-y-4">
        <p className="text-sm opacity-50">Main Menu</p>
        <Link
          href="/dashboard"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/dashboard") ? "text-purple-500 bg-purple-50" : ""
          }`}
        >
          <HouseIcon className="size-4" />
          <p>Dashboard</p>
        </Link>
        <Link
          href="/dashboard/products"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/dashboard/products")
              ? "text-purple-500 bg-purple-50"
              : ""
          }`}
        >
          <BoxIcon className="size-4" />
          <p>My Products</p>
        </Link>
        <Link
          href="/dashboard/orders"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/dashboard/orders") ? "text-purple-500 bg-purple-50" : ""
          }`}
        >
          <Package className="size-4" />
          <p>Orders</p>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/dashboard/profile") ? "text-purple-500 bg-purple-50" : ""
          }`}
        >
          <User className="size-4" />
          <p>Profile</p>
        </Link>
      </div>
    </div>
  );
}
export default DashboardSidebar;
