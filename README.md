# Cyber Quest

Cyber Quest is a playable, story-driven cybersecurity learning campaign for
upper-elementary and middle school students. It contains 52 original missions
across six progressively harder stages.

The campaign begins with the disappearance of Bolt, then expands into account
investigation, system recovery, network defense, digital forensics, and incident
command:

1. **Signal Lost — Cyber Scout:** careful observation, phishing, URL safety,
   password security, logs, hashes, and a safe training terminal.
2. **The Copycat Account — Digital Defender:** identity verification, email
   headers, OAuth permissions, timelines, and evidence-based reporting.
3. **Library Lockout — Systems Investigator:** filesystems, file signatures,
   permissions, persistence, backup validation, and recovery.
4. **Festival Firewall — Network Analyst:** HTTP, DNS, TLS, traffic baselines,
   ordered firewall rules, and detection logic.
5. **Midnight Archive — Forensics Specialist:** time normalization, binary
   triage, strings, regex, process trees, custody, and forensic reporting.
6. **Operation Glasshouse — Incident Commander:** risk prioritization, ATT&CK,
   identity analytics, supply-chain provenance, detection, and leadership.

Later stages include a Research Desk with source-quality guidance and suggested
search terms. Answers are still checked inside the fictional, browser-only
training environment; no mission connects to a real shell, account, or device.

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
static build whenever `main` changes. Progress is stored only in the learner's
browser.

## Demo security note

This repository is a front-end prototype. Challenge answers and simulated
terminal responses are included in browser code so the campaign can run
entirely on GitHub Pages. Production assessment should validate answers and
store progress on a server.

## Design reference

The progression model was informed by the range of topics cataloged in the
[CyberStart 2024 community walkthrough repository](https://github.com/alphyos/CyberStart-2024).
Cyber Quest uses original school-safe stories, evidence, answers, interfaces,
and defensive learning objectives; it does not reproduce the walkthrough flags
or challenge solutions.
