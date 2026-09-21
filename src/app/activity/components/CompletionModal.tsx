"use client";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompletionModal({ isOpen, onClose }: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-green-500/30 text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl shadow-lg">
          🎉
        </div>
        <h3 className="font-display font-extrabold text-xl text-brown-900">
          You Did It, Alex!
        </h3>
        <p className="text-xs text-brown-700">
          Kamu berhasil mencapai target aktivitas harian 1.200 poin! Zyba Score kamu meningkat +5 poin hari ini.
        </p>
        <button
          onClick={onClose}
          className="mt-2 w-full py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-500 transition-colors"
        >
          Lanjutkan →
        </button>
      </div>
    </div>
  );
}
