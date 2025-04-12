'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Item = {
  id: string;
  image: string;
  title: string;
  value: number;
  description: string;
};

interface SwipeCardProps {
  items: Item[];
}

export default function SwipeCard({ items }: SwipeCardProps) {
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<Item[]>([]);
  const [showMatch, setShowMatch] = useState(false);

  const currentItem = items[index];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentItem) return;

    if (direction === 'right') {
      setMatches((prev) => [...prev, currentItem]);
      setShowMatch(true);
      setTimeout(() => setShowMatch(false), 1500);
    }

    setIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-sm h-[520px] flex flex-col items-center justify-center gap-6 relative">
      {/* Match Popup */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-0 z-20 bg-green-600 text-white text-xl font-bold px-6 py-3 rounded-xl shadow-xl"
          >
            ✅ It's a Match!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipeable Card */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          drag="x"
          onDragEnd={(event, info) => {
            if (info.offset.x > 100) handleSwipe('right');
            else if (info.offset.x < -100) handleSwipe('left');
          }}
          className="relative w-full h-[420px] rounded-2xl overflow-hidden group shadow-2xl"
        >
          {/* Background image */}
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
        
          {/* Always visible: title + value */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            <h2 className="text-lg font-bold">{currentItem.title}</h2>
            <p className="text-green-300 font-semibold">${currentItem.value}</p>
          </div>
        
          {/* Hover-only: description */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm px-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p>{currentItem.description}</p>
          </div>
        </motion.div>
        
        
        )}
      </AnimatePresence>

      {/* Buttons */}
      {currentItem && (
        <div className="flex gap-6 z-10">
          <button
            onClick={() => handleSwipe('left')}
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Skip ❌
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            Match ✅
          </button>
        </div>
      )}

      {/* Show matched item names below */}
      {matches.length > 0 && (
        <div className="text-sm mt-2 text-center text-green-200">
          Matches: {matches.map((m) => m.title).join(', ')}
        </div>
      )}
    </div>
  );
}
