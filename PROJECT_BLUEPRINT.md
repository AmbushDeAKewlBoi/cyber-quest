# Cipher Scouts — Product Vision & Plan

## Product idea

Cipher Scouts is a story-driven cybersecurity learning game for grades 4–8. Players join the Beacon Bay Signal Scouts and solve safe, fictional digital mysteries using observation, communication, logic, beginner terminal commands, and cyber-safety habits.

The product promise is simple:

> I can recognize risky moments online, explain what makes them risky, and choose a safer next step.

## What we borrowed from CyberStart’s learning model

- Missions and a continuing story make the learner an active investigator.
- Short challenges unlock levels, points, badges, and new skills.
- Multiple challenge surfaces—messages, websites, puzzles, files, and a terminal—keep the experience varied.
- A Field Guide provides concept help, hints, and walkthroughs.
- Progress is visible to the learner and, in a future classroom version, to educators.

Cipher Scouts deliberately uses an original world, characters, visual language, writing, mission structure, and challenge content.

## Audience and age bands

### Trail Scouts — grades 4–5

- Reading-first challenges with large touch targets
- One new cybersecurity idea per mission
- Optional read-aloud support
- Strong visual cues and plain-language feedback
- No need to type commands; command chips remain available

### Signal Scouts — grades 6–8

- More ambiguous evidence
- Short typed terminal commands
- Multi-step website, message, and file investigations
- Reflection questions requiring the learner to explain their reasoning

## Core learning loop

1. Story beat: something in Beacon Bay needs help.
2. Observe: inspect a realistic but fictional artifact.
3. Try: make a choice or use a safe simulated tool.
4. Feedback: see why the choice worked or did not.
5. Debrief: name the principle and apply it to a fresh situation.

Target mission length: 8–12 minutes.

## Season one

1. The Phantom Prize — phishing and pressure tactics
2. Passphrase Forge — long, unique passwords and password managers
3. Two Keys at Twilight — multifactor authentication
4. The Update Express — software updates and trusted sources
5. The Oversharing Fog — privacy, location, and personal information
6. The Kindness Protocol — reporting, trusted adults, and safe communication

## Playable MVP

- One world map with six missions
- Reusable challenge engine for message, website, file, puzzle, and terminal scenes
- Field Guide with concept cards, layered hints, and final explanations
- XP, badges, mission progress, and optional replay
- Educator view with completion, attempts, hints used, and concept mastery
- Local/device-only progress for the earliest pilot; no child account required

## Demo challenge

The included mission, “The Phantom Prize,” asks the learner to:

- identify at least three phishing warning signs;
- safely scan the fictional message in the Signal Shell training terminal;
- report the message without opening its link;
- connect the fictional activity to a real-world action: pause and ask a trusted adult or teacher.

## Design system

- Direction: storybook mission control, not stereotypical “hacker green”
- Palette: navy ink, paper cream, signal teal, warning coral, reward yellow
- Typography: rounded display face, highly readable sans body, mono only for tools and labels
- Layout: map-centered first viewport, visible mission rail, persistent help
- Motion: brief state feedback only; reduced-motion preferences supported
- Accessibility: keyboard-operable interactions, visible focus, 44px targets, no color-only status, plain-language errors, responsive mobile layout

## Safety and privacy requirements

- All technical activity happens in clearly labeled fictional sandboxes.
- No real domains, credentials, personal data, or open-ended external command execution.
- Teach defensive intent, permission, reporting, and asking a trusted adult.
- For an elementary audience, avoid collecting child personal information in the pilot.
- Before production accounts, complete a formal COPPA review, parental notice/consent design, retention plan, educator controls, and security assessment.

## Validation plan

- Five learner sessions in each age band
- One classroom pilot with an educator observer
- Measure completion, hint use, wrong-answer recovery, and transfer to a new scenario
- Success target: 80% of learners identify three phishing signs in a novel message after completing the mission

## Suggested next build

1. Add mission two using the same challenge engine.
2. Add learner-level selection and read-aloud support.
3. Prototype the educator dashboard.
4. Pilot without child accounts and log only anonymous session analytics.
5. Refine difficulty and reading level from observation before building the full season.
