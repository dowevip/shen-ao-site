# Plan B Complete Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the isolated `plan-b` branch into a content-complete artist website while keeping the approved Hero and Featured Music intact.

**Architecture:** Keep the existing React/Vite single-page app and add real route rendering for `/work`, `/music`, `/live`, `/practice`, `/about`, `/epk`, and the listed project detail routes. Centralize project facts in `src/content/projects.ts`; keep page copy in `src/App.tsx` components unless it becomes duplicated factual metadata.

**Tech Stack:** React, TypeScript, Vite, Vitest, Playwright.

**Spec:** `/Users/dowehsiao/.codex/attachments/d0f165b0-74e1-43ef-860c-41ecc4f5dc37/pasted-text.txt`

## Global Constraints

- Work only on `plan-b`; do not merge to `main`.
- Do not deploy or modify GitHub Pages production settings.
- Do not redesign the approved Hero or Featured Music.
- Do not fabricate photos, stills, dates, venues, awards, credits, review quotes, tracklists, or project descriptions.
- Use designed placeholders where confirmed media is missing.
- `verificationStatus = needs-review` content must not be presented as confirmed public chronology.
- Run `npm test`, `npm run build`, and the existing screenshot test if available.

---

### Task 1: Data And Routing

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/App.tsx`
- Test: `src/__tests__/app.test.tsx`

**Interfaces:**
- Produces: richer `Project` records with `press`, `mediaStatus`, and consistent `externalLinks`.
- Produces: route components for all requested top-level and project detail paths.

- [ ] Add failing route tests for `/music`, `/live`, `/practice`, `/about`, `/epk`, `/work/fancy-a-bite`, and `/work/no-idea`.
- [ ] Extend `Project` data with confirmed facts only.
- [ ] Replace header buttons with route-aware nav links through the existing `navigate` helper.
- [ ] Implement route matching for requested top-level routes and generic detail pages.
- [ ] Run `npm test`.

### Task 2: Page Content And Placeholders

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Test: `src/__tests__/app.test.tsx`

**Interfaces:**
- Produces: `MediaPlaceholder`, `MusicPage`, `LivePage`, `PracticePage`, `AboutPage`, `EpkPage`, and generic project detail layouts.

- [ ] Add tests for confirmed About, EPK, music, live, and practice content.
- [ ] Implement reusable media placeholders with portrait, landscape, cinematic, and square variants.
- [ ] Fill Home lower sections with approved copy while preserving approved Hero and Featured Music.
- [ ] Implement complete top-level pages using confirmed copy and placeholders.
- [ ] Implement detail pages with known facts, links, placeholders, known press where present, and next project navigation.
- [ ] Run `npm test`.

### Task 3: Visual Pass And Verification

**Files:**
- Modify: `src/styles.css`
- Modify: `tests/screenshot.spec.ts`

**Interfaces:**
- Produces: Plan B page styles at varied intensity and screenshot outputs for review.

- [ ] Adapt Work, Music, Live, Practice, About, EPK, and detail page styles without altering the approved Hero and Featured Music composition.
- [ ] Update screenshot test to capture requested pages.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run screenshots`.
- [ ] Review desktop, laptop, and mobile screenshots for missing content and obvious overlap.
