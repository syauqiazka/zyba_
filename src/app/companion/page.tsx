"use client";

import React from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import CrisisBanner from "./components/CrisisBanner";
import { useCompanion } from "./context/CompanionContext";
import PersonaPicker from "./components/PersonaPicker";
import { PersonaId } from "@/backend/ai/personas";
import { useState } from "react";

/**
 * Companion Page - 100% Claude.ai Layout & Sub-Page Switching
 * 
 * Sidebar is rendered by layout.tsx.
 * Switching items in sidebar (Projects, Artifacts, Code, Chats) changes the view immediately.
 */
export default function CompanionPage() {
  const {
    activeSection,
    chatMode,
    setChatMode,
    inputText,
    setInputText,
    isVoiceActive,
    setIsVoiceActive,
    commStyle,
    setCommStyle,
    selectedModel,
    setSelectedModel,
    isSending,
    showSettingsModal,
    setShowSettingsModal,
    showProModal,
    setShowProModal,
    showDeleteModal,
    setShowDeleteModal,
    crisisAlert,
    setCrisisAlert,
    handleSendMessage,
    activeConv,
    messagesEndRef,
  } = useCompanion();

  const hasMessages = (activeConv?.messages || []).length > 0;
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("KINA");

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Window only — scope creep projects/artifacts/code dihapus (Bagian 23.1) */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-brown-900/10 overflow-hidden shadow-sm min-h-0">
          <ChatHeader
            activeConv={activeConv}
            selectedModel={selectedModel}
            commStyle={commStyle}
            setShowSettingsModal={setShowSettingsModal}
            setShowDeleteModal={setShowDeleteModal}
            setShowProModal={setShowProModal}
          />

          {/* Crisis Banner (10.5) — calm, supportive */}
          {crisisAlert && (
            <CrisisBanner onClose={() => setCrisisAlert(false)} />
          )}

          {/* Chat Messages / Center Empty State (Image 1 Claude.ai) */}
          <ChatMessages
            messages={activeConv?.messages || []}
            isSending={isSending}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            messagesEndRef={messagesEndRef}
            onSelectPromptStarter={(prompt) => handleSendMessage(prompt)}
            onSendMessage={(prompt) => handleSendMessage(prompt)}
            chatMode={chatMode}
            setChatMode={setChatMode}
          />

          {/* Sticky Bottom Input — shown when there are active messages in the conversation */}
          {hasMessages && (
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={() => handleSendMessage()}
              isSending={isSending}
              isVoiceActive={isVoiceActive}
              setIsVoiceActive={setIsVoiceActive}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              commStyle={commStyle}
              setCommStyle={setCommStyle}
            />
          )}
      </div>

      {/* Settings Modal — FASE 4: PersonaPicker (Bagian 21) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-brown-900">Pilih Karakter Zyba</h3>
              <button type="button" onClick={() => setShowSettingsModal(false)} className="text-brown-700 hover:text-brown-900 text-sm">✕</button>
            </div>
            <PersonaPicker selected={selectedPersona} onChange={setSelectedPersona} />
            <button type="button" onClick={() => setShowSettingsModal(false)} className="w-full py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-brown-900 transition-colors">
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}

      {/* Pro Modal (10.6) */}
      {showProModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-orange-100 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/20 flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center text-2xl shadow-md">
              ⚡
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-brown-900">
                Kuota Chat Harian Habis
              </h3>
              <p className="text-xs text-brown-700 mt-1 max-w-xs leading-relaxed">
                Buka batas percakapan tanpa limit, model Claude 3.5 Sonnet & GPT-4o, serta analitik wellness mendalam dengan Zyba Plus.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Fitur Zyba Plus segera hadir!");
                setShowProModal(false);
              }}
              className="w-full py-3.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              Upgrade ke Zyba Plus →
            </button>

            <button
              type="button"
              onClick={() => setShowProModal(false)}
              className="text-xs font-semibold text-brown-700 hover:text-brown-900 hover:underline"
            >
              Nanti saja
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-base text-brown-900">
              Hapus Percakapan Ini?
            </h3>
            <p className="text-xs text-brown-700">
              Semua riwayat obrolan dalam topik ini akan dihapus secara permanen.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-full border border-brown-900/15 text-xs font-bold text-brown-700 hover:bg-cream"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-danger text-white text-xs font-bold hover:opacity-90"
              >
                Hapus →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
