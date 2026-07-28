# Cyber Quest

Cyber Quest is a playable, story-driven cybersecurity learning demo for
elementary and middle school students.

Players follow the disappearance of Bolt, the Robot Club helper, through twelve
progressive challenges:

- hidden text and webpage clues
- simple text-pattern decoding
- phishing and look-alike domains
- password safety
- a simulated command-line terminal
- safe incident response and account recovery
- suspicious URLs and app permissions
- trusted Wi-Fi and photo metadata
- simple cipher decoding
- layered security planning

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Build

```bash
# Full vinext build
npm run build

# Static GitHub Pages build
npm run build:pages
```

The GitHub Actions workflow in `.github/workflows/pages.yml` publishes the
static build whenever `main` changes.

## Demo security note

This repository is a front-end prototype. Challenge answers and terminal
responses are included in the browser code so the demo can run entirely on
GitHub Pages. A production version should validate answers and store progress
on a server.
