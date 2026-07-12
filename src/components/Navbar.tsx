import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Agents', path: '/agents' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Docs', path: '/docs' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? 'bg-surface-2/90 backdrop-blur-xl border-edge shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)]' : 'glass-premium border-edge'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2.5 group">
                        <img
                            src="/removed_bglogo.png"
                            alt="VIDVAS AI"
                            className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-ink font-outfit font-bold text-2xl bg-gradient-to-r from-ink to-ink-2 bg-clip-text text-transparent">
                            VIDVAS AI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-xl text-base font-medium font-sora transition-all duration-300 ${
                                    isActive(link.path)
                                        ? 'bg-gradient-to-r from-electric-blue to-vivid-purple text-white shadow-glow-md'
                                        : 'text-ink-2 hover:text-ink hover:bg-surface-3'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-ink-2 hover:text-ink hover:bg-surface-3 border border-edge transition-all duration-300"
                        >
                            {theme === 'dark' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364-1.06-1.06M6.697 6.697l-1.06-1.06m12.727 0-1.06 1.06M6.697 17.303l-1.06 1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            )}
                        </button>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-ink-2 hover:text-ink transition-colors font-sora"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-gradient-to-r from-electric-blue to-vivid-purple text-white text-sm font-semibold rounded-xl hover:shadow-glow-md transition-all font-sora"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile controls */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-ink-2 hover:text-ink hover:bg-surface-3 border border-edge transition-all duration-300"
                        >
                            {theme === 'dark' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364-1.06-1.06M6.697 6.697l-1.06-1.06m12.727 0-1.06 1.06M6.697 17.303l-1.06 1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-ink-2 hover:text-ink focus:outline-none p-2 rounded-xl hover:bg-surface-3 transition-all duration-200"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden pb-4">
                    <div className="px-4 pt-2 pb-3 space-y-2 glass-premium rounded-2xl border border-edge mx-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 text-base font-medium font-sora rounded-xl transition-all duration-300 ${
                                    isActive(link.path)
                                        ? 'bg-gradient-to-r from-electric-blue to-vivid-purple text-white shadow-glow-md'
                                        : 'text-ink-2 hover:text-ink hover:bg-surface-3'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-2 space-y-2">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-center text-base font-medium text-ink-2 hover:text-ink transition-colors font-sora"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-3 bg-gradient-to-r from-electric-blue to-vivid-purple text-white text-base font-semibold rounded-xl hover:shadow-glow-md transition-all text-center font-sora"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
