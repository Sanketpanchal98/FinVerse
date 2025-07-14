import React, { useState } from "react";
import { useSelector } from "react-redux";

const CustomDropdown = ({ options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

    const {theme } = useSelector(state => state.theme)
    
  return (
    <div className="relative inline-block w-64">
      {/* Selected Option */}
      <div
        className={`${theme ? "bg-light-surface text-light-text" : "bg-dark-background text-dark-text"} text-gray-800 dark:text-white px-4 py-2 rounded shadow cursor-pointer flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${theme ? "bg-light-surface text-light-text" : "bg-dark-background text-dark-text"}`}>{selected || "Select an option"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Options List */}
      {isOpen && (
        <ul className={`absolute z-10 w-full ${theme ? "bg-light-surface text-light-text" : "bg-dark-background text-dark-text"} border mt-1 rounded shadow-md max-h-48 overflow-y-auto`}>
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-green-100 hover:text-white dark:hover:bg-green-700 flex gap-4 cursor-pointer transition"
              onClick={() => {
                setSelected(option.cat);
                setIsOpen(false);
              }}
            >
                <i className={`${option.icon}`}></i>
              {option.cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
