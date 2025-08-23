# Sommwhere Tasting — V1 Spec (Single-Player MVP)

## Purpose
A simple, single-player tier list game for wine tastings.  
Lives at `sommwhere.ai/tasting` as an extension of the marketing site.  
No backend or multiplayer for V1 — state is client-side only.

---

## Product Roadmap
- **V1 (now):** Single-player MVP (local state, export results).
- **V2:** Multiplayer with shared game state + unique URLs.
- **V3:** Additional game modes (blind guessing, matching, scoring).

---

## V1 Implementation Milestones

### Phase 1: Basic Navigation
1. Add "Tasting Game" link to homepage header
2. Create blank /tasting landing page
3. Design /tasting landing with start button

### Phase 2: Configuration Page
4. Create /tasting/new config page (blank)
5. Add bottle count input (2-12) on config page
6. Add "Name bottles now" toggle on config
7. Show/hide name input fields based on toggle

### Phase 3: Board Layout
8. Create /tasting/board page (blank)
9. Add tier rows (S,A,B,C,D,F) to board
10. Add wine cards tray at top of board
11. Generate wine cards based on config

### Phase 4: Core Functionality
12. Implement drag and drop functionality
13. Add localStorage save/load for game state

### Phase 5: Export Features
14. Add Reset button to toolbar
15. Add Export CSV functionality
16. Add Export PNG functionality
17. Add Copy Summary functionality

### Phase 6: Polish
18. Style everything with wine theme

---

## Routes / IA
- `/tasting` → Landing page (Start button).
- `/tasting/new` → Config (# of bottles).
- `/tasting/board` → Tier board (drag & drop).

---

## User Flow
1. Landing → **Start a game** → `/tasting/new`
2. Config:
   - Input: **Number of bottles** (2–12, default 6).
   - Toggle: "Name bottles now" → optional text fields for names.
   - CTA: **Start game** → `/tasting/board`
3. Board:
   - Top tray: wine cards (default names = Wine 1, Wine 2…).
   - Tiers: S, A, B, C, D, F.
   - Drag & drop wines into tiers.
   - Toolbar: Reset / Export CSV / Export PNG / Copy Summary.

---

## Local Data Model
```ts
// Saved in localStorage under "sommwhere:tasting:v1"
{
  createdAt: ISOString,
  settings: { bottleCount: number, names?: string[] },
  tiers: ["S","A","B","C","D","F"],
  placements: {
    [wineIndex: number]: "S"|"A"|"B"|"C"|"D"|"F"|null
  }
}
```