"use client";

import Link from "next/link";
import {
  GalleryVerticalEnd,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";

import {} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-[#0000002f] backdrop-blur-3xl">
        <nav className="flex gap-6 text-sm">
          <Link href="/">
            <GalleryVerticalEnd className="size-4" />
            <p className="font-bold">Bartr Inc.</p>
          </Link>

          <Link href="/about" className="hover:underline">
            About
          </Link>

          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 md:px-12 lg:px-24">
        <h1 className="text-5xl font-extrabold mb-12 text-center">
          About Bartr
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-800/10 backdrop-blur-3xl p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              No currency left? No problem. Bartr transforms old belongings into
              new opportunities by redefining trading in a post-apocalyptic
              world. We make trading fun, fair, and game-like.
            </p>
          </div>
          <div className="bg-gray-800/10 backdrop-blur-3xl p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg leading-relaxed">
              Users upload items along with details on what they want in return.
              Our Gemini AI evaluates the item’s value in USD and automatically
              matches you with trades within a ±10% range. Swipe left for “nah”
              and right for “I want that.”
            </p>
          </div>
          <div className="bg-gray-800/10 backdrop-blur-3xl p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg leading-relaxed">
              • 📸 Upload item image • 📝 Enter title, description, and desired
              trade • 🤖 Gemini AI for instant value estimation • 🔄 Auto-match
              within ±10% of value • ❤️ Gamified swipe interface
            </p>
          </div>
          <div className="bg-gray-800/10 backdrop-blur-3xl p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
            <p className="text-lg leading-relaxed">
              Step into a community where traditional currency is obsolete.
              Trade smart and have fun. With Bartr, your everyday items become
              the keys to a brave new world of bartering.
            </p>
          </div>
        </div>

        {/* Footer with Social Media Links */}
        <footer className="mt-16 py-8 border-t border-gray-700 text-center">
          <div className="flex justify-center space-x-6">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 text-2xl"
            >
              <FacebookIcon />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 text-2xl"
            >
              <TwitterIcon />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500 text-2xl"
            >
              <InstagramIcon />
            </Link>
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-700 text-2xl"
            >
              <LinkedinIcon />
            </Link>
          </div>
          <p className="mt-4 text-gray-400">
            © {new Date().getFullYear()} Bartr. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
