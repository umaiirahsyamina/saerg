# SAERG — Day One at Nexora

**SAERG** (Social-engineering Awareness Escape Room Game) is a browser-based 3D first-person
escape room that teaches players to recognise and report six social engineering attacks.
Final Year Project, Universiti Putra Malaysia.

The full game specification is in [CLAUDE.md](CLAUDE.md).

## Requirements

- Node.js 22 LTS or newer
- A desktop browser: Chrome, Edge or Firefox

## Commands

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm install`     | Install dependencies (first time only)                |
| `npm run dev`     | Start the local dev server at http://localhost:5173   |
| `npm test`        | Run the unit tests (Vitest)                           |
| `npm run lint`    | Check the code with ESLint                            |
| `npm run format`  | Format the code with Prettier                         |
| `npm run build`   | Type-check and build the production site into `dist/` |
| `npm run preview` | Serve the production build locally (under `/saerg/`)  |

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, tests, builds and
publishes the site to GitHub Pages: https://umaiirahsyamina.github.io/saerg/

One-time setup on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Folder structure

```
src/
  main.ts       entry point
  config.ts     API URL and debug flags
  core/         game state machine, timer, scoring (pure logic)
  world/        3D scene, player controller, interactables, NPCs
  scenarios/    generic ScenarioRunner + per-scenario 3D hooks
  ui/           HTML/CSS overlays (HUD, quiz, email, phone, ...)
  audio/        audio manager and subtitles
  analytics/    event queue and local fallback
  data/         all game text and content as JSON
  styles/       CSS
server/         analytics API (Express + SQLite), added in Milestone 7
tests/          Vitest unit tests
public/assets/  3D models, textures and audio
```
