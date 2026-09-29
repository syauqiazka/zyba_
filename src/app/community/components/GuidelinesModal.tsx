"use client";

import { useState } from "react";
import {
    ShieldCheck,
    HeartHandshake,
    LockKeyhole,
    MessageCircleHeart,
    Flag,
    Scale,
    Gavel,
    Check,
} from "lucide-react";

type CommunityGuidelinesModalProps = {
    open: boolean;
    onAccept: () => Promise<void> | void;
    loading?: boolean;
};

export default function CommunityGuidelinesModal({
    open,
    onAccept,
    loading = false,
}: CommunityGuidelinesModalProps) {
    const [accepted, setAccepted] = useState(false);

    if (!open) return null;

    const handleAccept = async () => {
        if (!accepted || loading) return;
        await onAccept();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-brown-900/55 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] bg-[#F7F2E7] border border-brown-900/10 shadow-2xl">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 sm:px-8 sm:pt-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E2EBD2] text-green-700">
                            <ShieldCheck size={22} strokeWidth={2} />
                        </div>

                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-green-700">
                                Selamat datang di Community
                            </p>

                            <h2 className="mt-1 font-display text-xl font-extrabold text-brown-900 sm:text-2xl">
                                Community Guidelines
                            </h2>

                            <p className="mt-1 text-xs leading-relaxed text-brown-700/70">
                                Ruang yang nyaman dimulai dari cara kita
                                memperlakukan satu sama lain.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-6 max-h-[50vh] overflow-y-auto rounded-2xl border border-brown-900/10 bg-white/60 p-5 sm:mx-8 sm:p-6">
                    <div className="space-y-6">

                        {/* Respect */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <HeartHandshake
                                    size={16}
                                    className="text-orange-500"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Saling menghormati
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Perlakukan anggota Community dengan hormat.
                                Hindari hinaan, pelecehan, perundungan,
                                diskriminasi, atau serangan pribadi terhadap
                                pengguna lain.
                            </p>
                        </section>

                        {/* Safe space */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <MessageCircleHeart
                                    size={16}
                                    className="text-green-600"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Jaga ruang tetap aman
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Bagikan pengalaman dan pendapat dengan
                                bertanggung jawab. Jangan gunakan Community
                                untuk mengancam, mengintimidasi, melecehkan,
                                atau menyakiti orang lain.
                            </p>
                        </section>

                        {/* Privacy */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <LockKeyhole
                                    size={16}
                                    className="text-green-600"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Lindungi privasi
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Jangan membagikan informasi pribadi, identitas,
                                foto, data kontak, atau data sensitif milik
                                orang lain tanpa izin.
                            </p>
                        </section>

                        {/* Content */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <ShieldCheck
                                    size={16}
                                    className="text-orange-500"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Bagikan dengan bijak
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Hindari konten yang berbahaya, diskriminatif,
                                mengandung ancaman, atau sengaja dibuat untuk
                                merugikan pengguna lain. Jangan menyebarkan
                                informasi yang kamu ketahui tidak benar atau
                                menyesatkan.
                            </p>
                        </section>

                        {/* Wellness disclaimer */}
                        <section>
                            <h3 className="mb-2 text-sm font-bold text-brown-900">
                                Community bukan pengganti bantuan profesional
                            </h3>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Pengalaman dan pendapat pengguna lain bukan
                                diagnosis atau pengganti bantuan dari tenaga
                                kesehatan profesional. Jika kamu berada dalam
                                kondisi darurat atau membutuhkan bantuan,
                                cari bantuan profesional atau layanan darurat
                                yang sesuai.
                            </p>
                        </section>

                        {/* Report */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <Flag
                                    size={16}
                                    className="text-orange-500"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Laporkan konten bermasalah
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Jika kamu menemukan konten atau perilaku yang
                                melanggar Community Guidelines, gunakan fitur
                                pelaporan yang tersedia. Jangan melakukan
                                tindakan balasan atau menyebarkan kembali
                                konten bermasalah tersebut.
                            </p>
                        </section>

                        {/* Legal */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <Scale
                                    size={16}
                                    className="text-orange-500"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Ketentuan Hukum
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Penggunaan Community wajib mematuhi peraturan
                                perundang-undangan yang berlaku di Republik
                                Indonesia, termasuk ketentuan mengenai
                                Informasi dan Transaksi Elektronik serta
                                ketentuan pidana yang berlaku.
                            </p>

                            <p className="mt-2 text-xs leading-6 text-brown-700/80">
                                Pengguna dilarang menggunakan Community untuk
                                melakukan, mengunggah, mengirimkan, atau
                                menyebarluaskan konten maupun aktivitas yang
                                melanggar hukum, termasuk namun tidak terbatas
                                pada ancaman, intimidasi, penipuan, perjudian,
                                penyebaran informasi bohong atau menyesatkan
                                yang memenuhi unsur hukum, penghinaan atau
                                pencemaran nama baik yang memenuhi unsur
                                tindak pidana, serta tindakan lain yang
                                dilarang oleh peraturan perundang-undangan.
                            </p>

                            <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-50/70 px-4 py-3">
                                <p className="text-[10px] leading-5 text-brown-700/70">
                                    <strong className="text-brown-900">
                                        Dasar hukum:
                                    </strong>{" "}
                                    ketentuan ini memperhatikan peraturan
                                    perundang-undangan Republik Indonesia yang
                                    berlaku, termasuk UU No. 1 Tahun 2024 tentang
                                    Perubahan Kedua UU ITE, UU No. 1 Tahun 2023
                                    tentang KUHP, serta peraturan perubahan atau
                                    penyesuaiannya.
                                </p>
                            </div>
                        </section>

                        {/* Sanctions */}
                        <section>
                            <div className="mb-2 flex items-center gap-2">
                                <Gavel
                                    size={16}
                                    className="text-red-500"
                                />

                                <h3 className="text-sm font-bold text-brown-900">
                                    Konsekuensi & Sanksi
                                </h3>
                            </div>

                            <p className="text-xs leading-6 text-brown-700/80">
                                Pelanggaran terhadap Community Guidelines dapat
                                menyebabkan ZYBA mengambil tindakan terhadap
                                konten dan/atau akun pengguna sesuai tingkat
                                dan sifat pelanggaran.
                            </p>

                            <ul className="mt-2 space-y-1.5 pl-4 text-xs leading-5 text-brown-700/80">
                                <li className="list-disc">
                                    Peringatan kepada pengguna.
                                </li>

                                <li className="list-disc">
                                    Penghapusan atau pembatasan akses terhadap
                                    konten.
                                </li>

                                <li className="list-disc">
                                    Pembatasan kemampuan untuk membuat atau
                                    berinteraksi dengan konten.
                                </li>

                                <li className="list-disc">
                                    Penangguhan fitur Community untuk sementara.
                                </li>

                                <li className="list-disc">
                                    Penangguhan akun untuk jangka waktu tertentu.
                                </li>

                                <li className="list-disc">
                                    Penonaktifan atau penghapusan akun.
                                </li>

                                <li className="list-disc">
                                    Pelaporan kepada pihak yang berwenang
                                    apabila terdapat dugaan pelanggaran hukum.
                                </li>
                            </ul>

                            <p className="mt-3 text-xs leading-6 text-brown-700/80">
                                Apabila suatu tindakan memenuhi unsur
                                pelanggaran hukum, pengguna dapat menghadapi
                                konsekuensi hukum sesuai peraturan
                                perundang-undangan yang berlaku, termasuk
                                kemungkinan pidana penjara dan/atau pidana
                                denda.
                            </p>

                            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-50/70 px-4 py-3">
                                <p className="text-[10px] leading-5 text-brown-700/70">
                                    <strong className="text-brown-900">
                                        Penting:
                                    </strong>{" "}
                                    pidana atau denda berdasarkan undang-undang
                                    bukan merupakan denda yang ditetapkan atau
                                    dipungut oleh ZYBA. Sanksi hukum ditentukan
                                    berdasarkan ketentuan hukum dan proses yang
                                    berlaku.
                                </p>
                            </div>
                        </section>

                        {/* Version */}
                        <div className="rounded-xl border border-brown-900/10 bg-[#F7F2E7] px-4 py-3">
                            <p className="text-[10px] leading-5 text-brown-700/60">
                                Community Guidelines Version:{" "}
                                <strong>1.0</strong>
                            </p>

                            <p className="mt-1 text-[10px] leading-5 text-brown-700/60">
                                Dengan melanjutkan, kamu menyatakan telah
                                membaca dan memahami Community Guidelines ini.
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
                            onClick={() =>
                                setAccepted((value) => !value)
                            }
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${accepted
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "border-brown-900/25 bg-white"
                                }`}
                        >
                            {accepted && (
                                <Check
                                    size={13}
                                    strokeWidth={3}
                                />
                            )}
                        </button>

                        <span className="text-xs leading-5 text-brown-700/80">
                            Saya telah membaca, memahami, dan menyetujui{" "}
                            <strong className="font-bold text-brown-900">
                                Community Guidelines ZYBA
                            </strong>{" "}
                            serta memahami konsekuensi atas pelanggaran
                            terhadap ketentuan tersebut.
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                    <button
                        type="button"
                        disabled={!accepted || loading}
                        onClick={handleAccept}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-brown-900 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loading
                            ? "Menyimpan..."
                            : "Saya Mengerti & Lanjutkan"}

                        {!loading && <span>→</span>}
                    </button>

                    <p className="mt-3 text-center text-[10px] leading-4 text-brown-700/50">
                        Persetujuan ini akan disimpan pada akunmu.
                    </p>
                </div>
            </div>
        </div>
    );
}