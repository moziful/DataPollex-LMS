'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiPlay,
  FiPlayCircle,
  FiBookOpen,
  FiVideo,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
  FiAward,
  FiCompass,
  FiRefreshCw,
  FiUser,
  FiLogOut,
  FiLayers,
} from 'react-icons/fi';
import { HiSparkles, HiAcademicCap } from 'react-icons/hi2';
import Button from '@/components/Button';
import CourseCard, { CourseCardSkeleton } from '@/components/CourseCard';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect student dashboard route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch courses from backend API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setCoursesError(null);
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (!res.ok) {
          throw new Error('Failed to fetch courses from backend');
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Sort newest first
          const sorted = [...data.data].sort((a, b) => {
            const dateDiff = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            if (dateDiff !== 0) return dateDiff;
            return (b._id || '').localeCompare(a._id || '');
          });
          setCourses(sorted);
        }
      } catch (err) {
        console.error('Error loading dashboard courses:', err);
        setCoursesError('Unable to load courses. Please check your backend connection.');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Retrieve current active progress for this student
  const activeProgress = (() => {
    if (!mounted) return null;
    if (user?.lastProgress && user.lastProgress.courseId) {
      return user.lastProgress;
    }
    try {
      const storageKey = user?.email
        ? `datapollex_progress_${user.email}`
        : 'datapollex_progress_guest';
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return null;
  })();

  // Find course matching current progress if available
  const continuedCourse = activeProgress
    ? courses.find((c) => c._id === activeProgress.courseId) || {
      _id: activeProgress.courseId,
      title: activeProgress.courseTitle || 'Active Course',
      thumbnailUrl: activeProgress.courseThumbnail || '',
    }
    : null;

  if (authLoading || (!mounted && !user)) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Loading student workspace...</p>
        </div>
      </div>
    );
  }

  const studentName = user?.name || (user?.email ? user.email.split('@')[0] : 'Student');
  const resumeUrl = activeProgress
    ? `/courses/${activeProgress.courseId}${activeProgress.lectureId ? `?lectureId=${activeProgress.lectureId}` : `?lecture=${activeProgress.lectureIndex ?? 0}`
    }`
    : '/courses';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ========================================================= */}
        {/* TOP WELCOME & STUDENT HEADER                              */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-10 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-sky-400/30 bg-sky-400/10 text-sky-700 dark:text-sky-300">
                <HiAcademicCap className="w-4 h-4 text-sky-400" />
                <span>DataPollex Academy • Student Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome back, <span className="text-sky-600 dark:text-sky-400">{studentName}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Pick up your lessons right where you left off, explore video curriculums, and master modern full-stack development.
              </p>
            </div>

            {/* Profile Action Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.email}</p>
                <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : 'Verified Student'}
                </p>
              </div>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-xl text-xs font-black border border-sky-400/40 bg-sky-400/10 text-sky-600 dark:text-sky-300 hover:bg-sky-400/20 transition-all"
                >
                  Admin Panel
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500/40 transition-colors cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Tracks</span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{courses.length}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Learning Mode</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-500">Self-Paced</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Classroom Access</span>
              <p className="text-xl sm:text-2xl font-black text-sky-500">Unrestricted</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Sync</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 pt-1">
                {activeProgress?.updatedAt
                  ? new Date(activeProgress.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Ready'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* "CONTINUE WHERE YOU LEFT OFF" - EXACT LECTURE RESUME CARD */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <FiPlayCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Continue Where You Left Off
              </h2>
            </div>
          </div>

          {activeProgress && continuedCourse ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-sky-400/40 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 dark:from-sky-950/30 dark:via-slate-900/90 dark:to-slate-900 p-6 sm:p-8 shadow-xl shadow-sky-500/5 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Course Thumbnail with Live Video Badge */}
                <div className="lg:col-span-5 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
                  <Image
                    src={activeProgress.courseThumbnail || continuedCourse.thumbnailUrl || '/placeholder.png'}
                    alt={activeProgress.courseTitle || 'Current Course'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <Link
                      href={resumeUrl}
                      className="w-14 h-14 rounded-2xl bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform"
                    >
                      <FiPlay className="w-6 h-6 ml-0.5" />
                    </Link>
                  </div>

                  {/* Now Watching Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-sky-400 border border-white/10 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      In Progress
                    </span>
                  </div>
                </div>

                {/* Course & Exact Lecture Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                      Curriculum Track
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {activeProgress.courseTitle || continuedCourse.title}
                    </h3>
                  </div>

                  {/* Exact Lecture Box */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span>Exact Lecture:</span>
                      <span className="text-sky-600 dark:text-sky-400 font-mono">
                        Lesson {(activeProgress.lectureIndex ?? 0) + 1}
                        {activeProgress.totalLectures ? ` of ${activeProgress.totalLectures}` : ''}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 leading-snug">
                      {activeProgress.lectureTitle || `Lecture ${(activeProgress.lectureIndex ?? 0) + 1}`}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={resumeUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 text-slate-950 hover:bg-sky-300 active:scale-95 text-xs sm:text-sm font-black transition-all shadow-md shadow-sky-400/20 cursor-pointer"
                    >
                      <FiPlay className="w-4 h-4 fill-slate-950" />
                      <span>Resume Lecture</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/courses/${activeProgress.courseId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      <FiLayers className="w-4 h-4" />
                      <span>Full Syllabus</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-500">
                <FiCompass className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  No Active Lesson in Progress Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Select any course from the catalog below to start watching video lectures. Your exact place will be automatically saved here!
                </p>
              </div>
              <div>
                <Button href="/courses" variant="primary" size="md">
                  <span>Browse All Courses</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* EXPLORE ALL COURSES CATALOG PREVIEW                        */}
        {/* ========================================================= */}
        <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                All Available Curriculums
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Explore production-ready tracks structured with Models, Views, and Controllers.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 hover:underline"
            >
              <span>Open Catalog & Filters</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Loading Skeletons */}
          {loadingCourses && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          )}

          {/* Error Banner */}
          {!loadingCourses && coursesError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-xs font-bold text-red-500">
              <p>{coursesError}</p>
            </div>
          )}

          {/* Course Grid */}
          {!loadingCourses && !coursesError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

