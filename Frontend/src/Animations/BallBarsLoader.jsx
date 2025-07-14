import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const BallBarsLoader = () => {
  const ballRef = useRef();
  const barRefs = useRef([]);

  useEffect(() => {
    const barSpacing = 30;       // 🔻 Reduced spacing
    const jumpHeight = 30;       // 📏 Shorter jump

    const tl = gsap.timeline({ repeat: -1 });

    const totalBars = barRefs.current.length;

    for (let i = 0; i < totalBars; i++) {
      const startX = (i - 1) * barSpacing;
      const endX = i * barSpacing;

      const path = [
        { x: startX < 0 ? 0 : startX, y: 0 },
        { x: (startX + endX) / 2, y: -jumpHeight },
        { x: endX, y: 0 },
      ];

      tl.to(ballRef.current, {
        duration: 0.5,
        motionPath: {
          path,
          align: false,
          autoRotate: false,
        },
        ease: "sine.inOut", // ✅ Smoother, elegant arc
      });

      tl.to(
        barRefs.current[i],
        {
          scaleY: 1.2,
          transformOrigin: "bottom",
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut", // ✅ Cleaner bounce
        },
        "-=0.4"
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F4F7F8] overflow-hidden">
      <div className="relative flex items-end gap-[20px] h-[80px]">
        {/* 📈 Final bar is tallest */}
        {[30, 40, 50, 35, 60].map((height, i) => (
          <div
            key={i}
            ref={(el) => (barRefs.current[i] = el)}
            className="w-[10px] bg-[#27AE60] rounded"
            style={{ height: `${height}px` }}
          ></div>
        ))}

        {/* Ball */}
        <div
          ref={ballRef}
          className="absolute bottom-[100%] w-[12px] h-[12px] bg-[#9B59B6] rounded-full"
          style={{ left: "0px" }}
        ></div>
      </div>

      <p className="mt-6 text-[#2C3E50] font-semibold text-xs sm:text-sm">
        FinVerse is analyzing your financial performance...
      </p>
    </div>
  );
};

export default BallBarsLoader;
