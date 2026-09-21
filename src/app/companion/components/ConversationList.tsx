"use client";

interface Conversation {
  id: string;
  title: string;
  lastMsg: string;
  time: string;
  emotionTag: string;
  messages: any[];
}

interface Props {
  conversations: Conversation[];
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  handleCreateNewChat: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedModel: string;
}

export function getMoodColor(emotion?: string): string {
  const norm = (emotion || "").toLowerCase();
  if (norm.includes("depress") || norm.includes("cemas") || norm.includes("berat") || norm.includes("overthink")) {
    return "bg-mood-depressed";
  }
  if (norm.includes("sad") || norm.includes("sedih") || norm.includes("lelah") || norm.includes("kecewa")) {
    return "bg-mood-sad";
  }
  if (norm.includes("happy") || norm.includes("senang") || norm.includes("lega") || norm.includes("excited")) {
    return "bg-mood-happy";
  }
  if (norm.includes("overjoy") || norm.includes("calm") || norm.includes("tenang") || norm.includes("bersyukur")) {
    return "bg-mood-overjoyed";
  }
  return "bg-mood-neutral";
}

export default function ConversationList({
  conversations,
  activeConvId,
  setActiveConvId,
  handleCreateNewChat,
  searchQuery,
  setSearchQuery,
  selectedModel,
}: Props) {
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-[320px] shrink-0 border-r border-brown-900/10 flex flex-col justify-between bg-cream/40 min-h-[500px]">
      {/* Header Kecil: Percakapan + Tombol + Baru */}
      <div className="p-4 border-b border-brown-900/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brown-900">
            Percakapan ({conversations.length})
          </h3>
          <button
            onClick={handleCreateNewChat}
            className="rounded-pill bg-orange-500 hover:opacity-90 text-white text-xs font-semibold px-3 py-1.5 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>+</span>
            <span>Baru</span>
          </button>
        </div>

        {/* Input Search Riwayat */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari riwayat percakapan..."
            className="w-full bg-white rounded-xl border border-brown-900/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 placeholder:text-brown-700/50"
          />
        </div>
      </div>

      {/* Daftar Item Percakapan */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-brown-700">
            Tidak ada riwayat percakapan.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            const moodColorClass = getMoodColor(conv.emotionTag);

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-left p-3 rounded-xl cursor-pointer transition-all flex items-start gap-2.5 ${
                  isActive
                    ? "bg-green-100 border-l-[3px] border-l-orange-500 shadow-sm"
                    : "hover:bg-white/70 border-l-[3px] border-l-transparent"
                }`}
              >
                {/* Avatar / Inisial */}
                <div className="w-8 h-8 rounded-full bg-white border border-brown-900/10 flex items-center justify-center shrink-0 font-display font-bold text-xs text-brown-900">
                  {conv.title.charAt(0).toUpperCase() || "Z"}
                </div>

                {/* Info Percakapan */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-brown-900 truncate">
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-brown-700 shrink-0 font-medium">
                      {conv.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-brown-700 truncate mb-1.5">
                    {conv.lastMsg || "Percakapan baru"}
                  </p>

                  {/* Titik Mood Emosi Dominan */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${moodColorClass} shrink-0`}
                      title={`Emosi: ${conv.emotionTag}`}
                    />
                    <span className="text-[10px] font-medium text-brown-700 truncate">
                      {conv.emotionTag}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info Model */}
      <div className="p-3 border-t border-brown-900/10 bg-white/50 flex items-center justify-between text-[11px] text-brown-700">
        <span className="truncate max-w-[160px]">
          Model: <strong className="text-brown-900">{selectedModel}</strong>
        </span>
        <span className="font-bold text-green-500">Zyba Free</span>
      </div>
    </aside>
  );
}