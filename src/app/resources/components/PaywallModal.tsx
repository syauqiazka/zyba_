interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PaywallModal({ open, onClose, onUpgrade }: PaywallModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/30 text-center flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center text-3xl shadow-lg">
          ✨
        </div>
        <h3 className="font-display font-extrabold text-xl text-brown-900">
          Unlock Full Course with Zyba Plus
        </h3>
        <p className="text-xs text-brown-700">
          Materi premium ini hanya tersedia untuk pengguna Zyba Plus. Dapatkan akses tak terbatas ke seluruh materi audio dan latihan interaktif.
        </p>
        <button
          onClick={onUpgrade}
          className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-xs shadow-md hover:opacity-95"
        >
          Upgrade to Zyba Plus →
        </button>
        <button
          onClick={onClose}
          className="text-xs font-bold text-brown-700 hover:underline"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
