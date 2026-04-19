# Onboarding Guide

Welcome to the project. This guide covers everything you need to go from zero to making changes confidently.

## Prerequisites

- [asdf](https://asdf-vm.com) — manages the Node version for this project
- Git

## Initial Setup

```bash
# 1. Clone
git clone https://github.com/paul-utley/sturdy-pancake-react-character-sheet.git
cd sturdy-pancake-react-character-sheet

# 2. Install the correct Node version (defined in .tool-versions)
asdf plugin add nodejs
asdf install

# 3. Install dependencies
npm install

# 4. Start the dev server
npm start
```

The app opens at http://localhost:3000. Changes hot-reload automatically.

## How the App Works (User Perspective)

The app is a character sheet for a tabletop RPG. When you open it, you land on a single character. The sticky header shows your attributes and action buttons (New Round, Rest, Lock). The main area has three columns on desktop and a tabbed layout on mobile:

- **Core** — character identity, archetype, bio, skills, inventory
- **Abilities** — active and passive abilities with Use buttons
- **Combat** — combat techniques with point-cost tracking
- **Stats** — vitals (Health, Vigor, Dashes), armor, damage reduction, momentum

Character data is saved to `localStorage` automatically. The URL also updates with a compressed copy of the active character, making it shareable.

## Codebase Overview

Start with [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture. The short version:

```
App.js          composes hooks → passes props → renders MobileLayout or DesktopLayout
hooks/          business logic — each file owns one concern
components/     pure UI — receive props, emit callbacks
data/           static reference data (combat technique costs, soon abilities)
```

All character state lives in `useCharacterStore`. `App.js` calls the hooks, collects the returned values, and passes them down as props. There is no Redux or Context — prop drilling is intentional for now.

## Making Changes

### Adding a new field to a character

1. Add the field to `initialCharacterState` in `src/hooks/useCharacterStore.js`
2. Add a handler in `src/hooks/useCharacterHandlers.js` (follow the existing pattern)
3. Wire the handler into `App.js` and pass it to the relevant layout component
4. Render the field in `MobileLayout` and/or `DesktopLayout`
5. Update `docs/ARCHITECTURE.md` if the data shape changes

### Adding a new component

Each component lives in its own folder under `src/components/` with a matching CSS file:

```
src/components/MyComponent/
  MyComponent.js
  MyComponent.css
```

CSS class names are global — pick names that won't collide (prefix with the component name).

### Adding a new hook

Hooks live in `src/hooks/`. Each hook should own a single concern and accept the minimum inputs it needs. Avoid reading from `character` in a hook when you can use the functional `setCharacter(prev => ...)` form instead — it avoids stale closure bugs.

## Key Concepts

### The Rulebook Tag System

Abilities and combat techniques use a bracket notation from the RPG rulebook:

| Bracket | Meaning | Examples |
|---|---|---|
| `( )` | Frequency | `(PA)` passive, `(AW)` at will, `(2R)` twice per round |
| `[ ]` | Timing | `[NA]` normal action, `[RE]` reaction |
| `{ }` | Cost | `{-}` free, `{1 Daring}` costs 1 Daring, `{SP}` special |

The current ability system stores this as plain text in a label string and parses it with regex. The planned rework (see [ROADMAP.md](ROADMAP.md)) replaces this with structured JSON data.

### Character Sharing

When character data changes, `useCharacterStore` serializes the active character to the URL query string:

```
JSON.stringify → pako.deflate (zlib) → btoa (base64) → ?character=<value>
```

On load, `usePersistentState` reads this parameter and merges the character into the local store. This means sharing a URL shares the character — no server required.

### The Lock

The `isLocked` state in `App.js` is passed to every component that has an input. When locked, all inputs are `disabled` and drag handles are hidden. It's intended for use during play to prevent accidental edits.

### DynamicList

`DynamicList` is a dnd-kit wrapper that handles drag-to-reorder. It uses a render prop pattern — you pass a function as `children` that receives each item, an `onItemChange` callback, and an `onItemRemove` callback:

```jsx
<DynamicList items={abilities} setItems={handleAbilitiesChange}>
  {(ability, onChange, onRemove) => (
    <DynamicListItem onRemove={() => onRemove(ability.id)}>
      <MyComponent item={ability} onChange={onChange} />
    </DynamicListItem>
  )}
</DynamicList>
```

## Branching and PRs

- `main` is the deploy branch — merging to `main` and running `npm run deploy` publishes to GitHub Pages
- Work in feature branches: `feature/thing-you-are-adding` or `refactor/what-you-are-refactoring`
- Open PRs against `main`

## Docs

Keep the docs folder in sync as you work:

- Changed the data shape? Update `ARCHITECTURE.md`
- Implemented something from the roadmap? Remove or update its entry in `ROADMAP.md`
- Planning a new feature? Add it to `ROADMAP.md` before starting
