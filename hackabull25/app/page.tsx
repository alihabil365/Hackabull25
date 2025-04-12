import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center p-4 gap-4 h-16">
        {/* 🔹 Navbar links on the left */}
        <nav className="flex gap-6 items-center">
          <a href="" className="text-sm font-semibold hover:underline">
            Home
          </a>
          <a href="/browse" className="text-sm hover:underline">
            Browse
          </a>
          <a href="/upload" className="text-sm hover:underline">
            Upload
          </a>
          <a href="/about" className="text-sm hover:underline">
            About
          </a>
          <a href="/swipe" className="text-sm hover:underline">
            Swipe
          </a>
        </nav>

        {/* 🔸 Clerk Auth Buttons on the right (original layout preserved) */}
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
    </div>
  );
}
