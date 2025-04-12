"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { Item } from "@/lib/supabase";

interface SwipeCardProps {
  item: Item;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeCard({
  item,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [exitComplete, setExitComplete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection("left");
      setTimeout(() => {
        setExitComplete(true);
        onSwipeLeft();
      }, 500);
    },
    onSwipedRight: () => {
      setSwipeDirection("right");
      setTimeout(() => {
        setExitComplete(true);
        onSwipeRight();
      }, 500);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const swipeLeftHandler = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      setExitComplete(true);
      onSwipeLeft();
    }, 500);
  };

  const swipeRightHandler = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      setExitComplete(true);
      onSwipeRight();
    }, 500);
  };

  const cardClasses = `swipe-card ${
    swipeDirection === "left" ? "swipe-left-exit" : ""
  } ${swipeDirection === "right" ? "swipe-right-exit" : ""}`;

  if (exitComplete) {
    return null;
  }

  return (
    <div ref={cardRef} className={cardClasses} {...swipeHandlers}>
      <div className="relative h-64 sm:h-80 bg-gray-200">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
        <p className="text-primary-600 font-semibold mb-2">
          Estimated Value: ${item.estimated_value.toFixed(2)}
        </p>
        <p className="mb-4">{item.description}</p>

        {item.desired_items && item.desired_items.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase text-gray-600">
              Looking for:
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.desired_items.map((desiredItem, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  {desiredItem}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={swipeLeftHandler}
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"
            aria-label="Decline"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
          </button>
          <button
            onClick={swipeRightHandler}
            className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center"
            aria-label="Accept"
          >
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
