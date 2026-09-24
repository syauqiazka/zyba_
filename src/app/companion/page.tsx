"use client";

import React from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import CrisisBanner from "./components/CrisisBanner";
import QuotaExceededModal from "./components/QuotaExceededModal";
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
    selectedPersona,
    setSelectedPersona,
    isSending,
    showSettingsModal,
    setShowSettingsModal,
    showPersonaModal,
    setShowPersonaModal,
    showProModal,
    setShowProModal,
    showDeleteModal,
    setShowDeleteModal,
    setConvIdToDelete,
    handleDeleteChat,
    crisisAlert,
    setCrisisAlert,
    handleSendMessage,
    activeConv,
    messagesEndRef,
    quotaRemaining,
    isTTSEnabled,
    setIsTTSEnabled,
    ttsProvider,
    setTTSProvider,
  } = useCompanion();

  const hasMessages = (activeConv?.messages || []).length > 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-brown-900/10 overflow-hidden shadow-sm min-h-0">
          <ChatHeader
            activeConv={activeConv}
            selectedModel={selectedModel}
            commStyle={commStyle}
            selectedPersona={selectedPersona}
            setSelectedPersona={setSelectedPersona}
            setShowSettingsModal={setShowSettingsModal}
            setShowPersonaModal={setShowPersonaModal}
            setShowDeleteModal={setShowDeleteModal}
            setShowProModal={setShowProModal}
            isTTSEnabled={isTTSEnabled}
            setIsTTSEnabled={setIsTTSEnabled}
            ttsProvider={ttsProvider}
            setTTSProvider={setTTSProvider}
          />

          {/* Crisis Banner (10.5) — calm, supportive */}
          {crisisAlert && (
            <CrisisBanner onClose={() => setCrisisAlert(false)} />
          )}

          {/* Quota indicator for Free users (27.5) */}
          {quotaRemaining !== null && quotaRemaining <= 20 && (
            <div className="px-4 py-2 bg-orange-50 border-b border-orange-200 text-center">
              <p className="text-xs text-brown-700">
                <span className="font-bold">{quotaRemaining}/20</span> pesan tersisa hari ini · 
                <a href="/settings/zyba-plus" className="ml-1 text-orange-500 font-bold hover:underline">
                  Upgrade untuk unlimited
                </a>
              </p>
            </div>
          )}

          {/* Chat Messages / Center Empty State (Image 1 Claude.ai) */}
          <ChatMessages
            messages={activeConv?.messages || []}
            isSending={isSending}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            selectedPersona={selectedPersona}
            messagesEndRef={messagesEndRef}
            onSelectPromptStarter={(prompt) => handleSendMessage(prompt)}
            onSendMessage={(prompt) => handleSendMessage(prompt)}
            chatMode={chatMode}
            setChatMode={setChatMode}
            ttsProvider={ttsProvider}
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

      {/* Persona Selection Modal */}
      {(showSettingsModal || showPersonaModal) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  AI Companion
                </span>
                <h3 className="font-display font-extrabold text-xl text-brown-900 mt-0.5">
                  Pilih Karakter Zyba
                </h3>
                <p className="text-xs text-brown-700 mt-0.5">
                  Pilih kepribadian pendamping yang paling sesuai dengan kebutuhanmu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowPersonaModal(false);
                }}
                className="w-8 h-8 rounded-full bg-cream text-brown-700 font-bold hover:bg-brown-900 hover:text-white transition-colors flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <PersonaPicker
              selected={selectedPersona}
              onChange={(p) => {
                setSelectedPersona(p);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setShowSettingsModal(false);
                setShowPersonaModal(false);
              }}
              className="w-full py-3 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Simpan Karakter
            </button>
          </div>
        </div>
      )}

      {/* Quota Exceeded Modal (Bagian 10.6 + 27) */}
      <QuotaExceededModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        remaining={quotaRemaining || 0}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-brown-900/10 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>
            <h3 className="font-display font-extrabold text-base text-brown-900 text-center">
              Hapus Percakapan Ini?
            </h3>
            <p className="text-xs text-brown-700 text-center leading-relaxed">
              Semua riwayat obrolan dalam topik ini akan dihapus secara permanen dari akunmu.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConvIdToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-full border border-brown-900/15 text-xs font-bold text-brown-700 hover:bg-cream transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteChat()}
                className="flex-1 py-2.5 rounded-full bg-danger text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
