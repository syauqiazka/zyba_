export default function DailyAssessmentLoading() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card p-6 rounded-3xl border border-brown-900/10 bg-gradient-to-r from-cream to-white">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="h-6 w-36 bg-cream rounded-full" />
            <div className="h-6 w-28 bg-cream rounded-full" />
          </div>
          <div className="h-7 w-64 bg-cream rounded" />
          <div className="h-4 w-80 bg-cream rounded" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 bg-white">
          <div className="flex flex-col gap-5">
            <div className="h-5 w-48 bg-cream rounded" />
            <div className="grid grid-cols-5 gap-3">
              {[1,2,3,4,5].map((i) => <div key={i} className="h-24 bg-cream rounded-2xl" />)}
            </div>
            <div className="h-4 w-full bg-cream rounded" />
            <div className="h-24 w-full bg-cream rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-brown-900/10 bg-white">
          <div className="flex flex-col gap-3">
            <div className="h-5 w-32 bg-cream rounded" />
            {[1,2,3].map((i) => <div key={i} className="h-20 bg-cream rounded-2xl" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
