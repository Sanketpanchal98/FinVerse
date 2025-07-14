// components/ZigZagArrowLoader.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const ArrowLoader = () => {
  const arrowRef = useRef();

  useEffect(() => {
  requestAnimationFrame(() => {
    const arrow = arrowRef.current;
    const path = document.querySelector("#zigzag-path");

    if (!arrow || !path) return console.error("Missing arrow or path");

    gsap.set(arrow, { xPercent: -50, yPercent: -50 });

    gsap.to(arrow, {
      duration: 2.5,
      repeat: -1,
      ease: "power1.inOut",
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
      },
    });
  });
}, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F4F7F8]">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* 🔷 Path the arrow follows */}
        <path
          id="zigzag-path"
          d="M0,70 L20,50 L40,70 L60,50 L80,30"
          fill="none"
          stroke="#2C3E50"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* 🔺 Arrow (can use circle or triangle) */}
        <polygon
          ref={arrowRef}
          points="0,-5 10,0 0,5"
          fill="#27AE60"
        />
      </svg>

      <p className="mt-6 text-[#2C3E50] font-semibold text-xs sm:text-sm">
        FinVerse is charting your financial growth...
      </p>
    </div>
  );
};

export default ArrowLoader;
