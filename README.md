# Kho Skill

**English** · [Tiếng Việt](README.vi.md)

A Vietnamese-language catalog of **AI Skills** (`SKILL.md` packages) for Claude and other AI agents. Every entry has a description written in Vietnamese, the author's exact install command, a checked license, and a link back to the original repository.

*Kho Skill* means "skill warehouse" in Vietnamese. The site itself is in Vietnamese because that is its audience. This README is in English for anyone reviewing the code.

> Live site: _coming soon_

## Why

AI skills are spreading fast, but they are scattered across hundreds of GitHub repos with English-only docs, unclear licenses and inconsistent install steps. Kho Skill gathers the useful ones in one place for Vietnamese developers and non-developers, and helps them pick the right skills for their project without searching one by one.

## Features

- **Catalog of 67 entries:** 19 official Anthropic skills, 46 community skills or skill collections, and 2 skills written for this project. It has accent-insensitive search (Vietnamese diacritics are optional), filters by category and source, and lets you save skills in the browser.
- **One page per skill:** when to use it, install commands with a copy button, a plain-language license note (with a warning when a repo has no license), and GitHub stars.
- **Project advisor (`/goi-y/`):** describe your project in free text and the site detects your needs, then recommends skills with a reason for each and one combined install command. Read [How the advisor works](#how-the-advisor-works) below.
- **Learning page (`/skill-la-gi/`):** explains what a skill is versus project rules (`CLAUDE.md`), with two ready-to-copy rule templates (beginner and experienced).
- **Own skills:** `session-handoff` (continue work across sessions) and `khoi-dong-du-an` (project kickoff: requirements → architecture → roadmap → build with tests, plus testing, security and deployment checklists).
- **Machine-readable catalog:** `/skills.json` lets an AI agent read the whole catalog and choose skills by looking at a real codebase.
- **Submit a skill (`/de-xuat/`):** validates a GitHub URL, detects duplicates, and opens a pre-filled GitHub Issue. It is enabled once `SITE_REPO` is set.
- Dark mode, works on phones down to 320px, keyboard and screen-reader friendly (`aria-current`, `aria-pressed`, visually hidden labels).

## Tech stack

- **Next.js 15** (App Router) with **React 19** and **TypeScript**. The site is fully static (`output: 'export'`), with no server, database or runtime API.
- No UI library. Plain CSS with design tokens and a dark theme.
- Node scripts that call the GitHub REST API to find new skills and refresh star counts.

## Technical highlights

### How the advisor works

It runs entirely in the browser, with no LLM or backend:

1. **Normalization:** the text is lowercased, diacritics are stripped, and it is padded with spaces so keywords only match whole words. Uppercase `AI` maps to "artificial intelligence", while lowercase `ai` is left alone because it is a common Vietnamese pronoun ("who").
2. **Longest phrase first:** keywords are sorted by word count, and each matched phrase is consumed. "react native" therefore counts as mobile and does not also trigger the React web need.
3. **Weighted needs:** 33 needs, each with strong keywords (1 point) and weak keywords (0.5 point, so one vague word is not enough), plus an optional boost (for example, "new project" counts double).
4. **Ranking:** a skill's score adds up across matched needs, weighted by its position in each need's list. Skill tags can only re-rank skills that already matched a need. They never pull in new ones, which avoids false positives such as "booking" → a calendar integration.
5. **Shareable state:** the description and any needs the user added or removed are synced to the URL with `history.replaceState`, so other projects can deep-link into a pre-filled result.

All the data is validated at build time: an unknown skill slug or a duplicate need id fails the build.

### Dev-only admin tab without leaking into production

The "Duyệt" (review) tab and its API are named `*.dev.tsx` / `*.dev.ts`, and `next.config.ts` only includes those extensions when running `next dev`. The static build contains no trace of them. The dev server binds to `127.0.0.1`, and `npm run dev:lan` turns the tab off when the server is exposed to the local network.

### Skill discovery pipeline

`scripts/discover-skills.mjs` runs 15 GitHub search queries (topics plus targeted queries for under-covered areas such as office documents, data, security and memory). It keeps repos with at least 100 stars, a license, activity in the last 12 months and a real `SKILL.md`, and it caches progress to survive rate limits. Candidates appear in the review tab. Picks are saved to `data/candidates.md`, and Claude Code adds them following the rules in `CLAUDE.md`. Nothing is added automatically.

## Getting started

```bash
npm install
npm run dev       # http://127.0.0.1:3000 (includes the review tab)
npm run dev:lan   # expose to your LAN to test on a phone (review tab off)
npm run build     # static site in out/
npm run stars     # refresh GitHub star counts
npm run discover  # search GitHub for new skill candidates
```

The GitHub scripts read an optional `GITHUB_TOKEN` from `.env`, which is git-ignored. Without a token, GitHub allows 60 requests per hour.

## Deploy

The output is plain static files, so any static host works. On Vercel, import the repo and click Deploy (Next.js is detected automatically). To enable the "submit a skill" page, set `SITE_REPO` in `src/data/site.ts` to `owner/repo`.

## Project structure

```
src/
  app/            routes: catalog, /skills/[slug], /bo-skill/[slug], /goi-y, /skill-la-gi, /de-xuat, /skills.json
  components/     catalog, advisor, skill row, copy button, nav…
  data/           skills.ts (catalog), needs.ts (advisor rules), collections, stars
  lib/            recommend.ts (advisor engine), storage helpers
public/raw/       skills and rule templates written for this project
scripts/          GitHub discovery and star updater
data/             reviewed candidate list
```

## Principles

- Only links to the original source code. No third-party skill code is stored in this repo.
- Descriptions are written from scratch in Vietnamese, not copied or machine-translated from the original.
- Not affiliated with Anthropic or any skill author.
