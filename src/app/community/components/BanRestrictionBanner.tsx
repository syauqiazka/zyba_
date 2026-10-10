"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";

const BanAppealModal = dynamic(
  () => import("@/components/moderation/BanAppealModal"),
  { ssr: false }
);

interface ModStatus {
  isBanned: boolean;
  isSuspended: boolean;
  suspendedUntil?: string | null;
  banReason?: string | null;
}

export default function BanRestrictionBanner() {
  const [status, setStatus] = useState<ModStatus | null>(null);
  const [appealOpen, setAppealOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/user/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted || !data?.user) return;
        const u = data.user;
        if (u.isBanned || u.isSuspended) {
          setStatus({
            isBanned: Boolean(u.isBanned),
            isSuspended: Boolean(u.isSuspended),
            suspendedUntil: u.suspendedUntil || null,
            banReason: u.banReason || null,
          });
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!status) return null;

  const fmtDate = (iso?: string | null) => {
    if (!iso) return null;
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  };

  const isBanned = status.isBanned;
  const isSuspended = status.isSuspended && !status.isBanned;

  const bannerCls = isBanned
    ? "w-full flex items-start gap-3 px-4 py-3 text-xs font-medium border-b shrink-0 bg-red-50 border-red-200 text-red-900"
    : "w-full flex items-start gap-3 px-4 py-3 text-xs font-medium border-b shrink-0 bg-amber-50 border-amber-200 text-amber-900";
  const iconCls = "shrink-0 mt-0.5 " + (isBanned ? "text-red-500" : "text-amber-500");
  const btnCls =
    "shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap " +
    (isBanned
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-amber-500 text-white hover:bg-amber-600");

  return (
    <>
      <div
        className={bannerCls}
        role="alert"
        aria-live="polite"
      >
        <ShieldAlert
          size={17}
          className={iconCls}
        />
        <div className="flex-1 min-w-0">
          {isBanned ? (
            <>
              <span className="font-bold">Akun Anda diblokir secara permanen.</span>
              {status.banReason && (
                <span className="ml-1 font-normal opacity-80">
                  Alasan: {status.banReason}.
                </span>
              )}
              <span className="ml-1">
                Anda tidak dapat membuat postingan atau komentar baru.
              </span>
            </>
          ) : (
            <>
              <span className="font-bold">Akun Anda ditangguhkan sementara.</span>
              {status.suspendedUntil && (
                <span className="ml-1">
                  Sampai {fmtDate(status.suspendedUntil)}.
                </span>
              )}
              <span className="ml-1">
                Fitur posting dan komentar tidak tersedia selama masa penangguhan.
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAppealOpen(true)}
          className={btnCls}
        >
          Ajukan Banding
        </button>
      </div>

      <BanAppealModal
        isOpen={appealOpen}
        onClose={() => setAppealOpen(false)}
        banReason={status.banReason}
        isBanned={status.isBanned}
        isSuspended={status.isSuspended}
      />
    </>
  );
}
