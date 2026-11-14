'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiSearch, FiX, FiFilter, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import SectionHeader from '@/components/SectionHeader';
import CourseCard, { CourseCardSkeleton } from '@/components/CourseCard';
import Button from '@/components/Button';
import CustomSelect from '@/components/CustomSelect';

const PRICE_OPTIONS = [
  { value: 'all', label: 'All Pricing' },
  { value: 'free', label: 'Free Only' },
  { value: 'paid', label: 'Paid Bootcamps' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Sort: Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'lessons', label: 'Most Video Lessons' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Courses' },
  { id: 'fullstack', label: 'Full-Stack MERN' },
  { id: 'frontend', label: 'Frontend & Next.js' },
  { id: 'database', label: 'Database & SQL' },
  { id: 'security', label: 'Security & Auth' },
];

const ITEMS_PER_PAGE = 6;

export default function CoursesPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8 bg-white dark:bg-slate-950">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Loading courses catalog...</p>
          </div>
        </div>
      }
    >
      <CoursesPage />
    </Suspense>
  );
}

function CoursesPage() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'free', 'paid'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc', 'lessons'
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch courses from backend API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/courses');
        if (!res.ok) {
          throw new Error('Failed to fetch courses from server');
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
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

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search matching
        const query = search.toLowerCase().trim();
        const matchesSearch =
          !query ||
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query);

        // Category matching
        let matchesCategory = true;
        const text = `${course.title} ${course.description}`.toLowerCase();
        if (category === 'fullstack') {
          matchesCategory = text.includes('mern') || text.includes('full-stack');
        } else if (category === 'frontend') {
          matchesCategory = text.includes('frontend') || text.includes('next.js') || text.includes('react');
        } else if (category === 'database') {
          matchesCategory = text.includes('database') || text.includes('postgresql') || text.includes('sql') || text.includes('mongo');
        } else if (category === 'security') {
          matchesCategory = text.includes('security') || text.includes('jwt') || text.includes('auth');
        }

        // Price matching
        let matchesPrice = true;
        if (priceFilter === 'free') {
          matchesPrice = Number(course.price) === 0;
        } else if (priceFilter === 'paid') {
          matchesPrice = Number(course.price) > 0;
        }

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price ?? 0) - (b.price ?? 0);
        if (sortBy === 'price-desc') return (b.price ?? 0) - (a.price ?? 0);
        if (sortBy === 'lessons') return (b.lecturesCount ?? 0) - (a.lecturesCount ?? 0);
        // Default: newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [courses, search, category, priceFilter, sortBy]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, priceFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setPriceFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters = search || category !== 'all' || priceFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-10 sm:py-16 transition-colors">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 dark:bg-sky-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300 mb-3">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>Full Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Browse All Courses
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Industry-ready tech bootcamps with hands-on video lectures and real production codebases.
            </p>
          </div>

          {/* Quick Stats Chip */}
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-black text-slate-700 dark:text-slate-300 shadow-xs">
              Total Courses: <span className="text-sky-500 font-black">{courses.length}</span>
            </span>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input Bar */}
            <div className="relative w-full lg:max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by course title or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 shadow-xs transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Filters (Price & Sort) using CustomSelect */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <CustomSelect
                value={priceFilter}
                onChange={setPriceFilter}
                options={PRICE_OPTIONS}
              />

              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
              />

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs ${isActive
                    ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-sky-400'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 pt-2">
          <span>
            Showing <span className="text-slate-900 dark:text-white font-black">{filteredCourses.length}</span> of {courses.length} courses
          </span>
          {category !== 'all' && (
            <span className="text-sky-600 dark:text-sky-400">
              Filtered by: {CATEGORIES.find((c) => c.id === category)?.label}
            </span>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        )}

        {/* Error Fallback */}
        {!loading && error && courses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-12 text-center text-red-600 dark:text-red-400 space-y-3">
            <p className="font-black text-lg">Unable to connect to backend server</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please verify that the Express backend is running on port 5000 (`npm run dev` in lms-backend).
            </p>
            <Button onClick={() => window.location.reload()} variant="primary" size="sm">
              Retry Connection
            </Button>
          </div>
        )}

        {/* Empty Search/Filter State */}
        {!loading && filteredCourses.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 sm:p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FiFilter className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No matching courses found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                No courses match your active search or filter criteria. Try clearing some filters.
              </p>
            </div>
            <Button onClick={resetFilters} variant="primary" size="sm">
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && paginatedCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-500 transition-colors cursor-pointer"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-colors cursor-pointer ${currentPage === i + 1
                    ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20'
                    : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-sky-400 hover:text-sky-500'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-500 transition-colors cursor-pointer"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

