import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BoxIcon,
  GalleryVerticalEnd,
  HouseIcon,
  Package,
  User,
  CompassIcon,
} from "lucide-react";

function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-1/4 p-6 bg-gray-50 flex flex-col space-y-6 h-screen">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-4">
        <Image
          src="/Logo.svg"
          alt="Bartr Logo"
          width={120}
          height={120}
          // className="w-auto h-auto"
        />
        {/* <p className="font-bold text-xl">Bartr Inc.</p> */}
      </Link>

      {/* Main Menu */}
      <div className="flex flex-col space-y-6">
        <p className="text-base opacity-50 font-medium">Main Menu</p>
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
          href="/explore"
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/explore") ? "text-purple-500 bg-purple-50" : ""
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
          href="/dashboard/orders"
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive("/dashboard/orders") ? "text-purple-500 bg-purple-50" : ""
          }`}
        >
          <Package className="size-6" />
          <p className="text-lg font-medium">Orders</p>
        </Link>
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
