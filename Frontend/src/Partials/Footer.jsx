import React from "react";
import { useSelector } from "react-redux";

export function Footer() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <footer className={`py-6 px-6 md:px-20 text-center text-sm transition-all duration-500 ${
      theme ? "bg-light-background text-gray-500" : "bg-dark-background text-gray-400"
    }`}>
      <hr className="mb-4 opacity-10" />
      <p>Made with ❤️ by <span className="text-green-400 font-semibold">Sanket Panchal</span></p>
    </footer>
  );
}
