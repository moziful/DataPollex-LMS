'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAcademicCap, HiShieldCheck } from 'react-icons/hi2';
import { FiMenu, FiX, FiArrowRight, FiBookOpen, FiLogOut } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    ...(mounted && isAuthenticated
      ? user?.role === 'admin'
        ? [{ name: 'Admin Panel', href: '/admin' }]
        : [{ name: 'Dashboard', href: '/dashboard' }]
      : []),
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
  ];

  const userAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsProfileOpen(false);
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
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-xs lg:text-sm font-bold rounded-lg transition-colors duration-200 focus:outline-hidden ${isActive
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Subtle Divider */}
            <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-800/80 mr-1" />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Authentication Section (Hydration-safe) */}
            {mounted && isAuthenticated ? (
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {/* User Avatar + Name Trigger */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1 pr-3 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-sky-400/50 dark:hover:border-sky-400/50 transition-all cursor-pointer shadow-xs focus:outline-hidden"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-sky-400/40 shrink-0">
                    <Image
                      src={userAvatar}
                      alt={user?.name || 'User Profile'}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 max-w-[130px] truncate text-left">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </button>

                {/* Hover Profile Pop-up Modal */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c1322] p-4 shadow-2xl z-50 text-left"
                    >
                      {/* Name & Role Area (Clicking navigates to Profile page) */}
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block rounded-xl p-2.5 -m-1 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors group/profile cursor-pointer"
                        title="Manage Profile & Settings"
                      >
                        <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover/profile:text-sky-500 transition-colors truncate">
                          {user?.name || (user?.role === 'admin' ? 'DataPollex Admin' : 'Student')}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                          {user?.email}
                        </p>
                        <div className="mt-2.5">
                          {user?.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase border border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400">
                              <HiShieldCheck className="w-3.5 h-3.5" />
                              <span>ADMIN</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                              <HiAcademicCap className="w-3.5 h-3.5" />
                              <span>STUDENT</span>
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Divider */}
                      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-3" />

                      {/* Full-width Sign Out Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black transition-all cursor-pointer"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors focus:outline-hidden"
              >
                Sign In
              </Link>
            )}

            {/* CTA Explore Courses (Hidden when signed in) */}
            {mounted && !isAuthenticated && (
              <Link
                href="/courses"
                className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-black text-slate-950 rounded-lg bg-sky-400 hover:bg-sky-300 active:scale-95 shadow-md shadow-sky-400/20 transition-all duration-200 focus:outline-hidden"
              >
                <span>Explore</span>
                <FiArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
              </Link>
            )}

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
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
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
                {mounted && isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-sky-400/40 shrink-0">
                          <Image
                            src={userAvatar}
                            alt={user?.name || 'User'}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${user?.role === 'admin'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                        }`}>
                        {user?.role === 'admin' ? 'ADMIN' : 'STUDENT'}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/courses"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-md shadow-sky-400/20 transition-all"
                    >
                      <FiBookOpen className="w-4 h-4" />
                      <span>Start Learning</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
