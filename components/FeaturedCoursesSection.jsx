'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import SectionHeader from './SectionHeader';
import CourseCard, { CourseCardSkeleton } from './CourseCard';

export default function FeaturedCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Connect to Express backend API
        const res = await fetch('http://localhost:5000/api/courses');
        if (!res.ok) {
          throw new Error('Failed to fetch courses from server');
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Ensure last added course is loaded first
          const sorted = [...data.data].sort((a, b) => {
            const dateDiff = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            if (dateDiff !== 0) return dateDiff;
            return (b._id || '').localeCompare(a._id || '');
          });
          setCourses(sorted);
        }
      } catch (err) {
        console.error('Error fetching courses:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="relative bg-slate-50/60 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Section Header & View All Link */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
          <SectionHeader
            eyebrow="Featured Programs"
            heading="Explore Top Industry Curriculums"
            subheading="Practical, production-grade courses structured to help you master modern tech stacks."
          />

          <Link
            href="/courses"
            className="mb-8 inline-flex items-center gap-2 text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors shrink-0 group"
          >
            <span>View all courses</span>
            <FaArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State: Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        )}

        {/* Error State (Fallback Notice) */}
        {!loading && error && courses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-8 text-center text-sm text-red-600 dark:text-red-400">
            <p className="font-bold">Unable to load courses from backend</p>
            <p className="text-xs mt-1 text-slate-500">Please make sure the backend server is running on port 5000.</p>
          </div>
        )}

        {/* Success State: Course Cards Grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center text-sm text-slate-600 dark:text-slate-400">
            No courses available yet. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}

