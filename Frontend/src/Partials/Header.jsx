import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toogleTheme } from '../Slices/ThemeSlice';
import { Link } from 'react-router-dom';
import { Link as ReactScroll } from 'react-scroll';

const Header = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector(state => state.user.user);  

  return (
    <div
      className={`w-full h-24 fixed top-0 z-50 transition-all duration-500 ${theme ? 'bg-light-background text-light-text' : 'bg-dark-background text-dark-text'
        }`}
    >
      <div className="w-full h-full px-6 md:px-12 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src="public/Logo/FinVerse_New.png"
            alt="FinVerse Logo"
            className="w-12 rounded-full"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-green-400">Fin</span>Verse
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`font-semibold border-b-2 border-transparent hover:border-current transition-all duration-300 ${theme ? 'hover:text-black' : 'hover:text-white'
              }`}
          >
            Home
          </Link>
          <ReactScroll
            to="features"
            smooth={true}
            offset={-80} // adjust based on your header height
            className={`cursor-pointer font-semibold border-b-2 border-transparent hover:border-current transition-all duration-300 delay-500 ${theme ? 'hover:text-black' : 'hover:text-white'
              }`}
          >
            Features
          </ReactScroll>
          <Link
            to="/dashboard"
            className={`font-semibold border-b-2 border-transparent hover:border-current transition-all duration-300 ${theme ? 'hover:text-black' : 'hover:text-white'
              }`}
          >
            Dashboard
          </Link>
          <a
            href="#contact"
            className={`font-semibold border-b-2 border-transparent hover:border-current transition-all duration-300 ${theme ? 'hover:text-black' : 'hover:text-white'
              }`}
          >
            Contact Us
          </a>
          <button
            className="border-2 py-2 px-3 border-slate-300 rounded-xl hover:scale-105 transition-transform"
            onClick={() => dispatch(toogleTheme())}
          >
            {!theme ? (
              <i className="ri-sun-line"></i>
            ) : (
              <i className="ri-moon-fill"></i>
            )}
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => dispatch(toogleTheme())}
            className="border-2 py-2 px-3 border-slate-300 rounded-xl hover:scale-105 transition-transform"
          >
            {!theme ? (
              <i className="ri-sun-line"></i>
            ) : (
              <i className="ri-moon-fill"></i>
            )}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className={`md:hidden flex flex-col items-center gap-4 py-4 transition-all duration-500 ${theme ? 'bg-light-background text-light-text' : 'bg-dark-background text-dark-text'
          }`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Login/Register</Link>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact Us</a>
        </div>
      )}
    </div>
  );
};

export default Header;
