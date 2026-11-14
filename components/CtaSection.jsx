'use client';

import Button from './Button';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export default function CtaSection() {
  return (
    <section className="bg-white dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 transition-colors">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-linear-to-b from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-8 sm:p-14 lg:p-16 text-center shadow-xl"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-b from-sky-400/15 dark:from-sky-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />

          {/* Eyebrow Pill */}
          <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 dark:bg-sky-400/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300 mb-6">
            <HiSparkles className="w-3.5 h-3.5" />
            <span>Start Learning Today</span>
          </div>

          {/* Headline */}
          <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to Build Production-Grade Applications?
          </h2>

          {/* Description */}
          <p className="relative z-10 mt-4 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join DataPollex Academy to master MERN, Next.js, relational databases,
            and secure backend architecture with hands-on video guidance.
          </p>

          {/* CTA Buttons */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Button href="/courses" variant="primary">
              <FiBookOpen className="text-base" />
              <span>Explore All Courses</span>
              <FiArrowRight className="text-sm" />
            </Button>

            <Button href="/login" variant="secondary">
              <span>Admin Portal</span>
            </Button>
          </div>

          {/* Checklist Trust Badges */}
          <div className="relative z-10 mt-10 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs font-bold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Lifetime Course Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Embedded HD Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Production Codebases</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

