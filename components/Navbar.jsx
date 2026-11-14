'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAcademicCap } from 'react-icons/hi2';
import { FiSearch, FiMenu, FiX, FiArrowRight, FiBookOpen, FiLogOut } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Bootcamp', href: '/bootcamp' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs'
        : 'bg-white/60 dark:bg-slate-950/60 backdrop-blur-xs border-b border-slate-100 dark:border-slate-800/40'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20 group-hover:scale-105 group-hover:bg-sky-300 transition-all duration-200">
              <HiAcademicCap className="w-6 h-6 transform group-hover:-rotate-6 transition-transform duration-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                DataPollex
              </span>
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 mt-1 tracking-[0.22em] uppercase">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 text-xs lg:text-sm font-bold rounded-lg transition-colors duration-200 focus:outline-hidden ${isActive
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-sky-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Search Box (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-1.5 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                /
              </kbd>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-400/40 bg-sky-400/10 text-sky-700 dark:text-sky-300 hover:bg-sky-400/20 transition-all"
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <FiLogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors focus:outline-hidden"
              >
                Sign In
              </Link>
            )}

            {/* CTA Explore Courses */}
            <Link
              href="/courses"
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-black text-slate-950 rounded-lg bg-sky-400 hover:bg-sky-300 active:scale-95 shadow-md shadow-sky-400/20 transition-all duration-200 focus:outline-hidden"
            >
              <span>Explore</span>
              <FiArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="inline-flex md:hidden items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors focus:outline-hidden"
            >
              {mobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-4 pt-3 pb-6 space-y-3">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400/40"
                />
              </div>

              <div className="flex flex-col space-y-1 pt-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${isActive
                        ? 'bg-sky-400/10 text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-400/10 border border-sky-400/30 transition-colors"
                    >
                      {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/courses"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-md shadow-sky-400/20 transition-all"
                >
                  <FiBookOpen className="w-4 h-4" />
                  <span>Start Learning</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
