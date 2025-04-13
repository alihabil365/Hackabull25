import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BoxIcon,
  HouseIcon,
  Package,
  User,
  CompassIcon,
  HeartIcon,
} from "lucide-react";

function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-1/4 p-6 bg-gray-50 flex flex-col h-screen">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-4 mb-6">
        <Image src="/Logo.svg" alt="Bartr Logo" width={120} height={120} />
      </Link>

      {/* Main Menu */}
      <div className="flex-1 flex flex-col">
        <p className="text-base opacity-50 font-medium mb-6"> </p>
        <div className="space-y-6">
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/dashboard") ? "text-purple-500 bg-purple-50" : ""
            }`}
          >
            <HouseIcon className="size-6" />
            <p className="text-lg font-medium">Dashboard</p>
          </Link>
          <Link
            href="/dashboard/explore"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/dashboard/explore")
                ? "text-purple-500 bg-purple-50"
                : ""
            }`}
          >
            <CompassIcon className="size-6" />
            <p className="text-lg font-medium">Explore</p>
          </Link>
          <Link
            href="/dashboard/products"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/dashboard/products")
                ? "text-purple-500 bg-purple-50"
                : ""
            }`}
          >
            <BoxIcon className="size-6" />
            <p className="text-lg font-medium">My Products</p>
          </Link>
          <Link
            href="/wishlist"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/wishlist") ? "text-purple-500 bg-purple-50" : ""
            }`}
          >
            <HeartIcon className="size-6" />
            <p className="text-lg font-medium">Wishlist</p>
          </Link>
          <Link
            href="/dashboard/orders"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/dashboard/orders")
                ? "text-purple-500 bg-purple-50"
                : ""
            }`}
          >
            <Package className="size-6" />
            <p className="text-lg font-medium">Orders</p>
          </Link>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <Link
          href="/dashboard/profile"
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/dashboard/profile") ? "text-purple-500 bg-purple-50" : ""
          }`}
        >
          <User className="size-6" />
          <p className="text-lg font-medium">Profile</p>
        </Link>
      </div>
    </div>
  );
}
export default DashboardSidebar;
