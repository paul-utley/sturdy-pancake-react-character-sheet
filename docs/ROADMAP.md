# Roadmap

Planned features and known code quality work, roughly in priority order.

---

## Planned Feature: Ability System Rework

### Problem

The current ability system stores abilities as free-form text with costs embedded in the label string:

```
"Fireball {3 Daring}"
```

The app then regex-parses this string to determine cost and resource. This is brittle — typos silently break cost deduction, and the full rulebook tag system (`(AW) [NA] {1 Daring}`) can't be represented.

### Goal

Replace with a static JSON-driven system where abilities are selected from a predefined list, stored by ID on the character, and displayed as read-only cards. This mirrors how combat technique traits already work.

### Rulebook Tag System

Abilities have three structured tag types:

**`( )` — Frequency:**
- `PA` — Passive; always in effect, no Use button
- `AW` — At Will; unlimited uses per round
- `xR` — x Per Round; tracked per round, resets on New Round

**`[ ]` — Timing:**
- `NA` — Normal Action (used on your turn)
- `RE` — Reaction (used in response to a trigger)

**`{ }` — Cost:**
- `{-}` — No cost
- `{SP}` — Special; cost described in text, no automatic deduction
- `{N Resource}` — Deduct N from the named resource (Daring, Deft, Steadfast, Momentum, Shrouded)

### New Data File: `src/data/abilities.js`

```js
export const abilities = [
  {
    id: 'quick-strike',
    name: 'Quick Strike',
    description: 'Make an immediate Melee attack.',
    frequency: { type: 'AW' },
    timing: 'NA',
    cost: { type: 'resource', amount: 1, resource: 'Daring' },
  },
  {
    id: 'guardian-stance',
    name: "Guardian's Stance",
    description: 'While active, adjacent allies gain +1 Defense.',
    frequency: { type: 'PA' },
    timing: null,
    cost: { type: 'none' },
  },
  {
    id: 'counterattack',
    name: 'Counterattack',
    description: 'Immediately make a Melee attack against the attacker.',
    frequency: { type: 'perRound', count: 1 },
    timing: 'RE',
    cost: { type: 'none' },
  },
];
```

### New Character Storage

Currently: `abilities: [{ id, label, text }]`

After rework: `abilities: ['quick-strike', 'counterattack']` — IDs only, resolved from the static list at render time.

### New Components

- **`AbilitySelectionModal`** — mirrors `TraitSelectionModal`; browse and select from the static list
- **`AbilityCard`** — read-only display card (rework the existing unused `AbilityDisplayCard`)

### State Change

`inactiveAbilityButtons` (array of used IDs) → `abilityUseCounts` map:

```js
// Before
inactiveAbilityButtons = ['quick-strike']

// After
abilityUseCounts = { 'counterattack': 1 }  // resets to {} on New Round
```

An ability is exhausted when `abilityUseCounts[id] >= ability.frequency.count`. `AW` abilities are never exhausted. `PA` abilities have no Use button.

---

## Code Quality Work

### URL Serialization Debounce

**File:** `src/hooks/useCharacterStore.js`

The health min / URL sync `useEffect` runs `JSON.stringify` + `pako.deflate` on every character state change, including every keystroke. Should be debounced ~500ms.

```js
// Wrap the URL sync portion with:
const timer = setTimeout(() => { /* compress + replaceState */ }, 500);
return () => clearTimeout(timer);
```

### Fix `useMediaQuery` Dependency Array

**File:** `src/hooks/useMediaQuery.js:29`

`matches` is included in the `useEffect` dependency array. Since the effect updates `matches`, this risks re-registering the event listener on every state change. Remove `matches` from the array.

### Add `React.memo` to Leaf Components

`App.js` uses `useCallback` for all handlers. Wrapping leaf components with `React.memo` completes the optimization and prevents re-renders when unrelated state changes.

Target components: `AttributeBox`, `VitalsBox`, `SkillItem`, `TabbedTextarea`

```js
export default React.memo(AttributeBox);
```

### Fix the Broken Test

**File:** `src/App.test.js`

The only test asserts `screen.getByText(/learn react/i)` — a Create React App boilerplate leftover that doesn't match the actual app. Replace with a smoke test, and add unit tests for the ability data shape and cost affordability logic once the ability rework lands.

### React Context for Cross-Cutting Props

`isLocked` and `highlightedFields` are passed through multiple component layers. A `LockContext` would remove these from intermediate components. Lower priority — implement after the ability rework stabilizes the component tree.
