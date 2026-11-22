# Neiro website

The marketing site for **Neiro**, the brain training app for iPhone (source: `FactoryLabsGroup/neiro-ios`).

A single static page: plain HTML, CSS and JavaScript modules, with no build step and no dependencies. Fonts are self hosted.

## Preview

ES modules need to be served over HTTP, so open it through any static server rather than from the file system:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Before launch

- **App Store link.** Set `APP_STORE_URL` at the top of `assets/js/main.js`. Every download button on the page reads it.
- **Screenshots.** `assets/screens/` holds the real App Store screenshots, cropped out of their frames from `Design/AppStore/ka/` in the app repository. They're in Georgian, which the page says under the day section. English versions can replace them under the same names (`home`, `adaptive`, `puzzle`, `streak`, `games`, `3d`, `progress`, `duel`): 948 × 2052 for the full size, and 474 × 1026 for the `-sm` version.

## What's on the page

| Section | Content |
|---|---|
| Hero | The headline from onboarding, the home screen in a phone, and a live neuron behind it that grows a node for a game every few seconds. |
| A day in Neiro | Three steps (three games, the puzzle and the challenge, the star and the streak). On wide screens the phone follows the step being read. |
| The games | All 28 games, one column per skill, with tile art drawn as SVG. Each opens a card with its tagline, what it trains, the task it's based on, its length and the level that opens it. |
| Try it here | Constellation and Ink, playable in the browser by the app's own rules and staircase, in shorter sessions. |
| How it works | The staircase as a chart (an example game of Ink, replaced by the visitor's own run once they've played), the honest research, score and level notes, and where each game comes from. |
| Your neuron | The neuron grown live by a port of the app's growth model. Visitors can play a game in any skill, play a week, or grow a different neuron. |
| Your sky | The twelve constellations with their real star placements and notes, lit by a days slider. |
| Puzzle and duels | A small sliding puzzle with the daily puzzle's rules, and the duel flow. |
| Details, What to expect, FAQ | Features, the app's own wording on what it does and doesn't promise, and common questions. |

## Where the content comes from

Everything on the page is taken from the app, so it stays true to it:

- Skill names, summaries and colours: `Core/Model/BrainArea.swift`, `Core/DesignSystem/Theme.swift`.
- Game names, taglines and what each trains: `Resources/Localizable.xcstrings`. Formats and unlock levels: `Core/Model/GameID.swift`, `Core/Progress/Leveling.swift`. The tasks they're based on: the app's README.
- The neuron (`assets/js/neuron.js`): a port of `Core/Neuron/Neuron.swift` and `Features/Neuron/NeuronView.swift`, with the same SplitMix64 generator and growth rules.
- The sky (`assets/js/data.js`): star positions, lines and notes from `Core/Sky/Sky.swift`.
- The demos (`assets/js/demos.js`): `ConstellationEngine`, `InkEngine` and `Staircase`.
- Claims: the *What to expect* wording comes from the app's *How Neiro works* page. The page promises better scores at the games and nothing more, as the app does. As in the app's copy, nothing a visitor reads uses a dash or a hyphen.

## Files

```
index.html
assets/
  css/styles.css     Design tokens (night and paper themes, the seven skill colours), layout, responsive rules
  js/main.js         Navigation, reveals, the hero, games wall and card, chart, neuron controls, sky, puzzle, FAQ
  js/data.js         Skills, games and constellations
  js/art.js          Tile art for each game
  js/neuron.js       The neuron's growth model and drawing
  js/demos.js        Constellation and Ink
  screens/           App screenshots (WebP)
  img/               App icon sizes, starfield
  fonts/             Nunito (fallback for SF Pro Rounded), Instrument Serif italic, Inter
```

Motion follows the visitor's Reduce Motion setting, and the canvases only animate while they're on screen.
