import WishlistClient from "@/components/WishlistClient";

function page() {
  return (
    <div className="min-h-screen w-3/4 flex pr-6 bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
          </div>
        </div>
        <div className="w-full">
          <WishlistClient />
        </div>
      </div>
    </div>
  );
}
export default page;
