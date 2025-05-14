# World Of Karma 360 – Music Page & Mureka AI Integration  
*Audience: UX/UI Designer (“Sketch”)*  
*Last updated: $(date "+%Y‑%m‑%d")*

---

## 1. Vision (TL;DR)

> Seamlessly weave **Mureka AI** into the Music experience so users can *listen, create, and own* adaptive tracks on any device—phone first, then desktop—without the neon “Matrix” vibe. Think **Apple Music meets AI creation studio**, dark‑mode default with a single accent color ( #0A84FF).

---

## 2. Core User Flows

| Flow | View | Mobile Interaction |
|------|------|--------------------|
| **Listen** | Music landing | Tap ► to stream an episode‑scored track generated via scene prompts |
| **Create (Karma Beats Studio)** | Modal | Prompt + mood field → “Generate” → progress bar → track preview card |
| **Mint NFT** | Track detail | “Mint” CTA (disabled until wallet connected) |
| **Game Reward Playback** | Puzzled / Fortune win screen | Autoplays 5‑sec jingle, “Save to My Tracks” toggle |
| **Soundpack Purchase** | KarmaMall product tile | Tap card → Apple‑style sheet with audio scrubber + “Buy for $ORB” |

---

## 3. Page‑Level Layout (mobile‑first)

1. **Music.vue**
   - Sticky header with “Music” title, subtle glass blur.
   - **Hero**: carousel of featured user‑generated tracks (cover art + play button).
   - **Studio CTA**: rounded pill button “Create a Song”.
   - **Track Grid**: two‑column cards, 1:1 ratio, consistent shadows (`shadow-md/50`), border radius `12px`.
2. **CreateSongModal.vue**
   - Prompt textarea (auto‑grow, 3‑line max).
   - Mood dropdown (chips: Chill / Epic / Lo‑fi / Ambient / Custom…).
   - Generate button → progress ring → success state with waveform scrubber.
3. **TrackDetail.vue**
   - Artwork top, waveform middle, actions bottom (Mint, Share, Delete).

---

## 4. Visual Tokens

| Token | Value |
|-------|-------|
| `--accent` | #0A84FF |
| `--surface-dark` | #1C1C1E |
| `--surface-light` | #F2F2F7 |
| `--border` | #3A3A3C |
| Font | SF Pro / Inter fallback |

No neon borders or glitch effects; use subtle 1‑px borders and soft shadows.

---

## 5. States / Empty Screens

*Empty library*:  ⚡ “You haven’t created anything yet—tap *Create a Song* to spin up your first track!”  
*Offline*: Grey waveform placeholder + “Connect to generate music”.

---

## 6. Accessibility

- Text contrast ≥ WCAG AA (❤️ dark surface, white text #FFFFFF).  
- Waveform scrubber sized ≥ 44×44 px tappable.

---

## 7. Dev Handoff Notes

- Vue 3 + Tailwind CSS; prefers class‑based styling over inline neon hacks.  
- Breakpoints: `sm` 375 px, `md` 768 px, `lg` 1024 px.  
- Artwork assets: 512×512 PNG or AVIF, stored via Supabase Storage.

---

## 8. Open Questions

1. Cover‑art generator style guidelines?  
2. How should NFT mint progress be surfaced (toast vs modal)?

