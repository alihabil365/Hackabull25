'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* 🔹 Full Background Image */}
      <Image
        src="/images/photo-1712133611163-3dc3cadecf7f.avif"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* 🔸 Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* 🔸 Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-neutral-800">
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/explore" className="hover:underline">Explore</Link>
          <Link href="/upload" className="hover:underline">Upload</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/swipe" className="hover:underline">Swipe</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* 🔸 Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-6">
        <h1
          className="text-6xl md:text-8xl font-extrabold"
        >
          Welcome to Bartr
        </h1>
        <p className="max-w-2xl text-lg md:text-2xl text-gray-300 ">
          Trade. Trust. Thrive. Enter to the future of bartering.
        </p>
      </main>
    </div>
  );
}
