import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Trade What You Have
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto">
            BarterSwap is a modern marketplace that lets you trade items you
            don&apos;t need for things you want. No money, just swipe and match!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/sign-up" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/sign-in" className="btn-outline text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Items</h3>
              <p className="text-gray-600">
                Add photos and details of items you want to trade away.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Swipe & Match</h3>
              <p className="text-gray-600">
                Browse other items and swipe right on things you want. Match
                when both users like each other's items.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trade & Enjoy</h3>
              <p className="text-gray-600">
                Arrange the exchange and enjoy your new items!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p>© {new Date().getFullYear()} BarterSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
