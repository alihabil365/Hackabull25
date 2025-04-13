import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BoxIcon,
  HouseIcon,
  Package,
  CompassIcon,
  HeartIcon,
  GitCompareArrows,
} from "lucide-react";

function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-1/5 p-6 bg-gray-50 dark:bg-black flex flex-col h-screen border-r">
      {/* Logo */}
      {/* <Link href="/dashboard" className="flex items-center gap-4 mb-6">
        <Image src="/Logo.svg" alt="Bartr Logo" width={150} height={150} />
      </Link> */}
      <Link href="/dashboard" className="flex items-center space-x-2">
        <GitCompareArrows className="h-6 w-6 text-purple-500" />
        <p className="text-3xl font-black">Bartr</p>
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
            href="/dashboard/wishlist"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/dashboard/wishlist")
                ? "text-purple-500 bg-purple-50"
                : ""
            }`}
          >
            <HeartIcon className="size-6" />
            <p className="text-lg font-medium">Wishlist</p>
          </Link>
          {/* <Link
            href="/dashboard/orders"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isActive("/dashboard/orders")
                ? "text-purple-500 bg-purple-50"
                : ""
            }`}
          >
            <Package className="size-6" />
            <p className="text-lg font-medium">Orders</p>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
export default DashboardSidebar;
