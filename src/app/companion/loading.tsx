export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 animate-in fade-in duration-300">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute w-6 h-6 rounded-full bg-orange-500/20 -top-1 left-1/2 -translate-x-1/2 animate-ping" />
        <div className="absolute w-6 h-6 rounded-full bg-green-500/20 -bottom-1 left-1/2 -translate-x-1/2 animate-ping delay-150" />
        <div className="absolute w-6 h-6 rounded-full bg-orange-500/20 -left-1 top-1/2 -translate-y-1/2 animate-ping delay-300" />
        <div className="absolute w-6 h-6 rounded-full bg-green-500/20 -right-1 top-1/2 -translate-y-1/2 animate-ping delay-500" />
        <div className="relative w-10 h-10 rounded-xl bg-cream border border-orange-500/20 shadow flex items-center justify-center z-10">
          <div className="w-3 h-3 rounded-full bg-brown-900 z-20" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="font-display font-extrabold text-sm text-brown-900">
          Memuat Zyba Companion
        </span>
        <span className="text-[11px] text-brown-700">
          Menghubungkan ke AI companion...
        </span>
      </div>
      <div className="w-40 h-1.5 bg-cream rounded-full overflow-hidden border border-brown-900/10">
        <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );
}
