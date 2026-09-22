"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User, ArrowLeft } from "lucide-react";

export default function FollowingPage() {
  const { userId } = useParams();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/community/users/${userId}/following`)
      .then((r) => (r.ok ? r.json() : { following: [] }))
      .then((data) => setFollowing(data.following || []))
      .catch(() => setFollowing([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto">
      <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <button type="button" onClick={() => window.history.back()} className="p-1.5 rounded-lg hover:bg-cream transition-colors" aria-label="Kembali">
            <ArrowLeft size={20} className="text-brown-900" />
          </button>
          <h1 className="font-bold text-lg text-brown-900">Mengikuti</h1>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-brown-700/60">Memuat...</div>
        ) : following.length === 0 ? (
          <div className="py-8 text-center text-xs text-brown-700/60">
            <p className="font-bold text-sm text-brown-900 mb-1">Belum mengikuti siapa pun</p>
            <p className="mb-3">Temukan orang untuk diikuti di halaman Cari.</p>
            <Link href="/community/search" className="rounded-full bg-brown-900 text-white text-xs font-bold px-4 py-2 hover:bg-orange-500 transition-colors">
              Cari Orang
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brown-900/10 divide-y divide-brown-900/6">
            {following.map((f) => (
              <Link key={f.userId} href={`/community/profile/${f.userId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#faf7f2]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-cream border border-brown-900/10 flex items-center justify-center font-bold text-sm shrink-0">
                  {f.name ? f.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : f.username?.slice(0, 2).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-brown-900 truncate">{f.name || f.username || "Pengguna ZYBA"}</p>
                  <p className="text-[10px] text-brown-700/60">@{f.username || f.userId?.slice(-4)}</p>
                </div>
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="ml-auto rounded-full bg-brown-900 text-white text-xs font-bold px-3 py-1.5 hover:bg-orange-500 transition-colors">
                  Lihat Profil
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}