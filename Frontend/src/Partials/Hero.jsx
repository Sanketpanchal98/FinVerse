import Lottie from "lottie-react";
import coinAnimation from "../assets/man-graphs.json";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function Hero() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <section
      className={`w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-center px-4 py-10 md:py-0 transition-all duration-500 ${
        theme ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text"
      }`}
    >
      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-12">
        <h1
          className={`font-bold mb-4`}
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            color: theme ? "#1F2937" : "#F9FAFB", // dark:text-white, light:text-gray-800
          }}
        >
          Visualize. Optimize. Thrive.
        </h1>
        <p
          className={`text-lg md:text-xl max-w-xl mb-6 transition-colors duration-300 ${
            theme ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Track expenses, analyze spending, and gain insights with AI-driven financial tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link className="bg-[#27AE60] text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all"
          to={'/auth'}
          >
            Start Tracking
          </Link>
          {/* <button className="bg-white text-[#2C3E50] px-6 py-3 rounded-xl border border-white hover:bg-gray-100 transition-all">
            Try Calculator
          </button> */}
        </div>
      </div>

      {/* Right Content (Lottie) */}
      <div className="w-full md:w-1/2 flex justify-center items-center mb-10 md:mb-0">
        <Lottie
          animationData={coinAnimation}
          loop={true}
          className="w-[90%] max-w-[400px] md:max-w-[500px] lg:max-w-[550px]"
        />
      </div>
    </section>
  );
}
