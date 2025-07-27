import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile_Nav = () => {
    const user = useSelector((state) => state.user.user);
    const theme = useSelector((state) => state.theme.theme);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navItems = [
        { to: '/dashboard', icon: 'ri-add-line', label: 'Add Expense', shortLabel: 'Add' },
        { to: '/dashboard/visualization', icon: 'ri-bar-chart-box-line', label: 'Visualization', shortLabel: 'Charts' },
        { to: '/dashboard/autopay', icon: 'ri-reset-left-line', label: 'AutoPay Setup', shortLabel: 'AutoPay' },
        { to: '/dashboard/goal', icon: 'ri-focus-line', label: 'Goals', shortLabel: 'Goals' },
        { to: '/dashboard/calculators', icon: 'ri-calculator-line', label: 'Calculators', shortLabel: 'Calc' },
        { to: '/dashboard/settings', icon: 'ri-tools-fill', label: 'Settings', shortLabel: 'Settings' }
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex lg:w-[300px] xl:w-[320px] p-6 rounded-xl shadow-md ${
                theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'
            } transition-all duration-500 flex-col h-[640px]`}>
                <div className="flex flex-col items-center gap-3">
                    <img
                        src={user?.avatar || `/ProfilePhotos/${user?.data?.avatar}.png`}
                        alt="profile"
                        className="w-32 h-32 rounded-full border-2 border-green-500 object-cover"
                    />
                    <h2 className="text-xl font-bold">{user?.data?.name || 'Anonymous'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{user?.data?.email || 'Email not set!'}</p>
                    <div className="mt-4 w-full">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item, index) => (
                                <Link
                                    key={index}
                                    className={`w-full text-left px-4 py-2 rounded hover:text-white ${theme ? 'hover:bg-green-100' : ' hover:bg-green-700'} transition-all`}
                                    to={item.to}
                                >
                                    <i className={item.icon}></i> {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Top Navigation */}
            <div className={`lg:hidden w-full mb-4 rounded-xl shadow-md ${
                theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'
            } transition-all duration-500`}>
                {/* Mobile Profile Header */}
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatar || `/ProfilePhotos/${user?.data?.avatar}.png`}
                            alt="profile"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-green-500 object-cover"
                        />
                        <div>
                            <h2 className="text-sm sm:text-base font-bold">{user?.data?.name || 'Anonymous'}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-300 hidden sm:block">{user?.data?.email || 'Email not set!'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-lg ${theme ? "hover:bg-gray-100" : "dark:hover:bg-gray-700"} transition-colors`}
                    >
                        <i className={`text-xl ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`overflow-hidden transition-all duration-300 ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } lg:hidden`}>
                    <nav className="flex flex-col gap-1 p-4 pt-0">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                className={`w-full text-left px-4 py-3 rounded hover:text-white ${theme ? 'hover:bg-green-100' : 'dark:hover:bg-green-700'} transition-all`}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <i className={item.icon}></i> 
                                <span className="ml-2 sm:inline">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Tablet Horizontal Navigation (md screens) */}
                <div className="hidden md:flex lg:hidden px-4 pb-4">
                    <nav className="flex flex-wrap gap-2 w-full">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                className="flex-1 min-w-0 text-center px-3 py-2 rounded hover:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-all text-sm"
                                to={item.to}
                            >
                                <i className={`${item.icon} block sm:inline`}></i>
                                <span className="block sm:inline sm:ml-2 text-xs sm:text-sm">{item.shortLabel}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Profile_Nav;