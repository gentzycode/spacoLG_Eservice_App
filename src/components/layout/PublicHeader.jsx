import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../../assets/logo-bayelsa.png';

const PublicHeader = ({ showLoginButton = true }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/fee-schedule', label: 'Fee Schedule' },
        { path: '/services', label: 'Services' },
    ];

    const isActive = (path) => location.pathname === path;

    const getLinkClasses = (path) => {
        const base = 'px-4 py-3 text-sm font-medium transition-all duration-200 rounded-md';
        if (isActive(path)) {
            return `${base} bg-[#3B78BD] text-white shadow-sm`;
        }
        return `${base} text-gray-700 hover:bg-gray-50 hover:text-[#3B78BD]`;
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center gap-4 flex-shrink-0">
                        <img
                            src={Logo}
                            alt="Yenagoa LG Logo"
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div className="hidden md:block">
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                Yenagoa E-Services
                            </h1>
                            <p className="text-xs text-gray-500">
                                Local Government Revenue Portal
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={getLinkClasses(item.path)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="https://lg.anambrastate.gov.ng/about"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#3B78BD] transition-colors"
                        >
                            FAQ
                        </a>
                        {showLoginButton && (
                            <Link
                                to="/auth"
                                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#3B78BD] to-[#2d5f94] rounded-full hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <FaTimes className="h-6 w-6" />
                        ) : (
                            <FaBars className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={getLinkClasses(item.path)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <a
                                href="https://lg.anambrastate.gov.ng/about"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                FAQ
                            </a>
                            {showLoginButton && (
                                <Link
                                    to="/auth"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-[#3B78BD] to-[#2d5f94] rounded-md hover:shadow-lg transition-all"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default PublicHeader;
