import React, { useState } from "react";
import { useSelector } from "react-redux";

const CustomDropdown = ({ options, selected, setSelected, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useSelector((state) => state.theme.theme);

    const selectedOption = options.find(opt => opt.cat === selected);

    return (
        <div className="relative">
            <label className={`block text-xs font-medium mb-1 ${theme ? "text-light-text" : "text-dark-text"}`}>
                {label}
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 min-w-[120px] ${
                    theme 
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" 
                        : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
                }`}
            >
                {selectedOption?.icon && <i className={`${selectedOption.icon} text-sm`} />}
                <span className="text-sm capitalize">{selected}</span>
                <i className={`ri-arrow-down-s-line text-sm ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className={`absolute top-full left-0 mt-1 w-full rounded-lg border shadow-lg z-10 ${
                    theme 
                        ? "bg-white border-gray-200" 
                        : "bg-gray-800 border-gray-600"
                }`}>
                    {options.map((option) => (
                        <button
                            key={option.cat}
                            onClick={() => {
                                setSelected(option.cat);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-opacity-80 transition-colors ${
                                selected === option.cat
                                    ? theme ? "bg-blue-50 text-blue-600" : "bg-blue-900 text-blue-300"
                                    : theme ? "hover:bg-gray-50" : "hover:bg-gray-700"
                            }`}
                        >
                            <i className={`${option.icon} text-sm`} />
                            <span className="text-sm capitalize">{option.cat}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
