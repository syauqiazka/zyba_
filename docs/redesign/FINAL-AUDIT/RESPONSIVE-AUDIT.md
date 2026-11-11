# RESPONSIVE ARCHITECTURE & VIEWPORT AUDIT
**Project:** ZYBA — Digital Mental Wellness Platform  
**Scope:** Viewport Behavior Across 7 Device Formats (360px to 1920px+)  
**Audit Date:** November 2026  
**Auditor:** Design Systems Engineer & Mobile Layout Specialist (`antislop-layoutmobile`)  

---

## 1. Viewport Tier Specifications

ZYBA adheres to a 3-tier responsive architecture strictly avoiding viewport horizontal overflow (`overflow-x: hidden` safeguards):

| Viewport Tier | Resolution Range | Primary Navigation Pattern | Layout Structure | Key Testing Devices |
|---|---|---|---|---|
| **Tier 1: Mobile Compact** | 360px – 414px | Ergonomic Bottom Pill Nav (56px floating pill, `rounded-full`) | Single-column linear flow, fluid padding (`px-4`), full-width cards | Samsung Galaxy S-series, iPhone 13/14/15, Pixel 7 |
| **Tier 2: Mobile Large** | 415px – 767px | Ergonomic Bottom Pill Nav (56px floating pill, `rounded-full`) | Single-column with expanded breathing room (`px-5` to `px-6`) | iPhone Pro Max, Galaxy Ultra |
| **Tier 3: Tablet Portrait** | 768px – 1023px | Floating Zen Dock (`md:w-[76px]`, `rounded-[28px]`, `md:pl-[108px]`) | 2-column adaptive grid, side-by-side metric split | iPad 10th Gen, iPad Air, Surface Go |
| **Tier 4: Laptop / Desktop** | 1024px – 1440px | Floating Zen Dock (`lg:w-[76px]`, `rounded-[28px]`, `md:pl-[108px]`) | 12-column desktop grid, 65:35 golden spread, 2-panel master-detail | MacBook Pro 14", ThinkPad X1, Dell XPS |
| **Tier 5: Ultra-Wide** | 1441px – 1920px+ | Floating Zen Dock (`left-6`) | Max-width container clamped at `1280px` (`max-w-[1280px] mx-auto`) | 27" 4K Monitor, 34" Ultrawide |

---

## 2. Navigation Transition Architecture

### Desktop & Tablet (≥768px): The Floating Zen Dock
- **Geometry:** Mengapung anggun di `fixed left-4 top-1/2 -translate-y-1/2`, lebar terkunci `76px`, tinggi dinamis mengikuti item, radius `rounded-[28px]`.
- **Surface:** `bg-white/90 backdrop-blur-md border border-brown-900/10 shadow-lg`.
- **Layout Offset:** Kontainer halaman utama diberi padding `md:pl-[108px]` sehingga konten tidak pernah bertubrukan dengan Zen Dock.
- **Portal Tooltips:** Seluruh label navigasi dock dimuat melalui React Portal langsung ke `document.body`. Posisi dihitung via `getBoundingClientRect()`, bebas dari clipping bug `overflow-y-auto`.
- **Profile Popover Anchor:** Popover profil berlabuh dinamis di `left: 104px` (`md:left-[104px] lg:left-[104px]`), membuka panel tactile tanpa menutupi dock navigasi.

### Mobile (<768px): Ergonomic Bottom Pill Nav
- **Geometry:** Mengapung di bagian bawah layar `fixed bottom-4 left-4 right-4 max-w-sm mx-auto h-[56px] rounded-full`.
- **Surface:** `bg-brown-900/95 backdrop-blur-md text-white border border-white/10 shadow-2xl`.
- **Thumb Zone Ergonomics:** 5 tab utama (Home, Check-In, Tanya Zyba, Ruang Sehat, Komunitas) disusun dalam radius jangkauan jempol natural.
- **Safe Area Insets:** Kontainer body memiliki bottom padding cadangan `pb-24` untuk memastikan elemen terbawah dan tombol aksi CTA tidak tertutup navigation pill.
- **Profile Popover Mobile:** Beralih mulus menjadi Centered Bottom Sheet dengan backdrop gelap semi-transparan `bg-black/50 backdrop-blur-xs`.

---

## 3. Page-by-Page Viewport Test Results

| Page / Component | 360px (Mobile S) | 768px (Tablet) | 1280px (Desktop) | 1920px (Ultrawide) | Status |
|---|---|---|---|---|---|
| **Landing Sanctuary (`/`)** | Hero headline reflows to 32px, 4 cards stack vertically in 1 column | 2-column grid for cards, headline scales to 48px | 4-column 3D perspective grid, headline scales to 68px | Centered container at 1240px max-width, no stretching | **PASS** |
| **Onboarding & Auth (`/onboarding`)** | Full-width tactile card with fluid padding, keypad fits snugly | Centered 480px card with ambient soft glow | Centered 520px card with breathing room | Centered 520px card with organic paper borders | **PASS** |
| **8-Step Assessment (`/assessment`)** | Stepper progress bar compact top, vertical radio/avatar pills | Split layout: left vertical stepper, right active question | Full 2-panel sanctuary workflow with live validation | Clamped container, centered focus | **PASS** |
| **Dashboard (`/dashboard`)** | Stacked widgets: Zyba Score on top, daily tracker checklist below | 2-column asymmetrical layout (metrics left, habits right) | 12-column grid: 8-col hero banner + 4-col companion launcher | Clamped max-w-[1240px], clean margins | **PASS** |
| **Tanya Zyba (`/companion`)** | Single active chat screen with drawer-toggle persona picker | Side-by-side master list (280px) and active chat pane | 2-panel Claude-inspired workspace: conversation history left, chat right | Balanced wide reading width, comfortable line-length | **PASS** |
| **Mood Check-In (`/mood-check-in`)** | Horizontal scrollable/flex pebbles, full-width reflection area | 5-pebble centered bar, side-by-side sleep & stress cards | Full 2-column ritual canvas: check-in left, weekly rhythm right | Clamped layout, zero whitespace drift | **PASS** |
| **Taman Pernapasan (`/activity`)** | Fullscreen breathing modal, pulsating flower scales to 220px | Centered dialog 540px, pulsating flower scales to 280px | Centered dialog 620px, ambient soundscape drawer | Dialog clamped, ambient background blur | **PASS** |
| **Ruang Sehat (`/wellness-journey`)** | Bézier chart features horizontal pan/scroll touch affordance | Chart reflows to full container width, score ring beside it | Asymmetrical 65:35 golden spread layout | Clamped Bézier SVG canvas with responsive viewBox | **PASS** |
| **Support Circles (`/community`)** | Full-width feed cards, comment drawer slides from bottom | Feed column (60%) + circle picker (40%) | 3-column editorial: circle topics left, feed center, active chat right | Clamped container, clean gutters | **PASS** |
| **Resource Library (`/resources`)** | Single column article cards with 16:9 thumbnail aspect | 2-column card grid with category pills | 3-column grid with editorial hierarchy | Clamped 3-column layout | **PASS** |

---

## 4. Touch Targets & Responsive Anti-Slop Safeguards
1. **Touch Target Size:** Every interactive element on mobile (buttons, pebbles, navigation pills, close triggers) meets or exceeds the minimum WCAG touch target guideline of $44 \times 44\text{px}$.
2. **Text Zoom & Scaling:** Tested at 200% browser zoom level without layout clipping or horizontal text collision.
3. **No Horizontal Scroll:** Verified zero unplanned horizontal scroll across all 26 routes (`document.documentElement.scrollWidth === window.innerWidth`).

