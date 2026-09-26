"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, FileText, Sprout, Check } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

interface SearchResult {
  id: string;
  userId?: string;
  type: "people" | "posts";
  name?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  content?: string;
  mediaUrl?: string;
}

export default function CommunitySearchView() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "people" | "posts">("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const QUICK_TOPICS = ["Mindfulness", "SleepRoutine", "Sharing", "SelfCare", "MentalHealth"];
  const QUICK_CREATORS = ["Sarah Jenkins", "Dimas Anggara", "Nadia Putri", "Rizky Pratama"];

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults();
      } else {
        setResults([]);
        setShowSuggestions(true);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, type]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const url = `/api/community/search?q=${encodeURIComponent(query)}&type=${type}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const combined: SearchResult[] = [];
        
        if (data.people) {
          combined.push(...data.people.map((p: any) => ({ ...p, type: "people" as const })));
        }
        if (data.posts) {
          combined.push(...data.posts.map((p: any) => ({ ...p, type: "posts" as const })));
        }
        
        setResults(combined);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "people") {
      // result.id is the userId — navigate to their profile
      router.push(`/community/profile/${result.id}`);
    } else {
      // For posts, go to the author's profile page
      if (result.userId) {
        router.push(`/community/profile/${result.userId}`);
      } else {
        router.push(`/community`);
      }
    }
  };

  const handleQuickTopicClick = (topic: string) => {
    setQuery(`#${topic}`);
    setType("posts");
  };

  const handleQuickCreatorClick = (creatorName: string) => {
    setQuery(creatorName);
    setType("people");
  };

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-5 animate-in fade-in duration-200">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-700/40">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, creators, or conversations..."
          autoFocus
          className="w-full bg-white rounded-2xl pl-11 pr-20 py-3 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/40 border border-brown-900/10 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            type="button"
            onClick={() => setType("people")}
            className={`p-1.5 rounded-lg transition-colors ${
              type === "people" ? "text-orange-500 bg-orange-50" : "text-brown-700/40 hover:text-brown-900"
            }`}
            title="People"
          >
            <User size={14} />
          </button>
          <button
            type="button"
            onClick={() => setType("posts")}
            className={`p-1.5 rounded-lg transition-colors ${
              type === "posts" ? "text-orange-500 bg-orange-50" : "text-brown-700/40 hover:text-brown-900"
            }`}
            title="Posts"
          >
            <FileText size={14} />
          </button>
        </div>
      </div>

      {/* Quick Topics */}
      {showSuggestions && !query && (
        <div className="bg-white rounded-2xl border border-brown-900/8 p-4 shadow-2xs">
          <h3 className="font-bold text-xs text-brown-900 mb-3 uppercase tracking-wider">
            Trending in Zyba Community
          </h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleQuickTopicClick(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 bg-cream text-brown-900 border-brown-900/8 hover:border-orange-500"
              >
                <Sprout size={10} className="text-green-600" />
                <span>#{t}</span>
              </button>
            ))}
          </div>
          <h3 className="font-bold text-xs text-brown-900 mb-3 uppercase tracking-wider mt-4">
            Popular Creators
          </h3>
          <div className="space-y-2">
            {QUICK_CREATORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleQuickCreatorClick(c)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-brown-900/5 transition-colors flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-orange-600">
                  {c.split(" ")[0][0]}{c.split(" ")[1][0]}
                </div>
                <span className="text-sm font-medium text-brown-900">{c}</span>
                <Check size={12} className="text-green-600 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-brown-900/8 p-8 text-center">
              <div className="text-xs text-brown-700/60">Searching...</div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  type="button"
                  onClick={() => handleResultClick(result)}
                  className="w-full bg-white rounded-2xl border border-brown-900/8 p-4 shadow-2xs hover:border-orange-500/40 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    {result.type === "people" ? (
                      <UserAvatar
                        src={result.avatarUrl}
                        name={result.name}
                        size="md"
                        showStatus={false}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cream border border-brown-900/10 flex items-center justify-center font-bold text-sm shrink-0">
                        <FileText size={16} className="text-brown-700" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {result.type === "people" ? (
                          <span className="font-bold text-sm text-brown-900">{result.name}</span>
                        ) : (
                          <span className="font-medium text-sm text-brown-900">Post by {result.name}</span>
                        )}
                        {result.type === "people" && (
                          <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
                        )}
                      </div>
                      {result.type === "people" ? (
                        <p className="text-xs text-brown-700/60 truncate">@{result.username}</p>
                      ) : (
                        <p className="text-xs text-brown-700/70 line-clamp-2">{result.content}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-brown-900/8 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cream border border-brown-900/8 flex items-center justify-center text-2xl mb-3 mx-auto">
                <Search size={24} className="text-brown-700/40" />
              </div>
              <h3 className="font-bold text-sm text-brown-900 mb-1">
                No results found
              </h3>
              <p className="text-xs text-brown-700/60 max-w-xs mx-auto">
                Try different keywords or check spelling.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
