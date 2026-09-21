"use client";

import React, { useState } from "react";

interface ForgotPasswordCardProps {
  onBack: () => void;
  defaultEmail?: string;
}

export default function ForgotPasswordCard({ onBack, defaultEmail = "" }: ForgotPasswordCardProps) {
  const [selectedMethod, setSelectedMethod] = useState<"PASSWORD" | "2FA" | "AUTHENTICATOR">("PASSWORD");
  const [targetContact, setTargetContact] = useState(defaultEmail || "alex@zyba.app");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-brown-900/10 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header dengan Tombol Back & Kubah Halus */}
      <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
          title="Kembali ke Sign In"
        >
          ←
        </button>

        <div className="w-10 h-10 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-xl mb-1">
          🔐
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-brown-700/70">
          Account Recovery
        </span>
      </div>

      <div className="p-8 flex flex-col gap-5 bg-white -mt-4 rounded-t-3xl z-10">
        <div className="flex flex-col">
          <h2 className="font-display font-extrabold text-2xl text-brown-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-xs text-brown-700/80 mt-1 leading-relaxed">
            Select contact details where you want to reset your password
          </p>
        </div>

        {isSent ? (
          <div className="p-6 rounded-2xl bg-green-100/60 border border-green-500/20 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white text-2xl flex items-center justify-center shadow-sm">
              ✓
            </div>
            <h3 className="font-display font-bold text-sm text-brown-900">
              Instruksi Pemulihan Terkirim!
            </h3>
            <p className="text-xs text-brown-700 leading-relaxed">
              Kami telah mengirimkan tautan reset dan instruksi ke{" "}
              <strong className="text-brown-900">{targetContact}</strong>. Silakan periksa kotak masuk atau spam.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-2 w-full py-3 rounded-full bg-brown-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors"
            >
              Kembali ke Sign In →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Opsi 1: Password (Email) */}
            <button
              type="button"
              onClick={() => setSelectedMethod("PASSWORD")}
              className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all ${
                selectedMethod === "PASSWORD"
                  ? "border-orange-500 bg-orange-100/30 shadow-xs"
                  : "border-brown-900/10 hover:border-brown-900/20 bg-cream/30"
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-brown-900/10 flex items-center justify-center text-xl shrink-0">
                🔒
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-xs md:text-sm text-brown-900">
                  Password Reset Link
                </span>
                <span className="text-[11px] text-brown-700/80">
                  Via email terdaftar ({targetContact || "email kamu"})
                </span>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === "PASSWORD" ? "border-orange-500 bg-orange-500" : "border-brown-900/30"
              }`}>
                {selectedMethod === "PASSWORD" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </button>

            {/* Opsi 2: Use 2FA */}
            <button
              type="button"
              onClick={() => setSelectedMethod("2FA")}
              className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all ${
                selectedMethod === "2FA"
                  ? "border-orange-500 bg-orange-100/30 shadow-xs"
                  : "border-brown-900/10 hover:border-brown-900/20 bg-cream/30"
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-brown-900/10 flex items-center justify-center text-xl shrink-0">
                📱
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-xs md:text-sm text-brown-900">
                  Use 2FA
                </span>
                <span className="text-[11px] text-brown-700/80">
                  Kirim kode verifikasi cepat via SMS / WhatsApp
                </span>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === "2FA" ? "border-orange-500 bg-orange-500" : "border-brown-900/30"
              }`}>
                {selectedMethod === "2FA" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </button>

            {/* Opsi 3: Google Authenticator */}
            <button
              type="button"
              onClick={() => setSelectedMethod("AUTHENTICATOR")}
              className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all ${
                selectedMethod === "AUTHENTICATOR"
                  ? "border-orange-500 bg-orange-100/30 shadow-xs"
                  : "border-brown-900/10 hover:border-brown-900/20 bg-cream/30"
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-brown-900/10 flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-xs md:text-sm text-brown-900">
                  Google Authenticator
                </span>
                <span className="text-[11px] text-brown-700/80">
                  Verifikasi menggunakan token 6-digit aplikasi
                </span>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === "AUTHENTICATOR" ? "border-orange-500 bg-orange-500" : "border-brown-900/30"
              }`}>
                {selectedMethod === "AUTHENTICATOR" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </button>

            {/* Input Target */}
            <div className="mt-2">
              <label className="text-xs font-bold text-brown-900 block mb-1">
                {selectedMethod === "2FA" ? "Nomor Telepon:" : "Konfirmasi Email Akun:"}
              </label>
              <input
                type={selectedMethod === "2FA" ? "tel" : "email"}
                value={targetContact}
                onChange={(e) => setTargetContact(e.target.value)}
                placeholder={selectedMethod === "2FA" ? "+62 812-3456-7890" : "namaanda@gmail.com"}
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            {/* Tombol Send Password 🔒 khas Figma */}
            <button
              type="button"
              disabled={isSending}
              onClick={handleSend}
              className="mt-3 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isSending ? (
                <span>Mengirim Permintaan...</span>
              ) : (
                <>
                  <span>Send Password</span>
                  <span className="text-sm">🔒</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
