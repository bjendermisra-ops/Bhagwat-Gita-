# Gita Quest — Production Plan & Launch Gates

**Repository:** `bjendermisra-ops/Bhagwat-Gita-`  
**Status:** Standalone playable web module, integrated into Home; native child-safety compliance still requires review.  
**Protected existing game:** `game.html` (Vrindavan Run) — **DO NOT MODIFY** during Gita Quest development.

## 1. Product goal

Help readers approximately **8–14 years old** learn Bhagavad Gita ideas with short, contextual play rather than rote memorization. Designed for families and educators as well as children; **not** designed to be used as a substitute for personal guidance. Primary user journey: open Gita app → tap Gita Quest → select a world → make a choice/solve a sequence → see a gentle explanation and the original verse → continue → track an illustrated lotus garden.

*Every challenge explicitly distinguishes our invented child-friendly situation from the original Sanskrit verse and the existing app's translation.* No countdown timers, penalties, leaderboards, accounts, chat, personal information prompts, IAP, or ad placements inside the module.

## 2. Scope for v1

| World | Challenges | Scripture references | Learning objective |
|---|---|---|---|
| Action & Courage | 1–5 | BG 2.47, 2.48, 3.19, 3.21, 2.14 | Effort, responsibility, fair play and equanimity |
| Mind & Friendship | 6–10 | BG 6.5, 6.26, 12.13, 16.2, 17.15 | Attention, kindness, honesty and helpful speech |
| Devotion & Trust | 11–15 | BG 9.22, 12.14, 4.7, 18.66, 18.78 | Steady practice, reflection and safe decision-making |

Challenge modes: **12 interactive story choices**, **3 sequence puzzles**. Each earns one non-monetary lotus petal. Incorrect answers are guided gently; unlimited retry. Users can replay all lessons or select any level without pressure. No reward for screen time or repeated ad viewing.

**Languages:** Hindi, Marathi and English. Users may switch at any point. Explanations and scenarios are educational paraphrases; original Sanskrit and translations are rendered from the existing `data/gita-v2.json` when available. The same origin serves all files.

## 3. Implementation boundaries

- `gita-quest.html` — new independent screen; accessible directly or through a single Home screen promotional card.
- `assets/gita-quest.css` — unique, responsive styles; small phones and desktop.
- `assets/gita-quest.js` — game engine + 15 level dataset + language rendering + persistence.
- `index.html` + `assets/sacred-editorial.css` — **only** the entry-point card and styling, not the existing reader or studio logic.
- `sw.js` — add new files to the existing first-load offline shell cache.
- `tests/gita-quest.cjs` — Chromium regression suite; must pass before promotion.
- `game.html` — **zero changes**. Any future runner work belongs to a different task.

Progress key: `gitaquest.v1.progress`, separate from `gita_profile`, `gita_studio`, and runner score. User can reset progress in the future if desired but v1 does not delete anything automatically.

This is **plain HTML/CSS/JS**. It runs on GitHub/Vercel, and is intended to work inside the existing Sketchware WebView; it does not need React, Firebase, external SDK, sign-in, or a new APK **provided the WebView already supports navigation to same-origin pages**. Native Android back behavior, ad display, and the Android network overlay still need SWB/device QA.

## 4. Visual interaction specification

**Mobile under 600px**: readable vertical flow, full-width answer rows at least ~48–56px high, short hero, world cards in one column, 2-column level directory, no overlays hiding buttons.  
**Tablet 600–1359px**: 2–3 column world display; challenge content and lesson sidebar adapt.  
**Desktop 1360px+**: tall fixed editorial rail and full workspace panel; challenge text remains at a readable measure.  
Support 280–1920 CSS pixel widths, orientation changes, reduced motion, visible keyboard focus, screen readers and optional browser text-to-speech where available.

Use existing licensed artwork and fonts, no external analytics. Do not create a childish flashing template or place ads near choices. Maintain premium devotional visual identity from the main app.

## 5. Verification and release criteria

1. Each of 15 levels has the correct order and answer, with a gentle retry and learning explanation.
2. All 15 Gita references resolve to source data in `gita-v2.json`; show a truthful unavailable state if any record cannot be fetched.
3. Browser smoke test passes: Hindi/Marathi/English, 280px / 320px / 390px / 768px / 1440px layouts, hard refresh, deep link, source card, scoring, all 15 levels, progress persistence, no uncaught JavaScript errors.
4. HTTPS first load + offline reload works after caching; verify from mobile WebView, too.
5. Native Android phone test: WebView navigation, back/exit, offline reconnect, scrolling, touch input, external Play Store links, no ads interrupting child-directed experiences.
6. Editorial review by a Gita teacher: Sanskrit, transliteration/translation provenance, Marathi/Hindi phrasing and appropriateness. Do not misattribute commentary to Srila Prabhupada.
7. Google Play: **update target audience declaration and Families-policy assessment before marketing to children**. This app previously used native ads; policy review must cover entire APK and ad SDK, not only the ad-free learning section. Ad SDK, content rating, data safety, privacy policy and any age screening require review.
8. Keep `game.html` SHA unchanged through this feature. Rollback is easy: remove Home link/quest files and restore the prior service worker cache version.

## 6. Future roadmap (not shipped)

**Release 2:** optional audio clips from verified local sources, more story illustrations, accessible listening-first mode, 3 new game mechanics (scenario sorting, Sanskrit listening, paired meaning matching), parent/teacher review screen.

**Release 3:** reviewed lessons across all 18 chapters, learner-controlled learning goals, optional offline downloadable lesson packs (no accounts), and friendly low-pressure challenge recommendations.

**Prohibited shortcuts:** fabricated scripture or translation, unverified medical claims, online chat between children, ad-gated learning, persistent child identifiers, coercive reward design, or storing children's personal information.
