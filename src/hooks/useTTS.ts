import { useState, useRef } from "react";

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string, useElevenLabs = false) => {
    if (isPlaying) {
      // Stop current audio
      audioRef.current?.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/companion/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, useElevenLabs }),
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type");
      
      if (contentType?.includes("audio")) {
        // Audio returned from server (Edge TTS or ElevenLabs)
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          console.error("[TTS] Audio playback error");
        };
        
        await audio.play();
      } else {
        // Fallback: use browser Web Speech API
        const data = await response.json();
        if (data.fallback) {
          speakWithBrowser(text);
        }
      }
    } catch (err) {
      console.error("[TTS] Error:", err);
      // Last resort: browser TTS
      speakWithBrowser(text);
    } finally {
      setIsLoading(false);
    }
  };

  const speakWithBrowser = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("[TTS] Web Speech API not supported");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  };

  return { speak, stop, isPlaying, isLoading };
}
