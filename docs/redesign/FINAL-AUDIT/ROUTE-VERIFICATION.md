# ROUTE & ENDPOINT VERIFICATION MATRIX
**Project:** ZYBA — Digital Mental Wellness Platform  
**Scope:** Exhaustive Audit of All 26 App Pages & 37 API Endpoints  
**Audit Date:** November 2026  
**Auditor:** Design Systems & Staff QA Engineering  

---

## 1. Frontend Page Inventory (26 Accessible Routes)

Every page in the Next.js `app/` directory was audited for route accessibility, authentication protection via `middleware.ts`, layout wrapper integration, responsive design tokens, and state handling.

| # | Route | Purpose & Sanctuary Feature | Auth Guard | Layout Shell | Responsive Layout | Verification Status |
|---|---|---|---|---|---|---|
| 1 | `/` | Public Landing Sanctuary (Hero, 4 3D Cards, Impact Pillars, BPS Census Context) | Public | Root Layout | 3-Viewport (Mobile 375px, Tablet 768px, Desktop 1280px) | **VERIFIED** |
| 2 | `/onboarding` | Arrival Carousel, Mode Selection, Sign In/Up Trigger | Public (Auth redirect) | Root Layout | Centered card with gentle organic shadow | **VERIFIED** |
| 3 | `/assessment` | 8-Step Profile & Onboarding Gating Ritual | Session Required (`onboardingCompleted: false`) | Root Layout (Standalone Flow) | Split-stepper desktop, vertical card mobile | **VERIFIED** |
| 4 | `/dashboard` | Sanctuary Overview (Zyba Score, Daily Quota, Reflection, Shortcuts) | Session Required (`onboardingCompleted: true`) | Zen Dock Shell (`ClientLayout`) | Grid 12-col desktop, single col mobile | **VERIFIED** |
| 5 | `/companion` | AI Sanctuary Pavilion (Tanya Zyba, Personas, Token Meter, Voice Mode) | Session Required | Zen Dock Shell | 2-panel master-detail desktop, full screen mobile | **VERIFIED** |
| 6 | `/companion/[slug]` | Sub-spaces: `projects`, `artifacts`, `code`, `customize` | Session Required | Zen Dock Shell | Dynamic sub-space layout | **VERIFIED** |
| 7 | `/mood-check-in` | Canonical Daily Check-In & Ritual (Pebbles, Sleep, Stress, Tags, Journal) | Session Required | Zen Dock Shell | Responsive dual-column card layout | **VERIFIED** |
| 8 | `/daily-assessment` | Legacy check-in route (Unified to `/mood-check-in`) | Session Required | Server Redirect (`307`) | N/A (Server-side redirect) | **VERIFIED** |
| 9 | `/activity` | Smart Activity Planner & Taman Pernapasan 4-7-8 | Session Required | Zen Dock Shell | Multi-column activity cards + modal ritual | **VERIFIED** |
| 10 | `/wellness-journey` | Ruang Sehat: River of Mindful Seasons Bézier Spline, Progress Ring | Session Required | Zen Dock Shell | Asymmetric 65:35 golden spread | **VERIFIED** |
| 11 | `/community` | Warm Support Circles Feed, Kirim Pelukan, Anonymous Circles | Session Required | Zen Dock Shell | Feed column + sidebar circles desktop | **VERIFIED** |
| 12 | `/community/post/[id]` | Thread Detail & Mindful Peer Comments | Session Required | Zen Dock Shell | Nested reply thread with gentle dividers | **VERIFIED** |
| 13 | `/community/circle/[slug]` | Specific Sanctuary Circle Stream (Anxiety, Burnout, Sleep, etc.) | Session Required | Zen Dock Shell | Filtered circle feed + topic banner | **VERIFIED** |
| 14 | `/community/profile/[username]` | Public Pseudonym Profile, Earned Badges, Hearth Activity | Session Required | Zen Dock Shell | Tactile bio card + post history | **VERIFIED** |
| 15 | `/community/messages` | Private 1-on-1 Empathetic Messaging (Direct Messages) | Session Required | Zen Dock Shell | Split master-detail inbox | **VERIFIED** |
| 16 | `/resources` | Curated Sanctuary Library (Articles & Audio Guides) | Session Required | Zen Dock Shell | 3-column tactile paper card grid | **VERIFIED** |
| 17 | `/resources/article/[slug]` | Editorial Article Reader with Typography Controls | Session Required (PRO Gated) | Zen Dock Shell | Focused single-column typography reader | **VERIFIED** |
| 18 | `/resources/course/[slug]` | Structured Wellness Course & Guided Mindfulness Audio | Session Required (PRO Gated) | Zen Dock Shell | Course curriculum sidebar + audio player | **VERIFIED** |
| 19 | `/achievements` | Quiet Milestones & Hearth Badges | Session Required | Zen Dock Shell | 4-column badge showcase grid | **VERIFIED** |
| 20 | `/settings` | Sanctuary Settings (Profile, Privacy, Security, Notifications, PIN) | Session Required | Zen Dock Shell | Tabbed settings cards | **VERIFIED** |
| 21 | `/settings/zyba-plus` | Subscription Upgrade & Token Quota Tier Selection | Session Required | Zen Dock Shell | Tier comparison cards with tactile toggle | **VERIFIED** |
| 22 | `/guidebook` | Crisis Directory, Hotline Sejiwa 119 ext. 8, Grounding Techniques | Public / Session | Root Layout / Dock | High-contrast urgent card directory | **VERIFIED** |
| 23 | `/admin` | Sanctuary Administration & Moderation Dashboard | Admin Role Required | Admin Shell | Data grid + moderation action panel | **VERIFIED** |
| 24 | `/admin/moderation` | Community Flagged Posts, Toxicity Scoring & Appeal Review | Admin Role Required | Admin Shell | Review queue with ban/unban controls | **VERIFIED** |
| 25 | `/admin/billing` | Manual Payment Proof Verification & Subscription Activation | Admin Role Required | Admin Shell | Payment proof image reviewer & action pill | **VERIFIED** |
| 26 | `/not-found` | 404 Sanctuary Recovery Page with return to dashboard | Public | Root Layout | Calm tactile illustration & navigation button | **VERIFIED** |

---

## 2. Backend API Endpoint Inventory (37 Routes)

All 37 Next.js API route handlers were verified for authentication middleware enforcement, rate limiting, request validation, IDOR authorization scoping, error boundaries, and Cache-Control headers.

| # | Endpoint | Method | Security Controls | Cache-Control | Verification Status |
|---|---|---|---|---|---|
| 1 | `/api/auth` | POST | Bcrypt cost 12, Timing-safe compare, Rate-limited | `no-store` | **VERIFIED** |
| 2 | `/api/auth/google` | GET/POST | State param CSRF cookie validation, PKCE flow | `no-store` | **VERIFIED** |
| 3 | `/api/auth/otp` | POST | 6-digit HMAC token challenge, Expiring 10m | `no-store` | **VERIFIED** |
| 4 | `/api/user/me` | GET/PATCH | Session-scoped userId, Input validation, No-XSS | `no-store` | **VERIFIED** |
| 5 | `/api/assessment` | GET/POST | Session required, Crisis screening trigger | `no-store` | **VERIFIED** |
| 6 | `/api/assessment/gate` | GET/POST | Sets `onboardingCompleted: true` on step 8 | `no-store` | **VERIFIED** |
| 7 | `/api/mood` | GET/POST | Session-scoped, Canonical mood entry storage | `no-store` | **VERIFIED** |
| 8 | `/api/mood/history` | GET | Session-scoped date range filtering | `no-store` | **VERIFIED** |
| 9 | `/api/activity` | GET/POST | Session-scoped, Activity log & duration tracking | `no-store` | **VERIFIED** |
| 10 | `/api/journal` | GET/POST | Session-scoped, Encrypted reflection storage | `no-store` | **VERIFIED** |
| 11 | `/api/journal/[id]` | PUT/DELETE | IDOR check: `userId === session.userId` | `no-store` | **VERIFIED** |
| 12 | `/api/companion` | POST | Token deduction, Crisis regex triage, Model routing | `no-store` | **VERIFIED** |
| 13 | `/api/companion/conversations` | GET/POST | Session-scoped conversation threads | `no-store` | **VERIFIED** |
| 14 | `/api/companion/conversations/[id]` | DELETE | IDOR check: owner verification before delete | `no-store` | **VERIFIED** |
| 15 | `/api/companion/quota` | GET | Atomic token count, Free (20k) / Plus (150k) | `no-store` | **VERIFIED** |
| 16 | `/api/community/posts` | GET/POST | Toxicity screening, Pseudonym attribution | `no-store` | **VERIFIED** |
| 17 | `/api/community/posts/[id]` | GET/DELETE | IDOR check: author or admin only delete | `no-store` | **VERIFIED** |
| 18 | `/api/community/posts/[id]/like` | POST | Idempotent "Kirim Pelukan" toggle | `no-store` | **VERIFIED** |
| 19 | `/api/community/posts/[id]/comments` | GET/POST | Toxicity filter, Rate-limited comments | `no-store` | **VERIFIED** |
| 20 | `/api/community/comments/[id]` | DELETE | IDOR check: author or admin only delete | `no-store` | **VERIFIED** |
| 21 | `/api/community/bookmarks` | GET/POST | Session-scoped saved post references | `no-store` | **VERIFIED** |
| 22 | `/api/community/notifications` | GET/PATCH | Session-scoped inbox notifications | `no-store` | **VERIFIED** |
| 23 | `/api/community/dm/conversations` | GET/POST | Dual-party participant verification | `no-store` | **VERIFIED** |
| 24 | `/api/community/dm/messages` | GET/POST | Participant authorization check | `no-store` | **VERIFIED** |
| 25 | `/api/community/circles` | GET | Category listing with member count | `stale-while-revalidate` | **VERIFIED** |
| 26 | `/api/wellness/insights` | GET | Dynamic Zyba Score computation, No hardcoding | `no-store` | **VERIFIED** |
| 27 | `/api/premium/insights` | GET | PLUS tier entitlement guard, Deep trends | `no-store` | **VERIFIED** |
| 28 | `/api/resources` | GET | Curated content catalog, Category search | `public, max-age=60` | **VERIFIED** |
| 29 | `/api/resources/[slug]` | GET | PRO body/audio gating for free tier users | Dynamic Gated | **VERIFIED** |
| 30 | `/api/achievements` | GET | Session-scoped milestone checks & unlocked badges | `no-store` | **VERIFIED** |
| 31 | `/api/badges` | POST | Validates badge ownership prior to pinning | `no-store` | **VERIFIED** |
| 32 | `/api/billing/checkout` | POST | Rate-limited order creation, Tier validation | `no-store` | **VERIFIED** |
| 33 | `/api/billing/manual` | POST | Upload proof image, Magic bytes validation | `no-store` | **VERIFIED** |
| 34 | `/api/billing/history` | GET | Session-scoped billing records | `no-store` | **VERIFIED** |
| 35 | `/api/settings/export` | GET | Rate-limited GDPR personal data export | `no-store` | **VERIFIED** |
| 36 | `/api/account/delete` | DELETE | Session-scoped atomic account purging | `no-store` | **VERIFIED** |
| 37 | `/api/moderation/appeal` | POST | Session-scoped appeal form submission | `no-store` | **VERIFIED** |

