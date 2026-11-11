"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseSTTOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  lang?: string;
}

/**
 * useSTT — Real Web Speech API recognition hook with Indonesian default (id-ID).
 * Provides listening lifecycle, live transcription callback, and clear error feedback.
 */
export function useSTT(options?: UseSTTOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Browser kamu belum mendukung pengenalan suara langsung (Web Speech API). Silakan gunakan Google Chrome, Edge, atau Safari."
      );
      setIsListening(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = optionsRef.current?.lang || "id-ID";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          setTranscript(currentText);
          optionsRef.current?.onTranscript?.(
            currentText,
            Boolean(finalTranscript)
          );
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[STT Error]:", event.error);
        if (event.error === "not-allowed") {
          setError(
            "Izin mikrofon ditolak. Mohon izinkan akses mikrofon di pengaturan browser Anda."
          );
        } else if (event.error === "no-speech") {
          setError("Tidak ada suara yang terdeteksi. Silakan coba bicara kembali.");
        } else if (event.error === "network") {
          setError("Kendala jaringan pada pengenalan suara.");
        } else if (event.error !== "aborted") {
          setError(`Gagal memproses suara (${event.error}).`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err: any) {
      console.error("[STT Start Error]:", err);
      setError("Gagal memulai mikrofon. Pastikan mikrofon terpasang.");
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    error,
    setError,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  };
}

