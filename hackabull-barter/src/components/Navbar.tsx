import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-primary-600"
            >
              BarterSwap
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/upload-item"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Upload Item
              </Link>
              <Link
                href="/trade"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Trade
              </Link>
              <Link
                href="/matches"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Matches
              </Link>
              <div className="ml-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Get Started
              </Link>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <SignedIn>
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              href="/upload-item"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Upload Item
            </Link>
            <Link
              href="/trade"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Trade
            </Link>
            <Link
              href="/matches"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Matches
            </Link>
            <div className="px-3 py-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-700 hover:text-white"
            >
              Get Started
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
