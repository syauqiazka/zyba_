# ZYBA — Complete Route & Surface Inventory

> **Document Status:** Authoritative Route Inventory  
> **Repository:** `https://github.com/syauqiazka/zyba_`  
> **Total Frontend Pages:** 26  
> **Total API Route Handlers:** 37

---

## 1. Public & Onboarding Routes

| Route | File Path | Layout Shell | Auth Level | Key Components & Modals | Functional Scope |
|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Root Layout | Public | `LandingHeader`, `LandingHero`, `LandingFeatures`, `TestimonialsSection`, `LandingFooter` | Public landing page introducing ZYBA, 3D perspective cards, 99% satisfaction rate, 74.9M+ trust bar. |
| `/login` | `src/app/login/page.tsx` | Root Layout | Public | `LoginForm`, `SocialAuthButtons`, `ForgotPasswordModal` | Email/password sign-in, Google OAuth redirection, session generation. |
| `/onboarding` | `src/app/onboarding/page.tsx` | Root Layout | Public | `WelcomeCarousel`, `AuthStep`, `OtpStep` | Initial user arrival carousel and registration step leading to `/assessment`. |
| `/welcome` | `src/app/welcome/page.tsx` | Root Layout | Authenticated | `WelcomeTour`, `SanctuaryGuideStep` | Post-onboarding tour introducing key sanctuary rituals and navigation dock. |
| `/assessment` | `src/app/assessment/page.tsx` | Root Layout | Gated Onboarding | `QuestionStep`, `CompletedState`, `PinPad`, `AvatarPicker` | 8-step clinical intake: Avatar/Name, Security PIN, Notification preferences, Goals, Demographics, Mood/Sleep, Stress/Symptoms, AI Expression Screening. |

---

## 2. Core Sanctuary Applications (Authenticated)

| Route | File Path | Layout Shell | Auth Level | Key Components & Modals | Functional Scope |
|---|---|---|---|---|---|
| `/dashboard` | `src/app/dashboard/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `TactileMetricCards`, `WeeklyTaskCards`, `CompanionWidget`, `StressLevelChart`, `SanctuaryRightRail`, `MetricScoreCard`, `QuickAccessCards`, `GroundingModal`, `AvatarCropModal` | Central dashboard: Contextual empathetic greeting, emotional weather indicator, daily routine checklist synced to DB, score breakdown. |
| `/mood-check-in` | `src/app/mood-check-in/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `MoodSelector`, `SleepEnergyStep`, `JournalReflectBox`, `MoodStatsTrend` | Canonical mindful check-in: 5 pebble mood selector, sleep quality slider, physical energy tags, reflective journaling with risk detection. |
| `/daily-assessment` | `src/app/daily-assessment/page.tsx` | Server Redirect | Auth + Onboarded | Server redirect header | Preserved route performing instant 307 server-side redirect to `/mood-check-in`. |
| `/companion` | `src/app/companion/page.tsx` | Companion Layout | Auth + Onboarded | `CompanionSidebar`, `ChatHeader`, `ChatMessages`, `ChatInput`, `TokenMeterBadge`, `ModelSelector`, `QuotaExceededModal` | AI Companion Sanctuary: Multi-provider chat (Gemini, Groq, Mistral), animal persona switcher, voice transcription (STT/TTS), real-time token gauge. |
| `/companion/[slug]` | `src/app/companion/[slug]/page.tsx` | Companion Layout | Auth + Onboarded | Dynamic conversation thread, `ChatMessages`, `ChatInput` | Nested conversation view bound to specific conversation ID from database. |
| `/activity` | `src/app/activity/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `ActivityBanner`, `DailyConditionCard`, `DailyPlan`, `BreathingExercise`, `ZybaRecommendations`, `AddActivityModal`, `CompletionModal` | Smart Activity Planner: 4-7-8 clinical breathing pacing (4s Inhale, 7s Hold, 8s Exhale), routine task checklists, ambient soundscapes. |
| `/wellness-journey` | `src/app/wellness-journey/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `ProgressOverview`, `WellnessTrendChart`, `JourneyEmptyState`, `ZybaScoreBreakdown` | Ruang Sehat: Catmull-Rom cubic Bézier spline waveform, Ring Skor Hening SVG 84px, historical wellness metrics. |
| `/community` | `src/app/community/page.tsx` | Community Layout | Auth + Onboarded | `ComposeBox`, `PostCard`, `SidebarInfo`, `CreatePostModal`, `CommunityMessagesView`, Crisis Hotline Card | Warm Support Circles: Anonymous reflection feed, "Kirim Pelukan" (*Hug*) interaction, empathetic topic tags, Sejiwa 119 ext. 8 hotline. |
| `/community/[slug]` | `src/app/community/[slug]/page.tsx` | Community Layout | Auth + Onboarded | Post detail view, `CommentThread`, `ReplyBox`, `ReportModal` | Single post discussion thread with comment trees and moderation actions. |
| `/community/profile` | `src/app/community/profile/page.tsx` | Community Layout | Auth + Onboarded | `ProfileBio`, `UserPostFeed`, `SavedBookmarksTab` | Current user's community presence, reflections history, and saved bookmarks. |
| `/community/profile/[userId]` | `src/app/community/profile/[userId]/page.tsx` | Community Layout | Auth + Onboarded | `PublicProfileCard`, `UserPostFeed`, `FollowButton` | Public profile view of another community member. |
| `/community/profile/[userId]/followers` | `src/app/community/profile/[userId]/followers/page.tsx` | Community Layout | Auth + Onboarded | `FollowersList`, `UserFollowCard` | List of followers for a given community member. |
| `/community/profile/[userId]/following` | `src/app/community/profile/[userId]/following/page.tsx` | Community Layout | Auth + Onboarded | `FollowingList`, `UserFollowCard` | List of accounts followed by a community member. |

---

## 3. Sanctuary Library, Milestones & Settings

| Route | File Path | Layout Shell | Auth Level | Key Components & Modals | Functional Scope |
|---|---|---|---|---|---|
| `/resources` | `src/app/resources/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `ResourceFilterTabs`, `ArticleCard`, `AudioCourseCard`, `ProPaywallBadge` | Curated Sanctuary Library: Evidence-based mental wellness articles, audio guides, PRO-exclusive content. |
| `/resources/[slug]` | `src/app/resources/[slug]/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `ArticleReader`, `AudioPlayerBar`, `AuthorBioCard` | Detailed article reader with tactile typography and audio narration player. |
| `/achievements` | `src/app/achievements/page.tsx` | Achievements Layout | Auth + Onboarded | `MilestoneGrid`, `BadgeDetailModal`, `HearthFlameCounter` | Quiet Milestones: Hearth badges for consistency, journaling depth, and mindfulness practice. |
| `/guidebook` | `src/app/guidebook/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `CrisisDirectory`, `GroundingTechniqueIndex`, `FaqAccordion` | Crisis safety directory, clinical grounding references, and platform usage guide. |
| `/settings` | `src/app/settings/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `ProfileSettingsForm`, `NotificationToggles`, `DataExportButton`, `AccountDeleteModal` | User account settings, avatar customization, privacy toggles, data export, account deletion. |
| `/settings/billing` | `src/app/settings/billing/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `CurrentPlanBadge`, `BillingHistoryTable`, `UpgradeCta` | Subscription status, transaction history, invoice details. |
| `/settings/zyba-plus` | `src/app/settings/zyba-plus/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `PlanComparisonTable`, `PlusFeatureCards`, `PaymentMethodSelector` | Zyba Plus upgrade gateway: 150k token quota, unlimited companion audio, advanced insights. |
| `/settings/zyba-plus/insights` | `src/app/settings/zyba-plus/insights/page.tsx` | ClientLayout (Zen Dock) | Auth + Plus | `InDepthTrendAnalysis`, `CorrelationsMatrix`, `AiWellnessSummary` | Advanced AI emotional insights and biomarker correlations for Plus subscribers. |
| `/settings/zyba-plus/payment` | `src/app/settings/zyba-plus/payment/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `PaymentQrCode`, `BankTransferDetails`, `ProofUploadForm` | Manual payment processing and proof of transfer submission. |
| `/settings/zyba-plus/success` | `src/app/settings/zyba-plus/success/page.tsx` | ClientLayout (Zen Dock) | Auth + Onboarded | `PaymentSuccessCard`, `ReturnToDashboardButton` | Post-payment confirmation and entitlement activation state. |

---

## 4. Administrative Operations

| Route | File Path | Layout Shell | Auth Level | Key Components & Modals | Functional Scope |
|---|---|---|---|---|---|
| `/admin/moderation` | `src/app/admin/moderation/page.tsx` | Root Layout | Admin Role | `ReportedQueueTable`, `ModerationActionModal`, `AuditLogView` | Reviewing flagged community content, crisis alerts, and appeal resolutions. |
| `/admin/payments` | `src/app/admin/payments/page.tsx` | Root Layout | Admin Role | `PendingPaymentList`, `VerificationModal`, `ApproveRejectButtons` | Verification and activation of manual bank transfer/QRIS subscription proofs. |

---

## 5. API Endpoints Map

```
/api/
├── account/delete                    # Scoped account deletion across all 3 databases
├── achievements                      # User badges & progress calculation
├── activity                          # Habit logging, completion sync & points
├── admin/
│   ├── ai-health                     # Model diagnostics & latency monitoring
│   ├── moderation/action             # Enforce moderator decisions
│   ├── moderation/appeals            # Appeal management queue
│   ├── moderation/logs               # Audit logs for moderation
│   ├── payments                      # Manual payment verification
│   └── reports                       # Reported content registry
├── assessment                        # Intake submission & profile setup
├── auth/
│   ├── route.ts                      # Credentials signin, signup & JWT issuance
│   ├── google                        # OAuth initiation
│   ├── google/callback               # OAuth callback & account provision
│   ├── otp                           # Cryptographic HMAC challenge verification
│   └── reset-password                # Secure password reset flow
├── badges                            # Badge pinning & status
├── billing/
│   ├── checkout                      # Plan checkout & order creation
│   ├── history                       # Subscription billing ledger
│   ├── manual                        # Manual payment submission
│   ├── manual/upload                 # Proof image upload
│   └── webhook                       # Gateway payment webhook
├── community/
│   ├── route.ts                      # Feed querying & post creation
│   ├── badges                        # Unread notifications count
│   ├── bookmarks                     # Saved posts management
│   ├── comments                      # Comment tree operations
│   ├── dm/conversations              # Direct messaging threads
│   ├── dm/messages                   # DM messages retrieval & dispatch
│   ├── feed/following                # Following-only community feed
│   ├── follows/[userId]              # Follow/unfollow relationship
│   ├── guidelines                    # Sanctuary community rules
│   ├── notifications                 # Community activity notifications
│   ├── posts/[postId]                # Post mutation & deletion
│   ├── posts/[postId]/report         # Report violation trigger
│   ├── posts/[postId]/visibility     # Anonymous / public visibility toggle
│   ├── search                        # Topic & tag search
│   └── users/[userId]/posts          # User post timeline
├── companion/
│   ├── route.ts                      # Chat completion streaming & crisis check
│   ├── conversations                 # Conversation list & active thread
│   ├── models                        # Multi-provider health & selection
│   ├── quota                         # Live token consumption & percentage meter
│   ├── stt                           # Groq Whisper audio transcription
│   └── tts                           # Edge TTS speech synthesis
├── daily-assessment                  # Daily assessment record retrieval
├── health                            # System health probe
├── journal                           # Private reflective journal entries
├── moderation/appeal                 # User moderation appeal submission
├── premium/insights                  # Plus subscriber analytical insights
├── resources                         # Curated library articles & audio courses
├── settings/
│   ├── export                        # GDPR-compliant JSON data export
│   └── notifications                 # Notification preference updates
├── upload                            # Secure file upload with magic byte check
├── user/
│   ├── avatar                        # Profile avatar upload with crop & cooldown
│   ├── me                            # Authoritative user session & stats
│   ├── profile/[userId]              # User profile retrieval
│   └── username                      # Username uniqueness verification
└── wellness/insights                 # General wellness metrics & trend analysis
```

