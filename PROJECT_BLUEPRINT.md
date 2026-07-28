# Cyber Quest — Product Vision & Plan

## Product idea

Cyber Quest is a story-driven cybersecurity challenge platform for grades 4–8. Learners choose a level, work through a short sequence of challenges, and unlock the next challenge after solving the current one.

The product promise:

> Learn a cyber skill by using it inside a clear, safe story.

## Experience structure

1. Choose a level from the level dashboard.
2. Open the level to see its challenges in a grid.
3. Start the first unlocked challenge.
4. Read a short briefing and objective in the left panel.
5. Solve the simulated website, email, puzzle, or terminal in the main workspace.
6. Submit the answer, earn points, and unlock the next challenge.

The challenge workspace always keeps the same controls in the same place:

- Challenge name and number
- Points available
- Briefing
- Field Manual
- Hint
- Answer submission
- Previous and next navigation

## Playable level: Signal Lost

One hour before the school science fair, the Robot Club’s helper robot Bolt disappears from the network. Twelve connected challenges follow the clues, recover Bolt, and secure the science-fair launch one concept at a time:

1. **Hidden in Plain Sight** — reveal hidden webpage text.
2. **Mixed-Up Message** — recognize and reverse a simple text pattern.
3. **The Fake Update** — identify a look-alike phishing domain.
4. **Password Pitfall** — choose a long, unique password.
5. **Terminal Trail** — use `ls` and `cat` in a training terminal.
6. **Bring Bolt Home** — choose the correct reporting and recovery steps.
7. **The Look-Alike Link** — compare full domains and choose the real club site.
8. **Permission Patrol** — apply least privilege to a badge-scanner app.
9. **Wi-Fi Impostor** — match a secured network with a trusted source.
10. **Photo Footprints** — remove precise GPS metadata before sharing.
11. **Shifted Schedule** — decode a simple Caesar-shift message.
12. **Science Fair Shield** — choose a layered launch-security plan.

Total level score: 1,810 points.

## Design system

- Direction: simple flat educational game interface
- Primary shell: deep navy
- Primary action: clear green
- Challenge surfaces: white cards with calm, single-purpose colors
- Typography: readable system sans with monospace reserved for code and terminal content
- Layout: compact fixed sidebar plus a large challenge workspace
- Status: explicit labels for ready, locked, and complete states
- Motion: small feedback transitions only; reduced-motion preferences supported

## Safety and privacy requirements

- Every technical activity runs in a fictional training surface.
- No real credentials, domains, personal information, or open-ended shell execution.
- Defensive intent, permission, reporting, and trusted-adult support are part of the story.
- Early pilots should not require child accounts or collect personal data.
- Production accounts require a formal COPPA review, parental notice and consent design, retention policy, educator controls, and security assessment.

## Next production steps

1. Add persistence for challenge completion and points.
2. Add learner reading-level options and optional read-aloud support.
3. Create an educator dashboard for progress, attempts, and hint usage.
4. Add Level 2 using the same challenge engine.
5. Pilot with grades 4–5 and 6–8 separately and adjust the reading level and difficulty.
