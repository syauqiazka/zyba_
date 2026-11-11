# ZYBA — Complete Component Inventory & Design System Mapping

> **Document Status:** Authoritative Component Inventory  
> **Source of Truth:** Real codebase components audited against Design System tokens

---

## 1. Global Shell & Navigation System

| Component | File Path | Props & API Contract | Design Tokens & Radius | State Handled |
|---|---|---|---|---|
| **Floating Zen Dock** | `src/components/ui/Sidebar.tsx` | `{ onClose?: () => void }` | `md:w-[76px]`, `rounded-[28px]`, `bg-white/90 backdrop-blur-md`, `border-brown-900/10` | Default, Active Nav Pill, Hover Portal Tooltip, Plus Badge |
| **Mobile Bottom Nav** | `src/components/ui/MobileBottomNav.tsx` | No external props | `h-14`, `rounded-full`, `bg-white/95 backdrop-blur-md`, `border-brown-900/10`, `z-40` | Active route icon, notification badge dot |
| **Ambient Sound Dock** | `src/components/ui/AmbientSoundDock.tsx` | Embedded in `Sidebar.tsx` | `rounded-2xl`, `border-brown-900/10`, `bg-cream/40` | Idle, Playing (animated audio bars), Track select, Volume slider |
| **Grounding Modal** | `src/components/ui/GroundingModal.tsx` | `{ isOpen: boolean; onClose: () => void }` | `max-w-lg`, `rounded-[24px]`, `bg-white`, `border-brown-900/10` | 5-Step Sensory Stepper (5-4-3-2-1), Completed state, DB sync |
| **User Avatar** | `src/components/ui/UserAvatar.tsx` | `{ src?: string; name: string; size?: "sm"\|"md"\|"lg"\|"xl"; showStatus?: boolean }` | `rounded-full`, `border-2 border-white/20`, fallback initials | Image loaded, fallback monogram, cooldown status indicator |
| **Avatar Crop Modal** | `src/components/ui/AvatarCropModal.tsx` | `{ isOpen: boolean; imageSrc: string \| null; onClose: () => void; onConfirm: (file: File) => Promise<void>; isUploading: boolean }` | `max-w-md`, `rounded-[24px]`, canvas crop | Drag-to-crop, zoom slider, uploading spinner |
| **Profile Popover** | `src/components/profile/ProfilePopover.tsx` | `{ user: ProfileUser; isOpen: boolean; onClose: () => void; anchorPosition?: { top: number; left: number } }` | `w-72`, `rounded-[24px]`, `bg-white`, `border-brown-900/10`, `shadow-lg` | Authenticated session, streak, score ring, quick links, logout |
| **Profile Settings Modal** | `src/components/profile/ProfileSettingsModal.tsx` | `{ user: ProfileUser; isOpen: boolean; onClose: () => void; onUserUpdate: (u: any) => void; onLogout: () => void }` | `max-w-xl`, `rounded-[24px]`, `bg-white` | Name edit, bio edit, status message, danger zone (delete account) |

---

## 2. Dashboard Sanctuary Components (`/dashboard`)

| Component | File Path | Props & API Contract | Design Tokens & Radius | State Handled |
|---|---|---|---|---|
| **Sanctuary Hero Anchor** | Integrated in `src/app/dashboard/page.tsx` | Dynamic user session | `rounded-[28px]`, `bg-[#344638] text-cream border border-[#445B4A]` | Dynamic greeting, empathetic subtitle, emotional weather badge |
| **Tactile Metric Cards** | `src/app/dashboard/components/TactileMetricCards.tsx` | `{ streak: number; conversationCount: number; score: number \| null; condition: string; hasAssessment: boolean }` | `grid grid-cols-1 sm:grid-cols-3 gap-3.5`, `rounded-[20px]`, `bg-white/90` | Active streak, conversation count, Zyba score pebble with organic tint |
| **Weekly Task Cards** | `src/app/dashboard/components/WeeklyTaskCards.tsx` | `{ hasAssessment: boolean; streak: number }` | `rounded-2xl`, `border-brown-900/10`, `bg-white/90` | Check-In status, Reflection prompt, Breathing recommendation |
| **Companion Gateway** | `src/app/dashboard/components/CompanionWidget.tsx` | `{ conversationCount: number }` | `rounded-[24px]`, `bg-cream border border-brown-900/10` | Quick chat prompt input, direct start button, recent topics |
| **Stress Level & Waveform** | `src/app/dashboard/components/StressLevelChart.tsx` | `{ initialHistory: any[] }` | `rounded-[24px]`, `bg-white/90 border border-brown-900/10` | 14-day Catmull-Rom spline, hover tooltip, empty state |
| **Sanctuary Right Rail** | `src/app/dashboard/components/SanctuaryRightRail.tsx` | `{ conversationCount: number; hasAssessment: boolean; trackerState: Record<string, boolean>; toggleTracker: (k: string) => void }` | `w-full`, `rounded-[24px]`, `bg-[#FAF7F2] border border-brown-900/10` | Specialist card, Kotak Tenang trigger, Today's routine checklist, Mood banner |
| **Metric Score Card** | `src/app/dashboard/components/MetricScoreCard.tsx` | `{ score: number \| null; condition: string; hasAssessment: boolean }` | `rounded-[24px]`, `bg-white/90 border border-brown-900/10` | Ring skor hening, category breakdown (Mental, Fisik, Sosial) |
| **Quick Access Cards** | `src/app/dashboard/components/QuickAccessCards.tsx` | No external props | `rounded-2xl`, `border-brown-900/10` | Breathing shortcut, audio relaxation link, Sejiwa 119 ext. 8 hotline |

---

## 3. Zyba Companion Components (`/companion`)

| Component | File Path | Props & API Contract | Design Tokens & Radius | State Handled |
|---|---|---|---|---|
| **Companion Sidebar** | `src/app/companion/components/CompanionSidebar.tsx` | `{ conversations: Conversation[]; activeId: string; onSelect: (id: string) => void; onNew: () => void; onDelete: (id: string) => void }` | `w-64`, `rounded-[24px]`, `bg-white/90 border border-brown-900/10` | Conversation list, active thread highlight, delete confirmation |
| **Chat Header** | `src/app/companion/components/ChatHeader.tsx` | `{ activePersona: CompanionPersona; onPersonaChange: (p: CompanionPersona) => void; conversationTitle: string }` | `rounded-2xl`, `border-b border-brown-900/10` | Animal persona switcher (Kina, Ollie, Rubi, Bruno), presence status |
| **Token Meter Badge** | `src/app/companion/components/TokenMeterBadge.tsx` | `{ quota: TokenQuota }` | `rounded-full`, dynamic health tint (`>40%` green, `15-40%` orange, `≤15%` red) | Live token count, remaining percentage gauge, upgrade tooltip |
| **Model Selector** | `src/app/companion/components/ModelSelector.tsx` | `{ currentModel: string; onSelect: (m: string) => void }` | `rounded-xl`, `border border-brown-900/15`, popover anchor | Gemini 2.5 Flash, Groq Llama 3.3, Mistral Ministral 8B |
| **Chat Messages** | `src/app/companion/components/ChatMessages.tsx` | `{ messages: Message[]; isStreaming: boolean }` | `rounded-2xl`, user `bg-brown-900 text-cream`, AI `bg-white/95 border-brown-900/10` | Streaming markdown bubbles, audio TTS button, crisis warning banner |
| **Chat Input** | `src/app/companion/components/ChatInput.tsx` | `{ onSend: (text: string) => void; isRecording: boolean; onToggleRecording: () => void; isGenerating: boolean }` | `rounded-2xl`, `border border-brown-900/15`, focus ring | Multiline auto-expanding textarea, Groq Whisper STT mic, send button |
| **Quota Exceeded Modal** | `src/app/companion/components/QuotaExceededModal.tsx` | `{ isOpen: boolean; onClose: () => void; plan: "FREE" \| "PLUS" }` | `max-w-md`, `rounded-[24px]`, `bg-white` | Daily limit explanation, reset timer at midnight WIB, upgrade CTA |

---

## 4. Community Components (`/community`)

| Component | File Path | Props & API Contract | Design Tokens & Radius | State Handled |
|---|---|---|---|---|
| **Post Card** | `src/app/community/components/PostCard.tsx` | `{ post: CommunityPost; onHug: (id: string) => void; onBookmark: (id: string) => void; onComment: (id: string) => void }` | `rounded-[20px]`, `bg-white/90 border border-brown-900/10` | Anonymous avatar, empathetic topic badge, "Kirim Pelukan" hug, bookmark |
| **Compose Box** | `src/app/community/components/ComposeBox.tsx` | `{ onSubmit: (post: CreatePostData) => Promise<void> }` | `rounded-[20px]`, `bg-white/90 border border-brown-900/10` | Textarea, topic selector (Refleksi, Hubungan, Kecemasan), anonymous toggle |
| **Sidebar Info** | `src/app/community/components/SidebarInfo.tsx` | No external props | `rounded-[24px]`, `bg-white/90 border border-brown-900/10` | Sanctuary rules, topic cloud, Sejiwa 119 ext. 8 hotline support card |
| **Create Post Modal** | `src/app/community/components/CreatePostModal.tsx` | `{ isOpen: boolean; onClose: () => void; onCreated: () => void }` | `max-w-lg`, `rounded-[24px]`, `bg-white` | Modal version of compose box triggered by floating "+" button on mobile |

---

## 5. Smart Activity & Breathing Components (`/activity`)

| Component | File Path | Props & API Contract | Design Tokens & Radius | State Handled |
|---|---|---|---|---|
| **Breathing Exercise** | `src/app/activity/components/BreathingExercise.tsx` | `{ onComplete: () => void }` | `rounded-[24px]`, `bg-white/90 border border-brown-900/10` | 4-7-8 method, 4 cycles (~76s), radial SVG expansion, ambient sound select |
| **Daily Plan** | `src/app/activity/components/DailyPlan.tsx` | `{ activities: Activity[]; onToggle: (id: string) => void }` | `rounded-[20px]`, `bg-white/90 border border-brown-900/10` | Morning, afternoon, and evening routine checklist items with SVG icons |
| **Zyba Recommendations** | `src/app/activity/components/ZybaRecommendations.tsx` | `{ condition: string }` | `rounded-[20px]`, `bg-cream border border-brown-900/10` | Contextual habit recommendations tailored to user condition |
| **Activity Universal Icon**| `src/lib/activityIcons.tsx` | `{ name: string; className?: string }` | Lucide SVG garis halus 1.8px | Maps 25+ semantic activity keys (walking, breathing, journal, meditation) |

---

## 6. Ruang Sehat & Mood Components

| Component | File Path | Props & API Contract | Design Tokens & Radius | State Handled |
|---|---|---|---|---|
| **Progress Overview** | `src/app/wellness-journey/components/ProgressOverview.tsx` | `{ zybaScore: number \| null; condition: string; streak: number }` | `rounded-[24px]`, `bg-[#344638] text-cream` | Ring Skor Hening SVG 84px, consistency count, condition badge |
| **Wellness Trend Chart** | `src/app/wellness-journey/components/WellnessTrendChart.tsx` | `{ history: DailyAssessment[] }` | `rounded-[20px]`, `bg-white/90 border border-brown-900/10` | Catmull-Rom cubic Bézier smooth spline, interactive data point hover |
| **Mood Selector** | `src/app/mood-check-in/page.tsx` & `src/components/MoodSelector.tsx` | `{ selected: Mood; onSelect: (m: Mood) => void }` | `rounded-2xl`, 5 canonical pebbles | Depressed, Sad, Neutral, Happy, Overjoyed with tactile active ring |

