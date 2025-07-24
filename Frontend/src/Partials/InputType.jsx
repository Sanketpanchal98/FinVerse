import React, { useState } from 'react';

const InputType = ({ 
  value, 
  type = "text", 
  isEdit = false, 
  onChange, 
  placeholder = "", 
  label = "", 
  icon = "", 
  required = false, 
  disabled = false,
  error = "",
  className = "",
  theme = true,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (onChange && isEdit) {
      onChange(e.target.value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isReadOnly = !isEdit || disabled;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
          theme ? 'text-gray-700' : 'text-gray-300'
        }`}>
          {icon && <i className={`${icon} text-base`}></i>}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          type={inputType}
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={isReadOnly}
          disabled={disabled}
          placeholder={isEdit ? placeholder : ''}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-base
            ${isReadOnly 
              ? `cursor-not-allowed ${theme ? 'bg-gray-100 text-gray-500 border-gray-300' : 'bg-gray-800 text-gray-400 border-gray-600'}` 
              : `cursor-text ${theme ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-900 text-white border-gray-600'}`
            }
            ${!isReadOnly && isFocused 
              ? `${theme ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-400 ring-2 ring-blue-900'}` 
              : ''
            }
            ${!isReadOnly && !isFocused && !error
              ? `${theme ? 'hover:border-gray-400' : 'hover:border-gray-500'}` 
              : ''
            }
            ${error 
              ? `${theme ? 'border-red-500 ring-2 ring-red-200' : 'border-red-400 ring-2 ring-red-900'}` 
              : ''
            }
            ${type === 'password' ? 'pr-12' : ''}
            focus:outline-none
          `}
          {...props}
        />

        {/* Password Toggle Button */}
        {type === 'password' && isEdit && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors duration-200 ${
              theme 
                ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
          </button>
        )}

        {/* Read-only indicator */}
        {isReadOnly && !disabled && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            theme ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <i className="ri-lock-line text-lg"></i>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
          <i className="ri-error-warning-line"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text for Read-only */}
      {isReadOnly && !error && (
        <div className={`mt-2 text-xs ${theme ? 'text-gray-500' : 'text-gray-400'}`}>
          <i className="ri-information-line mr-1"></i>
          Click "Edit" to modify this field
        </div>
      )}
    </div>
  );
};

export default InputType;