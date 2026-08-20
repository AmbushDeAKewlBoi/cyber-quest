"use client";

import { type CSSProperties, FormEvent, useMemo, useRef, useState } from "react";
import { LevelTwoGrid, LevelTwoWorkspace, levelTwoChallenges } from "./level-two";
import { LevelThreeGrid, LevelThreeWorkspace, levelThreeChallenges } from "./level-three";
import { LevelFourGrid, LevelFourWorkspace, levelFourChallenges } from "./level-four";

type View = "levels" | "challenge-grid" | "challenge";
type Panel = "briefing" | "manual" | "hint";

type MiniLesson = {
  title: string;
  summary: string;
  concepts: string[];
  takeaway: string;
};

type Challenge = {
  id: number;
  title: string;
  subtitle: string;
  points: number;
  skill: string;
  tool: string;
  objective: string;
  briefing: string;
  hint: string;
  manualTitle: string;
  manual: string;
  manualSteps?: string[];
  manualCommands?: {
    command: string;
    usage: string;
    description: string;
  }[];
  answer: string;
  placeholder: string;
  lesson: MiniLesson;
};

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Hidden in Plain Sight",
    subtitle: "Find the club contact",
    points: 100,
    skill: "Hidden text",
    tool: "Website",
    objective: "Find the hidden email address on Riley's profile.",
    briefing:
      "Bolt, the school robot, vanished from the network before the science fair. Riley left a contact address on this page, but it is hidden.",
    hint: "A page can contain text that is present but difficult to see.",
    manualTitle: "Hidden text",
    manual:
      "A webpage can contain text that blends into its background. Selecting the page reveals the letters without changing the page.",
    answer: "riley@robotclub.school",
    placeholder: "Enter the hidden email",
    lesson: {
      title: "Invisible does not mean absent",
      summary:
        "A browser displays a page using HTML for content and CSS for appearance. CSS can make real text match its background, move it off-screen, or shrink it—but the text may still exist in the page.",
      concepts: [
        "Presentation and underlying data are different things.",
        "Selecting text is a safe first inspection step; it does not change the website.",
        "Defenders verify what a page contains instead of trusting appearance alone.",
      ],
      takeaway: "When something looks blank, inspect carefully before deciding there is nothing there.",
    },
  },
  {
    id: 2,
    title: "Mixed-Up Message",
    subtitle: "Read the backwards note",
    points: 100,
    skill: "Text patterns",
    tool: "Message board",
    objective: "Reverse the message and enter the room code.",
    briefing:
      "Riley sent a quick update before Bolt disappeared. The message appears scrambled.",
    hint: "Try reading the message from the opposite end.",
    manualTitle: "Reversing text",
    manual:
      "Reversing is not encryption. It simply changes the order of characters. Start at the end and work toward the beginning.",
    answer: "LAB3",
    placeholder: "Enter the room code",
    lesson: {
      title: "Obfuscation is not encryption",
      summary:
        "Reversing text hides its meaning from a quick glance, but it uses no secret key and anyone can undo it. This is obfuscation: making information less obvious without truly protecting it.",
      concepts: [
        "Encoding changes a format; encryption protects data with a key.",
        "Simple patterns can be recognized and reversed by an analyst.",
        "Sensitive information needs real encryption, not a visual trick.",
      ],
      takeaway: "If a message can be decoded just by spotting a pattern, it was never securely encrypted.",
    },
  },
  {
    id: 3,
    title: "The Fake Update",
    subtitle: "Spot the suspicious sender",
    points: 120,
    skill: "Phishing",
    tool: "Email",
    objective: "Click the part of the email that proves it is fake.",
    briefing:
      "A message claims Bolt needs an emergency update. One detail shows the message did not come from the school.",
    hint: "Look closely at who actually sent the message.",
    manualTitle: "Look-alike domains",
    manual:
      "Scammers change one letter in a trusted address. Read the full domain slowly before opening a link or attachment.",
    answer: "sender",
    placeholder: "Select the suspicious detail",
    lesson: {
      title: "Phishing uses trust and urgency",
      summary:
        "Phishing messages imitate a trusted person or organization so you act before checking. Attackers often change one character in a sender domain and add urgency, threats, or tempting attachments.",
      concepts: [
        "Read the complete sender domain, not only the display name.",
        "Verify urgent requests through a known, separate channel.",
        "Do not open an attachment just because the message mentions a familiar organization.",
      ],
      takeaway: "Pause, inspect the sender, and verify the request before clicking or downloading.",
    },
  },
  {
    id: 4,
    title: "Password Pitfall",
    subtitle: "Choose the safer password",
    points: 120,
    skill: "Password safety",
    tool: "Security check",
    objective: "Choose the strongest password for the Robot Club account.",
    briefing:
      "The club account needs a new password after the suspicious update message. Review the available choices.",
    hint: "Compare the choices for length, predictability, and uniqueness.",
    manualTitle: "Strong passwords",
    manual:
      "Long and unique passwords are harder to guess. Avoid names, birthdays, teams, pets, and passwords reused on other accounts.",
    answer: "orbit-cactus-lantern-47!",
    placeholder: "Choose a password",
    lesson: {
      title: "Length and uniqueness beat clever substitutions",
      summary:
        "A long passphrase made from unrelated words gives an attacker far more possibilities to guess. Personal facts and common substitutions such as 0 for o are predictable, especially after public information is collected.",
      concepts: [
        "Use a different password for every account.",
        "A password manager can create and store long random passwords.",
        "Multi-factor authentication adds protection if a password is exposed.",
      ],
      takeaway: "Choose long, unique credentials and protect important accounts with MFA.",
    },
  },
  {
    id: 5,
    title: "Terminal Trail",
    subtitle: "Read Bolt's last log",
    points: 150,
    skill: "Command line",
    tool: "Terminal",
    objective: "Use the terminal to find Bolt's last known location.",
    briefing:
      "Bolt's safe training terminal contains a small set of files. Investigate it and report the robot's last known location.",
    hint: "Explore what is available in the terminal before trying to answer.",
    manualTitle: "Terminal command guide",
    manual:
      "Commands are short instructions typed after the prompt. Run one command at a time, read its output, and use what you learn to choose the next command.",
    manualSteps: [
      "Check which folder you are in.",
      "List the files in that folder.",
      "Read a promising text file by typing its exact name after cat.",
      "Enter the location from the log in the answer box.",
    ],
    manualCommands: [
      {
        command: "pwd",
        usage: "pwd",
        description: "Print the name of your current folder.",
      },
      {
        command: "ls",
        usage: "ls",
        description: "List the files available in the current folder.",
      },
      {
        command: "cat",
        usage: "cat filename.txt",
        description: "Print the contents of a file. Replace filename.txt with a listed file.",
      },
      {
        command: "clear",
        usage: "clear",
        description: "Clear the terminal screen without deleting any files.",
      },
    ],
    answer: "charging-station-4",
    placeholder: "Enter Bolt's location",
    lesson: {
      title: "Read-only terminal investigation",
      summary:
        "Command-line tools let analysts inspect systems precisely. In this mission, pwd identified the current folder, ls listed evidence, and cat displayed a text file without changing it.",
      concepts: [
        "Start by learning where you are and what files exist.",
        "Use the least-powerful command that answers your question.",
        "Read output carefully and keep evidence unchanged whenever possible.",
      ],
      takeaway: "Good investigators move step by step: locate, list, read, and document.",
    },
  },
  {
    id: 6,
    title: "Bring Bolt Home",
    subtitle: "Make the safe response",
    points: 200,
    skill: "Safe response",
    tool: "Control center",
    objective: "Choose the safe steps that bring Bolt back online.",
    briefing:
      "You found Bolt at Charging Station 4. Finish the case by choosing the response that protects the club account and restores Bolt safely.",
    hint: "Choose the response that addresses both the suspicious account activity and the update.",
    manualTitle: "Respond and recover",
    manual:
      "When an account may be at risk: stop, report the message, change the password through the real service, enable MFA, and ask a trusted adult or teacher.",
    answer: "report-reset-mfa-update",
    placeholder: "Choose the safe response",
    lesson: {
      title: "Recovery must remove the attacker’s advantage",
      summary:
        "Finding a device is not the end of an incident. A safe recovery reports the phishing attempt, resets exposed access through the real service, enables MFA, and installs only a verified update.",
      concepts: [
        "Contain the risky message or session before returning to normal.",
        "Use a trusted website or administrator—not links from the suspicious message.",
        "Recovery includes checking that the system is safe, not merely turning it back on.",
      ],
      takeaway: "Report, secure access, verify software, and only then restore service.",
    },
  },
  {
    id: 7,
    title: "The Look-Alike Link",
    subtitle: "Choose the real club website",
    points: 150,
    skill: "URL safety",
    tool: "Browser",
    objective: "Choose the real Robot Club website before signing in.",
    briefing:
      "Bolt is safe, but the fake update left several similar login links in the club bookmarks. Only one belongs to Robot Club.",
    hint: "Inspect every part of each web address, not just the familiar words.",
    manualTitle: "Reading a URL",
    manual:
      "The registered domain appears just before the first slash. Padlocks protect the connection, but they do not prove a website belongs to your school.",
    manualSteps: [
      "Find the first slash after https://.",
      "Read the domain before that slash from right to left.",
      "Treat words added after .school, .org, or .net as part of a different domain.",
      "Choose the address whose registered domain belongs to Robot Club.",
    ],
    answer: "robotclub.school",
    placeholder: "Choose the real website",
    lesson: {
      title: "The registered domain tells you who controls the site",
      summary:
        "Attackers place trusted words inside a longer address. The important part is the registered domain immediately before the path; words to its left are subdomains controlled by that domain owner.",
      concepts: [
        "Read hostnames from right to left before the first slash.",
        "HTTPS encrypts a connection but does not prove the site is honest.",
        "Use saved bookmarks or type a known address for important sign-ins.",
      ],
      takeaway: "Check the complete registered domain before entering a password.",
    },
  },
  {
    id: 8,
    title: "Permission Patrol",
    subtitle: "Limit a helper app",
    points: 150,
    skill: "App permissions",
    tool: "Tablet",
    objective: "Give the robot camera app only the permission it needs.",
    briefing:
      "The Bolt Badge Scanner reads printed QR badges and shows the matching booth number. Configure its permissions before installation.",
    hint: "Match each permission to a feature the app says it performs.",
    manualTitle: "Least privilege",
    manual:
      "Apps should receive only the permissions required for their job. Deny unrelated access and prefer “while using the app” when available.",
    manualSteps: [
      "List the app’s promised features: scan a printed code and show a booth number.",
      "Ask what hardware or personal data each feature truly needs.",
      "Select required permissions and leave unrelated permissions off.",
      "Use “while using the app” instead of “always” when possible.",
    ],
    answer: "camera",
    placeholder: "Configure the app permissions",
    lesson: {
      title: "Least privilege limits what can go wrong",
      summary:
        "Least privilege means giving an app only the access required for its stated job. A QR scanner needs the camera while scanning, but it does not need contacts, location, stored photos, or the microphone.",
      concepts: [
        "Connect every requested permission to a real feature.",
        "Prefer temporary access such as “while using the app.”",
        "Review and revoke permissions when an app no longer needs them.",
      ],
      takeaway: "Every unnecessary permission creates unnecessary privacy and security risk.",
    },
  },
  {
    id: 9,
    title: "Wi-Fi Impostor",
    subtitle: "Join the trusted network",
    points: 160,
    skill: "Wi-Fi safety",
    tool: "Network list",
    objective: "Connect the fair tablet to the trusted school network.",
    briefing:
      "Three nearly identical networks appear near Room 204. Identify the trusted school network.",
    hint: "Compare the network details against the setup note.",
    manualTitle: "Safer Wi-Fi",
    manual:
      "Attackers can copy familiar network names. Confirm the exact name with a trusted adult and avoid open networks for accounts or private information.",
    manualSteps: [
      "Open or read the details for every similar network.",
      "Compare the security type with the trusted setup note.",
      "Check who issued the network certificate.",
      "Choose only when both technical details match.",
    ],
    answer: "CQ-204-Secure",
    placeholder: "Choose the trusted network",
    lesson: {
      title: "A network name is not proof of identity",
      summary:
        "An evil-twin network copies a trusted Wi-Fi name to trick nearby devices. Signal strength and a familiar SSID are easy to imitate, so managed networks use stronger authentication and certificates.",
      concepts: [
        "Compare the exact SSID, security mode, and certificate issuer.",
        "Reject certificate warnings instead of clicking through them.",
        "Ask a trusted administrator when network details do not match the setup instructions.",
      ],
      takeaway: "Trust verified network details, not the strongest signal or most familiar name.",
    },
  },
  {
    id: 10,
    title: "Login Log Hunt",
    subtitle: "Find the repeated intruder",
    points: 180,
    skill: "Log analysis",
    tool: "Access logs",
    objective: "Find the IP address responsible for repeated failed logins.",
    briefing:
      "The club account is receiving login attempts. Read the access log and identify the address that failed several times in one minute.",
    hint: "Look for a source that appears repeatedly with the same failed result.",
    manualTitle: "Reading access logs",
    manual:
      "Security logs record events such as time, username, IP address, and result. Repeated failures from one source can be a sign of password guessing.",
    manualSteps: [
      "Read each row across: time, username, source IP, then result.",
      "Keep a small count of FAILED events for each IP.",
      "Do not treat one failed login followed by success as an attack by itself.",
      "Select the IP with a repeated pattern across the timeline.",
    ],
    answer: "203.0.113.42",
    placeholder: "Select the suspicious IP address",
    lesson: {
      title: "Logs become useful when events are correlated",
      summary:
        "One failed login is common and may be a typo. Repeated failures from the same source in a short window form a stronger pattern that could indicate password guessing.",
      concepts: [
        "Compare time, account, source, and result across multiple rows.",
        "A pattern is stronger evidence than one isolated event.",
        "An IP address identifies a network source, not automatically a specific person.",
      ],
      takeaway: "Use several related events to support a conclusion and avoid overclaiming.",
    },
  },
  {
    id: 11,
    title: "File Fingerprint",
    subtitle: "Catch the changed download",
    points: 200,
    skill: "File integrity",
    tool: "Hash checker",
    objective: "Compare the hashes and identify the file that was changed.",
    briefing:
      "The real school updater publishes a fingerprint for every approved file. One downloaded file has a different fingerprint.",
    hint: "Compare each approved fingerprint with its downloaded counterpart.",
    manualTitle: "Hashes as fingerprints",
    manual:
      "A cryptographic hash is a file fingerprint. If even a tiny part of a file changes, its hash should change too. Matching hashes help verify integrity.",
    manualSteps: [
      "Match each filename across the approved and downloaded columns.",
      "Compare the hash one group at a time from left to right.",
      "Do not judge a file by its name or type.",
      "Select the file whose two hashes differ.",
    ],
    answer: "bolt_update.zip",
    placeholder: "Select the changed file",
    lesson: {
      title: "Hashes check integrity",
      summary:
        "A cryptographic hash turns file contents into a fixed-length fingerprint. Changing even one small part should produce a different result, allowing defenders to detect corruption or tampering.",
      concepts: [
        "Compare against a hash obtained from a trusted source.",
        "A matching hash supports integrity; it does not prove the software is safe by itself.",
        "Never ignore a mismatch for an update or other important file.",
      ],
      takeaway: "A changed fingerprint means stop and investigate before opening or installing the file.",
    },
  },
  {
    id: 12,
    title: "Junior SOC Shift",
    subtitle: "Respond to the launch alert",
    points: 220,
    skill: "Incident response",
    tool: "Security console",
    objective: "Choose the response that contains the threat and safely restores launch.",
    briefing:
      "You are the junior analyst on duty. The console combines the phishing alert, failed logins, and changed update file into one incident.",
    hint: "Choose the response that preserves evidence and restores service from trusted sources.",
    manualTitle: "Incident response",
    manual:
      "A simple response flow is: identify, contain, recover, and learn. Do not erase evidence or keep using a file that failed an integrity check.",
    manualSteps: [
      "Identify what the evidence proves and what is still unknown.",
      "Contain the risky account or file without destroying logs.",
      "Recover with reset access and verified files.",
      "Report and document the incident so the team can prevent a repeat.",
    ],
    answer: "contain-reset-verify-report",
    placeholder: "Choose the complete incident response",
    lesson: {
      title: "Incident response is an evidence-driven cycle",
      summary:
        "A good response protects people and services while preserving enough evidence to understand what happened. Teams identify, contain, eradicate the cause, recover safely, and learn afterward.",
      concepts: [
        "Contain risky access without deleting the logs investigators need.",
        "Recover with known-good credentials, files, and validation checks.",
        "Document actions, communicate clearly, and improve defenses after the incident.",
      ],
      takeaway: "Contain first, preserve evidence, recover from trusted sources, and learn from the incident.",
    },
  },
];

const levelCards = [
  {
    id: 1,
    title: "Signal Lost",
    description: "Find Bolt before the science fair begins.",
    meta: "12 challenges · Beginner",
    unlocked: true,
    theme: "lab",
  },
  {
    id: 2,
    title: "The Copycat Account",
    description: "Track a fake profile across the school network.",
    meta: "8 challenges · Developing",
    unlocked: true,
    theme: "social",
  },
  {
    id: 3,
    title: "Library Lockout",
    description: "Recover the library system without losing its files.",
    meta: "8 challenges · Intermediate",
    unlocked: true,
    theme: "library",
  },
  {
    id: 4,
    title: "Festival Firewall",
    description: "Protect the science fair livestream.",
    meta: "8 challenges · Expert",
    unlocked: true,
    theme: "festival",
  },
];

const confettiPieces = Array.from({ length: 36 }, (_, index) => ({
  color: ["#35b96f", "#f6c445", "#2e74b5", "#ee6c5b", "#8b5cf6"][index % 5],
  delay: `${(index % 9) * 0.045}s`,
  duration: `${1.4 + (index % 6) * 0.12}s`,
  left: `${3 + ((index * 29) % 94)}%`,
  drift: `${-70 + ((index * 47) % 140)}px`,
  rotation: `${180 + ((index * 83) % 420)}deg`,
}));

const choiceChallengeIds = new Set([3, 4, 6, 7, 8, 9, 10, 11, 12]);

const choiceLabels: Record<string, string> = {
  sender: "Sender address selected",
  copy: "Email content selected",
  "robotclub.school": "robotclub.school selected",
  "robotclub-schools.org": "robotclub-schools.org selected",
  "robotclub.school.login-help.org": "login-help.org selected",
  "robot-club-school.example-login.net": "example-login.net selected",
  "CQ-204-Secure": "CQ-204-Secure selected",
  "CQ-204_Secure": "CQ-204_Secure selected",
  "CQ-204-Secure-5G": "CQ-204-Secure-5G selected",
  "198.51.100.18": "198.51.100.18 selected",
  "198.51.100.77": "198.51.100.77 selected",
  "192.0.2.15": "192.0.2.15 selected",
  "203.0.113.42": "203.0.113.42 selected",
  "slides.pdf": "slides.pdf selected",
  "schedule.csv": "schedule.csv selected",
  "poster.png": "poster.png selected",
  "readme.txt": "readme.txt selected",
  "bolt_firmware.bin": "bolt_firmware.bin selected",
  "bolt_update.zip": "bolt_update.zip selected",
  "contain-reset-verify-report": "Full incident response selected",
  "reset-and-clean": "Reset and clean up selected",
  "block-and-launch": "Block and launch selected",
};

const challengeGraphicLabels = [
  "ABOUT",
  "← TEXT",
  "@ MAIL",
  "••••",
  ">_",
  "✓ SAFE",
  "URL?",
  "ALLOW",
  "WI-FI",
  "LOG",
  "HASH",
  "SOC",
];

function challengeRank(id: number) {
  if (id <= 3) return "Foundation";
  if (id <= 6) return "Defender";
  if (id <= 9) return "Investigator";
  return "Junior Analyst";
}

function challengeRankClass(id: number) {
  if (id <= 3) return "foundation";
  if (id <= 6) return "defender";
  if (id <= 9) return "investigator";
  return "analyst";
}

function Icon({ name }: { name: string }) {
  const symbols: Record<string, string> = {
    website: "▣",
    message: "≡",
    email: "@",
    password: "●",
    terminal: ">_",
    control: "✓",
    lock: "⌁",
    check: "✓",
    star: "★",
    book: "▤",
    brief: "i",
    hint: "?",
  };
  return <span aria-hidden="true">{symbols[name] ?? "•"}</span>;
}

export default function Home() {
  const celebrationKey = useRef(0);
  const [view, setView] = useState<View>("levels");
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [activeChallengeId, setActiveChallengeId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [completedLevelTwo, setCompletedLevelTwo] = useState<number[]>([]);
  const [completedLevelThree, setCompletedLevelThree] = useState<number[]>([]);
  const [completedLevelFour, setCompletedLevelFour] = useState<number[]>([]);
  const [panel, setPanel] = useState<Panel>("briefing");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedPassword, setSelectedPassword] = useState("");
  const [selectedRecovery, setSelectedRecovery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "Cyber Quest training terminal",
    "No guided help is available during the challenge.",
  ]);
  const [celebration, setCelebration] = useState<{
    key: number;
    challengeId: number;
    flag: string;
  } | null>(null);

  const activeChallenge = challenges.find((item) => item.id === activeChallengeId)!;
  const activeIndex = challenges.findIndex((item) => item.id === activeChallengeId);
  const totalPoints = completed.reduce(
    (sum, id) => sum + (challenges.find((item) => item.id === id)?.points ?? 0),
    0,
  );
  const levelTwoPoints = completedLevelTwo.reduce(
    (sum, id) => sum + (levelTwoChallenges.find((item) => item.id === id)?.points ?? 0),
    0,
  );
  const levelThreePoints = completedLevelThree.reduce(
    (sum, id) => sum + (levelThreeChallenges.find((item) => item.id === id)?.points ?? 0),
    0,
  );
  const levelFourPoints = completedLevelFour.reduce(
    (sum, id) => sum + (levelFourChallenges.find((item) => item.id === id)?.points ?? 0),
    0,
  );
  const totalAvailablePoints = challenges.reduce(
    (sum, challenge) => sum + challenge.points,
    0,
  );
  const levelComplete = completed.length === challenges.length;
  const activeChallengeComplete = completed.includes(activeChallengeId);
  const progressPercent = Math.round(
    ((completed.length + completedLevelTwo.length + completedLevelThree.length + completedLevelFour.length) /
      (challenges.length + levelTwoChallenges.length + levelThreeChallenges.length + levelFourChallenges.length)) *
      100,
  );

  const nextUnlockedId = useMemo(() => {
    const firstIncomplete = challenges.find((challenge, index) => {
      if (completed.includes(challenge.id)) return false;
      return index === 0 || completed.includes(challenges[index - 1].id);
    });
    return firstIncomplete?.id ?? challenges.length;
  }, [completed]);

  function isUnlocked(id: number) {
    return challenges.some((challenge) => challenge.id === id);
  }

  function openLevel(levelId = activeLevelId) {
    setActiveLevelId(levelId);
    setView("challenge-grid");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openChallenge(id: number) {
    if (!isUnlocked(id)) return;
    setActiveChallengeId(id);
    setPanel("briefing");
    setAnswer("");
    setFeedback("");
    setSelectedPart("");
    setSelectedPassword("");
    setSelectedRecovery("");
    setSelectedOption("");
    setSelectedPermissions([]);
    setTerminalInput("");
    setTerminalLines([
      "Cyber Quest training terminal",
      "No guided help is available during the challenge.",
    ]);
    setView("challenge");
    window.scrollTo({ top: 0 });
  }

  function markComplete() {
    if (!completed.includes(activeChallengeId)) {
      setCompleted((current) => [...current, activeChallengeId]);
    }
    celebrationKey.current += 1;
    setCelebration({
      key: celebrationKey.current,
      challengeId: activeChallengeId,
      flag: activeChallenge.answer,
    });
    setFeedback(
      activeChallengeId === challenges.length
        ? "Level complete! Bolt is back online."
        : `Correct! Challenge ${activeChallengeId + 1} is now unlocked.`,
    );
  }

  function checkAnswer(submitted: string) {
    if (submitted.toLowerCase() === activeChallenge.answer.toLowerCase()) {
      markComplete();
      return;
    }

    setFeedback(
      choiceChallengeIds.has(activeChallengeId)
        ? "Not quite. Check the objective and try another choice."
        : "That answer does not match yet. Review the evidence and try again.",
    );
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted =
      activeChallengeId === 8
        ? [...selectedPermissions].sort().join(",")
        : activeChallengeId === 3
        ? selectedPart
        : activeChallengeId === 4
          ? selectedPassword
          : activeChallengeId === 6
            ? selectedRecovery
            : choiceChallengeIds.has(activeChallengeId)
              ? selectedOption
              : answer.trim();

    checkAnswer(submitted);
  }

  function chooseAnswer(
    value: string,
    select: (choice: string) => void,
  ) {
    select(value);
    if (activeChallengeId <= 6) {
      checkAnswer(value);
    } else {
      setFeedback("Choice selected. Review the evidence, then check your answer.");
    }
  }

  function togglePermission(permission: string) {
    setSelectedPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    );
    setFeedback("Permissions updated. Review the app’s needs, then check your answer.");
  }

  function goToAdjacent(direction: -1 | 1) {
    const target = activeIndex + direction;
    if (target < 0 || target >= challenges.length) return;
    if (!isUnlocked(challenges[target].id)) return;
    openChallenge(challenges[target].id);
  }

  function runTerminal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    if (!command) return;

    let response = "Command not found.";
    if (command === "help") {
      response = "Guided help is unavailable during the challenge.";
    } else if (command === "pwd") {
      response = "/training/bolt";
    } else if (command === "ls") {
      response = "bolt.txt   readme.txt";
    } else if (command === "cat bolt.txt") {
      response =
        "LAST SIGNAL: charging-station-4\nSTATUS: safe, offline\nNEXT STEP: report the fake update";
    } else if (command === "cat readme.txt") {
      response = "CASE NOTE: Inspect the other text file for Bolt's final signal.";
    } else if (command.startsWith("cat ")) {
      response = `cat: ${command.slice(4)}: No such file`;
    } else if (command === "clear") {
      setTerminalLines(["Terminal cleared."]);
      setTerminalInput("");
      return;
    }

    setTerminalLines((lines) => [...lines, `quest@lab:~$ ${terminalInput}`, response]);
    setTerminalInput("");
  }

  return (
    <main className="cq-app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {celebration && (
        <div className="success-celebration" key={celebration.key}>
          <div className="confetti-burst" aria-hidden="true">
            {confettiPieces.map((piece, index) => (
              <i
                key={index}
                style={
                  {
                    "--confetti-color": piece.color,
                    "--confetti-delay": piece.delay,
                    "--confetti-duration": piece.duration,
                    "--confetti-left": piece.left,
                    "--confetti-drift": piece.drift,
                    "--confetti-rotation": piece.rotation,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <section className="flag-notification" role="status" aria-live="assertive">
            <button
              className="flag-close"
              onClick={() => setCelebration(null)}
              aria-label="Close success notification"
            >
              ×
            </button>
            <span className="flag-check" aria-hidden="true">
              ✓
            </span>
            <div>
              <small>CHALLENGE {celebration.challengeId} COMPLETE</small>
              <strong>Flag captured!</strong>
              <code>{celebration.flag}</code>
            </div>
            <button
              className="flag-continue"
              onClick={() => {
                const nextId = celebration.challengeId + 1;
                setCelebration(null);
                if (nextId <= challenges.length) {
                  openChallenge(nextId);
                } else {
                  setView("challenge-grid");
                }
              }}
            >
              {celebration.challengeId < challenges.length
                ? "Next challenge →"
                : "View completed level"}
            </button>
          </section>
        </div>
      )}

      {view !== "challenge" && (
        <header className="cq-header">
          <button
            className="cq-brand"
            onClick={() => setView("levels")}
            aria-label="Cyber Quest home"
          >
            <span className="cq-logo">CQ</span>
            <span>
              <strong>CYBER QUEST</strong>
              <small>LEARN. SOLVE. PROTECT.</small>
            </span>
          </button>

          <nav aria-label="Primary navigation">
            <button
              className={view === "levels" ? "active" : ""}
              onClick={() => setView("levels")}
            >
              Levels
            </button>
            <button
              className={view === "challenge-grid" ? "active" : ""}
              onClick={() => openLevel(activeLevelId)}
            >
              Level {activeLevelId}
            </button>
          </nav>

          <div className="header-stats">
            <span>
              <Icon name="star" />
              <strong>{totalPoints + levelTwoPoints + levelThreePoints + levelFourPoints}</strong> points
            </span>
            <div className="profile-dot">N</div>
          </div>
        </header>
      )}

      {view === "levels" && (
        <section className="levels-view" id="main-content">
          <div className="page-heading">
            <div>
              <p className="kicker">CYBER QUEST ACADEMY</p>
              <h1>Choose a level</h1>
              <p>All four levels are open for free exploration.</p>
            </div>
            <div className="overall-progress">
              <span>Overall progress</span>
              <strong>{progressPercent}%</strong>
              <div>
                <i style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="level-grid">
            {levelCards.map((level) => (
              <article
                className={`level-card ${level.unlocked ? "unlocked" : "locked"}`}
                key={level.id}
              >
                <div className={`level-art ${level.theme}`}>
                  <span className="room-floor" />
                  <span className="room-desk" />
                  <span className="room-screen">{level.id === 1 ? ">_" : "•"}</span>
                  <span className="room-person">
                    <i />
                  </span>
                  <span className="room-prop" />
                  {!level.unlocked && (
                    <span className="large-lock">
                      <Icon name="lock" />
                    </span>
                  )}
                </div>
                <div className="level-card-body">
                  <div className="level-number">LEVEL {level.id}</div>
                  <div>
                    <h2>{level.title}</h2>
                    <p>{level.description}</p>
                    <small>{level.meta}</small>
                  </div>
                  <button disabled={!level.unlocked} onClick={() => openLevel(level.id)}>
                    {level.unlocked ? "Go to level" : "Locked"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "challenge-grid" && activeLevelId === 1 && (
        <section className="challenge-grid-view" id="main-content">
          <div className="level-banner">
            <button className="back-link" onClick={() => setView("levels")}>
              ← All levels
            </button>
            <div className="level-banner-copy">
              <div>
                <p className="kicker">LEVEL 1 · BEGINNER</p>
                <h1>Signal Lost</h1>
                <p>
                  Bolt disappeared one hour before the school science fair. Follow twelve clues
                  to find the robot, secure the club account, and protect the launch.
                </p>
                <div className="rank-track" aria-label="Challenge skill progression">
                  <span>Foundation</span>
                  <i>→</i>
                  <span>Defender</span>
                  <i>→</i>
                  <span>Investigator</span>
                  <i>→</i>
                  <span>Junior Analyst</span>
                </div>
              </div>
              <div className="level-score">
                <span>{completed.length} / {challenges.length} complete</span>
                <strong>{totalPoints} / {totalAvailablePoints} points</strong>
                <div>
                  <i style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="challenge-section-heading">
            <div>
              <h2>Challenges</h2>
              <p>All 12 challenges are open. Play them in any order.</p>
            </div>
            <span className="story-status">
              {levelComplete ? "Story complete" : "Free explore · all challenges open"}
            </span>
          </div>

          <div className="challenge-card-grid">
            {challenges.map((challenge, index) => {
              const unlocked = isUnlocked(challenge.id);
              const done = completed.includes(challenge.id);
              const isReady = challenge.id === nextUnlockedId && !done;
              return (
                <button
                  className={`challenge-card ${done ? "complete" : ""} ${isReady ? "ready" : ""}`}
                  key={challenge.id}
                  disabled={!unlocked}
                  onClick={() => openChallenge(challenge.id)}
                >
                  <div className="challenge-card-top">
                    <span className="challenge-index">
                      {done ? <Icon name="check" /> : String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="challenge-points">+{challenge.points} pts</span>
                  </div>
                  <div className={`challenge-graphic graphic-${challenge.id}`}>
                    <div className="mini-window">
                      <span />
                      <span />
                      <span />
                      <strong>{challengeGraphicLabels[challenge.id - 1]}</strong>
                    </div>
                  </div>
                  <div className="challenge-card-copy">
                    <div className="challenge-labels">
                      <span>{challenge.skill}</span>
                      <em className={`rank-${challengeRankClass(challenge.id)}`}>
                        {challengeRank(challenge.id)}
                      </em>
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
      )}

      {view === "challenge-grid" && activeLevelId === 2 && (
        <LevelTwoGrid
          completed={completedLevelTwo}
          onBack={() => setView("levels")}
          onOpen={(id) => {
            setActiveChallengeId(id);
            setView("challenge");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "challenge-grid" && activeLevelId === 3 && (
        <LevelThreeGrid
          completed={completedLevelThree}
          onBack={() => setView("levels")}
          onOpen={(id) => {
            setActiveChallengeId(id);
            setView("challenge");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "challenge-grid" && activeLevelId === 4 && (
        <LevelFourGrid
          completed={completedLevelFour}
          onBack={() => setView("levels")}
          onOpen={(id) => {
            setActiveChallengeId(id);
            setView("challenge");
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "challenge" && activeLevelId === 1 && (
        <section className="challenge-workspace" id="main-content">
          <aside className="challenge-sidebar">
            <div className="sidebar-top">
              <button className="round-back" onClick={() => setView("challenge-grid")}>
                ←
                <span className="sr-only">Back to challenge grid</span>
              </button>
              <div>
                <h1>{activeChallenge.title}</h1>
                <p>
                  L1 C{String(activeChallenge.id).padStart(2, "0")} · {activeChallenge.tool} ·{" "}
                  {challengeRank(activeChallenge.id)}
                </p>
              </div>
            </div>

            <div className="points-row">
              <span>Worth</span>
              <strong>
                <Icon name="star" /> {activeChallenge.points} points
              </strong>
            </div>

            <div className="sidebar-tabs" role="tablist" aria-label="Challenge information">
              <button
                role="tab"
                aria-selected={panel === "briefing"}
                className={panel === "briefing" ? "active" : ""}
                onClick={() => setPanel("briefing")}
              >
                <Icon name="brief" />
                Briefing
              </button>
              <button
                role="tab"
                aria-selected={panel === "manual"}
                className={panel === "manual" ? "active" : ""}
                onClick={() => setPanel("manual")}
              >
                <Icon name="book" />
                Field manual
              </button>
              <button
                role="tab"
                aria-selected={panel === "hint"}
                className={panel === "hint" ? "active" : ""}
                onClick={() => setPanel("hint")}
              >
                <Icon name="hint" />
                Hint
              </button>
            </div>

            <div className="sidebar-info" role="tabpanel">
              <span>
                {panel === "briefing"
                  ? "Mission briefing"
                  : panel === "manual"
                    ? "Post-challenge lesson"
                    : "Hint"}
              </span>
              {panel === "briefing" && <p>{activeChallenge.briefing}</p>}
              {panel === "hint" && <p>{activeChallenge.hint}</p>}
              {panel === "manual" && (
                <section
                  className={`mini-lesson ${activeChallengeComplete ? "unlocked" : "locked"}`}
                  aria-label="Post-challenge cyber mini-lesson"
                >
                  <div className="mini-lesson-heading">
                    <span>{activeChallengeComplete ? "LESSON UNLOCKED" : "LOCKED UNTIL SOLVED"}</span>
                    <strong>Cyber mini-lesson</strong>
                  </div>
                  {activeChallengeComplete ? (
                    <>
                      <h3>{activeChallenge.lesson.title}</h3>
                      <p>{activeChallenge.lesson.summary}</p>
                      <h4>What you learned</h4>
                      <ul>
                        {activeChallenge.lesson.concepts.map((concept) => (
                          <li key={concept}>{concept}</li>
                        ))}
                      </ul>
                      <div className="lesson-takeaway">
                        <strong>Remember</strong>
                        <p>{activeChallenge.lesson.takeaway}</p>
                      </div>
                    </>
                  ) : (
                    <p className="lesson-locked-copy">
                      Solve this challenge to unlock the lesson explaining the real cybersecurity
                      idea behind it.
                    </p>
                  )}
                </section>
              )}
              <div className="objective-box">
                <strong>Your task</strong>
                <p>{activeChallenge.objective}</p>
              </div>
            </div>

            <form className="answer-form" onSubmit={submitAnswer}>
              <label htmlFor="challenge-answer">
                {activeChallengeId === 8
                  ? "Selected permissions"
                  : choiceChallengeIds.has(activeChallengeId)
                    ? "Your choice"
                    : "Your answer"}
              </label>
              {choiceChallengeIds.has(activeChallengeId) ? (
                <div className="selection-status" id="challenge-answer">
                  {activeChallengeId === 3
                    ? choiceLabels[selectedPart] || "Nothing selected yet"
                    : activeChallengeId === 4
                      ? selectedPassword || "Nothing selected yet"
                      : activeChallengeId === 6
                        ? selectedRecovery
                          ? "Response selected"
                          : "Nothing selected yet"
                        : activeChallengeId === 8
                          ? selectedPermissions.length
                            ? `${selectedPermissions.length} permission${
                                selectedPermissions.length === 1 ? "" : "s"
                              } selected`
                            : "No permissions selected"
                        : choiceLabels[selectedOption] || "Nothing selected yet"}
                </div>
              ) : (
                <input
                  id="challenge-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder={activeChallenge.placeholder}
                  autoComplete="off"
                />
              )}
              <button className="submit-answer" type="submit">
                Check answer ↵
              </button>
              <p
                className={`answer-feedback ${
                  feedback.startsWith("Correct") || feedback.startsWith("Level") ? "success" : ""
                }`}
                aria-live="polite"
              >
                {feedback || "You can try as many times as you need."}
              </p>
            </form>

            <div className="challenge-nav">
              <button disabled={activeIndex === 0} onClick={() => goToAdjacent(-1)}>
                ← Previous
              </button>
              <button
                disabled={
                  activeIndex === challenges.length - 1 ||
                  !isUnlocked(challenges[activeIndex + 1]?.id)
                }
                onClick={() => goToAdjacent(1)}
              >
                Next →
              </button>
            </div>
          </aside>

          <div className="challenge-main">
            <div className="challenge-stage-heading">
              <div>
                <span>
                  CHALLENGE {activeChallenge.id} OF {challenges.length} ·{" "}
                  {challengeRank(activeChallenge.id)}
                </span>
                <h2>{activeChallenge.objective}</h2>
              </div>
              <button onClick={() => setView("challenge-grid")}>View all challenges</button>
            </div>

            {activeChallengeId === 1 && (
              <div className="browser-frame profile-challenge">
                <BrowserBar url="https://robotclub.school/members/riley" />
                <div className="profile-page">
                  <div className="profile-banner" />
                  <div className="profile-avatar">R</div>
                  <h3>Riley Chen</h3>
                  <span className="profile-role">Robot Club Captain</span>
                  <div className="profile-columns">
                    <section>
                      <h4>About me</h4>
                      <p>
                        I build tiny robots, repair old keyboards, and never miss the school
                        science fair.
                      </p>
                      <h4>Robot Club</h4>
                      <p>
                        Bolt’s launch team meets every Thursday in Lab 3.
                      </p>
                      <p className="hidden-contact">
                        Club contact: riley@robotclub.school
                      </p>
                    </section>
                    <section>
                      <h4>Current project</h4>
                      <div className="project-chip">BOLT · HELPER ROBOT</div>
                      <p>Status: preparing for the science fair</p>
                      <p>Favorite command: keep learning</p>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 2 && (
              <div className="browser-frame message-challenge">
                <BrowserBar url="https://schoolboard.example/robot-club" />
                <div className="message-board">
                  <div className="board-brand">
                    <span>Q</span>
                    <strong>SchoolBoard</strong>
                  </div>
                  <article className="message-post">
                    <div className="post-author">
                      <span>R</span>
                      <div>
                        <strong>Riley · Robot Club</strong>
                        <small>Posted 15 minutes ago</small>
                      </div>
                    </div>
                    <p className="reversed-message">
                      3BAL si edoc eht .noos tob rof kool ot baL eht ta teeM
                    </p>
                    <div className="post-actions">Reply · Save · Share</div>
                  </article>
                </div>
              </div>
            )}

            {activeChallengeId === 3 && (
              <div className="browser-frame email-challenge">
                <BrowserBar url="https://mail.robotclub.school/inbox/42" />
                <div className="mail-app">
                  <div className="mail-nav">
                    <strong>Mail</strong>
                    <span>Inbox 4</span>
                    <span>Starred</span>
                    <span>Sent</span>
                  </div>
                  <article className="email-paper">
                    <header>
                      <span className="mail-logo">U</span>
                      <div>
                        <h3>URGENT: Bolt requires an update</h3>
                        <button
                          className={selectedPart === "sender" ? "selected-evidence" : ""}
                          onClick={() => chooseAnswer("sender", setSelectedPart)}
                        >
                          School IT &lt;updates@robotcIub.school&gt;
                          <span>Click to select</span>
                        </button>
                      </div>
                    </header>
                    <button
                      className={`email-copy ${selectedPart === "copy" ? "selected-evidence" : ""}`}
                      onClick={() => chooseAnswer("copy", setSelectedPart)}
                    >
                      Hello Robot Club,
                      <br />
                      <br />
                      Bolt will shut down unless you install our emergency update now. Open the
                      attached file and enter the club password.
                    </button>
                    <div className="fake-attachment">bolt_update.zip · 4.2 MB</div>
                  </article>
                </div>
              </div>
            )}

            {activeChallengeId === 4 && (
              <div className="browser-frame password-challenge">
                <BrowserBar url="https://security.robotclub.school/password-check" />
                <div className="password-page">
                  <div className="shield-mark">✓</div>
                  <h3>Robot Club password check</h3>
                  <div className="password-options">
                    {[
                      "Bolt2026",
                      "RobotClub123",
                      "RileyBirthday!",
                      "orbit-cactus-lantern-47!",
                    ].map((option) => (
                      <button
                        key={option}
                        className={selectedPassword === option ? "selected" : ""}
                        onClick={() => chooseAnswer(option, setSelectedPassword)}
                      >
                        <span>{option}</span>
                        <i>{selectedPassword === option ? "✓" : ""}</i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 5 && (
              <div className="terminal-challenge">
                <div className="terminal-titlebar">
                  <span>
                    <i />
                    <i />
                    <i />
                  </span>
                  CYBER QUEST TERMINAL · TRAINING MODE
                  <strong>SAFE</strong>
                </div>
                <div className="terminal-body" aria-live="polite">
                  {terminalLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>
                <form className="terminal-command" onSubmit={runTerminal}>
                  <label htmlFor="terminal-input">quest@lab:~$</label>
                  <input
                    id="terminal-input"
                    autoFocus
                    autoComplete="off"
                    value={terminalInput}
                    onChange={(event) => setTerminalInput(event.target.value)}
                  />
                  <button type="submit">Run</button>
                </form>
              </div>
            )}

            {activeChallengeId === 6 && (
              <div className="browser-frame recovery-challenge">
                <BrowserBar url="https://control.robotclub.school/recovery" />
                <div className="recovery-page">
                  <div className="bolt-status">
                    <div className="robot-head">
                      <i />
                      <i />
                      <span />
                    </div>
                    <div>
                      <span>BOLT · CHARGING STATION 4</span>
                      <h3>Offline, but safe</h3>
                      <p>Choose the safest recovery plan.</p>
                    </div>
                  </div>
                  <div className="recovery-options">
                    {[
                      {
                        value: "click-update",
                        title: "Open the email attachment",
                        copy: "Install the update and keep the old password.",
                      },
                      {
                        value: "ignore-message",
                        title: "Ignore everything",
                        copy: "Turn Bolt back on without reporting the message.",
                      },
                      {
                        value: "report-reset-mfa-update",
                        title: "Report, reset, protect, update",
                        copy: "Report the email, change the password, enable MFA, and use the real school updater.",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={selectedRecovery === option.value ? "selected" : ""}
                        onClick={() => chooseAnswer(option.value, setSelectedRecovery)}
                      >
                        <i>{selectedRecovery === option.value ? "✓" : ""}</i>
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.copy}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                  {levelComplete && (
                    <div className="level-complete-banner">
                      <Icon name="star" />
                      <div>
                        <strong>Level 1 complete</strong>
                        <span>Bolt is online and the science fair can begin.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeChallengeId === 7 && (
              <div className="browser-frame url-challenge">
                <BrowserBar url="browser://bookmarks/robot-club" />
                <div className="url-lab">
                  <div className="url-lab-heading">
                    <span className="url-shield">URL</span>
                    <div>
                      <small>BOOKMARK SAFETY CHECK</small>
                      <h3>Which website really belongs to Robot Club?</h3>
                    </div>
                  </div>
                  <div className="url-options">
                    {[
                      {
                        value: "robotclub.school.login-help.org",
                        label: "Bookmark A",
                        protocol: "https://",
                        domain: "robotclub.school.login-help.org",
                        path: "/club/signin",
                      },
                      {
                        value: "robotclub.school",
                        label: "Bookmark B",
                        protocol: "https://",
                        domain: "portal.robotclub.school",
                        path: "/account",
                      },
                      {
                        value: "robotclub-schools.org",
                        label: "Bookmark C",
                        protocol: "https://",
                        domain: "robotclub-schools.org",
                        path: "/members/login",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={selectedOption === option.value ? "selected" : ""}
                        onClick={() => chooseAnswer(option.value, setSelectedOption)}
                      >
                        <span className="url-option-label">{option.label}</span>
                        <code>
                          <i>{option.protocol}</i>
                          <strong>{option.domain}</strong>
                          <em>{option.path}</em>
                        </code>
                        <small>Click to choose this domain</small>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 8 && (
              <div className="device-stage permission-challenge">
                <div className="tablet-shell">
                  <div className="tablet-camera" />
                  <div className="tablet-screen">
                    <div className="tablet-status">
                      <span>9:42</span>
                      <span>Robot Club Tablet · 82%</span>
                    </div>
                    <div className="permission-app">
                      <span className="scanner-icon">B</span>
                      <div>
                        <small>NEW APP</small>
                        <h3>Bolt Badge Scanner</h3>
                        <p>Configure each permission before installing.</p>
                      </div>
                    </div>
                    <div className="permission-requirements">
                      <strong>APP DESCRIPTION</strong>
                      <ul>
                        <li>Scans printed QR badges using the tablet</li>
                        <li>Shows a booth number already stored inside the app</li>
                        <li>Does not record audio, display maps, or message club members</li>
                      </ul>
                    </div>
                    <div className="permission-options">
                      {[
                        {
                          value: "camera",
                          title: "Camera",
                          copy: "Take photos and video while the app is open.",
                          badge: "HARDWARE",
                        },
                        {
                          value: "microphone",
                          title: "Microphone",
                          copy: "Record audio while the app is open.",
                          badge: "HARDWARE",
                        },
                        {
                          value: "location",
                          title: "Precise location",
                          copy: "Read the tablet’s exact physical location.",
                          badge: "PERSONAL DATA",
                        },
                        {
                          value: "contacts",
                          title: "Contacts",
                          copy: "Read names and contact information.",
                          badge: "PERSONAL DATA",
                        },
                        {
                          value: "photos",
                          title: "Photos and videos",
                          copy: "Read media already saved on the tablet.",
                          badge: "FILES",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={selectedPermissions.includes(option.value) ? "selected" : ""}
                          aria-pressed={selectedPermissions.includes(option.value)}
                          onClick={() => togglePermission(option.value)}
                        >
                          <i>{selectedPermissions.includes(option.value) ? "✓" : ""}</i>
                          <span>
                            <small>{option.badge}</small>
                            <strong>{option.title}</strong>
                            <em>{option.copy}</em>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 9 && (
              <div className="network-stage wifi-challenge">
                <div className="wifi-card">
                  <div className="wifi-heading">
                    <span className="wifi-mark">)))</span>
                    <div>
                      <small>AVAILABLE NETWORKS</small>
                      <h3>Choose a network</h3>
                      <p>
                        Setup note: <strong>Room 204 · WPA3-Enterprise · district-it.school</strong>
                      </p>
                    </div>
                  </div>
                  <div className="wifi-list">
                    {[
                      {
                        value: "CQ-204_Secure",
                        security: "WPA2-Personal",
                        certificate: "Certificate: none",
                        strength: 4,
                      },
                      {
                        value: "CQ-204-Secure-5G",
                        security: "WPA3-Enterprise",
                        certificate: "Certificate: district-login.school",
                        strength: 4,
                      },
                      {
                        value: "CQ-204-Secure",
                        security: "WPA3-Enterprise",
                        certificate: "Certificate: district-it.school",
                        strength: 3,
                      },
                    ].map((network) => (
                      <button
                        key={network.value}
                        className={selectedOption === network.value ? "selected" : ""}
                        onClick={() => chooseAnswer(network.value, setSelectedOption)}
                      >
                        <span className="signal-bars" aria-hidden="true">
                          {Array.from({ length: 4 }, (_, index) => (
                            <i className={index < network.strength ? "on" : ""} key={index} />
                          ))}
                        </span>
                        <span>
                          <strong>{network.value}</strong>
                          <small>{network.security}</small>
                          <small>{network.certificate}</small>
                        </span>
                        <em>DETAILS</em>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 10 && (
              <div className="log-stage analyst-challenge">
                <div className="analyst-window">
                  <div className="analyst-titlebar">
                    <span>
                      <i />
                      <i />
                      <i />
                    </span>
                    ACCESS.LOG · ROBOT CLUB AUTH
                    <strong>LIVE</strong>
                  </div>
                  <div className="log-summary">
                    <div>
                      <small>AUTHENTICATION TIMELINE</small>
                      <strong>12 chronological events</strong>
                    </div>
                    <p>Select a row to investigate its source IP.</p>
                  </div>
                  <div className="log-columns" aria-hidden="true">
                    <span>TIME</span>
                    <span>USERNAME</span>
                    <span>SOURCE IP</span>
                    <span>RESULT</span>
                  </div>
                  <div className="log-rows">
                    {[
                      {
                        time: "09:51:02",
                        user: "riley",
                        ip: "198.51.100.18",
                        result: "SUCCESS",
                      },
                      {
                        time: "09:51:13",
                        user: "robot-club",
                        ip: "203.0.113.42",
                        result: "FAILED",
                      },
                      {
                        time: "09:51:25",
                        user: "teacher",
                        ip: "192.0.2.15",
                        result: "SUCCESS",
                      },
                      {
                        time: "09:51:37",
                        user: "robot-club",
                        ip: "203.0.113.42",
                        result: "FAILED",
                      },
                      {
                        time: "09:51:54",
                        user: "riley",
                        ip: "198.51.100.18",
                        result: "SUCCESS",
                      },
                      {
                        time: "09:52:19",
                        user: "visitor",
                        ip: "198.51.100.77",
                        result: "FAILED",
                      },
                      {
                        time: "09:52:31",
                        user: "robot-club",
                        ip: "203.0.113.42",
                        result: "FAILED",
                      },
                      {
                        time: "09:52:58",
                        user: "teacher",
                        ip: "192.0.2.15",
                        result: "FAILED",
                      },
                      {
                        time: "09:53:10",
                        user: "robot-club",
                        ip: "203.0.113.42",
                        result: "FAILED",
                      },
                      {
                        time: "09:53:26",
                        user: "riley",
                        ip: "198.51.100.18",
                        result: "SUCCESS",
                      },
                      {
                        time: "09:53:40",
                        user: "teacher",
                        ip: "192.0.2.15",
                        result: "SUCCESS",
                      },
                      {
                        time: "09:54:05",
                        user: "visitor",
                        ip: "198.51.100.77",
                        result: "SUCCESS",
                      },
                    ].map((row) => (
                      <button
                        key={`${row.time}-${row.ip}`}
                        className={selectedOption === row.ip ? "selected" : ""}
                        onClick={() => chooseAnswer(row.ip, setSelectedOption)}
                      >
                        <time>{row.time}</time>
                        <span>{row.user}</span>
                        <code>{row.ip}</code>
                        <em>{row.result}</em>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 11 && (
              <div className="hash-stage analyst-challenge">
                <div className="hash-window">
                  <div className="hash-heading">
                    <span>#</span>
                    <div>
                      <small>SHA-256 INTEGRITY CHECK</small>
                      <h3>Compare approved and downloaded fingerprints</h3>
                    </div>
                  </div>
                  <div className="hash-legend">
                    <span>FILE</span>
                    <span>APPROVED HASH</span>
                    <span>DOWNLOADED HASH</span>
                  </div>
                  <div className="hash-files">
                    {[
                      {
                        value: "slides.pdf",
                        approved: "91a7-d22e-4c10",
                        downloaded: "91a7-d22e-4c10",
                      },
                      {
                        value: "schedule.csv",
                        approved: "8f00-c12a-71de",
                        downloaded: "8f00-c12a-71de",
                      },
                      {
                        value: "bolt_update.zip",
                        approved: "b731-8e23-0fa2",
                        downloaded: "b731-8e23-9c44",
                      },
                      {
                        value: "poster.png",
                        approved: "cc09-721e-31a8",
                        downloaded: "cc09-721e-31a8",
                      },
                      {
                        value: "bolt_firmware.bin",
                        approved: "4d22-a891-8e9b",
                        downloaded: "4d22-a891-8e9b",
                      },
                      {
                        value: "readme.txt",
                        approved: "10ce-55f0-2b77",
                        downloaded: "10ce-55f0-2b77",
                      },
                    ].map((file) => (
                      <button
                        key={file.value}
                        className={selectedOption === file.value ? "selected" : ""}
                        onClick={() => chooseAnswer(file.value, setSelectedOption)}
                      >
                        <span>
                          <i>FILE</i>
                          <strong>{file.value}</strong>
                        </span>
                        <code>
                          <i>APPROVED</i>
                          {file.approved}
                        </code>
                        <code>
                          <i>DOWNLOADED</i>
                          {file.downloaded}
                        </code>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 12 && (
              <div className="soc-stage final-challenge">
                <div className="soc-console">
                  <div className="launch-heading">
                    <div className="launch-badge">SOC</div>
                    <div>
                      <small>INCIDENT CQ-012 · ACTIVE</small>
                      <h3>Science Fair launch alert</h3>
                      <p>Review the evidence, then choose the safest response.</p>
                    </div>
                    <span className="launch-time">SEVERITY · MEDIUM</span>
                  </div>
                  <div className="evidence-strip">
                    <article>
                      <span>01</span>
                      <div>
                        <small>EMAIL GATEWAY</small>
                        <strong>Look-alike sender blocked</strong>
                      </div>
                    </article>
                    <article>
                      <span>02</span>
                      <div>
                        <small>AUTH LOG</small>
                        <strong>4 failed logins · same IP</strong>
                      </div>
                    </article>
                    <article>
                      <span>03</span>
                      <div>
                        <small>FILE CHECK</small>
                        <strong>Update hash mismatch</strong>
                      </div>
                    </article>
                  </div>
                  <div className="response-label">CHOOSE YOUR RESPONSE PLAYBOOK</div>
                  <div className="launch-options">
                    {[
                      {
                        value: "reset-and-clean",
                        title: "Reset and clean up",
                        steps: [
                          "Reset the club password",
                          "Delete failed-login logs after noting the IP",
                          "Scan the downloaded update, then launch",
                        ],
                      },
                      {
                        value: "block-and-launch",
                        title: "Block and launch",
                        steps: [
                          "Block the repeated source IP",
                          "Keep existing sessions signed in",
                          "Skip the changed update and launch now",
                        ],
                      },
                      {
                        value: "contain-reset-verify-report",
                        title: "Contain, reset, verify, report",
                        steps: [
                          "Pause login and save the logs",
                          "Reset access and use verified files",
                          "Report, recover, and document",
                        ],
                      },
                    ].map((option, index) => (
                      <button
                        key={option.value}
                        className={selectedOption === option.value ? "selected" : ""}
                        onClick={() => chooseAnswer(option.value, setSelectedOption)}
                      >
                        <span className="plan-number">0{index + 1}</span>
                        <strong>{option.title}</strong>
                        <ul>
                          {option.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                  {levelComplete && (
                    <div className="final-complete-banner">
                      <Icon name="star" />
                      <div>
                        <strong>Level 1 complete · Junior Analyst earned</strong>
                        <span>Bolt is online, the incident is contained, and the fair can begin.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {view === "challenge" && activeLevelId === 2 && (
        <LevelTwoWorkspace
          key={activeChallengeId}
          activeId={activeChallengeId}
          completed={completedLevelTwo}
          setCompleted={setCompletedLevelTwo}
          onBack={() => setView("challenge-grid")}
          onNavigate={(id) => {
            setActiveChallengeId(id);
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "challenge" && activeLevelId === 3 && (
        <LevelThreeWorkspace
          key={activeChallengeId}
          activeId={activeChallengeId}
          completed={completedLevelThree}
          setCompleted={setCompletedLevelThree}
          onBack={() => setView("challenge-grid")}
          onNavigate={(id) => {
            setActiveChallengeId(id);
            window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "challenge" && activeLevelId === 4 && (
        <LevelFourWorkspace
          key={activeChallengeId}
          activeId={activeChallengeId}
          completed={completedLevelFour}
          setCompleted={setCompletedLevelFour}
          onBack={() => setView("challenge-grid")}
          onNavigate={(id) => {
            setActiveChallengeId(id);
            window.scrollTo({ top: 0 });
          }}
        />
      )}
    </main>
  );
}

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="browser-bar">
      <span className="browser-dots">
        <i />
        <i />
        <i />
      </span>
      <div className="address-bar">
        <span>▣</span>
        {url}
      </div>
    </div>
  );
}
