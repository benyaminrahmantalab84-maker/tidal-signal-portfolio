# Bilingual React portfolio (concept)

A one-page Persian/English portfolio sample built with React and TypeScript. Its fictional game studio brief, **Tidal Signal**, connects a player hub, studio dashboard, and launch site. The interactive scope explorer calls a real Node.js REST endpoint at `POST /api/scope`. The endpoint is a Node.js Function, not Express.

All identity and project content is **sample content**. The concept projects are not presented as completed client work.

## Run locally

Requires Node.js 22+ and pnpm 11.

```sh
pnpm install
pnpm dev
```

Vite serves the same API handler locally through its middleware. To check the production bundle and preview it locally:

```sh
pnpm build
pnpm preview
```

The preview server also mounts the API handler for local checks. On Vercel, `api/scope.js` runs as a Node.js Function.

## Replace the sample content

- Edit both languages in `src/content.ts`. Keep the concept labels until real, verifiable projects replace them.
- Replace the name, email, and GitHub placeholders in that file with genuine information. Add contact links only when you have real destinations.
- The source link points to the verified public repository. `VITE_REPOSITORY_URL` can override it if the repository moves (see `.env.example`).
- `src/styles.css` controls layout and motion. Reduced-motion preferences disable animation.

## Image credit

The featured photograph is [Kråkenes Lighthouse during stormy weather](https://commons.wikimedia.org/wiki/File:Krakenes-lighthouse-waves-tunliweb.jpg) by Svein Magne Tunli, sourced from Wikimedia Commons under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). This repository stores a 1280-pixel version supplied by Wikimedia Commons. The site displays it with CSS overlays and cropping, without editing the image file. The photograph shows a real place and is only visual reference for the fictional Tidal Signal brief; it is not game art or a screenshot. Keep the attribution and license link if you reuse or modify the image.

## API contract

Send JSON such as:

```json
{"siteType":"portfolio","features":["content","analytics"]}
```

Accepted site types: `portfolio`, `dashboard`, `commerce`. Accepted features: `auth`, `content`, `analytics`, `payments`. The server rejects invalid or duplicate values with HTTP 400 and returns deterministic module IDs and a complexity level for valid input. The result is educational, not a price or delivery commitment.

## Publishing

The [source repository](https://github.com/benyaminrahmantalab84-maker/tidal-signal-portfolio) is public on GitHub. The website itself is still served locally; no public site deployment has been configured. A static-only host cannot run the API Function without a separate Node deployment.
