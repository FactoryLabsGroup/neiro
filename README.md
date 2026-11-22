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

- **App Store link.** Set `APP_STORE_URL` in `assets/js/config.js`. Every download button on both pages reads it.
- **English screenshots.** The app repository only has Georgian App Store screenshots, so for now the English page shows those too, and says so under the day section. To make the English set, run this on a Mac with Xcode, pointing at the app repository:

  ```bash
  tools/capture-screens.sh en ~/path/to/neiro-ios
  ```

  It builds the app for the Simulator, launches it once per screen with the app's own debug launch arguments (demo progress, dark, English), and asks you to scroll by hand for two of them. Then it runs `tools/make-screens.py`, which writes `assets/screens/en/` and adds `en` to `assets/js/screens.js`, after which the English page shows English screens. Screenshots you already have work too: name them `home`, `adaptive`, `puzzle`, `streak`, `games`, `3d`, `progress`, `duel`, put them in a folder, and run `python3 tools/make-screens.py en that/folder` (it needs Pillow).
- **Privacy policy.** `privacy.html`, in English and Georgian, is the page to give App Store Connect as the privacy policy URL. It names Factory Labs and contact@factorylabs.app.

## Languages

The site is in English and Georgian, like the app. A visitor gets Georgian when their browser asks for it and English otherwise; the EN / ქა switch in the header and footer changes it in place, remembers the choice in the browser, and adds `?lang=` to the address so a link keeps the language.

- English lives in the HTML. Georgian lives in `assets/js/i18n.js`, keyed by each element's `data-i18n` name (`data-i18n-alt`, `data-i18n-aria` and `data-i18n-content` for attributes). Strings that scripts write, such as the demos' messages, sit in the same file under `UI`.
- Wherever the app already says the same thing, the Georgian is the app's own, from `Localizable.xcstrings`: every game's name, tagline and "trains" line, the skills, the constellations, and the honest wording on what to expect.
- Georgian follows the app's rules: the polite plural, nouns singular after numbers, „…“ quotes, zero letter spacing, never capitals, and no dash or hyphen. It's set in the system's Georgian face on Apple devices and in Noto Sans Georgian elsewhere, loaded only when Georgian is on the page.
- Screenshots follow the language (see above).

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
| Privacy policy | `privacy.html`: what stays on the phone, the iCloud backup, Game Center and the day's board, duel links, reminders, Siri, Apple's crash reports, and this website. |

## Where the content comes from

Everything on the page is taken from the app, so it stays true to it:

- Skill names, summaries and colours, in both languages: `Core/Model/BrainArea.swift`, `Core/DesignSystem/Theme.swift`, `Resources/Localizable.xcstrings`.
- Game names, taglines and what each trains: `Resources/Localizable.xcstrings`. Formats and unlock levels: `Core/Model/GameID.swift`, `Core/Progress/Leveling.swift`. The tasks they're based on: the app's README.
- The neuron (`assets/js/neuron.js`): a port of `Core/Neuron/Neuron.swift` and `Features/Neuron/NeuronView.swift`, with the same SplitMix64 generator and growth rules.
- The sky (`assets/js/data.js`): star positions, lines and notes from `Core/Sky/Sky.swift`.
- The demos (`assets/js/demos.js`): `ConstellationEngine`, `InkEngine` and `Staircase`.
- Claims: the *What to expect* wording comes from the app's *How Neiro works* page. The page promises better scores at the games and nothing more, as the app does. As in the app's copy, nothing a visitor reads uses a dash or a hyphen.

## Files

```
index.html           The page
privacy.html         The privacy policy, in both languages
assets/
  css/styles.css     Design tokens (night and paper themes, the seven skill colours), layout, responsive rules
  js/main.js         Navigation, reveals, the hero, games wall and card, chart, neuron controls, sky, puzzle, FAQ
  js/i18n.js         Languages: detection, the switch, and the Georgian text
  js/config.js       The App Store link
  js/screens.js      Which languages have their own screenshots (written by tools/make-screens.py)
  js/page.js         The privacy page's script
  js/data.js         Skills, games and constellations, in both languages
  js/art.js          Tile art for each game
  js/neuron.js       The neuron's growth model and drawing
  js/demos.js        Constellation and Ink
  screens/<lang>/    App screenshots (WebP), one folder per language
  img/               App icon sizes, starfield
  fonts/             Nunito (fallback for SF Pro Rounded), Instrument Serif italic, Inter, Noto Sans and Serif Georgian
tools/
  capture-screens.sh Captures the screens from the Simulator (Mac)
  make-screens.py    Turns screenshots into the site's set for a language
```

Motion follows the visitor's Reduce Motion setting, and the canvases only animate while they're on screen.
