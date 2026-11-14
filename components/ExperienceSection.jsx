'use client';

import { motion } from 'framer-motion';
import {
  FiVideo,
  FiTerminal,
  FiAward,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import Link from 'next/link';
import SectionHeader from './SectionHeader';

export default function ExperienceSection() {
  return (
    <section className="relative bg-slate-50/60 dark:bg-slate-900/40 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="The DataPollex Experience"
          heading="Built for Real-World Software Engineering"
          subheading="We bridge the gap between academic theory and the practical, production-ready skills demanded by modern tech companies."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1: Interactive Classroom */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: 0 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-sky-400/50 dark:hover:border-sky-400/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/10 text-sky-600 dark:text-sky-400 text-xl group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-slate-950 transition-all duration-300 shadow-xs">
                  <FiVideo className="w-6 h-6" />
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 dark:bg-sky-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300">
                  <FiCheckCircle className="w-3 h-3 text-sky-500" />
                  <span>Bite-Sized & Focused</span>
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  STUDENT CLASSROOM
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Curated HD Video Lessons
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Distraction-free, high-definition video lectures covering complex full-stack concepts, architecture diagrams, and step-by-step coding demonstrations.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors"
              >
                <span>Explore Curriculum</span>
                <FiArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Pillar 2: Production Code */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-sky-400/50 dark:hover:border-sky-400/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/10 text-sky-600 dark:text-sky-400 text-xl group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-slate-950 transition-all duration-300 shadow-xs">
                  <FiTerminal className="w-6 h-6" />
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 dark:bg-sky-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300">
                  <FiCheckCircle className="w-3 h-3 text-sky-500" />
                  <span>Real-World Patterns</span>
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  INDUSTRY STANDARDS
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Production MVC Architecture
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Learn how senior engineers structure maintainable backends with Models, Views, and Controllers, resilient error middleware, and secure JWT sessions.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors"
              >
                <span>Explore Curriculum</span>
                <FiArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Pillar 3: Career Ready */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-sky-400/50 dark:hover:border-sky-400/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/10 text-sky-600 dark:text-sky-400 text-xl group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-slate-950 transition-all duration-300 shadow-xs">
                  <FiAward className="w-6 h-6" />
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 dark:bg-sky-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300">
                  <FiCheckCircle className="w-3 h-3 text-sky-500" />
                  <span>Portfolio-Ready</span>
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  CAREER ADVANCEMENT
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Self-Paced Practical Mastery
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Build recruitment-grade portfolio applications at your own pace with lifetime curriculum access and practical hands-on development workflows.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors"
              >
                <span>Explore Curriculum</span>
                <FiArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
