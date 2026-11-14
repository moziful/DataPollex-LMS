import { Suspense } from 'react';
import CoursePlayerView from '@/components/CoursePlayerView';

async function CourseContent({ paramsPromise }) {
  const resolvedParams = await paramsPromise;
  const { id } = resolvedParams;

  return <CoursePlayerView courseId={id} />;
}

export default function CourseDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Loading classroom...</p>
          </div>
        </div>
      }
    >
      <CourseContent paramsPromise={params} />
    </Suspense>
  );
}
