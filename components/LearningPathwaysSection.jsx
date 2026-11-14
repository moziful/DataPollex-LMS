'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLayers, FiCode, FiDatabase, FiShield, FiArrowRight } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const PATHWAYS = [
  {
    id: 'fullstack',
    title: 'Full-Stack Web Development',
    eyebrow: 'MERN Track',
    description:
      'Build scalable end-to-end web applications with MongoDB, Express.js, React, and Node.js using clean MVC architecture.',
    icon: FiLayers,
    skills: ['MERN Stack', 'Express MVC', 'REST APIs', 'Full-Stack CRUD'],
    color: 'from-sky-500/20 to-sky-600/5 border-sky-500/30 hover:border-sky-400/60',
    iconBg: 'bg-sky-400/10 text-sky-500 dark:text-sky-400',
    glow: 'hover:shadow-sky-500/10',
    badge: 'Comprehensive',
  },
  {
    id: 'frontend',
    title: 'Modern Frontend Engineering',
    eyebrow: 'Next.js Track',
    description:
      'Master Next.js App Router, TypeScript type safety, server components, and responsive mobile-first Tailwind CSS UI design.',
    icon: FiCode,
    skills: ['Next.js App Router', 'TypeScript', 'Tailwind CSS', 'React 19'],
    color: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 hover:border-indigo-400/60',
    iconBg: 'bg-indigo-400/10 text-indigo-500 dark:text-indigo-400',
    glow: 'hover:shadow-indigo-500/10',
    badge: 'In-Demand',
  },
  {
    id: 'database',
    title: 'Database Architecture & Modeling',
    eyebrow: 'SQL & NoSQL Track',
    description:
      'Design relational schemas with PostgreSQL, optimize SQL queries, and manage document databases with MongoDB & Mongoose.',
    icon: FiDatabase,
    skills: ['PostgreSQL', 'MongoDB', 'Indexing', 'Relational Schemas'],
    color: 'from-teal-500/20 to-teal-600/5 border-teal-500/30 hover:border-teal-400/60',
    iconBg: 'bg-teal-400/10 text-teal-500 dark:text-teal-400',
    glow: 'hover:shadow-teal-500/10',
    badge: 'Core Foundation',
  },
  {
    id: 'security',
    title: 'Backend Security & Authentication',
    eyebrow: 'Security Track',
    description:
      'Harden server endpoints with bcrypt password hashing, stateless JWT session tokens, route middleware guards, and CORS security.',
    icon: FiShield,
    skills: ['JWT Tokens', 'Bcrypt Hashing', 'Auth Guards', 'API Security'],
    color: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 hover:border-amber-400/60',
    iconBg: 'bg-amber-400/10 text-amber-500 dark:text-amber-400',
    glow: 'hover:shadow-amber-500/10',
    badge: 'Essential',
  },
];

export default function LearningPathwaysSection() {
  return (
    <section className="bg-white dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Structured Pathways"
          heading="Specialized Career Tracks"
          subheading="Follow structured engineering pathways designed to take you from foundational concepts to production-ready applications."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PATHWAYS.map((pathway, idx) => {
            const Icon = pathway.icon;
            return (
              <motion.div
                key={pathway.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className={`group flex flex-col justify-between rounded-2xl border bg-gradient-to-b ${pathway.color} p-6 shadow-md ${pathway.glow} transition-all duration-300 backdrop-blur-xs`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon & Track Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${pathway.iconBg} text-xl transition-transform duration-300 group-hover:scale-110 shadow-xs`}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {pathway.badge}
                    </span>
                  </div>

                  {/* Title & Eyebrow */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                      {pathway.eyebrow}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {pathway.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pathway.description}
                  </p>

                  {/* Skills Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pathway.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/60 mt-6">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                  >
                    <span>Browse Courses</span>
                    <FiArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

