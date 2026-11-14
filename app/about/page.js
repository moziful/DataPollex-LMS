'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiAcademicCap,
  HiOutlineBuildingOffice2,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import {
  FiCheckCircle,
  FiCode,
  FiDatabase,
  FiShield,
  FiVideo,
  FiArrowRight,
  FiUsers,
  FiAward,
} from 'react-icons/fi';
import Button from '@/components/Button';

export default function AboutPage() {
  const pillars = [
    {
      icon: FiCode,
      title: 'MVC Architecture',
      description:
        'Industry-standard separation of concerns with dedicated Routes, Controllers, Models, and Middlewares in Node.js and Express.',
    },
    {
      icon: FiShield,
      title: 'Stateless Security & JWT',
      description:
        'Protected administrative endpoints with Bcrypt password hashing, role-based authorization, and secure JSON Web Tokens.',
    },
    {
      icon: FiVideo,
      title: 'Sequential Video Classroom',
      description:
        'Interactive 16:9 embedded player with natural numeric syllabus ordering, progress synchronization, and previous/next controls.',
    },
    {
      icon: FiDatabase,
      title: 'Persistent Cloud Database',
      description:
        'Production-grade MongoDB Atlas cluster with foreign key associations and automated cascade deletions for associated lectures.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 sm:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ========================================================= */}
        {/* HERO SECTION                                              */}
        {/* ========================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border border-sky-400/30 bg-sky-400/10 text-sky-700 dark:text-sky-300">
            <HiAcademicCap className="w-4 h-4 text-sky-400" />
            <span>Industrial Training Recruitment Process</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Building Real-World Engineers at{' '}
            <span className="text-sky-600 dark:text-sky-400">DataPollex Academy</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            DataPollex Ltd. delivers production-ready engineering curriculums focused on hands-on full-stack development, modern cloud architectures, and disciplined software craftsmanship.
          </p>
        </div>

        {/* ========================================================= */}
        {/* CORE PILLARS GRID                                         */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <span className="text-[11px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Technical Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              What Powers Our Curriculum
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm space-y-3 hover:border-sky-400/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* COMPANY & CONTACT DETAILS (FROM BRIEF)                    */}
        {/* ========================================================= */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Official Headquarters
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                DataPollex Ltd.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                We empower emerging tech professionals with structured bootcamps, real-world project mentorship, and production-tested software engineering standards.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <HiOutlineMapPin className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <span>House 6, Block A, Main Road, Mirpur 10, Mirpur, Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlinePhone className="w-5 h-5 text-sky-500 shrink-0" />
                  <span>01963-431045</span>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlineEnvelope className="w-5 h-5 text-sky-500 shrink-0" />
                  <span>contact@datapollex.com</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-sky-400/20 bg-sky-50/60 dark:bg-sky-950/20 p-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <FiAward className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Ready to Accelerate Your Career?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse our verified video curriculums or sign in to track your learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button href="/courses" variant="primary" size="sm">
                  <span>Explore Courses</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/login" variant="secondary" size="sm">
                  <span>Sign In</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

