"use client";

import { useState } from "react";
import {
    ShieldCheck,
    FileText,
    LockKeyhole,
    Users,
    Check,
    X,
} from "lucide-react";

type TermsAgreementModalProps = {
    open: boolean;
    onAccept: () => void;
    onClose?: () => void;
};

export default function TermsAgreementModal({
    open,
    onAccept,
    onClose,
}: TermsAgreementModalProps) {
    const [accepted, setAccepted] = useState(false);

    if (!open) return null;

    const handleAccept = () => {
        if (!accepted) return;
        onAccept();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] bg-[#F7F2E7] shadow-2xl border border-brown-900/10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 sm:px-8 sm:pt-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E2EBD2] text-green-700">
                            <ShieldCheck size={22} strokeWidth={2} />
                        </div>

                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-green-700">
                                Sebelum melanjutkan
                            </p>

                            <h2 className="mt-1 font-display text-xl font-extrabold text-brown-900 sm:text-2xl">
                                Terms & Agreement
                            </h2>

                            <p className="mt-1 text-xs leading-relaxed text-brown-700/70">
                                Luangkan sebentar untuk memahami bagaimana ZYBA digunakan.
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brown-700/60 transition hover:bg-white hover:text-brown-900"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="mx-6 max-h-[42vh] overflow-y-auto rounded-2xl border border-brown-900/10 bg-white/60 p-5 sm:mx-8 sm:p-6">
                    <div className="space-y-5">
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-orange-500" />
                                <h3 className="text-sm font-bold text-brown-900">
                                    Penggunaan ZYBA
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                ZYBA menyediakan fitur wellness seperti assessment,
                                journaling, aktivitas, komunitas, dan ZYBA Companion untuk
                                membantu kamu memahami keseharian dan membangun kebiasaan
                                positif.
                            </p>
                        </section>

                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <LockKeyhole size={16} className="text-green-600" />
                                <h3 className="text-sm font-bold text-brown-900">
                                    Data & Privasi
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Data yang kamu berikan digunakan untuk menjalankan fitur ZYBA,
                                mempersonalisasi pengalaman, dan meningkatkan layanan sesuai
                                kebijakan privasi yang berlaku.
                            </p>
                        </section>

                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <Users size={16} className="text-orange-500" />
                                <h3 className="text-sm font-bold text-brown-900">
                                    Penggunaan Community
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Saat menggunakan Community, kamu bertanggung jawab atas konten
                                yang kamu bagikan dan wajib menghormati pengguna lain.
                                Community memiliki aturan tambahan yang berlaku khusus di
                                dalamnya.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 text-sm font-bold text-brown-900">
                                Bukan diagnosis medis
                            </h3>

                            <p className="text-xs leading-6 text-brown-700/80">
                                ZYBA adalah platform wellness dan bukan pengganti diagnosis,
                                konsultasi, atau perawatan dari tenaga kesehatan profesional.
                            </p>
                        </section>

                        <div className="rounded-xl border border-brown-900/10 bg-[#F7F2E7] px-4 py-3">
                            <p className="text-[10px] leading-5 text-brown-700/60">
                                Versi Terms: <strong>1.0</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Agreement */}
                <div className="px-6 pt-5 sm:px-8">
                    <label className="flex cursor-pointer items-start gap-3">
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={accepted}
                            onClick={() => setAccepted((value) => !value)}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${accepted
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "border-brown-900/25 bg-white"
                                }`}
                        >
                            {accepted && <Check size={13} strokeWidth={3} />}
                        </button>

                        <span className="text-xs leading-5 text-brown-700/80">
                            Saya telah membaca dan menyetujui{" "}
                            <button
                                type="button"
                                onClick={() => setAccepted(true)}
                                className="font-bold text-brown-900 underline underline-offset-2"
                            >
                                Terms & Agreement
                            </button>{" "}
                            dan{" "}
                            <button
                                type="button"
                                onClick={() => setAccepted(true)}
                                className="font-bold text-brown-900 underline underline-offset-2"
                            >
                                Privacy Policy
                            </button>{" "}
                            ZYBA.
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                    <button
                        type="button"
                        disabled={!accepted}
                        onClick={handleAccept}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-brown-900 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Saya Setuju & Lanjutkan
                        <span>→</span>
                    </button>

                    <p className="text-center text-[10px] leading-4 text-brown-700/50">
                        Dengan melanjutkan, persetujuan ini akan disimpan pada akunmu.
                    </p>
                </div>
            </div>
        </div>
    );
}