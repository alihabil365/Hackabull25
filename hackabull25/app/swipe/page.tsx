"use client";

import SwipeCard from "../../components/SwipeCard";

const mockItems = [
  {
    id: "item1",
    image: "https://via.placeholder.com/300x200.png?text=Water+Filter",
    title: "Water Filter",
    value: 30,
    description: "",
  },
  {
    id: "item2",
    image: "https://via.placeholder.com/300x200.png?text=Clean+Socks",
    title: "Clean Socks (4x)",
    value: 10,
    description: "",
  },
  {
    id: "item3",
    image: "https://via.placeholder.com/300x200.png?text=Camp+Stove",
    title: "Portable Camp Stove",
    value: 45,
    description: "",
  },
];

export default function SwipePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Barter Matchmaker</h1>
      <SwipeCard items={mockItems} />
    </main>
  );
}
