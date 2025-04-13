import ExploreClient from "@/components/Explore";

function page() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen w-4/5 flex pr-6 bg-gray-50">
=======
    <div className="h-screen w-4/5 bg-gray-50 flex flex-col relative overflow-scroll">
>>>>>>> 6d0d084a4d3987d9ed1ef5fa5e98ee39761beea1
      {/* Main Content */}
      <div className="p-6">
        <div className="w-full mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
        </div>
        <hr className="mt-6" />
      </div>
      <ExploreClient />
    </div>
  );
}
export default page;
