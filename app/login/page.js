'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdErrorOutline,
  MdCode,
  MdVerified,
  MdPlayCircleFilled,
} from 'react-icons/md';
import { FiKey, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, user, loading: authLoading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }

      setLoading(true);
      const res = await register(formData.name, formData.email, formData.password);
      setLoading(false);

      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } else {
      setLoading(true);
      const res = await login(formData.email, formData.password);
      setLoading(false);

      if (res.success) {
        if (res.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    }
  };

  const handleQuickFillAdmin = () => {
    setIsSignUp(false);
    setFormData({
      ...formData,
      email: 'admin@datapollex.com',
      password: 'Admin@1234',
    });
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col lg:grid lg:grid-cols-12 bg-white dark:bg-slate-950 transition-colors">
      {/* ============================================================ */}
      {/* LEFT COLUMN: AUTHENTICATION FORM (5 / 12 cols on desktop)    */}
      {/* ============================================================ */}
      <div className="flex-1 lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-16">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Headline */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isSignUp
                ? 'Join DataPollex Academy to access courses and video lectures.'
                : 'Enter your credentials to access your classroom and courses.'}
            </p>
          </div>

          {/* Demo Admin Helper Banner (Only on Sign In) */}
          {!isSignUp && (
            <div className="rounded-2xl border border-sky-400/20 bg-sky-50/60 dark:bg-sky-950/20 p-3.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300">
                  <FiKey className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin Evaluation Login</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  admin@datapollex.com
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="px-2.5 py-1 rounded-lg border border-sky-400/40 bg-sky-400 text-slate-950 hover:bg-sky-300 text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              >
                Auto-Fill
              </button>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Sign Up: Full Name */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <MdPerson className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <MdEmail className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-3 pl-11 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="h-4 w-4" />
                  ) : (
                    <MdVisibility className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <MdLock className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-3 pl-11 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff className="h-4 w-4" />
                    ) : (
                      <MdVisibility className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-500"
                >
                  <MdErrorOutline className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="flex-1 leading-snug">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full justify-center text-sm font-black py-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Student Account' : 'Sign In'}</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Bottom Switcher & Back Link */}
          <div className="pt-2 text-center space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isSignUp ? (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError('');
                    }}
                    className="font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                    }}
                    className="font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    Sign up as student
                  </button>
                </>
              )}
            </p>

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: BRAND SHOWCASE & HIGHLIGHTS (7 / 12 on desktop) */}
      {/* ============================================================ */}
      <div className="hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-l border-slate-800">
        {/* Ambient Radial Lights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Feature Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <HiAcademicCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">DataPollex Academy</h3>
              <p className="text-[11px] text-slate-400">Industrial Training Recruitment Track</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <MdVerified className="w-3.5 h-3.5" />
            <span>MERN & Full-Stack</span>
          </span>
        </div>

        {/* Middle Core Statement & Cards */}
        <div className="relative z-10 space-y-8 my-auto py-8">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
              Production-Grade Skills Built for Modern Engineers.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore hands-on curriculums structured with Models, Views, and Controllers, secure JWT authentication, and interactive YouTube video classroom integration.
            </p>
          </div>

          {/* Three Feature Highlights */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-400">
                <MdPlayCircleFilled className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black">Curated Videos</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Step-by-step video classroom with playlist progression.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-400/20 flex items-center justify-center text-indigo-400">
                <MdCode className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black">MVC Architecture</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Clean backend controllers, schema models, and error middleware.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                <MdVerified className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black">Self-Paced Track</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Learn anytime with seamless lesson switching and state memory.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial / Location Info */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Platform Active • Mirpur 10, Dhaka</span>
          </div>

          <span className="font-semibold text-slate-500">
            © 2026 DataPollex Ltd.
          </span>
        </div>
      </div>
    </div>
  );
}
