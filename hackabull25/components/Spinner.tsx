"use client";

import { motion } from "motion/react";

function LoadingCircleSpinner() {
  return (
    <div>
      <motion.div
        className="w-4 h-4 rounded-full border-2 border-black border-t-white will-change-transform"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.75,
          repeat: Infinity,
          type: "spring",
        }}
      />
    </div>
  );
}

export default LoadingCircleSpinner;
