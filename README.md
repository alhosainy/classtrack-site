# ClassTrack — Landing page

The official marketing site for **ClassTrack**, the offline-first app for private teachers. Live at:

**https://alhosainy.github.io/classtrack-site/**

The ClassTrack *application source code* lives in a private repository and is not part of this project. This repo only contains the static site used to promote it and host its APK downloads.

## What's on the site

- Bilingual **Arabic-first / English** with a language toggle (RTL/LTR aware)
- **Light/dark** theme toggle
- Hero with a live screenshot carousel + a section explaining the app's headline features
- Feature grid, "how it works" steps, and a screenshot gallery (all screenshots are real captures from the app, running against an example dataset)
- **Download section** with the latest APK link and coming-soon Google Play / iOS placeholders

## Download link

The Download buttons resolve the latest APK from **this repo's** GitHub Release (`releases/latest`) at runtime, so the site always points at the newest `classtrack-<version>.apk`. Publish flows: when the app repo bumps its version, its CI builds the signed APK and mirrors `classtrack-<version>.apk` here as a Release, using the `SITE_RELEASE_TOKEN` secret (only write access to this repo).

## Project structure

```
index.html          Landing page markup (sections, static toggles)
css/styles.css      Design-system tokens, light/dark themes, responsive layout
js/main.js          i18n dictionary (AR/EN), theme, carousel, APK link resolution
assets/icon.png     App icon
assets/screenshots/ Screenshots used by the gallery and carousel
```

## Run locally

```bash
python -m http.server 8123 --directory .
# open http://localhost:8123
```

## Deploy

The site is published with GitHub Pages from the `main` branch, no build step required. Push to `main` and GitHub redeploys automatically (`.nojekyll` is present to skip Jekyll).