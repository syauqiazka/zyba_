# ZYBA — Comprehensive Project & Architecture Audit

> **Document Status:** Authoritative Repository Audit  
> **Repository:** `https://github.com/syauqiazka/zyba_`  
> **Environment:** Next.js 14.2.15 (App Router), React 18.3.1, Tailwind CSS 3.4.13, Prisma 5.22.0, TypeScript 5.9.3

---

## 1. Executive Summary

ZYBA is a Gen Z mental health and personal growth sanctuary engineered around the core emotional cadence:
**Curhat (Catharsis) → Solusi (Evidence-Based Grounding) → Program (Micro-Habits) → Aksi (Mindful Daily Action)**.

The platform provides:
1. **Zyba Companion (Private AI Sanctuary):** A multi-provider conversational partner (Gemini 2.5 Flash, Groq Llama 3.3 70B, Mistral Ministral 8B, OpenRouter) with animal personas (Kina, Ollie, Rubi, Bruno), speech-to-text (Groq Whisper), and token-metered quota guards.
2. **Mood Check-In & Daily Assessment:** Canonical daily emotional tracking, sleep rating, physical symptoms, and Catmull-Rom cubic spline waveform visualization.
3. **Smart Activity Planner & 4-7-8 Breathing Garden:** Clinical sensory grounding, custom breathing pacing, and ambient soundscapes.
4. **Ruang Sehat (Wellness Journey):** Holistic wellness overview, Zyba Score computation, and progress milestones.
5. **Lingkar Komunitas Hangat (Community):** An empathetic social sanctuary featuring anonymous reflection feeds, "Kirim Pelukan" (*Hug*) supportive interactions, topic tagging, guidelines, and instant safety hotline integration.
6. **Onboarding Arrival Ritual:** An 8-step clinical intake and profile setup gated by server middleware.

---

## 2. Technology Stack & Dependencies

### Core Framework & Runtime
- **Next.js:** `14.2.15` (App Router architecture with standalone output configuration, route handlers, server-side redirects, and suspense boundaries).
- **React:** `18.3.1` (Client and Server Components, React Portal for overflow-immune tooltips and modals).
- **TypeScript:** `5.9.3` (Strict type-checking with zero current compilation errors via `npx tsc --noEmit`).

### Styling & Design System
- **Tailwind CSS:** `3.4.13` with custom semantic tokens (`bg-cream`, `text-brown-900`, `bg-orange-500`, `bg-green-500`, canonical mood tokens).
- **Fonts:** `Manrope` (`font-display`, weights 500/600/700/800) for display/editorial titles; `DM Sans` (`font-body`, weights 400/500/600/700) for high-legibility interface copy.
- **Iconography:** `lucide-react 1.47.0` (Stroke width 1.8px; strict anti-slop rule eliminating emoji icons).

### Database & ORM
- **Prisma ORM:** `5.22.0` multi-schema architecture with 3 isolated database clients:
  1. `accountDb` (`prisma/account/schema.prisma` → `src/generated/account-client`): Manages `User`, `Assessment`, `DailyAssessment`, `MoodEntry`, `JournalEntry`, `ActivityLog`, `Subscription`, `NotificationPref`, `Badge`, `UserBadge`.
  2. `companionDb` (`prisma/companion/schema.prisma` → `src/generated/companion-client`): Manages `Conversation`, `Message`, `CompanionPersona`, `TokenQuotaUsage`.
  3. `communityDb` (`prisma/community/schema.prisma` → `src/generated/community-client`): Manages `CommunityPost`, `Comment`, `PostLike`, `PostHug`, `Bookmark`, `DirectMessage`, `Follow`, `Report`, `Appeal`.

### Security & Authentication
- **Password Security:** `bcryptjs 3.0.3` with cost 12 hashing and timing-safe `compare`.
- **Session Tokens:** `jose 6.2.12` signing cryptographically secure HS256 JWT tokens with 30-day expiry stored in `auth-token` HTTP cookies.
- **OTP Verification:** HMAC-SHA256 challenge-proof tokens with expiration timestamps, preventing OTP exposure in API payloads.
- **Route Gating:** `middleware.ts` enforcing `onboardingCompleted` checks, preventing non-onboarded users from accessing protected sanctuary areas.
- **Crisis Detection:** `src/lib/crisisDetection.ts` screening user inputs for acute distress and mounting immediate Indonesian emergency hotlines (Sejiwa Kemenkes 119 ext. 8, Lisa Emergency, Yayasan Pulih).

---

## 3. Directory Structure Map

```
zyba_/
├── prisma/
│   ├── account/schema.prisma      # Auth, profiles, habits, assessments
│   ├── companion/schema.prisma    # AI conversations, messages, token quotas
│   └── community/schema.prisma    # Posts, hugs, comments, bookmarks, DMs
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts & metadata
│   │   ├── page.tsx               # Public landing page
│   │   ├── ClientLayout.tsx       # Floating Zen Dock & auth wrapper
│   │   ├── dashboard/             # Sanctuary overview & right rail
│   │   ├── mood-check-in/         # Canonical daily emotional check-in
│   │   ├── companion/             # Tanya Zyba AI chat sanctuary
│   │   ├── activity/              # Activity planner & 4-7-8 breathing garden
│   │   ├── wellness-journey/      # Holistic progress, spline charts, score
│   │   ├── community/             # Circles of support & anonymous reflections
│   │   ├── resources/             # Curated sanctuary library & audio guides
│   │   ├── assessment/            # 8-step intake & security setup
│   │   ├── daily-assessment/      # Server-side redirect to /mood-check-in
│   │   ├── settings/              # Account, notifications, billing, export
│   │   ├── achievements/          # Badges & Hearth milestones
│   │   ├── guidebook/             # Crisis directory & mental health guide
│   │   ├── welcome/               # Interactive tour & ritual overview
│   │   ├── login/ & onboarding/   # Auth entry points
│   │   ├── admin/                 # Moderation & payment operations
│   │   └── api/                   # 30+ modular API route handlers
│   ├── backend/
│   │   ├── db/                    # accountClient, companionClient, communityClient
│   │   └── billing/               # Token quotas & entitlements
│   ├── components/
│   │   ├── ui/                    # Sidebar, MobileBottomNav, GroundingModal, AmbientSoundDock
│   │   ├── landing/               # LandingHero, Features, Header, Testimonials
│   │   └── profile/               # ProfilePopover, ProfileSettingsModal
│   ├── hooks/                     # useFreshData, useSTT, useKeyboardNav
│   └── lib/                       # auth, crisisDetection, tokenizer, activityIcons
└── docs/                          # Comprehensive architectural specifications
```

---

## 4. Current State Assessment & Technical Health

| Evaluation Vector | Health Rating | Audit Observations |
|---|:---:|---|
| **TypeScript Strictness** | **100% Pass** | `npx tsc --noEmit` exits with code 0 across all app routes and library modules. |
| **Next.js Production Build** | **100% Pass** | `npm run build` succeeds completely; all 76 static and server-rendered routes build cleanly. |
| **Security Hardening** | **100% Pass** | Rounds 2 & 3 test suites pass 100%; zero plain-text secrets, rate-limiting active, IDOR protection verified. |
| **Data Hygiene** | **100% Pass** | Local JSON fallbacks excluded from git (`.gitignore`), zero passwords in repository history. |
| **Anti-Slop Compliance** | **High** | Emoji interface icons removed; replaced with Lucide 1.8px SVGs. Radius hierarchy standardized. |
| **Design Cohesion** | **Strong** | "The Tactile Sanctuary" palette (Cream `#F7F2E7`, Brown `#3B2A20`, Terracotta `#F2884B`, Sage `#8FAE5D`) enforced across major layouts. |

