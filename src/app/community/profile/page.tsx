"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CommunityProfileIndexPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/user/me")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data pengguna");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data?.user?.id) {
          router.replace(`/community/profile/${data.user.id}`);
        } else {
          router.replace("/onboarding");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat profil");
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="flex-1 w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-cream/30">
      {error ? (
        <div className="bg-white p-6 rounded-2xl border border-brown-900/10 shadow-xs text-center max-w-sm">
          <p className="text-sm font-bold text-brown-900 mb-2">Terjadi Kendala</p>
          <p className="text-xs text-brown-700/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-3 border-orange-500/20 border-t-orange-500 animate-spin" />
          <p className="text-xs font-semibold text-brown-700/60 animate-pulse">
            Memuat profil komunitas...
          </p>
        </div>
      )}
    </div>
  );
}
