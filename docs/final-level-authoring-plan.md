# Level 4 authoring plan — Festival Firewall

## Self-use authoring prompt

Build the final Cyber Quest level as eight distinct, authorized training simulations inspired by the interaction patterns in the CyberStart 2024 archive. Make it the hardest level by requiring tool fluency, multi-step evidence correlation, and precise reporting—not by hiding required information or requiring arbitrary guesses.

For every challenge:

- Establish a closed evidence chain: every nonstandard command, hostname, field, value, and answer must be discoverable inside the challenge.
- Keep the main workspace free of hints, answer-shaped callouts, suspicious highlighting, and narrated stepping stones.
- Put optional procedural help only in the Hint tab.
- Keep all challenges open for free exploration.
- Reveal the cyber mini-lesson and CC BY-SA attribution only after the challenge is solved.
- Test the intended solve path and at least one wrong or malformed path with executable logic tests.

## Difficulty and variety matrix

| ID | Lab | Primary mechanic | Player output | CyberStart inspiration |
| --- | --- | --- | --- | --- |
| C1 | Service Sweep | Host inventory, targeted scan, service connection | Service codename | Port of Call; Alien Server |
| C2 | Alias Chain | DNS record traversal | Final A record | First Contact; network field manual |
| C3 | Certificate Split | Endpoint certificate comparison | Rogue fingerprint | Headers and Strings; web request investigations |
| C4 | Proxy Trust | Raw HTTP request editing | Audit marker | Secret Pages; Don't Forget HTTP |
| C5 | Stream in the Packets | Display filtering and TCP stream reconstruction | Exfiltrated archive name | Running Report; Report Part Two |
| C6 | Socket Sequence | Bounded Python protocol client | Acceptance code | Sockets and Servers; Galactic Greetings |
| C7 | Rule Order | Top-down firewall policy editing | Passing rule set | Defence Data; network field manual |
| C8 | Final Broadcast | Cross-artifact incident report | Six verified findings | Running Report; Report Part Two |

## Solvability gate

Before implementation, each challenge must answer yes to all of these:

1. Does the player know the exact outcome they are trying to recover or configure?
2. Is every challenge-specific value present in an artifact or returned by a valid tool action?
3. Are tool commands or API contracts visible when the simulator cannot behave like a complete real tool?
4. Does a wrong action produce useful system feedback without revealing the solution?
5. Can a player solve it without opening the Hint tab?
6. Is the expected answer unique and normalized safely?
7. Is the action confined to the fictional, authorized training environment?

## Intended no-hint solve paths and pre-build critique

### L4 C1 — Service Sweep

- Goal: recover the codename returned by the undocumented relay service.
- Starting evidence: an asset register names three in-scope hosts; a console lists its supported commands.
- Solve path: run `hosts`; scan the relay at `10.44.8.20`; observe open port `8443` alongside the documented ports; connect to `10.44.8.20 8443`; read `service_codename=AURORA-EDGE`.
- Wrong behavior: unknown hosts, closed ports, malformed commands, and documented services return specific neutral errors/banners.
- Answer: `AURORA-EDGE`.
- Critique: a full-subnet guessing exercise would be tedious rather than hard, so the asset register bounds the target set while the scan still discovers the port.

### L4 C2 — Alias Chain

- Goal: find the final IPv4 address serving the livestream hostname.
- Starting evidence: the target hostname and supported `dig` syntax.
- Solve path: query `stream.festival.school`, follow its CNAME to `live.media.school`, follow the next CNAME to `edge2.media.school`, then read its A record `192.0.2.80`. `dig +trace` exposes the same chain.
- Wrong behavior: nonexistent names return NXDOMAIN; malformed input returns usage.
- Answer: `192.0.2.80`.
- Critique: DNS knowledge should determine which records to follow; no endpoint is visually labeled suspicious.

### L4 C3 — Certificate Split

- Goal: submit the fingerprint of the endpoint whose certificate does not cover the expected livestream hostname.
- Starting evidence: expected hostname `stream.festival.school`, three endpoint buttons, and certificate fields including SAN and SHA-256 fingerprint.
- Solve path: probe each endpoint; compare every SAN list with the expected hostname; identify `edge2.media.school` as the mismatch; submit `9F:3A:71:C2:08:6D`.
- Wrong behavior: choosing another fingerprint fails without naming the rogue endpoint.
- Answer: `9F:3A:71:C2:08:6D`.
- Critique: the endpoint list is small enough for deliberate comparison and every certificate looks equally neutral.

### L4 C4 — Proxy Trust

- Goal: recover the audit marker from a protected manifest route by demonstrating unsafe proxy-header trust.
- Starting evidence: a network note states the authorized reverse proxy address, and the raw request editor begins with an ordinary external-client request.
- Solve path: retain the documented route and host, change `X-Forwarded-For` to the trusted proxy address `10.44.8.10`, send the request, and read `audit_marker=PROXY-TRUST-BROKEN` from the response.
- Wrong behavior: wrong path, method, host, missing header, and untrusted address yield distinct HTTP responses.
- Answer: `PROXY-TRUST-BROKEN`.
- Critique: the network note supplies the only challenge-specific value; understanding why spoofing the header works remains the security insight.

### L4 C5 — Stream in the Packets

- Goal: identify the archive transferred out of the festival network.
- Starting evidence: an eight-row packet capture, a display-filter input, and a Follow TCP stream action.
- Solve path: filter for HTTP POST traffic (or inspect the rows), select the POST to the external upload host, follow TCP stream 4, and recover `festival-keys.tar.gz` from the multipart filename.
- Wrong behavior: invalid filters report a syntax error; non-TCP selections cannot be followed; benign streams contain no archive.
- Answer: `festival-keys.tar.gz`.
- Critique: the packet table must include plausible noise and timestamps but stay small enough to inspect without real Wireshark.

### L4 C6 — Socket Sequence

- Goal: write a client that completes the relay challenge-response protocol and prints its acceptance code.
- Starting evidence: the exact sandbox API and protocol contract, including host, port, greeting, digest construction, and required receive steps.
- Solve path: import the API and SHA-256 helper; connect; send `HELLO`; receive the nonce; hash `<nonce>:FESTIVAL`; send the lowercase digest; receive and print the reply; read `NEBULA-9050`.
- Wrong behavior: static answers, omitted receives, wrong host/port, wrong digest, or no printed reply produce contract errors.
- Answer: `NEBULA-9050`.
- Critique: protocol instructions are required interface documentation, not hints. The challenge is turning the contract into correct stateful code.

### L4 C7 — Rule Order

- Goal: make all four firewall tests pass while keeping approved traffic available.
- Starting evidence: an ordered rule list and four named test flows with expected decisions.
- Solve path: move the precise deny for `203.0.113.88/32` above the broader `203.0.113.0/24` partner allow, then run the suite.
- Wrong behavior: the initial policy fails only the hostile-partner test; over-broad changes cause availability tests to fail.
- Answer: a passing ordered policy, checked structurally rather than as text.
- Critique: the player sees desired outcomes but not the required edit. Reordering, not rule creation, keeps the simulator focused on first-match semantics.

### L4 C8 — Final Broadcast

- Goal: complete a six-field incident report from four evidence sources.
- Starting evidence: gateway log, service inventory, certificate ledger, and reconstructed HTTP stream. Each artifact is available in a tab and contains all required values.
- Solve path: correlate source `203.0.113.88`, targeted port `8443`, service codename `AURORA-EDGE`, rogue endpoint `edge2.media.school`, archive `festival-keys.tar.gz`, and containment CIDR `203.0.113.88/32`; enter all six fields; submit the report.
- Wrong behavior: the report reports which fields remain unverified but never supplies expected values.
- Answer: a fully verified structured report.
- Critique: it is intentionally the densest challenge, but it is self-contained so players who open it first are not blocked by prior completion state.

## Build reflection

The first complete replay produced four revisions:

1. **Firewall feedback was premature.** The initial build rendered evaluated PASS/FAIL results before the player ran the suite. The workspace now starts in a neutral “not run” state, clears stale results after every reorder, and reveals decisions only after an explicit test run or submission.
2. **The socket contract looked like a walkthrough.** A numbered implementation recipe made the challenge feel guided. It was replaced with a compact protocol transcript and API surface. The exact protocol remains implementable, but the player must translate it into code.
3. **Report readiness was misleading.** Before validation, an untouched report displayed “6 / 6 fields ready” because no fields had yet been marked invalid. Readiness now counts completed fields; validation separately marks only the fields that do not match evidence.
4. **Tool errors needed to stay diagnostic without leaking answers.** Logic tests now prove that wrong hosts, closed ports, NXDOMAIN results, malformed filters, ordinary proxy requests, incomplete socket clients, unsafe firewall order, and over-broad containment all fail without returning the challenge answer.

The final no-hint audit confirmed that all eight answers are unique; each nonstandard value is present in an artifact or returned only after a valid tool action; challenge workspaces contain no multiple-choice options or answer-shaped “pattern check” cards; and the Hint and post-solve Field Manual remain separate from the working surface.
