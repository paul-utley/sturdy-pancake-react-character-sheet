# Sturdy Pancake — RPG Character Sheet

A web-based character sheet for a custom tabletop RPG system. Manage multiple characters, track attributes, skills, vitals, abilities, and combat techniques — all saved locally in your browser and shareable via URL.

**Live app:** https://paul-utley.github.io/sturdy-pancake-react-character-sheet/

## Features

- Multiple character support with quick switching
- Attributes, skills, vitals (Health / Vigor / Dashes), and momentum tracking
- Ability management with automatic cost deduction
- Combat technique builder with point-cost calculation and trait selection
- Drag-and-drop reordering for abilities and combat technique traits
- Lock mode to prevent accidental edits during play
- New Round / Quick Rest / Long Rest actions with field highlighting
- Character sharing via compressed URL
- Import / export characters as JSON

## Quick Start

Requires Node 20 (see `.tool-versions` — use [asdf](https://asdf-vm.com) to manage).

```bash
asdf install        # installs Node version from .tool-versions
npm install
npm start           # opens http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server |
| `npm test` | Run tests in watch mode |
| `npm run build` | Production build |
| `npm run deploy` | Build and deploy to GitHub Pages |

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — tech stack, project structure, state management, data shapes
- [docs/ONBOARDING.md](docs/ONBOARDING.md) — getting started guide for new contributors
- [docs/ROADMAP.md](docs/ROADMAP.md) — planned features and known code quality work
