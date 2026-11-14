'use client';

import Link from 'next/link';
import { HiAcademicCap } from 'react-icons/hi2';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'All Courses' },
  { href: '/courses', label: 'Bootcamps' },
  { href: '/login', label: 'Admin Portal' },
];

const SOCIAL_LINKS = [
  { href: '#', label: 'Facebook', icon: FaFacebookF },
  { href: '#', label: 'X', icon: FaXTwitter },
  { href: '#', label: 'Instagram', icon: FaInstagram },
  { href: '#', label: 'LinkedIn', icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-6 lg:px-8 pt-14 pb-10 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand & Bio */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20 group-hover:scale-105 transition-all">
              <HiAcademicCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                DataPollex
              </span>
              <span className="text-[9px] font-black text-sky-600 dark:text-sky-400 mt-0.5 tracking-[0.22em] uppercase">
                Academy
              </span>
            </div>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
            Empowering engineers with production-grade curriculums, structured video lectures, and hands-on full-stack development skills.
          </p>
          <div className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 transition-all text-xs"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Quick Navigation
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact & Campus Info */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Campus & Support
          </h3>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2.5">
              <FiMapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>House 6, Block A, Main road, Mirpur 10, Mirpur, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiPhone className="w-4 h-4 text-sky-500 shrink-0" />
              <span>01963-431045</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiMail className="w-4 h-4 text-sky-500 shrink-0" />
              <span>contact@datapollex.com</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Stay Updated
          </h3>
          <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Subscribe to receive announcements about upcoming bootcamps, workshops, and releases.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="submit"
              className="rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-sky-300 transition-colors cursor-pointer shrink-0"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 DataPollex Ltd. All rights reserved.</p>
        <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 tracking-wide uppercase">
          Empowering The Next Generation of Engineers
        </p>
        <p>
          Developed by{" "}
          <Link
            href="http://moziful.vercel.app/"
            className="text-sky-400 font-semibold leading-loose uppercase text-xs bg-sky-300/30 rounded-sm px-1"
          >
            Moziful Haque
          </Link>
        </p>
      </div>
    </footer>
  );
}

