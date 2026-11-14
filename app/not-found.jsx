'use client';

import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { FiHome, FiBookOpen } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 px-4 py-16 flex items-center justify-center relative overflow-hidden transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_38%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 dark:opacity-30 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-2"
        >
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-600 select-none drop-shadow-sm">
            404
          </span>
          <div className="absolute -inset-4 bg-sky-400/10 blur-2xl rounded-full -z-10" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            The page or curriculum you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
          </p>
        </motion.div>
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Button href="/" variant="primary">
            <FiHome className="text-base" />
            <span>Return to Homepage</span>
          </Button>

          <Button href="/courses" variant="secondary">
            <FiBookOpen className="text-base" />
            <span>Explore Courses</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

