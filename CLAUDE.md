# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Floating Wardrobe": a static, dependency-free interactive page where cutout images of Louis Vuitton SS24 pieces float in a parallax scene. Scroll velocity makes each piece sway and play a synthesized sound that matches its material (canvas rustle, pearl jingle, leather creak, etc.). The user communicates in Korean; UI copy, item `concept` text and docs are Korean.

## Commands

No build step, bundler, linter or test suite. Plain ES modules served as static files.

```bash
npm start                                   # python3 -m http.server 5173 → http://localhost:5173
node scripts/write-prompts.mjs              # regenerate PROMPTS.md from items.js
OPENAI_API_KEY=... npm run generate         # create assets/items/{id}.png via OpenAI images API (skips existing)
OPENAI_API_KEY=... npm run generate -- --only id1,id2   # specific items; --force to overwrite
OPENAI_API_KEY=... npm run cutout           # background-remove assets/source/{id}.{png,jpg,jpeg,webp} via images/edits
```

`OPENAI_IMAGE_MODEL` (default `gpt-image-1`) and `OPENAI_IMAGE_QUALITY` (default `high`) tune generation. No API key is configured in the cloud environment; the user's plan is to generate images for free in ChatGPT using `PROMPTS.md` and upload them by file name.

The page must be served over HTTP (ES module imports fail from `file://`). To verify visually, use Playwright with Chromium at `/opt/pw-browsers/chromium`.

## Architecture

`items.js` is the single source of truth, shared by the browser and the Node scripts:
- `ITEMS[].id` → image path `assets/items/{id}.png` and the file name users must upload.
- `sound` (`rustle | swish | beads | sequins | leather | metal`) selects both the synth voice in `sound.js` and the spring/jitter profile in `MOTION` in `main.js`; a new sound type needs an entry in both.
- `x`/`w` are in vw, `y` in vh within the scene, `depth` is the parallax factor; `aspect` picks the generation size; `shape`/`pattern`/`color` drive the fallback silhouette.
- `PROMPT_BASE` + `prompt` form the image-generation prompt (used by `generate-images.mjs` and `write-prompts.mjs`). After editing items, rerun `write-prompts.mjs` so `PROMPTS.md` stays in sync.

`main.js` runs one `requestAnimationFrame` loop: smooths scroll velocity, positions every item so it crosses the viewport center at its own `y` regardless of `depth`, integrates a per-item spring for rotation/skew, and picks at most 3 visible items per frame to sound (gated by per-material cooldown, intensity from speed, distance to center and depth; stereo pan from x). Hover/click also "kick" an item. Narrow screens (<640px) scale item widths ×1.75.

`sound.js` (`SoundEngine`) synthesizes everything with Web Audio from a shared white-noise buffer plus oscillators (`burst`, `sweep`, `ping`, `clink` primitives) into a compressor/master gain. The AudioContext is created only after the intro button click (browser autoplay policy).

`placeholder.js` renders an inline SVG silhouette when an item's PNG 404s, so the site works with no images.

## Publishing

The site is published as a claude.ai artifact (https://claude.ai/artifact/XXd4vqnyGeXLMKAPNYzEap) from `index.html` with `style.css`, `main.js`, `items.js`, `sound.js`, `placeholder.js` as supporting files. When images are added, include them under `assets/items/` in the publish `files` map, otherwise the artifact keeps showing silhouettes.

## Content constraints

Item descriptions are based on review coverage of the men's (Pharrell, June 2023) and women's (Ghesquière, Oct 2023) SS24 shows; some colors were chosen, not confirmed. Prompts deliberately exclude logos and brand names. `assets/source/` (real photos) is gitignored for copyright reasons; don't commit or pull official LV photos from the web.
