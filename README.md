# Paw Tiles

A tile-matching puzzle game featuring collectible cat avatars, each with their own unique world and abilities.

**Play now:** [golem-paw-tiles.singularitybridge.net](https://golem-paw-tiles.singularitybridge.net)

## How to Play

- Tap tiles to select them into your slots (up to 4)
- When 3 matching tiles are selected, they clear and you earn points
- If all 4 slots fill without a match, it's game over
- Clear all tiles from the board to win and earn stars

## Features

- **Tile Matching** — Classic mahjong solitaire-style gameplay with layered tile boards
- **Cat Avatars** — 6 collectible cat characters, each with unique skills and upgradeable abilities
- **Avatar Worlds** — Each cat has their own AI-generated background that appears across all screens
- **Star Economy** — Earn stars by winning games, spend them to unlock avatars and upgrade skills
- **Tutorial System** — Step-by-step guide for new players
- **Game Designer** — Debug tools for testing and inspecting game state
- **Responsive Mobile UI** — Designed for portrait phone screens with touch interactions

## Avatars

| Avatar | Skill | World |
|--------|-------|-------|
| Mochi | Zen Focus | Zen garden with cherry blossoms |
| Kuro | Shadow Sight | Moonlit temple at night |
| Sakura | Bloom Burst | Spring meadow with wisteria |
| Taro | Iron Will | Mountain fortress in autumn |
| Yuki | Frost Veil | Snowy shrine under aurora |
| Hana | Petal Dance | Festival street with fireworks |

## Tech Stack

- [Next.js](https://nextjs.org) 16 with Turbopack
- React 19 with `use client` components
- TypeScript
- CSS (no Tailwind utility classes — custom component styles)
- localStorage for game state persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/          — Next.js app router (layout, page, global CSS)
  components/   — Game screens (MahjongGame, MainMenu, AvatarGallery, etc.)
  lib/          — Game store, avatar definitions, tile data
public/
  avatars/      — Cat avatar illustrations
  backgrounds/  — Per-avatar world backgrounds (AI-generated, Flux 2 Max)
  tiles/        — Tile artwork
```

## License

[MIT](LICENSE)
