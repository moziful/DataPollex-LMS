'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiVideo, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function CourseCard({ course }) {
  const isFree = Number(course?.price ?? 0) === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-xl hover:border-sky-400/50 dark:hover:border-sky-400/50 transition-all duration-300 overflow-hidden"
    >
      <Link href={`/courses/${course._id}`} className="block relative w-full h-52 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Image
          src={course.thumbnailUrl || '/placeholder.png'}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-xs">
            <FiVideo className="w-3.5 h-3.5 text-sky-400" />
            <span>{course.lecturesCount ?? 0} Lessons</span>
          </span>

          <span className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-400/90 text-slate-950 backdrop-blur-md px-3 py-1 text-xs font-black shadow-xs">
            {isFree ? 'FREE' : `${Number(course.price).toLocaleString()} BDT`}
          </span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/courses/${course._id}`}>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 leading-snug">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Card Footer: Access Tag & Action Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Self-Paced</span>
          </div>

          <Link
            href={`/courses/${course._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-sky-400 hover:text-slate-950 dark:hover:bg-sky-400 dark:hover:text-slate-950 transition-all cursor-pointer"
          >
            <span>Details</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
      <div className="w-full h-52 sm:h-56 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
        </div>
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

