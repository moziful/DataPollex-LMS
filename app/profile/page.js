'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiLock,
  FiCamera,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiShield,
  FiClock,
} from 'react-icons/fi';
import { HiAcademicCap, HiShieldCheck } from 'react-icons/hi2';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

// Preset avatar options for instant selection
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, updateUserProfile } = useAuth();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Pre-fill user data when loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ type: 'error', text: 'Full name cannot be blank.' });
      return;
    }

    try {
      setSaving(true);
      const res = await updateUserProfile(name.trim(), avatar.trim());
      if (res.success) {
        setFeedback({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Network error connecting to backend.' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const role = user.role === 'admin' ? 'admin' : 'student';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={role === 'admin' ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-500 transition-colors"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>{role === 'admin' ? 'Back to Admin Panel' : 'Back to Dashboard'}</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Profile & Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Manage your personal credentials, identity, and profile avatar.
            </p>
          </div>

          <div>
            {role === 'admin' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
                <HiShieldCheck className="w-4 h-4" />
                <span>Admin Account</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <HiAcademicCap className="w-4 h-4" />
                <span>Verified Student</span>
              </span>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              {feedback.type === 'success' ? (
                <FiCheck className="w-4 h-4 shrink-0 text-emerald-500" />
              ) : (
                <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              )}
              <span>{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========================================================= */}
          {/* SECTION 1: PROFILE PHOTO / AVATAR SELECTION               */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Profile Photo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your profile picture is shown in the navigation bar and comments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Active Avatar Preview */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-sky-400/30 shadow-lg bg-slate-950 shrink-0">
                <Image
                  src={avatar || AVATAR_PRESETS[0]}
                  alt="Profile Avatar"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Preset Avatar Selection Grid */}
              <div className="space-y-2 flex-1 w-full">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Choose from Preset Avatars
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {AVATAR_PRESETS.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(presetUrl)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden transition-all cursor-pointer ${
                        avatar === presetUrl
                          ? 'ring-4 ring-sky-400 scale-105 shadow-md'
                          : 'opacity-70 hover:opacity-100 hover:scale-105 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <Image
                        src={presetUrl}
                        alt={`Avatar preset ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Or Enter Custom Image URL:
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-sky-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: PERSONAL INFORMATION                           */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your display name. Email address is tied to your account identity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name Input (Editable) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5 text-sky-500" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all font-semibold"
                />
              </div>

              {/* Email Address Input (Disabled / Readonly) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FiMail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-950/50 px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: UPDATE PASSWORD (LOCKED PER SPECIFICATION)     */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-slate-400" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Update Password
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ensure your account uses a strong, unique password.
                </p>
              </div>

              {/* Locked Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FiLock className="w-3.5 h-3.5" />
                <span>Locked • Will add later</span>
              </div>
            </div>

            {/* Disabled Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 opacity-60 pointer-events-none">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Current Password</label>
                <input
                  type="password"
                  disabled
                  value="••••••••••••"
                  className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-4 py-2.5 text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">New Password</label>
                <input
                  type="password"
                  disabled
                  value="••••••••••••"
                  className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-4 py-2.5 text-slate-400"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              Self-service password rotation is currently locked for this evaluation release.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href={role === 'admin' ? '/admin' : '/dashboard'}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Cancel
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-black shadow-md shadow-sky-400/20"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

