# Cyber Quest challenge authoring plan

This is the private implementation write-up for Level 2 Challenge 2 and Level 3. It contains intended solutions and must not be rendered inside the unsolved challenge UI.

## Self-use authoring prompt

> Design this Cyber Quest challenge as a safe, fictional, CyberStart-inspired lab for middle- and high-school learners. Preserve the chosen CyberStart mechanic, but remake the story, artifacts, names, values, and interface for Cyber Quest. Start with a player-visible goal that names the desired outcome without describing the solution. Build a closed evidence chain: every nonstandard value the player needs must be stated in the goal, visible in an artifact, returned by a valid tool action, or derivable from a supplied reference. Never require an arbitrary guess. Let the workspace behave like the real tool instead of asking a multiple-choice trivia question. Do not place hints, procedural stepping stones, suspicious highlighting, or answer-leading callouts in the workspace. Keep optional help only in the Hint tab. Lock the explanatory Field Manual lesson until the challenge is solved. Make the answer appear only after the player performs the intended investigation. Before implementation, write the exact no-hint solve path and reject the design if any transition cannot be justified from visible evidence. After implementation, replay the solve path, test wrong and empty actions, verify the answer gate, and reflect on whether the challenge rewards observation and reasoning rather than guessing.

## Solvability gate

A challenge is ready only if every answer below is **yes**.

1. Is the desired outcome clear before the player acts?
2. Can the player identify a reasonable first action from the tool and evidence?
3. Does each action produce evidence that supports the next action?
4. Is every unusual value discoverable without guessing?
5. Does the workspace avoid giving away the important interpretation?
6. Is optional help confined to the Hint tab?
7. Does the correct tool action reveal the answer or the evidence needed to derive it?
8. Are wrong, empty, and malformed actions handled without exposing the solution?
9. Is the mechanic meaningfully different from adjacent challenges?
10. Does the locked post-solve lesson explain the real security concept accurately?

## Plan check

The sequence makes sense because it alternates tools and mental models instead of repeating eight answer forms:

| Challenge | Primary action | What is learned | CyberStart inspiration |
| --- | --- | --- | --- |
| L2 C2 Role in the URL | Edit a client-controlled URL value | Broken access control | Secret Pages |
| L3 C1 Directory Detour | Navigate and read a filesystem | Evidence-led shell navigation | Foreign Filesystem / Dante In Command |
| L3 C2 Masquerade | Inspect leading bytes | File identity is content-based | Magic File / Unfamiliar Files |
| L3 C3 Permission Repair | Configure permission bits | Least privilege and numeric modes | Linux Permissions field manual |
| L3 C4 Decode Desk | Select and run a decoder | Encoding is reversible representation | ASCII Encoding / 610enC0de'd Password |
| L3 C5 Request Recovery | Construct an HTTP request | Method, path, and headers form a request | Don't Forget HTTP |
| L3 C6 Session Shelf | Inspect and edit a training cookie | Client cookies are not authorization | Cookie Jar |
| L3 C7 Memory Trace | Query a memory snapshot | Processes and memory strings provide volatile evidence | Volatile Memory |
| L3 C8 Vault Loop | Write and run a bounded recovery script | Iteration, formatting, success handling | Alien Zip |

The difficulty rises from tool discovery to evidence interpretation and finally short code construction. Each lab is self-contained because all challenges remain unlocked for testing.

## Intended solve paths and reflection

### L2 C2 — Role in the URL

- Player-visible goal: reach the **editor view** and recover its draft ID.
- Starting evidence: the editable address ends in `?user=guest`; the page confirms guest access.
- No-hint solve path: notice the named target role → replace `guest` with `editor` → press Go → read `FAIR-204` → submit it.
- Wrong-path behavior: other role values remain on the guest page; malformed URLs show a neutral error.
- Reflection: the old objective said only to “test” the parameter. The hidden value `editor` was disclosed only in longer briefing copy and was easy to miss, so the challenge felt like role-name guessing. Naming the desired view fixes the contract without revealing the URL edit or answer.

### L3 C1 — Directory Detour

- Goal: recover the backup label from the newest **completed** manifest.
- Starting evidence: a mounted read-only shell and a visible `README.txt` filename.
- Solve path: `ls` → `cat README.txt` → `cd backups` → `ls` → `cat index.txt` → identify the newest complete entry → `cat manifest-2026-05-14.txt` → read `kiosk-clean-7`.
- Wrong-path behavior: unknown commands and files return normal shell errors; no command changes evidence.
- Reflection: the README and index make every navigation decision evidence-based. The task is still investigative because neither path nor answer is printed in the objective.

### L3 C2 — Masquerade

- Goal: identify the filename hiding a Windows executable.
- Starting evidence: four recovered files and a signature reference containing PDF, JPEG, PNG, ZIP, and `MZ`/Windows executable headers.
- Solve path: inspect file headers → compare bytes to the reference → observe `poster.jpg` starts with `4D 5A` → submit `poster.jpg`.
- Wrong-path behavior: every file opens; the UI does not label any as suspicious.
- Reflection: typing the filename avoids a lucky multiple-choice click. The signature sheet supplies domain knowledge without interpreting the evidence for the player.

### L3 C3 — Permission Repair

- Goal: configure `startup.conf` so the owner can read/write, the `library-it` group can read, and others have no access.
- Starting evidence: explicit policy plus interactive owner/group/other permission controls.
- Solve path: enable owner read + write, group read, nothing for others → mode display becomes `640` / `rw-r-----` → check answer.
- Wrong-path behavior: all combinations are allowed, but only the policy-compliant state passes.
- Reflection: the target policy is specification, not a hint. The learner performs the permission translation rather than recognizing a prewritten answer.

### L3 C4 — Decode Desk

- Goal: recover the preferred backup label from an encoded maintenance value.
- Starting evidence: `cmVzdG9yZS1jaGFubmVsLTc=`, an encoding selector, input area, and output area.
- Solve path: recognize the Base64 alphabet/padding → select Base64 → paste the value → Decode → read `restore-channel-7`.
- Wrong-path behavior: other decoders return a format mismatch; empty input returns a neutral prompt.
- Reflection: the decoder behaves like a tool. It does not preselect Base64 or automatically insert the evidence.

### L3 C5 — Request Recovery

- Goal: retrieve the recovery ticket from the documented internal status endpoint.
- Starting evidence: API card states `GET`, `/api/restore/status`, and required `X-Kiosk-ID: LIB-04`.
- Solve path: place the documented method, path, header name, and value into the request builder → Send → read `RESTORE-318` from the 200 response.
- Wrong-path behavior: wrong path returns 404, wrong method 405, and missing/wrong header 403.
- Reflection: constructing the request is the challenge; required values are documentation, not secrets. Error responses teach request semantics without disclosing the ticket.

### L3 C6 — Session Shelf

- Goal: open the backup inventory as the `archivist` role and recover its key.
- Starting evidence: page says current role `reader`; session inspector exposes `library_role=reader`; access matrix names `archivist` as the role allowed to read backup inventory.
- Solve path: edit cookie value to `archivist` → Apply and reload → read `SHELF-882`.
- Wrong-path behavior: unknown roles remain unauthorized.
- Reflection: unlike the old L2 flaw, the target role is explicitly discoverable in the access matrix. The insight is that a client-editable cookie must not grant authorization.

### L3 C7 — Memory Trace

- Goal: recover the unlock token held by the suspicious process.
- Starting evidence: approved-process baseline and a memory console whose neutral command reference lists `pslist`, `pstree`, and `strings <pid>`.
- Solve path: run `pslist` → compare with baseline and spot `shelfcrypt.exe` PID 4180 → optionally confirm its abnormal parent with `pstree` → run `strings 4180` → read `UNLOCK-604`.
- Wrong-path behavior: strings for other PIDs contain ordinary process data; malformed commands return usage text.
- Reflection: the odd process name alone is a lead, while the baseline and parent relationship justify the choice. The token appears only after a targeted memory action.

### L3 C8 — Vault Loop

- Goal: write a script that tries every three-digit code, stops on success, and reads `recovery.txt`.
- Starting evidence: safe training API documentation defines `vault.try_password(value)` and `vault.read(filename)`; the archive uses `000`–`999`.
- Solve path: loop through `range(1000)` → convert each number to a zero-padded three-character string → call `try_password` → on success print `vault.read("recovery.txt")` and break → Run → read `OPEN-SHELF-9`.
- Wrong-path behavior: the runner reports which required behavior is missing without supplying finished code; an unbounded or non-stopping attempt fails safely.
- Reflection: this is the most scaffolded environment but the least scaffolded solution. API documentation specifies the contract while the learner supplies the algorithm.

## Final reflection checklist

After implementation, replay all nine paths above without opening Hint. For each challenge, record whether the goal, first action, intermediate evidence, answer reveal, retry behavior, and post-solve lesson match this document. Revise any challenge where a tester must ask “what word am I supposed to guess?” or where the workspace itself explains the solution.

## Implementation reflection

The first implementation pass exposed three design flaws that the rubric caught:

1. Directory Detour and Decode Desk initially revealed the same final label. Because every challenge is unlocked, a learner could reuse the earlier answer and skip the decoder. Decode Desk now has its own encoded value and unique answer, `restore-channel-7`.
2. Decode Desk originally accepted only the encoded substring. A reasonable learner might paste the full recovered `preferred_restore=value` line, so the decoder now accepts either form without weakening the encoding decision.
3. Vault Loop originally recognized only `.zfill(3)`. Valid Python can also use an f-string or `format` for zero-padding, so the analyzer now accepts multiple correct implementations while still requiring a bounded range, password test, recovery-file read, and stop condition.

Automated replay now proves the Level 2 editor target, the full filesystem evidence chain, the unique magic-byte mismatch, permission mode translation, decoder success and failure, all HTTP error branches, cookie-role gating, memory-process narrowing, and complete/incomplete vault algorithms. Static checks separately verify that hints remain in their tab, Field Manual content remains locked until completion, all eight mechanics are distinct, and all eight answers are unique.
