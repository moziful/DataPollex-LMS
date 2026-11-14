'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiVideo,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

// Seeded course data for Hero Carousel (dynamically replaceable via props from backend)
const DEFAULT_HERO_COURSES = [
  {
    _id: '1',
    tag: 'FULL-STACK MERN',
    title: 'Full-Stack MERN Development Bootcamp',
    description:
      'Master MongoDB, Express.js, React, and Node.js by building production-ready web applications from scratch with MVC architecture.',
    price: 4500,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1920&q=85',
    lecturesCount: 3,
    duration: '24 Hours',
    badge: 'Best Seller',
  },
  {
    _id: '2',
    tag: 'NEXT.JS & TYPESCRIPT',
    title: 'Modern Frontend with Next.js & TypeScript',
    description:
      'Build fast, SEO-friendly, and type-safe web interfaces using Next.js App Router, TypeScript interfaces, and Tailwind CSS.',
    price: 3800,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=85',
    lecturesCount: 3,
    duration: '18 Hours',
    badge: 'Trending',
  },
  {
    _id: '3',
    tag: 'DATABASE ARCHITECTURE',
    title: 'PostgreSQL & Relational Database Design',
    description:
      'A practical guide to relational modeling, SQL queries, indexing, and integrating PostgreSQL with modern Node.js backends.',
    price: 3200,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1920&q=85',
    lecturesCount: 2,
    duration: '14 Hours',
    badge: 'Industry Essential',
  },
  {
    _id: '4',
    tag: 'SECURITY & AUTH',
    title: 'Backend Security & JWT Authentication',
    description:
      'Secure your Node.js applications against common vulnerabilities using bcrypt password hashing, stateless JWT sessions, and route guards.',
    price: 0,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1920&q=85',
    lecturesCount: 2,
    duration: '8 Hours',
    badge: 'Free Access',
  },
];

export default function Hero({ courses = DEFAULT_HERO_COURSES }) {
  const slides = courses.length > 0 ? courses : DEFAULT_HERO_COURSES;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Continuous auto-advance every 6 seconds (does not stop on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrent((prev) => (prev + 1) % slides.length);
    } else {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  if (!mounted) {
    return (
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="min-h-[580px] lg:min-h-[660px]" />
      </section>
    );
  }

  // Pure horizontal slide variants — NO OPACITY FADE
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
    }),
    center: {
      x: '0%',
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
      },
    }),
  };

  return (
    <section
      className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center transition-colors"
    >
      {/* Sliding Slide Track (Horizontal Slide Movement Only) */}
      <div className="relative w-full h-full min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] overflow-hidden flex items-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`hero-slide-${current}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center"
          >
            {/* Background Course Image */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                src={slides[current].thumbnailUrl}
                alt={slides[current].title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center lg:object-right"
              />

              {/* Dimmed Horizontal Overlay: Softens image under text on left, clearer on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/94 via-white/80 to-white/20 dark:from-slate-950/92 dark:via-slate-950/75 dark:to-slate-950/25 z-10" />

              {/* Top & Bottom blends */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 dark:from-slate-950/80 to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/90 dark:from-slate-950/90 to-transparent z-10" />
            </div>

            {/* Slide Content (Left-Aligned within standard container, padded above floating controls) */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 py-12 lg:py-16 pb-24 sm:pb-28">
              <div className="w-full lg:max-w-xl xl:max-w-2xl flex flex-col justify-center text-center lg:text-left space-y-5">
                {/* Category Pill & Status Badge */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-400/15 dark:bg-sky-400/25 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300 backdrop-blur-md">
                    <HiSparkles className="w-3.5 h-3.5" />
                    {slides[current].tag}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {slides[current].badge}
                  </span>
                </div>

                {/* Course Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
                  {slides[current].title}
                </h1>

                {/* Course Description */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                  {slides[current].description}
                </p>

                {/* Course Meta Info Bar */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 backdrop-blur-md shadow-xs">
                    <FiVideo className="w-4 h-4 text-sky-500" />
                    <span>{slides[current].lecturesCount} Video Lectures</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 backdrop-blur-md shadow-xs">
                    <FiClock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>{slides[current].duration}</span>
                  </div>
                </div>

                {/* Consistent CTAs across all slides */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                  <Button href="/courses" variant="primary">
                    <FiBookOpen className="text-base" />
                    <span>Explore Courses</span>
                    <FiArrowRight className="text-sm" />
                  </Button>

                  <Button href="/courses" variant="secondary">
                    <FiCheckCircle className="text-base text-emerald-500" />
                    <span>View Curriculum</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FLOATING CONTROLS INSIDE HERO WITH TRANSPARENT BACKGROUND (No border, No counter text) */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between pointer-events-auto">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === current
                    ? 'w-8 bg-sky-400 shadow-sm shadow-sky-400/50'
                    : 'w-2.5 bg-slate-400/40 dark:bg-white/30 hover:bg-sky-400/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous course slide"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300/80 dark:border-white/15 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-sky-400 hover:border-sky-400 hover:text-slate-950 dark:hover:bg-sky-400 dark:hover:text-slate-950 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next course slide"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300/80 dark:border-white/15 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-sky-400 hover:border-sky-400 hover:text-slate-950 dark:hover:bg-sky-400 dark:hover:text-slate-950 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
