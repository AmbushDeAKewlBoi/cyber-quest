"use client";

import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";

type Panel = "briefing" | "manual" | "hint";
type ChallengeKind =
  | "filesystem"
  | "magic"
  | "permissions"
  | "decoder"
  | "http"
  | "cookie"
  | "memory"
  | "code";

type Lesson = {
  title: string;
  summary: string;
  concepts: string[];
  takeaway: string;
};

export type LevelThreeChallenge = {
  id: number;
  title: string;
  subtitle: string;
  points: number;
  skill: string;
  tool: string;
  rank: string;
  kind: ChallengeKind;
  objective: string;
  briefing: string;
  hint: string;
  answer: string;
  placeholder?: string;
  reference: string;
  lesson: Lesson;
};

export const levelThreeChallenges: LevelThreeChallenge[] = [
  {
    id: 1,
    title: "Directory Detour",
    subtitle: "Navigate a preserved filesystem",
    points: 220,
    skill: "Filesystem navigation",
    tool: "Training terminal",
    rank: "Explorer",
    kind: "filesystem",
    objective: "Recover the backup label from the newest completed kiosk manifest.",
    briefing:
      "A read-only copy of the library archive is mounted in the training shell. Work from the files, not the ransom-style note left on the kiosk.",
    hint: "Inventory the current folder and read its README before choosing a path.",
    answer: "kiosk-clean-7",
    placeholder: "Enter the backup label",
    reference: "Foreign Filesystem and Dante In Command",
    lesson: {
      title: "Filesystem investigation follows evidence",
      summary:
        "Analysts orient themselves, inventory a directory, read documentation, and follow records rather than jumping between guessed paths. Read-only navigation preserves the original evidence.",
      concepts: [
        "pwd confirms where you are; ls shows what is available.",
        "README and index files often explain unfamiliar collections.",
        "A manifest records the identity and properties of a backup set.",
      ],
      takeaway: "Orient, inventory, read, then follow the evidence one step at a time.",
    },
  },
  {
    id: 2,
    title: "Masquerade",
    subtitle: "Look past a filename",
    points: 230,
    skill: "File signatures",
    tool: "Hex inspector",
    rank: "Explorer",
    kind: "magic",
    objective: "Identify the recovered filename that actually contains a Windows executable.",
    briefing:
      "One recovered library file may have been renamed to look harmless. Inspect the leading bytes and compare them with the supplied signature reference.",
    hint: "A Windows executable begins with the two bytes commonly displayed as MZ or 4D 5A.",
    answer: "poster.jpg",
    placeholder: "Enter the disguised filename",
    reference: "Magic File and Unfamiliar Files",
    lesson: {
      title: "File content outranks the extension",
      summary:
        "Many formats begin with recognizable magic bytes. An extension helps applications choose how to open a file, but renaming a file does not change its underlying structure.",
      concepts: [
        "Magic bytes are format identifiers near the beginning of a file.",
        "MZ (4D 5A) commonly marks a Windows PE executable.",
        "A content/extension mismatch is a reason to isolate and investigate.",
      ],
      takeaway: "Verify a suspicious file by content instead of trusting its name.",
    },
  },
  {
    id: 3,
    title: "Permission Repair",
    subtitle: "Translate policy into access bits",
    points: 250,
    skill: "Linux permissions",
    tool: "Permission editor",
    rank: "Examiner",
    kind: "permissions",
    objective: "Configure startup.conf to match the library’s access policy.",
    briefing:
      "The kiosk configuration became writable by every local account. Restore least privilege using the owner, group, and other permission controls.",
    hint: "Read is 4, write is 2, and execute is 1. Add the enabled values for each column.",
    answer: "640",
    reference: "Linux Permissions field manual",
    lesson: {
      title: "Permissions encode least privilege",
      summary:
        "Linux groups basic file access into owner, group, and others. Each group can receive read, write, and execute rights, represented symbolically or as octal values.",
      concepts: [
        "Read is 4, write is 2, and execute is 1.",
        "Mode 640 means owner read/write, group read, and others no access.",
        "World-writable configuration lets unrelated accounts change service behavior.",
      ],
      takeaway: "Give each identity only the access its role actually requires.",
    },
  },
  {
    id: 4,
    title: "Decode Desk",
    subtitle: "Identify representation before decoding",
    points: 260,
    skill: "Data encoding",
    tool: "Decoder workbench",
    rank: "Examiner",
    kind: "decoder",
    objective: "Decode the maintenance value and recover the preferred backup label.",
    briefing:
      "A maintenance export stores its preferred restore label as encoded text. Use the workbench to identify and reverse the representation.",
    hint: "The alphabet and trailing equals signs are characteristic of Base64.",
    answer: "restore-channel-7",
    placeholder: "Enter the decoded channel",
    reference: "ASCII Encoding and 610enC0de'd Password",
    lesson: {
      title: "Encoding changes representation, not secrecy",
      summary:
        "Base64 represents binary data using printable text so it travels safely through text systems. It is reversible by design and must never be treated as encryption.",
      concepts: [
        "Base64 commonly uses letters, digits, +, /, and = padding.",
        "Hex and decimal ASCII are other ways to represent byte values.",
        "Encoded credentials are still exposed credentials.",
      ],
      takeaway: "Identify the representation first, then use the matching decoder.",
    },
  },
  {
    id: 5,
    title: "Request Recovery",
    subtitle: "Build an HTTP request",
    points: 280,
    skill: "HTTP fundamentals",
    tool: "Request builder",
    rank: "Operator",
    kind: "http",
    objective: "Retrieve the recovery ticket from the documented internal restore-status endpoint.",
    briefing:
      "The isolated backup service exposes a read-only training endpoint. Construct the request from its API card and examine the response.",
    hint: "Match the method, path, header name, and kiosk value exactly to the API card.",
    answer: "restore-318",
    placeholder: "Enter the recovery ticket",
    reference: "Don't Forget HTTP",
    lesson: {
      title: "HTTP requests have structured parts",
      summary:
        "A web request combines a method, resource path, headers, and sometimes a body. Servers use those parts to route the request and decide how to respond.",
      concepts: [
        "GET requests retrieve a representation without asking to modify it.",
        "The path selects a resource; headers carry additional request context.",
        "Status codes distinguish missing resources, wrong methods, and denied requests.",
      ],
      takeaway: "Build requests from documented contracts and interpret the response precisely.",
    },
  },
  {
    id: 6,
    title: "Session Shelf",
    subtitle: "Audit a client-controlled role",
    points: 300,
    skill: "Cookies and sessions",
    tool: "Session inspector",
    rank: "Operator",
    kind: "cookie",
    objective: "Open the backup inventory as the archivist role and recover its inventory key.",
    briefing:
      "The safe library portal stores a role value in an editable training cookie. Test whether the portal incorrectly trusts it for authorization.",
    hint: "The access matrix names the required role. Apply that exact value to the cookie, then reload the training page.",
    answer: "shelf-882",
    placeholder: "Enter the inventory key",
    reference: "Cookie Jar",
    lesson: {
      title: "Cookies are client input",
      summary:
        "Browsers send cookies with requests, and users can often view or alter their own cookie values. A server must verify the session and authorization instead of trusting a role string supplied by the browser.",
      concepts: [
        "Cookies maintain state across HTTP requests.",
        "Editable client data is not proof of identity or permission.",
        "Secure sessions use unpredictable identifiers backed by server-side authorization.",
      ],
      takeaway: "Treat every cookie value as untrusted until the server validates it.",
    },
  },
  {
    id: 7,
    title: "Memory Trace",
    subtitle: "Follow a suspicious process",
    points: 320,
    skill: "Memory forensics",
    tool: "Memory console",
    rank: "Responder",
    kind: "memory",
    objective: "Recover the unlock token held in memory by the suspicious kiosk process.",
    briefing:
      "Responders captured volatile memory before powering down kiosk 04. Compare running processes with the approved baseline, then inspect the relevant process.",
    hint: "List processes first. The suspicious executable is not in the approved baseline; inspect strings from its PID.",
    answer: "unlock-604",
    placeholder: "Enter the unlock token",
    reference: "Volatile Memory",
    lesson: {
      title: "Memory captures evidence that disappears",
      summary:
        "A memory image can preserve running processes, parent relationships, network state, and plaintext fragments that vanish when power is removed.",
      concepts: [
        "A process list is compared with a known-good baseline, not judged by name alone.",
        "Parent/child relationships help explain how a process started.",
        "Targeted strings searches can reveal configuration and runtime tokens.",
      ],
      takeaway: "Preserve volatile evidence early, then narrow analysis from process context.",
    },
  },
  {
    id: 8,
    title: "Vault Loop",
    subtitle: "Automate a bounded recovery",
    points: 350,
    skill: "Python scripting",
    tool: "Training code runner",
    rank: "Responder",
    kind: "code",
    objective: "Write a bounded script that opens the three-digit recovery vault and prints recovery.txt.",
    briefing:
      "The preserved recovery archive uses a numerical code from 000 through 999. The safe training API lets your script test candidates and read the recovery note after a match.",
    hint: "Loop through range(1000), zero-pad each number to three characters, and break after the API reports success.",
    answer: "open-shelf-9",
    placeholder: "Enter the recovered phrase",
    reference: "Alien Zip",
    lesson: {
      title: "Automation makes bounded searches repeatable",
      summary:
        "A small script can systematically test a finite candidate space. Correct automation formats each candidate, detects success, stops at the right time, and records the result.",
      concepts: [
        "range(1000) covers integers 0 through 999.",
        "Zero-padding preserves values such as 007 as three characters.",
        "Breaking after success prevents unnecessary or destructive extra attempts.",
      ],
      takeaway: "Define a bounded search, handle success explicitly, and stop when the goal is reached.",
    },
  },
];

const graphicLabels = [">_", "4D 5A", "RW-", "B64", "HTTP", "COOKIE", "MEM", "PY"];

function MiniIcon({ children }: { children: string }) {
  return <span aria-hidden="true">{children}</span>;
}

export function LevelThreeGrid({
  completed,
  onBack,
  onOpen,
}: {
  completed: number[];
  onBack: () => void;
  onOpen: (id: number) => void;
}) {
  const earned = completed.reduce(
    (sum, id) => sum + (levelThreeChallenges.find((challenge) => challenge.id === id)?.points ?? 0),
    0,
  );
  const available = levelThreeChallenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const percent = Math.round((completed.length / levelThreeChallenges.length) * 100);

  return (
    <section className="challenge-grid-view level-three-grid" id="main-content">
      <div className="level-banner level-three-banner">
        <button className="back-link" onClick={onBack}>← All levels</button>
        <div className="level-banner-copy">
          <div>
            <p className="kicker">LEVEL 3 · INTERMEDIATE</p>
            <h1>Library Lockout</h1>
            <p>
              A failed kiosk update left the library locked. Work through preserved files,
              requests, sessions, memory, and recovery code without erasing the evidence.
            </p>
            <div className="rank-track" aria-label="Challenge skill progression">
              <span>Explorer</span><i>→</i><span>Examiner</span><i>→</i>
              <span>Operator</span><i>→</i><span>Responder</span>
            </div>
          </div>
          <div className="level-score">
            <span>{completed.length} / {levelThreeChallenges.length} complete</span>
            <strong>{earned} / {available} points</strong>
            <div><i style={{ width: `${percent}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="challenge-section-heading">
        <div><h2>Challenges</h2><p>All 8 challenges are open. Play them in any order.</p></div>
        <span className="story-status">{completed.length === 8 ? "Recovery verified" : "Free explore · all challenges open"}</span>
      </div>

      <div className="challenge-card-grid level-three-card-grid">
        {levelThreeChallenges.map((challenge, index) => {
          const done = completed.includes(challenge.id);
          return (
            <button className={`challenge-card level-three-card ${done ? "complete" : ""}`} key={challenge.id} onClick={() => onOpen(challenge.id)}>
              <div className="challenge-card-top"><span className="challenge-index">{done ? <MiniIcon>✓</MiniIcon> : String(index + 1).padStart(2, "0")}</span><span className="challenge-points">+{challenge.points} pts</span></div>
              <div className={`challenge-graphic level-three-graphic graphic-l3-${challenge.id}`}><div className="mini-window"><span /><span /><span /><strong>{graphicLabels[index]}</strong></div></div>
              <div className="challenge-card-copy">
                <div className="challenge-labels"><span>{challenge.skill}</span><em className="rank-level-three">{challenge.rank}</em></div>
                <h3>{challenge.title}</h3><p>{challenge.subtitle}</p><strong>{done ? "Replay challenge" : "Start challenge"}</strong>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export const levelThreeFileHeaders = [
  { name: "catalog.pdf", claimed: "PDF document", size: "82 KB", bytes: "25 50 44 46 2D 31 2E 37 0A 25 E2 E3 CF D3", ascii: "%PDF-1.7" },
  { name: "poster.jpg", claimed: "JPEG image", size: "146 KB", bytes: "4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF", ascii: "MZ............" },
  { name: "schedule.png", claimed: "PNG image", size: "54 KB", bytes: "89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48", ascii: ".PNG........IH" },
  { name: "notices.zip", claimed: "ZIP archive", size: "31 KB", bytes: "50 4B 03 04 14 00 00 00 08 00 5A 31 41 5C", ascii: "PK........Z1A\\" },
];

const processRows = [
  ["4", "System", "0", "2026-05-15 08:02:11", "Microsoft Windows"],
  ["612", "smss.exe", "4", "2026-05-15 08:02:11", "Microsoft Windows"],
  ["824", "csrss.exe", "612", "2026-05-15 08:02:14", "Microsoft Windows"],
  ["1016", "winlogon.exe", "612", "2026-05-15 08:02:15", "Microsoft Windows"],
  ["1772", "kiosk-shell.exe", "1016", "2026-05-15 08:03:02", "Eastview Library IT"],
  ["2916", "catalog-sync.exe", "1772", "2026-05-15 08:03:08", "Eastview Library IT"],
  ["3560", "winword.exe", "1772", "2026-05-15 09:07:42", "Microsoft Corporation"],
  ["4180", "shelfcrypt.exe", "3560", "2026-05-15 09:08:17", "Unknown"],
] as const;

const approvedProcesses = ["System", "smss.exe", "csrss.exe", "winlogon.exe", "kiosk-shell.exe", "catalog-sync.exe", "winword.exe"];

const filesystemListings: Record<string, string> = {
  "/library/archive": "README.txt   backups/   notices/   quarantine/",
  "/library/archive/backups": "index.txt   manifest-2026-05-07.txt   manifest-2026-05-14.txt   manifest-2026-05-15.txt",
  "/library/archive/notices": "ransom-note.txt",
  "/library/archive/quarantine": "poster.jpg",
};

const filesystemFiles: Record<string, string[]> = {
  "/library/archive/README.txt": ["LIBRARY ARCHIVE INDEX", "Completed backup manifests are stored in ./backups.", "Read backups/index.txt to compare completion state and creation time."],
  "/library/archive/backups/index.txt": ["2026-05-07 02:00 | complete | manifest-2026-05-07.txt", "2026-05-14 02:00 | complete | manifest-2026-05-14.txt", "2026-05-15 09:30 | failed   | manifest-2026-05-15.txt"],
  "/library/archive/backups/manifest-2026-05-07.txt": ["set=kiosk-clean-6", "status=complete", "created=2026-05-07T02:00Z"],
  "/library/archive/backups/manifest-2026-05-14.txt": ["set=kiosk-clean-7", "status=complete", "created=2026-05-14T02:00Z", "hash=6f2a-019d-c118"],
  "/library/archive/backups/manifest-2026-05-15.txt": ["set=kiosk-live-1", "status=failed", "created=2026-05-15T09:30Z"],
  "/library/archive/notices/ransom-note.txt": ["YOUR CATALOG IS LOCKED", "Send payment to restore service."],
  "/library/archive/quarantine/poster.jpg": ["Binary evidence. Use the hex inspector challenge to examine this file."],
};

export function simulateFilesystemCommand(path: string, input: string) {
  const raw = input.trim();
  const command = raw.toLowerCase();
  if (!raw) return { path, lines: [] as string[], clear: false };
  if (command === "pwd") return { path, lines: [path], clear: false };
  if (command === "ls" || command === "ls -la" || command === "ls -l") {
    return { path, lines: [filesystemListings[path] ?? ""], clear: false };
  }
  if (command === "clear") return { path, lines: [] as string[], clear: true };
  if (command.startsWith("cd ")) {
    const target = raw.slice(3).trim();
    let next = path;
    if (target === "..") next = path.split("/").slice(0, -1).join("/") || "/";
    else if (target.startsWith("/")) next = target.replace(/\/$/, "");
    else next = `${path}/${target}`.replace(/\/+/g, "/");
    return filesystemListings[next]
      ? { path: next, lines: [] as string[], clear: false }
      : { path, lines: [`cd: ${target}: No such directory`], clear: false };
  }
  if (command.startsWith("cat ")) {
    const filename = raw.slice(4).trim();
    const target = filename.startsWith("/") ? filename : `${path}/${filename}`.replace(/\/+/g, "/");
    return { path, lines: filesystemFiles[target] ?? [`cat: ${filename}: No such file`], clear: false };
  }
  return { path, lines: ["Command not found."], clear: false };
}

export function permissionModeFor(permissions: string[]) {
  const digit = (scope: string) =>
    (permissions.includes(`${scope}-r`) ? 4 : 0) +
    (permissions.includes(`${scope}-w`) ? 2 : 0) +
    (permissions.includes(`${scope}-x`) ? 1 : 0);
  return `${digit("owner")}${digit("group")}${digit("other")}`;
}

export function decodeTrainingValue(mode: string, input: string) {
  const value = input.trim().replace(/^preferred_restore=/i, "");
  if (!value) return "Enter an encoded value first.";
  try {
    if (mode === "base64") return atob(value);
    if (mode === "hex") {
      if (!/^(?:[0-9a-f]{2}\s*)+$/i.test(value)) throw new Error("format");
      return value.match(/[0-9a-f]{2}/gi)!.map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
    }
    if (!/^(?:\d{1,3}\s*)+$/.test(value)) throw new Error("format");
    return value.split(/\s+/).map((number) => String.fromCharCode(Number(number))).join("");
  } catch {
    return "Input does not match the selected decoder.";
  }
}

export function buildRestoreResponse(methodInput: string, pathInput: string, headerInput: string, valueInput: string) {
  const method = methodInput.trim().toUpperCase();
  const path = pathInput.trim();
  const header = headerInput.trim().toLowerCase();
  const value = valueInput.trim().toUpperCase();
  if (path !== "/api/restore/status") return { status: "404 NOT FOUND", body: "No resource exists at that path." };
  if (method !== "GET") return { status: "405 METHOD NOT ALLOWED", body: "That resource does not accept this method." };
  if (header !== "x-kiosk-id" || value !== "LIB-04") return { status: "403 FORBIDDEN", body: "A valid kiosk context is required." };
  return { status: "200 OK", body: '{ "state": "isolated", "recovery_ticket": "RESTORE-318" }' };
}

export function inventoryKeyForRole(role: string) {
  return role.trim().toLowerCase() === "archivist" ? "SHELF-882" : null;
}

export function simulateMemoryCommand(input: string) {
  const command = input.trim().toLowerCase();
  if (command === "pslist") return ["PID   PPID  NAME               STARTED", ...processRows.map((row) => `${row[0].padEnd(5)} ${row[2].padEnd(5)} ${row[1].padEnd(18)} ${row[3]}`)];
  if (command === "pstree") return ["System (4)", "└─ winlogon.exe (1016)", "   └─ kiosk-shell.exe (1772)", "      ├─ catalog-sync.exe (2916)", "      └─ winword.exe (3560)", "         └─ shelfcrypt.exe (4180)"];
  if (/^strings\s+\d+$/.test(command)) {
    const pid = command.split(/\s+/)[1];
    return pid === "4180"
      ? ["process=shelfcrypt.exe", "campaign=library-lockout", "unlock_token=UNLOCK-604", "note=preserve-before-shutdown"]
      : [`PID ${pid}: ordinary process strings; no unlock token found.`];
  }
  if (command.startsWith("strings")) return ["usage: strings PID"];
  return ["Unknown memory command."];
}

export function analyzeVaultSource(source: string) {
  const checks = [
    { valid: /range\(\s*(?:0\s*,\s*)?1000\s*\)/.test(source), message: "No bounded 000–999 iteration detected." },
    { valid: /zfill\(\s*3\s*\)|:03d?\}?|format\([^)]*["']0?3d?["']/.test(source), message: "Candidate values are not formatted as three digits." },
    { valid: /vault\.try_password\s*\(/.test(source), message: "The script never checks a candidate with the vault API." },
    { valid: /vault\.read\s*\(\s*["']recovery\.txt["']\s*\)/.test(source), message: "The script never reads recovery.txt." },
    { valid: /\bbreak\b/.test(source), message: "The loop does not stop after success." },
  ];
  return checks.filter((check) => !check.valid).map((check) => check.message);
}

export function LevelThreeWorkspace({
  activeId,
  completed,
  setCompleted,
  onBack,
  onNavigate,
}: {
  activeId: number;
  completed: number[];
  setCompleted: Dispatch<SetStateAction<number[]>>;
  onBack: () => void;
  onNavigate: (id: number) => void;
}) {
  const challenge = levelThreeChallenges.find((item) => item.id === activeId)!;
  const [panel, setPanel] = useState<Panel>("briefing");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  const [terminalPath, setTerminalPath] = useState("/library/archive");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "Library archive shell · read-only evidence mode",
    "Volume mounted at /library/archive",
  ]);
  const [selectedFile, setSelectedFile] = useState(levelThreeFileHeaders[0]);
  const [permissions, setPermissions] = useState<string[]>([
    "owner-r", "owner-w", "group-r", "group-w", "other-r", "other-w",
  ]);
  const [decoderMode, setDecoderMode] = useState("hex");
  const [decoderInput, setDecoderInput] = useState("");
  const [decoderOutput, setDecoderOutput] = useState("Decoder output will appear here.");
  const [httpMethod, setHttpMethod] = useState("POST");
  const [httpPath, setHttpPath] = useState("");
  const [httpHeader, setHttpHeader] = useState("");
  const [httpValue, setHttpValue] = useState("");
  const [httpResponse, setHttpResponse] = useState({ status: "NO REQUEST", body: "Build and send a request." });
  const [cookieValue, setCookieValue] = useState("reader");
  const [activeRole, setActiveRole] = useState("reader");
  const [memoryInput, setMemoryInput] = useState("");
  const [memoryLines, setMemoryLines] = useState(["kiosk04.mem loaded · snapshot preserved", "Memory console ready."]);
  const [code, setCode] = useState("import vault\n\n# Write your recovery loop below.\n");
  const [codeOutput, setCodeOutput] = useState(["Runner idle."]);

  const isComplete = completed.includes(activeId);
  const inventoryKey = inventoryKeyForRole(activeRole);

  const permissionMode = useMemo(() => permissionModeFor(permissions), [permissions]);

  const permissionSymbolic = useMemo(() => {
    const symbols = (scope: string) =>
      `${permissions.includes(`${scope}-r`) ? "r" : "-"}${permissions.includes(`${scope}-w`) ? "w" : "-"}${permissions.includes(`${scope}-x`) ? "x" : "-"}`;
    return `${symbols("owner")}${symbols("group")}${symbols("other")}`;
  }, [permissions]);

  function togglePermission(name: string) {
    setPermissions((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }

  function runFilesystem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;
    const result = simulateFilesystemCommand(terminalPath, raw);
    if (result.clear) {
      setTerminalLines(["Terminal cleared."]);
      setTerminalInput("");
      return;
    }
    setTerminalLines((current) => [...current, `analyst@archive:${terminalPath}$ ${raw}`, ...result.lines]);
    setTerminalPath(result.path);
    setTerminalInput("");
  }

  function runDecoder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDecoderOutput(decodeTrainingValue(decoderMode, decoderInput));
  }

  function sendHttpRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHttpResponse(buildRestoreResponse(httpMethod, httpPath, httpHeader, httpValue));
  }

  function applyCookie(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveRole(cookieValue.trim().toLowerCase());
  }

  function runMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = memoryInput.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setMemoryLines(["Console cleared. kiosk04.mem remains loaded."]);
      setMemoryInput("");
      return;
    }
    const response = simulateMemoryCommand(command);
    setMemoryLines((current) => [...current, `memory> ${memoryInput.trim()}`, ...response]);
    setMemoryInput("");
  }

  function runVaultCode() {
    const missing = analyzeVaultSource(code);
    if (missing.length) setCodeOutput(["Run stopped: program contract incomplete.", ...missing]);
    else setCodeOutput(["Trying 000…", "Trying 001…", "…", "Trying 731… success", "OPEN-SHELF-9", "Program stopped after successful extraction."]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const correct = challenge.kind === "permissions"
      ? permissionMode === challenge.answer
      : answer.trim().toLowerCase() === challenge.answer.toLowerCase();
    if (correct) {
      setCompleted((current) => current.includes(activeId) ? current : [...current, activeId]);
      setFeedback(activeId === 8 ? "Level complete! The library recovery is verified." : "Correct! Challenge complete.");
      setCelebrating(true);
    } else setFeedback("Not quite. Review the evidence and try again.");
  }

  const usesTextAnswer = challenge.kind !== "permissions";

  return (
    <section className="challenge-workspace level-three-workspace" id="main-content">
      {celebrating && (
        <div className="success-celebration">
          <section className="flag-notification level-three-flag" role="status" aria-live="assertive">
            <button className="flag-close" onClick={() => setCelebrating(false)} aria-label="Close success notification">×</button>
            <span className="flag-check" aria-hidden="true">✓</span>
            <div><small>LEVEL 3 · CHALLENGE {activeId} COMPLETE</small><strong>Evidence verified!</strong><code>CQ-L3-C{String(activeId).padStart(2, "0")}</code></div>
            <button className="flag-continue" onClick={() => { setCelebrating(false); if (activeId < 8) onNavigate(activeId + 1); else onBack(); }}>{activeId < 8 ? "Next challenge →" : "View completed level"}</button>
          </section>
        </div>
      )}

      <aside className="challenge-sidebar level-three-sidebar">
        <div className="sidebar-top"><button className="round-back" onClick={onBack}>←<span className="sr-only">Back to challenge grid</span></button><div><h1>{challenge.title}</h1><p>L3 C{String(activeId).padStart(2, "0")} · {challenge.tool} · {challenge.rank}</p></div></div>
        <div className="points-row"><span>Worth</span><strong><MiniIcon>★</MiniIcon> {challenge.points} points</strong></div>
        <div className="sidebar-tabs" role="tablist" aria-label="Challenge information">
          <button role="tab" aria-selected={panel === "briefing"} className={panel === "briefing" ? "active" : ""} onClick={() => setPanel("briefing")}><MiniIcon>i</MiniIcon>Briefing</button>
          <button role="tab" aria-selected={panel === "manual"} className={panel === "manual" ? "active" : ""} onClick={() => setPanel("manual")}><MiniIcon>▤</MiniIcon>Field manual</button>
          <button role="tab" aria-selected={panel === "hint"} className={panel === "hint" ? "active" : ""} onClick={() => setPanel("hint")}><MiniIcon>?</MiniIcon>Hint</button>
        </div>
        <div className="sidebar-info" role="tabpanel">
          <span>{panel === "briefing" ? "Mission briefing" : panel === "manual" ? "Post-challenge lesson" : "Hint"}</span>
          {panel === "briefing" && <p>{challenge.briefing}</p>}
          {panel === "hint" && <p>{challenge.hint}</p>}
          {panel === "manual" && (
            <section className={`mini-lesson ${isComplete ? "unlocked" : "locked"}`} aria-label="Post-challenge cyber mini-lesson">
              <div className="mini-lesson-heading"><span>{isComplete ? "LESSON UNLOCKED" : "LOCKED UNTIL SOLVED"}</span><strong>Cyber mini-lesson</strong></div>
              {isComplete ? <><h3>{challenge.lesson.title}</h3><p>{challenge.lesson.summary}</p><h4>What you learned</h4><ul>{challenge.lesson.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul><div className="lesson-takeaway"><strong>Remember</strong><p>{challenge.lesson.takeaway}</p></div><p className="challenge-inspiration">Mechanic inspired by “{challenge.reference}” from the CyberStart 2024 archive (CC BY-SA 4.0). Scenario and artifacts were remade for Cyber Quest.</p></> : <p className="lesson-locked-copy">Solve this challenge to unlock the lesson explaining the real cybersecurity idea behind it.</p>}
            </section>
          )}
          <div className="objective-box"><strong>Your task</strong><p>{challenge.objective}</p></div>
        </div>
        <form className="answer-form" onSubmit={submit}>
          {usesTextAnswer ? <label htmlFor="level-three-answer">Your answer</label> : <span className="answer-form-label">Current permission mode</span>}
          {usesTextAnswer ? <input id="level-three-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={challenge.placeholder} autoComplete="off" /> : <div className="selection-status" id="level-three-answer">{permissionMode} · {permissionSymbolic}</div>}
          <button className="submit-answer" type="submit">Check answer ↵</button>
          <p className={`answer-feedback ${feedback.startsWith("Correct") || feedback.startsWith("Level") ? "success" : ""}`} aria-live="polite">{feedback || "You can try as many times as you need."}</p>
        </form>
        <div className="challenge-nav"><button disabled={activeId === 1} onClick={() => onNavigate(activeId - 1)}>← Previous</button><button disabled={activeId === 8} onClick={() => onNavigate(activeId + 1)}>Next →</button></div>
      </aside>

      <div className="challenge-main level-three-main">
        <div className="challenge-stage-heading"><div><span>CHALLENGE {activeId} OF 8 · {challenge.rank}</span><h2>{challenge.objective}</h2></div><button onClick={onBack}>View all challenges</button></div>

        {activeId === 1 && (
          <div className="system-stage filesystem-stage"><div className="library-terminal"><div className="system-titlebar"><span><i /><i /><i /></span>LIBRARY ARCHIVE SHELL<strong>READ ONLY</strong></div><div className="library-terminal-body" aria-live="polite">{terminalLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div><form className="system-command" onSubmit={runFilesystem}><label htmlFor="filesystem-command">analyst@archive:{terminalPath}$</label><input id="filesystem-command" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} autoComplete="off" autoFocus /><button type="submit">Run</button></form><div className="system-status"><span>Commands: pwd · ls · cd · cat · clear</span><strong>Evidence changes disabled</strong></div></div></div>
        )}

        {activeId === 2 && (
          <div className="system-stage magic-stage"><div className="hex-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>RECOVERED FILE INSPECTOR<strong>4 FILES</strong></div><div className="hex-layout"><aside><span>RECOVERED FILES</span>{levelThreeFileHeaders.map((file) => <button key={file.name} className={selectedFile.name === file.name ? "active" : ""} onClick={() => setSelectedFile(file)}><strong>{file.name}</strong><small>{file.claimed} · {file.size}</small></button>)}</aside><section><div className="hex-file-heading"><div><small>SELECTED FILE</small><strong>{selectedFile.name}</strong></div><span>OFFSET 00000000</span></div><div className="hex-dump"><code>{selectedFile.bytes}</code><pre>{selectedFile.ascii}</pre></div><div className="signature-reference"><h3>File signature reference</h3><dl><div><dt>PDF</dt><dd>25 50 44 46</dd></div><div><dt>JPEG</dt><dd>FF D8 FF</dd></div><div><dt>PNG</dt><dd>89 50 4E 47 0D 0A 1A 0A</dd></div><div><dt>ZIP</dt><dd>50 4B 03 04</dd></div><div><dt>Windows executable</dt><dd>4D 5A</dd></div></dl></div></section></div></div></div>
        )}

        {activeId === 3 && (
          <div className="system-stage permission-stage"><div className="permission-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>PERMISSION EDITOR · startup.conf<strong>SIMULATION</strong></div><div className="permission-policy"><small>LIBRARY ACCESS POLICY</small><div><span>Owner · kiosk-service</span><strong>Read + write</strong></div><div><span>Group · library-it</span><strong>Read only</strong></div><div><span>Other users</span><strong>No access</strong></div></div><div className="permission-grid"><span /><strong>READ · 4</strong><strong>WRITE · 2</strong><strong>EXECUTE · 1</strong>{["owner", "group", "other"].map((scope) => <div className="permission-row" key={scope}><b>{scope}</b>{["r", "w", "x"].map((right) => { const name = `${scope}-${right}`; return <button key={name} className={permissions.includes(name) ? "enabled" : ""} aria-pressed={permissions.includes(name)} onClick={() => togglePermission(name)}><i>{permissions.includes(name) ? "✓" : ""}</i>{right.toUpperCase()}</button>; })}</div>)}</div><div className="permission-result"><span>startup.conf</span><code>-{permissionSymbolic}</code><strong>mode {permissionMode}</strong></div></div></div>
        )}

        {activeId === 4 && (
          <div className="system-stage decoder-stage"><div className="decoder-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>MAINTENANCE EXPORT DECODER<strong>OFFLINE</strong></div><section className="encoded-artifact"><small>RECOVERED VALUE · maintenance.env</small><code>preferred_restore=cmVzdG9yZS1jaGFubmVsLTc=</code></section><form className="decoder-form" onSubmit={runDecoder}><label htmlFor="decoder-mode">Decoder</label><select id="decoder-mode" value={decoderMode} onChange={(event) => setDecoderMode(event.target.value)}><option value="hex">Hex bytes</option><option value="ascii">Decimal ASCII</option><option value="base64">Base64</option></select><label htmlFor="decoder-input">Input</label><textarea id="decoder-input" value={decoderInput} onChange={(event) => setDecoderInput(event.target.value)} placeholder="Paste the encoded value" /><button type="submit">Decode</button></form><div className="decoder-output"><span>OUTPUT</span><code>{decoderOutput}</code></div></div></div>
        )}

        {activeId === 5 && (
          <div className="system-stage http-stage"><div className="http-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>ISOLATED RESTORE SERVICE<strong>TRAINING API</strong></div><div className="api-card"><div><small>METHOD</small><code>GET</code></div><div><small>PATH</small><code>/api/restore/status</code></div><div><small>REQUIRED HEADER</small><code>X-Kiosk-ID: LIB-04</code></div><p>Returns the current isolation state and recovery ticket for an authorized kiosk.</p></div><form className="request-builder" onSubmit={sendHttpRequest}><div><label htmlFor="http-method">Method</label><input id="http-method" value={httpMethod} onChange={(event) => setHttpMethod(event.target.value)} /></div><div><label htmlFor="http-path">Path</label><input id="http-path" value={httpPath} onChange={(event) => setHttpPath(event.target.value)} placeholder="/path" /></div><div><label htmlFor="http-header">Header name</label><input id="http-header" value={httpHeader} onChange={(event) => setHttpHeader(event.target.value)} /></div><div><label htmlFor="http-value">Header value</label><input id="http-value" value={httpValue} onChange={(event) => setHttpValue(event.target.value)} /></div><button type="submit">Send request</button></form><div className="http-response"><strong>HTTP/1.1 {httpResponse.status}</strong><pre>{httpResponse.body}</pre></div></div></div>
        )}

        {activeId === 6 && (
          <div className="system-stage cookie-stage"><div className="session-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>LIBRARY PORTAL · SESSION LAB<strong>AUTHORIZED SIMULATION</strong></div><div className="session-layout"><section className="session-page"><small>BACKUP INVENTORY</small><h3>{inventoryKey ? "Inventory access granted" : "Inventory access denied"}</h3>{inventoryKey ? <div className="inventory-key"><span>INVENTORY KEY</span><strong>{inventoryKey}</strong><p>Verified backup sets: 2</p></div> : <div className="denied-card"><p>The current role cannot read backup inventory.</p><code>current_role={activeRole || "unset"}</code></div>}<div className="access-matrix"><strong>Access matrix</strong><span>reader → public catalog</span><span>archivist → backup inventory</span><span>technician → kiosk health</span></div></section><aside className="cookie-inspector"><small>SESSION COOKIE</small><form onSubmit={applyCookie}><label htmlFor="cookie-name">Name</label><input id="cookie-name" value="library_role" readOnly /><label htmlFor="cookie-value">Value</label><input id="cookie-value" value={cookieValue} onChange={(event) => setCookieValue(event.target.value)} autoComplete="off" /><button type="submit">Apply and reload</button></form></aside></div></div></div>
        )}

        {activeId === 7 && (
          <div className="system-stage memory-stage"><div className="memory-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>MEMORY ANALYSIS · kiosk04.mem<strong>PRESERVED SNAPSHOT</strong></div><div className="memory-layout"><aside><small>APPROVED PROCESS BASELINE</small>{approvedProcesses.map((process) => <code key={process}>{process}</code>)}<div><strong>Command reference</strong><span>pslist</span><span>pstree</span><span>strings PID</span><span>clear</span></div></aside><section><div className="memory-console" aria-live="polite">{memoryLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div><form className="memory-command" onSubmit={runMemory}><label htmlFor="memory-command">memory&gt;</label><input id="memory-command" value={memoryInput} onChange={(event) => setMemoryInput(event.target.value)} autoComplete="off" autoFocus /><button type="submit">Run</button></form></section></div></div></div>
        )}

        {activeId === 8 && (
          <div className="system-stage code-stage"><div className="code-workbench"><div className="system-titlebar"><span><i /><i /><i /></span>PYTHON RECOVERY SANDBOX<strong>SAFE TRAINING API</strong></div><div className="code-layout"><aside><small>VAULT API CONTRACT</small><p>Archive code range: <code>000–999</code></p><code>vault.try_password(value) → bool</code><code>vault.read(&quot;recovery.txt&quot;) → text</code><p>The program must stop after the first successful extraction.</p></aside><section><div className="code-editor-heading"><span>recovery.py</span><button onClick={() => setCode("import vault\n\n# Write your recovery loop below.\n")}>Reset</button></div><textarea className="code-editor" aria-label="Python recovery script" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} /><button className="run-code" onClick={runVaultCode}>Run program</button><div className="code-output"><span>OUTPUT</span>{codeOutput.map((line, index) => <code key={`${line}-${index}`}>{line}</code>)}</div></section></div>{completed.length === 8 && <div className="level-complete-banner"><MiniIcon>★</MiniIcon><div><strong>Level 3 complete · Systems Investigator earned</strong><span>The library recovery has been validated without erasing the evidence.</span></div></div>}</div></div>
        )}
      </div>
    </section>
  );
}
