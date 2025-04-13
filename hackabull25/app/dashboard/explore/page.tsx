import ExploreClient from "@/components/Explore";

function page() {
  return (
    <div className="min-h-screen w-4/5 flex pr-6 bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          </div>
        </div>
        <div className="w-full">
          <ExploreClient />
        </div>
      </div>
    </div>
  );
}
export default page;
