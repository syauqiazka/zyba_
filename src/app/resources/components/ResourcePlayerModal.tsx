"use client";

interface ResourceItem {
  id: string;
  type: "ARTICLE" | "COURSE";
  title: string;
  author: string;
  duration: string;
  category: string;
  isPro: boolean;
  coverEmoji: string;
  desc: string;
}

interface ResourcePlayerModalProps {
  resource: ResourceItem;
  isAudioPlaying: boolean;
  courseCompleted: boolean;
  onPlayToggle: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function ResourcePlayerModal({
  resource,
  isAudioPlaying,
  courseCompleted,
  onPlayToggle,
  onComplete,
  onClose,
}: ResourcePlayerModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-brown-900/10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-500">
            {resource.type} • {resource.duration}
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-brown-700 hover:text-brown-900 p-1"
          >
            ✕ Tutup
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cream text-4xl flex items-center justify-center shrink-0">
            {resource.coverEmoji}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-brown-900">
              {resource.title}
            </h3>
            <span className="text-xs text-brown-700">Penulis: {resource.author}</span>
          </div>
        </div>

        {/* Audio Player State if COURSE */}
        {resource.type === "COURSE" ? (
          <div className="bg-cream p-6 rounded-2xl border border-brown-900/10 flex flex-col items-center gap-4 text-center">
            <span className="text-xs font-bold text-brown-900">
              {isAudioPlaying ? "🎵 Playing: Mindfulness Meditation Intro" : "Sesi Audio Siap Diputar"}
            </span>
            <span className="font-display text-4xl font-extrabold text-brown-900">
              {isAudioPlaying ? "05:55" : "00:00"}
            </span>

            <div className="w-full h-2 rounded-full bg-white overflow-hidden border border-brown-900/10">
              <div className={`h-full bg-green-500 transition-all ${isAudioPlaying ? "w-full duration-10000" : "w-0"}`} />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onPlayToggle}
                className="px-6 py-2.5 rounded-full bg-brown-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-md"
              >
                {isAudioPlaying ? "⏸️ Jeda Audio" : "▶️ Putar Audio"}
              </button>
              <button
                onClick={onComplete}
                className="px-4 py-2.5 rounded-full bg-green-500 text-white font-bold text-xs hover:bg-brown-900 transition-colors"
              >
                Selesaikan Sesi ✓
              </button>
            </div>
          </div>
        ) : (
          /* Article Body Text */
          <div className="text-xs text-brown-900 leading-relaxed bg-cream/40 p-4 rounded-2xl border border-brown-900/10 max-h-[220px] overflow-y-auto">
            <p className="mb-3">
              Pikiran berlebih (overthinking) terjadi ketika amigdala merespons potensi ancaman masa depan dengan mengaktifkan hormon stres kortisol.
            </p>
            <p>
              Dengan melatih kesadaran penuh (mindfulness), kita dapat mengaktifkan korteks prefrontal untuk memproses emosi secara rasional dan menghentikan lingkaran kecemasan.
            </p>
          </div>
        )}

        {/* Course Completed Celebration */}
        {courseCompleted && (
          <div className="p-4 rounded-2xl bg-green-100 border border-green-500/30 text-center flex flex-col items-center gap-2">
            <span className="text-2xl">🎉</span>
            <span className="text-xs font-bold text-brown-900">Course Completed!</span>
            <span className="text-[10px] text-brown-700">Zyba Score kamu meningkat +10 poin!</span>
          </div>
        )}
      </div>
    </div>
  );
}
