"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";

import { motion } from "motion/react";

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

      {/* 🔸 Header */}
      <header className="fixed w-full z-50 flex justify-between items-center p-6 bg-[#0000002f] backdrop-blur-3xl">
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="flex space-x-2 items-center">
            <GalleryVerticalEnd className="size-4" />
            <p className="font-bold">Bartr Inc.</p>
          </Link>
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/swipe" className="hover:underline">
            Swipe
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* 🔸 Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center h-screen">
        <motion.p
          initial={{ opacity: 0, transform: "translateY(100px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ type: "spring", duration: 2.5 }}
          className="text-9xl font-bold select-none bg-clip-text text-transparent bg-gradient-to-r from-white/80 to-white/30"
        >
          Bartr.
        </motion.p>

        {/* Sub title */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", delay: 1, duration: 2.5 }}
          className="text-3xl select-none"
        >
          Trade. Trust. Thrive. Enter the future of bartering.
        </motion.p>
      </main>
    </div>
  );
}
