export default function SectionHeader({ eyebrow, heading, subheading }) {
  return (
    <div className="mb-8 sm:mb-10 text-center lg:text-left">
      {eyebrow && (
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-sky-600 dark:text-sky-400">
          {eyebrow}
        </p>
      )}

      {heading && (
        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {heading}
        </h2>
      )}

      {subheading && (
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          {subheading}
        </p>
      )}
    </div>
  );
}

