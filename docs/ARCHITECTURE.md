# Architecture

A React 19 character sheet app for a custom tabletop RPG system. Bootstrapped with Create React App, deployed to GitHub Pages.

## Stack

| Concern | Choice |
|---|---|
| UI | React 19, plain JavaScript (no TypeScript) |
| Styling | Plain CSS — one `.css` file per component folder, all global (no CSS Modules) |
| Drag-and-drop | dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`) |
| URL sharing | pako (zlib compression) — character data is deflated + base64-encoded into the URL |
| Persistence | `localStorage` via `usePersistentState` hook |
| Deployment | `gh-pages` package |
| Node version | See `.tool-versions` (managed with asdf) |

## Project Structure

```
src/
  App.js                        # Root component — composes hooks and layout
  hooks/
    usePersistentState.js       # localStorage sync + URL decompression on load
    useMediaQuery.js            # Responsive breakpoint detection
    useCharacterStore.js        # Character state, derived values, and data effects
    useCharacterHandlers.js     # All field/attribute/skill/technique update callbacks
    useAbilityPayment.js        # Ability use tracking and cost deduction logic
    useRoundActions.js          # New Round / Quick Rest / Long Rest handlers
    useCharacterManager.js      # Character CRUD: create, load, delete, import
  data/
    combatTechniqueCosts.js     # Static cost definitions for combat technique traits
  components/
    MobileLayout/               # Tabbed mobile UI (< 1300px)
    DesktopLayout/              # Three-column desktop UI
    AttributeBox/               # Single attribute with value/max inputs
    VitalsBox/                  # Health / Vigor / Dashes tracker
    SkillItem/                  # Skill name + level checkboxes
    CombatTechniqueBox/         # Full technique editor with cost calculation
    TabbedTextarea/             # Editable label + textarea + optional Use button
    DynamicList/                # dnd-kit sortable list wrapper
    DynamicListItem/            # List item with remove button
    SectionBox/                 # Collapsible section with optional editable title
    PaymentChoiceModal/         # Modal for choosing which attribute pays an ability cost
    LoadCharacterModal/         # Character switcher / creator / importer
    ImportCharacterModal/       # Paste or upload character JSON/compressed string
    DataModal/                  # Display raw character JSON
    ... (others)
```

## State Management

All character state lives in `useCharacterStore`, which returns `character` (the active character object) and `setCharacter` (a stable callback). There is no Redux or Context — state flows down via props.

```
useCharacterStore        → character, setCharacter, characters, setCharacters
useCharacterHandlers     → handle*Change callbacks (consume character + setCharacter)
useAbilityPayment        → ability use state + handlers (consume character + setCharacter)
useRoundActions          → highlightedFields + round/rest handlers (consume setCharacter)
useCharacterManager      → CRUD handlers (consume characters + setCharacters)
App.js                   → composes all hooks, renders MobileLayout or DesktopLayout
```

## Character Data Shape

Stored in `localStorage` under the key `characters` as a map of `{ [id]: characterObject }`.

```js
{
  id: number,
  characterName: string,
  archetype: string,
  archetypeBody: string,
  bio: { id, label, text },
  beliefs: { id, label, text },
  goals: { id, label, text },
  attributes: [{ name, value, max }],   // Daring, Deft, Steadfast, Shrouded, Resolve
  abilities: [{ id, label, text }],     // see ROADMAP.md — structure changing
  skills: [{ name, level, isEditable? }],
  health: { name, value, max },
  vigor: { name, value, max },
  dashes: { name, value, max },
  armor: '' | 'Light' | 'Medium' | 'Heavy',
  damageReduction: number,
  inventory: string[],
  combatTechniques: [{
    id, column, title, body, damage, zone, armament, role, range,
    traits: [{ id, label, text }],
    totalCost: number
  }],
  momentum: boolean,
}
```

## URL Sharing

When character data changes, `useCharacterStore` serializes the active character to the URL:

```
JSON.stringify → pako.deflate → btoa → ?character=<base64>
```

On load, `usePersistentState` reads the `?character` param and merges it into the characters map. This allows sharing a character by copying the URL.

## Rulebook Tag System

Abilities and combat techniques use a bracket-based notation from the rulebook:

| Bracket | Meaning | Examples |
|---|---|---|
| `( )` | Frequency | `(PA)` passive, `(AW)` at will, `(2R)` twice per round |
| `[ ]` | Timing | `[NA]` normal action, `[RE]` reaction |
| `{ }` | Cost | `{-}` free, `{1 Daring}` strain Daring once, `{SP}` special |

## Responsive Layout

| Breakpoint | Layout |
|---|---|
| > 1300px | Three-column desktop (`DesktopLayout`) |
| ≤ 1300px | Tabbed mobile (`MobileLayout`) with Core / Abilities / Combat / Stats tabs |
| ≤ 1299px | Desktop layout, but column 2 techniques collapse into column 0 |
