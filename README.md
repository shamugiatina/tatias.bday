# თათიას 27-ე დაბადების დღე 🎀

Mobile-first invitation for **26 November 2026, 20:00 Asia/Tbilisi**.

## Run

Requires Node.js 22 or newer. There are no npm dependencies.

```sh
cd /workspace/tatias.bday
npm start
```

The server listens on port 3000 (`PORT` overrides it). `npm run dev` enables server watch mode. Run `npm test` for HTTP and persistence checks.

## Features

Tap-to-extinguish birthday cake, live countdown, animated envelope, dress-code palette, provided Google Maps link, and RSVP form. Works on phone screens from 320px; desktop retains a centered invitation layout. Fonts are served locally with their OFL licenses. Reduced-motion settings are respected.

## Responses and hosting

Guest responses are saved to `data/responses.jsonl`, outside the public directory and ignored by Git. Each line contains the name, yes/no attendance, optional note and submission timestamp. The host can read/export this file; there is no public guest list or admin dashboard. `RSVP_FILE` overrides the storage location.

To share the invitation, deploy this Node server on HTTPS hosting with **persistent writable storage** for responses. Static-only hosting will show the page but cannot save RSVPs. This development environment is not a published public website. Back up responses and restrict server filesystem access. For a larger public event add abuse protection and an authenticated management interface.

The map illustration is decorative; the button opens the exact Google Maps link supplied by the host. Venue name and street address were not supplied. Artwork is original SVG/CSS inspired by the reference palette; the provided screenshots are not embedded. Update event copy in `public/index.html`, and the countdown instant in `public/app.js`. The supplied DM Galaktioni UNI font is served locally as `public/fonts/galaktioni.ttf`. The cake and four fashion figures are generated transparent assets in `public/images`. Each fashion figure animates independently; balloons release candy on touch. Reduced-motion preferences disable movement. Build a self-contained offline preview with `python3 scripts/build-preview.py`; the HTML is written to `/tmp/tatia-invitation-preview.html`. In that preview only, RSVPs are saved in the current browser, not sent to the host.

## GitHub Pages

`python3 scripts/build-pages.py` builds the static version in `docs/`, with relative asset URLs for the `/tatias.bday/` project path. In repository Settings → Pages select Deploy from a branch, branch `main`, folder `/docs`, then Save. GitHub Pages hosts the invitation, cake, stickers, countdown and map. It cannot run the Node RSVP API: the static version clearly disables the RSVP form and asks guests to contact the host directly. The Node version remains unchanged and stores RSVPs on a persistent server. Rebuild and push `docs/` after editing the source.

## Background music

The host-supplied MP3 lives in `public/audio/this-will-be.mp3` and is copied into `docs/audio/`. Playback begins directly on the first cake tap (browser user-gesture requirement), loops at 35% volume and continues through the invitation. A floating accessible button pauses/resumes playback; replaying the cake respects an explicit pause. The button remains available if playback is blocked so the guest can retry. The offline preview embeds the MP3.
