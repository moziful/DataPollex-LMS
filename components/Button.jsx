'use client';

import Link from 'next/link';

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-black transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary:
      'bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-lg shadow-sky-400/20 hover:scale-[1.02]',
    secondary:
      'border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 hover:border-sky-400 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-300 shadow-xs hover:scale-[1.02] backdrop-blur-md',
    danger:
      'border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20',
    ghost:
      'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60',
  };

  const sizeStyles = {
    sm: 'rounded-lg px-3.5 py-1.5 text-xs',
    md: 'rounded-xl px-6 py-3 text-xs sm:text-sm',
    lg: 'rounded-xl px-7 py-3.5 text-sm sm:text-base',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
}

