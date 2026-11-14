'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiPlay,
  FiPlayCircle,
  FiCheckCircle,
  FiVideo,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiShare2,
  FiAward,
  FiLayers,
  FiRefreshCw,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import Button from '@/components/Button';
import { formatVideoEmbedUrl, formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function CoursePlayerView({ courseId }) {
  const searchParams = useSearchParams();
  const { user, saveProgress } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeLectureIndex, setActiveLectureIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success && data?.data) {
          const loadedCourse = data.data;
          setCourse(loadedCourse);

          const sorted = [...(loadedCourse.lectures || [])].sort((a, b) =>
            (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' })
          );

          // Determine initial active lecture (from URL query or student's saved continuation)
          const targetLectureId = searchParams?.get('lectureId');
          const targetLectureIndex = searchParams?.get('lecture');

          let initialIndex = 0;
          if (targetLectureId) {
            const foundIdx = sorted.findIndex((l) => l._id === targetLectureId);
            if (foundIdx !== -1) initialIndex = foundIdx;
          } else if (targetLectureIndex !== null && !isNaN(Number(targetLectureIndex))) {
            const num = Number(targetLectureIndex);
            if (num >= 0 && num < sorted.length) initialIndex = num;
          } else {
            // Check student saved progress for this course
            const savedStudentProgress = user?.lastProgress;
            if (savedStudentProgress?.courseId === loadedCourse._id && savedStudentProgress?.lectureId) {
              const foundSavedIdx = sorted.findIndex((l) => l._id === savedStudentProgress.lectureId);
              if (foundSavedIdx !== -1) initialIndex = foundSavedIdx;
            } else {
              try {
                const localKey = user?.email
                  ? `datapollex_progress_${user.email}`
                  : 'datapollex_progress_guest';
                const localData = JSON.parse(localStorage.getItem(localKey) || '{}');
                if (localData?.courseId === loadedCourse._id && localData?.lectureId) {
                  const foundLocalIdx = sorted.findIndex((l) => l._id === localData.lectureId);
                  if (foundLocalIdx !== -1) initialIndex = foundLocalIdx;
                }
              } catch (e) {}
            }
          }

          setActiveLectureIndex(initialIndex);
        } else {
          setError(data?.message || 'Course not found or unavailable');
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to connect to the server. Please check your backend connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId, searchParams, user?.lastProgress?.courseId, user?.lastProgress?.lectureId]);

  const rawLectures = course?.lectures || [];
  const lectures = [...rawLectures].sort((a, b) =>
    (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' })
  );
  const hasLectures = lectures.length > 0;
  const activeLecture = hasLectures ? lectures[activeLectureIndex] : null;

  // Auto-record progress when active lecture changes
  useEffect(() => {
    if (course && activeLecture) {
      saveProgress?.({
        courseId: course._id,
        courseTitle: course.title,
        courseThumbnail: course.thumbnailUrl,
        lectureId: activeLecture._id,
        lectureTitle: activeLecture.title,
        lectureIndex: activeLectureIndex,
        totalLectures: lectures.length,
      });
    }
  }, [course?._id, activeLecture?._id, activeLectureIndex, lectures.length]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNext = () => {
    if (activeLectureIndex < lectures.length - 1) {
      setActiveLectureIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeLectureIndex > 0) {
      setActiveLectureIndex((prev) => prev - 1);
    }
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800/80 rounded animate-pulse" />

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video w-full rounded-2xl bg-slate-200 dark:bg-slate-800/80 animate-pulse" />
              <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800/80 rounded animate-pulse" />
              <div className="h-20 w-full bg-slate-200 dark:bg-slate-800/80 rounded-2xl animate-pulse" />
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-4">
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-800/80 rounded-xl animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 w-full bg-slate-200 dark:bg-slate-800/80 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !course) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Course Unavailable
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {error || 'The requested course could not be located or may have been removed.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/courses" variant="primary" size="md">
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="md"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isFree = Number(course.price ?? 0) === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header / Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <Button
              href="/courses"
              variant="secondary"
              size="sm"
              className="px-3 py-1.5"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Courses</span>
            </Button>
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 max-w-[200px] sm:max-w-md truncate">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              <FiShare2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <span className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs font-black text-sky-600 dark:text-sky-300">
              {formatPrice(course.price)}
            </span>
          </div>
        </div>

        {/* Main Content Layout: Player (2 cols) + Playlist Sidebar (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Video Player Stage + Lecture Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* 16:9 Video Player Box */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-950 shadow-2xl shadow-sky-500/5 group">
              {activeLecture ? (
                <iframe
                  key={activeLecture._id || activeLecture.videoUrl}
                  src={formatVideoEmbedUrl(activeLecture.videoUrl)}
                  title={activeLecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-radial from-slate-900 to-slate-950">
                  <div className="w-16 h-16 rounded-2xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                    <FiVideo className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No Lectures Available Yet</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                    Lectures for this course have not been uploaded by the academy instructor yet.
                  </p>
                </div>
              )}
            </div>

            {/* Lecture Navigation & Controls Bar */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-400/10 border border-sky-400/30 text-sky-600 dark:text-sky-300">
                      Lesson {hasLectures ? activeLectureIndex + 1 : 0} of {lectures.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Free Classroom Access
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {activeLecture?.title || course.title}
                  </h1>
                </div>

                {/* Prev / Next Buttons */}
                {hasLectures && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handlePrev}
                      disabled={activeLectureIndex <= 0}
                      className="px-3.5 py-2 text-xs"
                      title="Previous Lesson"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNext}
                      disabled={activeLectureIndex >= lectures.length - 1}
                      className="px-3.5 py-2 text-xs"
                      title="Next Lesson"
                    >
                      <span className="hidden sm:inline">Next Lesson</span>
                      <FiChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Active Lecture Description */}
              {activeLecture?.description && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    Lesson Overview
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeLecture.description}
                  </p>
                </div>
              )}
            </div>

            {/* Course Overview Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-500">
                  <FiBookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    About This Course
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    DataPollex Academy • Industrial Training Curriculum
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>

              {/* Highlights Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-sky-500 uppercase tracking-wider">
                    <FiVideo className="w-3.5 h-3.5" />
                    <span>Total Lessons</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    {lectures.length} Lectures
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-500 uppercase tracking-wider">
                    <FiAward className="w-3.5 h-3.5" />
                    <span>Access Mode</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    Self-Paced
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-500 uppercase tracking-wider">
                    <FiLayers className="w-3.5 h-3.5" />
                    <span>Curriculum Tier</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    {isFree ? 'Community Free' : 'Pro Industrial'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Course Curriculum / Playlist Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-sky-400" />
                    <span>Curriculum Playlist</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any lesson to watch
                  </p>
                </div>

                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-sky-400/10 border border-sky-400/30 text-sky-600 dark:text-sky-300">
                  {lectures.length} Lessons
                </span>
              </div>

              {/* Lecture Playlist Items */}
              <div className="p-3 space-y-2 max-h-[580px] overflow-y-auto">
                {hasLectures ? (
                  lectures.map((lecture, idx) => {
                    const isActive = idx === activeLectureIndex;

                    return (
                      <button
                        key={lecture._id || idx}
                        onClick={() => setActiveLectureIndex(idx)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer group ${isActive
                          ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/40 shadow-sm'
                          : 'border-slate-200/80 dark:border-slate-800/80 hover:border-sky-400/50 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                      >
                        {/* Play / Number Icon */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${isActive
                            ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/30 scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-sky-400/20 group-hover:text-sky-500'
                            }`}
                        >
                          {isActive ? (
                            <FiPlay className="w-4 h-4 fill-slate-950" />
                          ) : (
                            <span>{String(idx + 1).padStart(2, '0')}</span>
                          )}
                        </div>

                        {/* Title & Status */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs sm:text-sm font-bold line-clamp-2 transition-colors ${isActive
                                ? 'text-sky-700 dark:text-sky-300'
                                : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-300'
                                }`}
                            >
                              {lecture.title}
                            </span>
                          </div>

                          {isActive && (
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                Now Playing
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      No video lectures added yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar Footer Info */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Lifetime Access
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    DataPollex LMS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

