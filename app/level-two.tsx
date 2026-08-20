"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";

type Panel = "briefing" | "manual" | "hint";
type ChallengeKind =
  | "social"
  | "url"
  | "search"
  | "source"
  | "terminal"
  | "hash"
  | "packets"
  | "image";

type Lesson = {
  title: string;
  summary: string;
  concepts: string[];
  takeaway: string;
};

export type LevelTwoChallenge = {
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
  answer: string | Record<string, string>;
  placeholder?: string;
  reference: string;
  lesson: Lesson;
};

export const levelTwoChallenges: LevelTwoChallenge[] = [
  {
    id: 1,
    title: "Public Breadcrumbs",
    subtitle: "Pivot through public posts",
    points: 180,
    skill: "Social OSINT",
    tool: "Public archive",
    rank: "Scout",
    kind: "social",
    objective: "Search the fictional public archive and find the favorite color exposed by @eastview.zara.",
    briefing:
      "The copycat account may be using facts students posted publicly to answer recovery questions. Search the safe training archive for the provided handle and recover the exposed fact.",
    hint: "Search the exact handle, then read the older posts rather than only the profile bio.",
    answer: "teal",
    placeholder: "Enter the exposed favorite color",
    reference: "Social Secret",
    lesson: {
      title: "Small public facts can become security answers",
      summary:
        "OSINT uses publicly available information to answer questions. Harmless-looking posts about favorites, birthdays, pets, or schools can become useful to someone attempting account recovery or impersonation.",
      concepts: [
        "A username is a useful pivot across public sources.",
        "Older posts may expose facts missing from a current profile.",
        "Recovery answers should not be facts other people can research.",
      ],
      takeaway: "Treat personal trivia as public data, not as a secret credential.",
    },
  },
  {
    id: 2,
    title: "Role in the URL",
    subtitle: "Test a query parameter",
    points: 190,
    skill: "Access control",
    tool: "Training browser",
    rank: "Scout",
    kind: "url",
    objective: "Reach the editor view in the training browser and recover its draft ID.",
    briefing:
      "A safe practice site opens the draft page as a guest. Your authorized target is the editor view. Test whether the client-controlled address can take you there.",
    hint: "The address contains user=guest. Replace the current role with the target role named in the mission.",
    answer: "fair-204",
    placeholder: "Enter the draft ID",
    reference: "Secret Pages",
    lesson: {
      title: "Authorization must happen on the server",
      summary:
        "Query parameters are input supplied by the browser. A secure application may use them for navigation, but it must independently verify whether the signed-in user is allowed to access protected data.",
      concepts: [
        "Changing a URL is a normal test inside an authorized training lab.",
        "A role name in the browser is not proof of that role.",
        "Broken access control can expose data without breaking a password.",
      ],
      takeaway: "Never trust a client-controlled parameter to enforce permission.",
    },
  },
  {
    id: 3,
    title: "Signal in the Static",
    subtitle: "Search a noisy evidence dump",
    points: 220,
    skill: "Text searching",
    tool: "Evidence viewer",
    rank: "Analyst",
    kind: "search",
    objective: "Use the evidence viewer’s find tool to recover the incident code hidden in the noisy text dump.",
    briefing:
      "The copycat sent a large export filled with repeated filler, status messages, and unrelated notes. One record contains the incident code needed by the response team.",
    hint: "Use the find box with words that are likely to appear near the value you need.",
    answer: "blue-meteor-7",
    placeholder: "Enter the incident code",
    reference: "Too Much Text",
    lesson: {
      title: "Search is a basic forensic superpower",
      summary:
        "Large evidence files are rarely read from top to bottom. Analysts search for meaningful field names, error terms, identifiers, and timestamps, then examine the surrounding context.",
      concepts: [
        "Start with terms derived from the question, not random guesses.",
        "A match is a lead; nearby context tells you what it means.",
        "Searching does not modify the evidence.",
      ],
      takeaway: "Use precise searches to reduce noise, then verify the matching context.",
    },
  },
  {
    id: 4,
    title: "Broken Route",
    subtitle: "Inspect a disabled link",
    points: 230,
    skill: "Source inspection",
    tool: "Browser source",
    rank: "Analyst",
    kind: "source",
    objective: "Inspect the page source, recover the disabled staff route, and navigate to it in the training browser.",
    briefing:
      "The news portal shows a Staff Review control, but clicking it does nothing. The safe lab preserves the HTML that generated the page.",
    hint: "The visible button is broken, but its HTML still contains the route it was meant to open.",
    answer: "echo-441",
    placeholder: "Enter the review token",
    reference: "Broken Click",
    lesson: {
      title: "The browser receives more than it displays",
      summary:
        "HTML source contains attributes, routes, comments, and scripts used to build a page. A broken visual control may still reveal where it intended to navigate.",
      concepts: [
        "View-source is read-only inspection.",
        "Hidden or disabled interface elements are not access controls.",
        "Sensitive routes still require authorization when opened directly.",
      ],
      takeaway: "Anything delivered to the browser should be treated as visible to the user.",
    },
  },
  {
    id: 5,
    title: "Token Trail",
    subtitle: "Investigate a connected app",
    points: 240,
    skill: "Command-line forensics",
    tool: "Training terminal",
    rank: "Investigation",
    kind: "terminal",
    objective: "Use the terminal artifacts to identify the OAuth app ID that published the fake announcement.",
    briefing:
      "A safe offline copy of the account’s application inventory and activity log is mounted in the training shell. Investigate without changing the evidence.",
    hint: "Use ls to inventory files, cat to read one, and grep to filter matching log lines.",
    answer: "oauth_77",
    placeholder: "Enter the suspicious app ID",
    reference: "Dante In Command and Too Much Text",
    lesson: {
      title: "Command-line tools make evidence searchable",
      summary:
        "Analysts use read-only shell commands to inventory files, inspect records, and filter large logs. The goal is not to type commands quickly—it is to ask precise questions without altering evidence.",
      concepts: [
        "List available artifacts before deciding what to inspect.",
        "cat reads a file; grep filters lines matching a search term.",
        "Correlate stable identifiers across separate evidence files.",
      ],
      takeaway: "Use small, read-only commands to narrow evidence while preserving the original record.",
    },
  },
  {
    id: 6,
    title: "Hash Hunt",
    subtitle: "Query a known-hash index",
    points: 250,
    skill: "Hash intelligence",
    tool: "Hash lookup",
    rank: "Investigation",
    kind: "hash",
    objective: "Query the fictional known-hash index and recover the original text for the supplied MD5 value.",
    briefing:
      "An intercepted message contains a 32-character digest. The safe training index contains previously identified hashes. Determine whether this exact value is already known.",
    hint: "Search the complete hash exactly as written; changing one character produces a different lookup.",
    answer: "purple-orbit",
    placeholder: "Enter the recovered text",
    reference: "Hard Hash",
    lesson: {
      title: "Hashes are fingerprints, not encryption",
      summary:
        "A cryptographic hash is designed to be one-way, but common or previously seen inputs can appear in lookup databases. Finding a match does not mean the hash function was decrypted.",
      concepts: [
        "Exact hashes can be searched as identifiers.",
        "Weak, reused text is more likely to have a known hash.",
        "Modern passwords need slow password-hashing algorithms plus unique salts.",
      ],
      takeaway: "A hash match reveals reused input; it does not reverse strong cryptography.",
    },
  },
  {
    id: 7,
    title: "First Knock",
    subtitle: "Profile a port scan",
    points: 260,
    skill: "Packet analysis",
    tool: "Packet capture",
    rank: "Case Lead",
    kind: "packets",
    objective: "Analyze the capture and report the scan pattern, likely operating system, and targeted ports.",
    briefing:
      "Before the fake announcement appeared, one external host probed a lab server. The capture mixes the scan with ordinary DNS and web traffic.",
    hint: "Compare destination hosts and ports. The IP TTL can help distinguish common operating-system defaults.",
    answer: {
      pattern: "vertical",
      os: "windows",
      ports: "135,139,445,5357,6666,7443",
    },
    reference: "Running Report",
    lesson: {
      title: "Port scans reveal reconnaissance",
      summary:
        "A vertical scan checks many ports on one host. Analysts can infer the pattern from destinations and targeted ports, while TTL values may provide a cautious clue about the sender’s operating system.",
      concepts: [
        "A vertical scan targets multiple services on one system.",
        "SYN packets can test whether ports respond without completing a connection.",
        "Operating-system inference is a clue, not absolute attribution.",
      ],
      takeaway: "Describe the packet pattern first, then make cautious inferences from metadata.",
    },
  },
  {
    id: 8,
    title: "Zoom Room",
    subtitle: "Inspect the full-resolution image",
    points: 300,
    skill: "Visual forensics",
    tool: "Image viewer",
    rank: "Case Lead",
    kind: "image",
    objective: "Zoom and pan around the full-resolution evidence image to recover the note hidden in plain sight.",
    briefing:
      "A photographer captured the student newsroom shortly before the copycat post. The preview hides small details that remain visible in the original resolution.",
    hint: "Increase the zoom and inspect the objects near the far side of the room.",
    answer: "violet-lens-42",
    placeholder: "Enter the note text",
    reference: "Photo Rapide",
    lesson: {
      title: "Resolution can preserve overlooked evidence",
      summary:
        "A scaled-down preview may hide information that still exists in the original pixels. Visual forensics starts with preserving the source file and inspecting it at full resolution.",
      concepts: [
        "Zooming changes presentation, not the underlying evidence.",
        "Inspect edges, reflections, screens, labels, and backgrounds methodically.",
        "Record the original filename and avoid destructive edits.",
      ],
      takeaway: "Always inspect the original-resolution artifact before concluding a detail is absent.",
    },
  },
];

const graphicLabels = ["OSINT", "?USER", "FIND", "</>", ">_", "HASH", "PCAP", "ZOOM"];

function MiniIcon({ children }: { children: string }) {
  return <span aria-hidden="true">{children}</span>;
}

export function LevelTwoGrid({
  completed,
  onBack,
  onOpen,
}: {
  completed: number[];
  onBack: () => void;
  onOpen: (id: number) => void;
}) {
  const earned = completed.reduce(
    (sum, id) => sum + (levelTwoChallenges.find((challenge) => challenge.id === id)?.points ?? 0),
    0,
  );
  const available = levelTwoChallenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const percent = Math.round((completed.length / levelTwoChallenges.length) * 100);

  return (
    <section className="challenge-grid-view level-two-grid" id="main-content">
      <div className="level-banner level-two-banner">
        <button className="back-link" onClick={onBack}>← All levels</button>
        <div className="level-banner-copy">
          <div>
            <p className="kicker">LEVEL 2 · DEVELOPING</p>
            <h1>The Copycat Account</h1>
            <p>
              Follow a CyberStart-inspired case through public-source research, browser
              inspection, noisy files, terminal evidence, hashes, packets, and visual forensics.
            </p>
            <div className="rank-track" aria-label="Challenge skill progression">
              <span>Scout</span><i>→</i><span>Web Analyst</span><i>→</i>
              <span>Investigator</span><i>→</i><span>Forensics</span>
            </div>
          </div>
          <div className="level-score">
            <span>{completed.length} / {levelTwoChallenges.length} complete</span>
            <strong>{earned} / {available} points</strong>
            <div><i style={{ width: `${percent}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="challenge-section-heading">
        <div>
          <h2>Challenges</h2>
          <p>All 8 challenges are open. Play them in any order.</p>
        </div>
        <span className="story-status">
          {completed.length === levelTwoChallenges.length
            ? "Case closed"
            : "Free explore · all challenges open"}
        </span>
      </div>

      <div className="challenge-card-grid level-two-card-grid">
        {levelTwoChallenges.map((challenge, index) => {
          const done = completed.includes(challenge.id);
          return (
            <button
              className={`challenge-card level-two-card ${done ? "complete" : ""}`}
              key={challenge.id}
              onClick={() => onOpen(challenge.id)}
            >
              <div className="challenge-card-top">
                <span className="challenge-index">
                  {done ? <MiniIcon>✓</MiniIcon> : String(index + 1).padStart(2, "0")}
                </span>
                <span className="challenge-points">+{challenge.points} pts</span>
              </div>
              <div className={`challenge-graphic level-two-graphic graphic-l2-${challenge.id}`}>
                <div className="mini-window"><span /><span /><span /><strong>{graphicLabels[index]}</strong></div>
              </div>
              <div className="challenge-card-copy">
                <div className="challenge-labels">
                  <span>{challenge.skill}</span>
                  <em className="rank-level-two">{challenge.rank}</em>
                </div>
                <h3>{challenge.title}</h3>
                <p>{challenge.subtitle}</p>
                <strong>{done ? "Replay challenge" : "Start challenge"}</strong>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const terminalArtifacts: Record<string, string[]> = {
  "auth.log": [
    "14:01:02 actor=user action=login result=success source=10.24.18.44",
    "14:03:18 actor=app app_id=oauth_31 action=profile_read result=success",
    "14:07:44 actor=app app_id=oauth_12 action=calendar_read result=success",
    "14:12:09 actor=user action=draft_saved result=success source=10.24.18.44",
    "14:16:30 actor=app app_id=oauth_77 action=post_created post_id=9914 result=success",
    "14:16:31 actor=app app_id=oauth_77 action=message_read thread=principal result=success",
    "14:18:55 actor=app app_id=oauth_31 action=profile_read result=success",
    "14:22:04 actor=app app_id=oauth_77 action=post_created post_id=9918 result=success",
    "14:27:38 actor=user action=logout result=success source=10.24.18.44",
  ],
  "apps.csv": [
    "app_id,name,granted_scopes,installed",
    "oauth_12,Eastview Calendar,calendar.read,2025-08-11",
    "oauth_31,Profile Badge,profile.read,2026-01-24",
    "oauth_54,Photo Resizer,media.read media.write,2026-04-03",
    "oauth_77,Caption Spark,profile.read posts.write messages.read,2026-08-16",
  ],
  "case.txt": [
    "CASE=CQ-205",
    "SCOPE=offline evidence copy",
    "QUESTION=Which OAuth app ID created the fake announcement?",
  ],
};

const publicArchivePosts = [
  { date: "2024-09-03", handle: "@eastview.zara", text: "New year, same teal notebook. I refuse to use any other color." },
  { date: "2025-02-14", handle: "@eastview.zara", text: "The news desk finally replaced our microphone cables." },
  { date: "2025-06-07", handle: "@zara.photos", text: "Blue hour over Eastview stadium." },
  { date: "2026-03-21", handle: "@eastview.news", text: "Applications for next year’s editors are open." },
  { date: "2026-07-18", handle: "@eastview.zara", text: "Reminder: never use public facts as password recovery answers." },
];

const evidenceDump = Array.from({ length: 96 }, (_, index) => {
  if (index === 67) {
    return "067 | audit=review | incident_code=BLUE-METEOR-7 | owner=response-team";
  }
  const channels = ["scheduler", "media-cache", "draft-sync", "weather-feed", "spellcheck"];
  const states = ["idle", "complete", "waiting", "cached", "rotated", "healthy"];
  return `${String(index).padStart(3, "0")} | service=${channels[index % channels.length]} | state=${states[index % states.length]} | job=${4100 + index}`;
});

const dashboardSource = [
  "<!doctype html>",
  "<html>",
  "  <main class=\"dashboard\">",
  "    <h1>Publishing dashboard</h1>",
  "    <button class=\"staff-review disabled\"",
  "      data-route=\"/staff/review-portal\">",
  "      Staff Review",
  "    </button>",
  "  </main>",
  "</html>",
].join("\n");

const reviewSource = [
  "<section class=\"review-portal\">",
  "  <span>REVIEW TOKEN</span>",
  "  <strong>ECHO-441</strong>",
  "</section>",
].join("\n");

const packetRows = [
  ["1", "09:41:02.110", "198.51.100.60", "10.24.30.15", "TCP", "54012 → 135 [SYN] Seq=0 TTL=128"],
  ["2", "09:41:02.121", "10.24.30.15", "198.51.100.60", "TCP", "135 → 54012 [RST, ACK] TTL=64"],
  ["3", "09:41:02.304", "10.24.18.44", "10.24.0.53", "DNS", "Standard query A portal.eastview.school TTL=64"],
  ["4", "09:41:02.508", "198.51.100.60", "10.24.30.15", "TCP", "54013 → 139 [SYN] Seq=0 TTL=128"],
  ["5", "09:41:02.891", "198.51.100.60", "10.24.30.15", "TCP", "54014 → 445 [SYN] Seq=0 TTL=128"],
  ["6", "09:41:03.024", "10.24.18.44", "192.0.2.20", "TLS", "Client Hello SNI=portal.eastview.school TTL=64"],
  ["7", "09:41:03.305", "198.51.100.60", "10.24.30.15", "TCP", "54015 → 5357 [SYN] Seq=0 TTL=128"],
  ["8", "09:41:03.710", "198.51.100.60", "10.24.30.15", "TCP", "54016 → 6666 [SYN] Seq=0 TTL=128"],
  ["9", "09:41:04.102", "198.51.100.60", "10.24.30.15", "TCP", "54017 → 7443 [SYN] Seq=0 TTL=128"],
  ["10", "09:41:04.820", "10.24.18.44", "198.51.100.24", "QUIC", "Protected payload to video.education.example TTL=64"],
  ["11", "09:41:05.014", "198.51.100.60", "10.24.30.15", "ICMP", "Echo request TTL=128"],
  ["12", "09:41:05.117", "10.24.30.15", "198.51.100.60", "ICMP", "Echo reply TTL=64"],
  ["13", "09:41:06.240", "10.24.18.44", "192.0.2.25", "TLS", "Application Data · 1220 bytes TTL=64"],
  ["14", "09:41:07.402", "203.0.113.77", "10.24.30.22", "TCP", "443 → 51320 [ACK] TTL=52"],
  ["15", "09:41:08.030", "10.24.18.44", "10.24.0.53", "DNS", "Standard query A mail.eastview.school TTL=64"],
  ["16", "09:41:09.721", "192.0.2.55", "10.24.30.15", "TCP", "443 → 52210 [ACK] TTL=51"],
] as const;

export function resolveTrainingPage(url: string): "guest" | "editor" | "missing" {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("user")?.toLowerCase() === "editor" ? "editor" : "guest";
  } catch {
    return "missing";
  }
}

export function LevelTwoWorkspace({
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
  const challenge = levelTwoChallenges.find((item) => item.id === activeId)!;
  const [panel, setPanel] = useState<Panel>("briefing");
  const [answer, setAnswer] = useState("");
  const [fieldAnswers, setFieldAnswers] = useState<Record<string, string>>({});
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveSearched, setArchiveSearched] = useState(false);
  const [trainingUrl, setTrainingUrl] = useState(
    "https://drafts.eastview.school/review?user=guest",
  );
  const [trainingPage, setTrainingPage] = useState<"guest" | "editor" | "missing">("guest");
  const [findTerm, setFindTerm] = useState("");
  const [sourceMode, setSourceMode] = useState<"page" | "source">("page");
  const [sourceUrl, setSourceUrl] = useState("https://news.eastview.school/dashboard");
  const [sourcePage, setSourcePage] = useState<"dashboard" | "review" | "missing">("dashboard");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "Cyber Quest evidence shell · read-only training mode",
    "case volume mounted at /evidence/copycat",
  ]);
  const [hashQuery, setHashQuery] = useState("");
  const [hashSearched, setHashSearched] = useState(false);
  const [packetFilter, setPacketFilter] = useState("");
  const [imageZoom, setImageZoom] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const isComplete = completed.includes(activeId);

  function runArchiveSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setArchiveSearched(true);
  }

  function navigateTrainingBrowser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTrainingPage(resolveTrainingPage(trainingUrl));
  }

  function navigateSourceBrowser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const parsed = new URL(sourceUrl);
      setSourcePage(parsed.pathname === "/staff/review-portal" ? "review" : "dashboard");
      setSourceMode("page");
    } catch {
      setSourcePage("missing");
    }
  }

  function runEvidenceTerminal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = terminalInput.trim();
    const lower = command.toLowerCase();
    if (!command) return;

    let response: string[] = ["Command not found."];
    if (lower === "pwd") {
      response = ["/evidence/copycat"];
    } else if (lower === "ls" || lower === "ls -la" || lower === "ls -l") {
      response = ["auth.log   apps.csv   case.txt"];
    } else if (lower === "help") {
      response = ["Guided help is unavailable during the challenge."];
    } else if (lower === "clear") {
      setTerminalLines(["Terminal cleared."]);
      setTerminalInput("");
      return;
    } else if (lower.startsWith("cat ")) {
      const filename = lower.slice(4).trim();
      response = terminalArtifacts[filename] ?? [`cat: ${filename}: No such file`];
    } else if (lower.startsWith("grep ")) {
      const match = command.match(/^grep\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s+(\S+)$/i);
      if (!match) {
        response = ["usage: grep SEARCH filename"];
      } else {
        const search = (match[1] ?? match[2] ?? match[3]).toLowerCase();
        const filename = match[4].toLowerCase();
        const file = terminalArtifacts[filename];
        response = file
          ? file.filter((line) => line.toLowerCase().includes(search))
          : [`grep: ${filename}: No such file`];
        if (file && response.length === 0) response = ["No matching lines."];
      }
    }

    setTerminalLines((current) => [...current, `analyst@case:~$ ${command}`, ...response]);
    setTerminalInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let correct = false;
    if (challenge.kind === "packets") {
      const expected = challenge.answer as Record<string, string>;
      correct = Object.entries(expected).every(
        ([field, value]) =>
          fieldAnswers[field]?.trim().toLowerCase().replace(/\s+/g, "") ===
          value.toLowerCase().replace(/\s+/g, ""),
      );
    } else {
      correct = answer.trim().toLowerCase() === String(challenge.answer).toLowerCase();
    }

    if (correct) {
      setCompleted((current) => current.includes(activeId) ? current : [...current, activeId]);
      setFeedback(
        activeId === levelTwoChallenges.length
          ? "Level complete! The evidence brief is ready."
          : "Correct! Challenge complete.",
      );
      setCelebrating(true);
    } else {
      setFeedback("Not quite. Review the evidence and try again.");
    }
  }

  const visiblePackets = packetRows.filter((row) => {
    const filter = packetFilter.trim().toLowerCase();
    if (!filter) return true;
    if (filter.startsWith("ip.addr ==")) {
      const address = filter.split("==")[1]?.trim();
      return row[2] === address || row[3] === address;
    }
    if (filter.startsWith("dns.qry.name ==")) {
      const domain = filter.split("==")[1]?.trim();
      return row[5].toLowerCase().includes(domain);
    }
    return row.some((cell) => cell.toLowerCase().includes(filter));
  });

  const archiveMatches = archiveSearched
    ? publicArchivePosts.filter((post) =>
        `${post.handle} ${post.text}`.toLowerCase().includes(archiveQuery.trim().toLowerCase()),
      )
    : [];
  const textMatches = findTerm.trim()
    ? evidenceDump.filter((line) => line.toLowerCase().includes(findTerm.trim().toLowerCase()))
    : evidenceDump;
  const usesTextAnswer = challenge.kind !== "packets";
  const selectionLabel = `${Object.values(fieldAnswers).filter((value) => value.trim()).length} of 3 report fields completed`;

  return (
    <section className="challenge-workspace level-two-workspace" id="main-content">
      {celebrating && (
        <div className="success-celebration">
          <section className="flag-notification level-two-flag" role="status" aria-live="assertive">
            <button className="flag-close" onClick={() => setCelebrating(false)} aria-label="Close success notification">×</button>
            <span className="flag-check" aria-hidden="true">✓</span>
            <div>
              <small>LEVEL 2 · CHALLENGE {activeId} COMPLETE</small>
              <strong>Evidence verified!</strong>
              <code>CQ-L2-C{String(activeId).padStart(2, "0")}</code>
            </div>
            <button
              className="flag-continue"
              onClick={() => {
                setCelebrating(false);
                if (activeId < levelTwoChallenges.length) onNavigate(activeId + 1);
                else onBack();
              }}
            >
              {activeId < levelTwoChallenges.length ? "Next challenge →" : "View completed level"}
            </button>
          </section>
        </div>
      )}

      <aside className="challenge-sidebar level-two-sidebar">
        <div className="sidebar-top">
          <button className="round-back" onClick={onBack}>←<span className="sr-only">Back to challenge grid</span></button>
          <div>
            <h1>{challenge.title}</h1>
            <p>L2 C{String(activeId).padStart(2, "0")} · {challenge.tool} · {challenge.rank}</p>
          </div>
        </div>

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
              {isComplete ? (
                <>
                  <h3>{challenge.lesson.title}</h3><p>{challenge.lesson.summary}</p>
                  <h4>What you learned</h4>
                  <ul>{challenge.lesson.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
                  <div className="lesson-takeaway"><strong>Remember</strong><p>{challenge.lesson.takeaway}</p></div>
                  <p className="challenge-inspiration">
                    Mechanic inspired by “{challenge.reference}” from the CyberStart 2024 archive
                    (CC BY-SA 4.0). Scenario and artifacts were remade for Cyber Quest.
                  </p>
                </>
              ) : <p className="lesson-locked-copy">Solve this challenge to unlock the lesson explaining the real cybersecurity idea behind it.</p>}
            </section>
          )}
          <div className="objective-box"><strong>Your task</strong><p>{challenge.objective}</p></div>
        </div>

        <form className="answer-form" onSubmit={submit}>
          {usesTextAnswer ? (
            <label htmlFor="level-two-answer">Your answer</label>
          ) : (
            <span className="answer-form-label">Forensics report</span>
          )}
          {usesTextAnswer ? (
            <input id="level-two-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={challenge.placeholder} autoComplete="off" />
          ) : <div className="selection-status" id="level-two-answer">{selectionLabel}</div>}
          <button className="submit-answer" type="submit">Check answer ↵</button>
          <p className={`answer-feedback ${feedback.startsWith("Correct") || feedback.startsWith("Level") ? "success" : ""}`} aria-live="polite">{feedback || "You can try as many times as you need."}</p>
        </form>

        <div className="challenge-nav">
          <button disabled={activeId === 1} onClick={() => onNavigate(activeId - 1)}>← Previous</button>
          <button disabled={activeId === levelTwoChallenges.length} onClick={() => onNavigate(activeId + 1)}>Next →</button>
        </div>
      </aside>

      <div className="challenge-main level-two-main">
        <div className="challenge-stage-heading">
          <div><span>CHALLENGE {activeId} OF {levelTwoChallenges.length} · {challenge.rank}</span><h2>{challenge.objective}</h2></div>
          <button onClick={onBack}>View all challenges</button>
        </div>

        {activeId === 1 && (
          <div className="copycat-stage social-osint-stage">
            <div className="public-archive">
              <header><div><small>FICTIONAL TRAINING INDEX</small><h3>Public Post Archive</h3></div><span>5 POSTS INDEXED</span></header>
              <form className="archive-search" onSubmit={runArchiveSearch}>
                <label htmlFor="archive-query">Search public posts</label>
                <div><input id="archive-query" value={archiveQuery} onChange={(event) => setArchiveQuery(event.target.value)} placeholder="Search handle or phrase" autoComplete="off" /><button type="submit">Search</button></div>
              </form>
              <div className="archive-status" role="status">{archiveSearched ? `${archiveMatches.length} matching posts` : "Archive ready"}</div>
              <div className="archive-results">
                {archiveMatches.map((post) => <article key={`${post.date}-${post.handle}`}><time>{post.date}</time><div><strong>{post.handle}</strong><p>{post.text}</p></div></article>)}
                {!archiveSearched && <div className="archive-empty"><span>⌕</span><p>Search results will appear here.</p></div>}
                {archiveSearched && archiveMatches.length === 0 && <div className="archive-empty"><p>No posts matched that search.</p></div>}
              </div>
            </div>
          </div>
        )}

        {activeId === 2 && (
          <div className="copycat-stage parameter-stage">
            <div className="training-browser">
              <div className="training-browser-tabs"><span>Authorized training simulation</span><strong>Draft Review</strong></div>
              <form className="lab-address-bar" onSubmit={navigateTrainingBrowser}>
                <input aria-label="Training browser address" value={trainingUrl} onChange={(event) => setTrainingUrl(event.target.value)} autoComplete="off" />
                <button type="submit">Go</button>
              </form>
              <div className="training-page">
                {trainingPage === "guest" && <section className="guest-page"><small>EASTVIEW DRAFTS</small><h3>Guest access</h3><p>Draft preview unavailable for this session.</p><span>Access level: guest</span></section>}
                {trainingPage === "editor" && <section className="editor-page"><small>STAFF DRAFT REVIEW</small><h3>Fall Fair Announcement</h3><div><span>DRAFT ID</span><strong>FAIR-204</strong></div><p>Review copy is ready for the student newsroom.</p></section>}
                {trainingPage === "missing" && <section className="missing-page"><strong>Page unavailable</strong><p>Enter a complete training URL.</p></section>}
              </div>
            </div>
          </div>
        )}

        {activeId === 3 && (
          <div className="copycat-stage text-search-stage">
            <div className="text-evidence-viewer">
              <div className="evidence-viewer-title"><span><i /><i /><i /></span><strong>evidence-dump.txt</strong><em>96 LINES · READ ONLY</em></div>
              <div className="evidence-find"><label htmlFor="evidence-find">Find</label><input id="evidence-find" value={findTerm} onChange={(event) => setFindTerm(event.target.value)} placeholder="Search this file" autoComplete="off" /><span>{findTerm.trim() ? `${textMatches.length} matches` : "All lines"}</span></div>
              <pre aria-label="Evidence text dump"><code>{textMatches.join("\n")}</code></pre>
            </div>
          </div>
        )}

        {activeId === 4 && (
          <div className="copycat-stage source-inspection-stage">
            <div className="source-browser">
              <div className="source-browser-toolbar">
                <form className="lab-address-bar" onSubmit={navigateSourceBrowser}><input aria-label="Source browser address" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} autoComplete="off" /><button type="submit">Go</button></form>
                <div className="source-mode-tabs"><button className={sourceMode === "page" ? "active" : ""} onClick={() => setSourceMode("page")}>Rendered page</button><button className={sourceMode === "source" ? "active" : ""} onClick={() => setSourceMode("source")}>View source</button></div>
              </div>
              <div className="source-browser-page">
                {sourcePage === "missing" && <div className="missing-page"><strong>Page unavailable</strong></div>}
                {sourcePage === "dashboard" && sourceMode === "page" && <section className="news-dashboard"><small>EASTVIEW NEWSROOM</small><h3>Publishing dashboard</h3><div className="dashboard-cards"><article><span>12</span><strong>Published stories</strong></article><article><span>3</span><strong>Drafts pending</strong></article></div><button className="broken-review-button" type="button" disabled>Staff Review</button><p>Review control unavailable.</p></section>}
                {sourcePage === "dashboard" && sourceMode === "source" && <pre className="html-source"><code>{dashboardSource}</code></pre>}
                {sourcePage === "review" && sourceMode === "page" && <section className="review-portal"><small>STAFF REVIEW WORKSPACE</small><h3>Route recovered</h3><div><span>REVIEW TOKEN</span><strong>ECHO-441</strong></div><p>Direct routes still require server-side authorization outside this training simulation.</p></section>}
                {sourcePage === "review" && sourceMode === "source" && <pre className="html-source"><code>{reviewSource}</code></pre>}
              </div>
            </div>
          </div>
        )}

        {activeId === 5 && (
          <div className="copycat-stage token-terminal-stage">
            <div className="evidence-terminal">
              <div className="terminal-titlebar"><span><i /><i /><i /></span>CYBER QUEST SHELL · CASE CQ-205<strong>READ ONLY</strong></div>
              <div className="terminal-body" aria-live="polite">
                {terminalLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
              </div>
              <form className="terminal-command" onSubmit={runEvidenceTerminal}>
                <label htmlFor="level-two-terminal">analyst@case:~$</label>
                <input id="level-two-terminal" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} autoComplete="off" autoFocus />
                <button type="submit">Run</button>
              </form>
              <div className="terminal-evidence-state"><span>Mounted evidence: 3 files</span><strong>Changes disabled</strong></div>
            </div>
          </div>
        )}

        {activeId === 6 && (
          <div className="copycat-stage hash-stage-two">
            <div className="hash-lab">
              <header><div><small>FICTIONAL KNOWN-HASH INDEX</small><h3>Hash Hunt</h3></div><span>OFFLINE TRAINING DATA</span></header>
              <section className="hash-evidence"><span>INTERCEPTED DIGEST</span><code>a827f9ef19bfa35b11643c4b020e301b</code></section>
              <form className="hash-search" onSubmit={(event) => { event.preventDefault(); setHashSearched(true); }}>
                <label htmlFor="hash-query">Query hash</label><div><input id="hash-query" value={hashQuery} onChange={(event) => setHashQuery(event.target.value)} placeholder="Paste a complete hash" autoComplete="off" /><button type="submit">Lookup</button></div>
              </form>
              <div className="hash-result" role="status">
                {!hashSearched && <p>Lookup results will appear here.</p>}
                {hashSearched && hashQuery.trim().toLowerCase() !== "a827f9ef19bfa35b11643c4b020e301b" && <p>No known match for that value.</p>}
                {hashSearched && hashQuery.trim().toLowerCase() === "a827f9ef19bfa35b11643c4b020e301b" && <dl><div><dt>Algorithm</dt><dd>MD5</dd></div><div><dt>Status</dt><dd>KNOWN</dd></div><div><dt>Original text</dt><dd><code>purple-orbit</code></dd></div></dl>}
              </div>
            </div>
          </div>
        )}

        {activeId === 7 && (
          <div className="copycat-stage packet-stage">
            <div className="packet-workbench">
              <div className="packet-titlebar"><span>PCAP</span><div><small>CAPTURE FILE</small><strong>first-knock.pcapng</strong></div><em>16 packets loaded</em></div>
              <div className="packet-filter"><label htmlFor="packet-filter">Display filter</label><input id="packet-filter" value={packetFilter} onChange={(event) => setPacketFilter(event.target.value)} placeholder="protocol, address, hostname, or expression" autoComplete="off" /><span>{visiblePackets.length} shown</span></div>
              <div className="packet-table" role="table" aria-label="Packet capture rows">
                <div className="packet-columns" role="row"><span>No.</span><span>Time</span><span>Source</span><span>Destination</span><span>Protocol</span><span>Info</span></div>
                <div className="packet-rows">{visiblePackets.map((row) => <div key={row[0]} role="row"><span>{row[0]}</span><time>{row[1]}</time><code>{row[2]}</code><code>{row[3]}</code><strong>{row[4]}</strong><p>{row[5]}</p></div>)}</div>
              </div>
              {visiblePackets.length === 0 && <div className="packet-empty">No packets match this display filter.</div>}
              <div className="packet-report" aria-label="Forensics report fields">
                <div><label htmlFor="scan-pattern">Scan pattern</label><input id="scan-pattern" value={fieldAnswers.pattern ?? ""} onChange={(event) => setFieldAnswers((current) => ({ ...current, pattern: event.target.value }))} autoComplete="off" /></div>
                <div><label htmlFor="likely-os">Likely operating system</label><input id="likely-os" value={fieldAnswers.os ?? ""} onChange={(event) => setFieldAnswers((current) => ({ ...current, os: event.target.value }))} autoComplete="off" /></div>
                <div><label htmlFor="target-ports">Targeted ports</label><input id="target-ports" value={fieldAnswers.ports ?? ""} onChange={(event) => setFieldAnswers((current) => ({ ...current, ports: event.target.value }))} placeholder="comma-separated" autoComplete="off" /></div>
              </div>
            </div>
          </div>
        )}

        {activeId === 8 && (
          <div className="copycat-stage zoom-evidence-stage">
            <div className="zoom-lab">
              <div className="zoom-toolbar"><div><small>EVIDENCE IMAGE</small><strong>newsroom-original.jpg</strong></div><label htmlFor="image-zoom">Zoom <input id="image-zoom" type="range" min="1" max="4" step="0.25" value={imageZoom} onChange={(event) => setImageZoom(Number(event.target.value))} /><span>{Math.round(imageZoom * 100)}%</span></label></div>
              <div className="zoom-viewport">
                <div className="zoom-canvas" style={{ width: `${1200 * imageZoom}px`, height: `${700 * imageZoom}px` }}>
                  <div className="newsroom-photo" style={{ transform: `scale(${imageZoom})` }}>
                    <div className="room-wall"><span>EASTVIEW STUDENT NEWS</span></div>
                    <div className="room-window window-one" /><div className="room-window window-two" />
                    <div className="room-desk desk-one"><i /><b /></div><div className="room-desk desk-two"><i /><b /></div><div className="room-desk desk-three"><i /><b /></div>
                    <div className="camera-tripod"><i /><span /><b /></div>
                    <div className="news-shelf"><i /><i /><i /><i /></div>
                    <div className="hidden-note">VIOLET-LENS-42</div>
                    <div className="room-floor" />
                  </div>
                </div>
              </div>
              <p className="zoom-caption">newsroom-original.jpg · 1200 × 700 · original preserved</p>
              {completed.length === levelTwoChallenges.length && <div className="level-complete-banner"><MiniIcon>★</MiniIcon><div><strong>Level 2 complete · Evidence Defender earned</strong><span>Every CyberStart-inspired lab has been cleared.</span></div></div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
