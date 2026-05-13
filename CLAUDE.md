# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web app for comparing two real-world cars in a 1/4 mile drag race. Users pick Car A and Car B via cascading dropdowns, watch a side-by-side animation with a Christmas tree countdown, then see results with a speed-vs-time chart. Every race gets a shareable URL with an auto-generated OG image.

**Differentiator:** clean, focused 1v1 comparison tool — no mods, no weather, no multi-car races.

## Tech Stack

- **Backend:** Go + Gin, SQLite via `database/sql` + `sqlx`, deployed to Fly.io
- **Frontend:** React + Vite + JavaScript, Tailwind CSS (dark theme), Recharts, deployed to Vercel

## File Layout

```
/backend
  /cmd/server/main.go
  /internal
    /api        — Gin handlers
    /db         — schema, queries, seed loader
    /sim        — curve fit + telemetry generator
    /og         — OG image generation
  /data/cars.csv
  go.mod

/frontend
  /src
    /pages      — Landing, RaceSetup, RaceView
    /components — CarPanel, Cascade, ChristmasTree, RaceAnimation, TelemetryChart
    /api        — fetch wrappers
    /lib        — slug helpers, formatters
  package.json
  vite.config.ts
```

## Data Model

**`cars`:** `id, make, model, year, trim, horsepower, torque, weight_lbs, drivetrain, zero_to_sixty, quarter_mile, trap_mph (nullable)` — UNIQUE on `(make, model, year, trim)`

**`races`:** `slug (PK), car_a_id, car_b_id, created_at` — slug is alphabetically sorted so A-vs-B and B-vs-A resolve to the same URL

Seed: `~150 cars` in `/backend/data/cars.csv`, upserted on first boot.

## API Endpoints

```
GET  /api/makes
GET  /api/models?make=X
GET  /api/years?make=X&model=Y
GET  /api/trims?make=X&model=Y&year=Z
GET  /api/cars/:id
POST /api/races            body: {car_a_id, car_b_id} → {slug}  (idempotent)
GET  /api/races/:slug      → {car_a, car_b, telemetry, winner, margin_sec}
GET  /api/og/:slug.png     → 1200×630 OG image (cached on disk)
```

Telemetry is computed on the fly — not persisted. Generated at 50ms intervals until both cars cross 1320 ft.

## Simulation Model

Two-parameter exponential (Phase 1):
```
v(t) = v_term * (1 - exp(-k * t))
x(t) = v_term * (t + (exp(-k*t) - 1) / k)
```
Solve for `v_term` and `k` numerically (Newton-Raphson or bisection) using the two constraints: `v(t_60) = 60 mph` and `x(t_quarter) = 1320 ft`. If `trap_mph` is available, consider a three-parameter model in a later phase.

## Build Order

**Phase 1 — Backend:** Gin skeleton → schema + seed → all API endpoints → simulation → race creation/slug → OG image (basic or placeholder)

**Phase 1 — Frontend:** Vite + React + JS + Tailwind → routing → landing (minimal) → cascading dropdowns wired to API → car stats panel → Start Race → race view (rectangles as cars, basic results, basic chart) → Share button

**Phase 2:** Polish landing (looping car animation), drag-strip background, Christmas tree countdown, SVG car sprites, scrolling asphalt, live HUD, scrubber, styled OG images.

## Decisions (locked)

- **Cars CSV:** data will be sourced collaboratively when we reach that step — do not attempt to auto-populate
- **OG image Phase 1:** static placeholder image; full generation comes in Phase 2
- **API base URL:** backend runs on `localhost:8000`; frontend uses `VITE_API_BASE` env var (`http://localhost:8000` for dev)
- **Build order:** backend fully first, then frontend — never build both simultaneously
- **Prompt sizing:** keep each prompt to one small logical unit; summarize what's done and confirm it's committed before moving to the next unit
- Missing `trap_mph`: show "—" (not hide the row)
- Scrubber: Phase 2
- Curve-fit model: start two-parameter; upgrade only if accuracy is visibly off
- "Race Again" behavior: TBD during build
- Dark theme color palette: decide during Phase 2

## Communication Style

- No preamble ("I'll help you with that", "Let me...") or postamble ("Let me know if you need anything else")
- Don't narrate intent before acting — just act
- Summarize changes at the end in 2-3 lines max
- If a task is ambiguous, ask one specific question; don't guess

## Always Do First

- **Before writing any frontend code, every session, no exceptions:** invoke the `frontend-design` skill via the Skill tool
- **After every prompt where code changes:** commit immediately before moving on. One logical unit = one commit. Never batch across prompts.

## Commit Rules

- No "Generated with Claude Code" or "Co-Authored-By: Claude" in commit messages — ever
- Git author is always Felix Gao (local git config) — never override or set a different committer
- Commit as often as possible — every logical unit of work, no matter how small
- Commit messages: short, human, lowercase imperative ("add filter row to modal" not "Implement FilterChip component with AnimatePresence transition")
- Always run `npm run build` or `npm run dev` after changes before declaring done
- Update `plan.md` at the end of every session (session log + next checklist)

## Session Hygiene

- Don't re-read files already viewed in this session unless they've been edited
- When fixing a bug, read only the relevant files — don't grep the whole codebase
- Edit files surgically with str_replace, not full rewrites
