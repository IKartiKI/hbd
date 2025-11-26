## Anti-Reel — Birthday Feed

Single-page React + Vite + Tailwind app that mimics an Instagram Reels style vertical feed, powered entirely by a local JSON manifest. No auth, no database — just roasted birthday chaos.

### Structure

- **`src`**: React app source (feed, reels, overlays, final card).
- **`public/assets/manifest.json`**: Ordered list of media items that drives the entire UI.
- **`public/assets/media`**: Put your photos, videos, and audio files here (MP4/WEBM, JPG/WEBP, MP3/AAC recommended).

### Running locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the printed `localhost` URL in your browser (mobile devtools recommended to preview the vertical feed).

### Manifest format

The app reads `public/assets/manifest.json`. Example:

```json
[
  {
    "id": "1",
    "type": "photo",
    "filename": "media/her_photo_01.jpg",
    "caption": "POV: She thinks she’s chill",
    "roast_line": "Certified chaos magnet™",
    "audio_filename": "media/silly_tune.mp3",
    "audio_start_sec": 0,
    "audio_end_sec": 12,
    "sticker": "Certified Clown",
    "show_subtitle": true
  }
]
```

All media paths are relative to `public/assets/`.

### Build

```bash
npm run build
```

This outputs a static site into the `dist` folder.

### Deploy to Vercel (one-command path)

1. Install the Vercel CLI (once):

```bash
npm install -g vercel
```

2. From the project root, run:

```bash
vercel
```

When prompted the first time:

- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Output directory**: `dist`

On subsequent deployments you can just run:

```bash
vercel --prod
```

Vercel will serve the app as a fully static site.

### Deploy to Netlify

1. Install the Netlify CLI:

```bash
npm install -g netlify-cli
```

2. From the project root:

```bash
netlify deploy
```

When asked:

- **Build command**: `npm run build`
- **Publish directory**: `dist`

For a production deploy:

```bash
netlify deploy --prod
```

### Privacy note

**Make sure you have consent to use and host these photos/videos — do not publish personal media without permission.**

