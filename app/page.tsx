"use client";

import { type CSSProperties, FormEvent, useMemo, useState } from "react";

type View = "levels" | "challenge-grid" | "challenge";
type Panel = "briefing" | "manual" | "hint";

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
  answer: string;
  placeholder: string;
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
    hint: "Drag your mouse across the blank-looking sentence under “Robot Club.”",
    manualTitle: "Hidden text",
    manual:
      "A webpage can contain text that blends into its background. Selecting the page reveals the letters without changing the page.",
    answer: "riley@robotclub.school",
    placeholder: "Enter the hidden email",
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
      "Riley sent a quick update before Bolt disappeared. The post looks scrambled, but the letters follow a simple pattern.",
    hint: "Read the message from the final character back to the first. The code is the last word after reversing it.",
    manualTitle: "Reversing text",
    manual:
      "Reversing is not encryption. It simply changes the order of characters. Start at the end and work toward the beginning.",
    answer: "LAB3",
    placeholder: "Enter the room code",
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
    hint: "Compare the sender's address with the real school address shown in the email footer.",
    manualTitle: "Look-alike domains",
    manual:
      "Scammers change one letter in a trusted address. Read the full domain slowly before opening a link or attachment.",
    answer: "sender",
    placeholder: "Select the suspicious detail",
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
      "The fake update tried to guess the club password. Pick the option that is long, unique, and does not use club information.",
    hint: "The strongest choice is the long phrase made from unrelated words and symbols.",
    manualTitle: "Strong passwords",
    manual:
      "Long and unique passwords are harder to guess. Avoid names, birthdays, teams, pets, and passwords reused on other accounts.",
    answer: "orbit-cactus-lantern-47!",
    placeholder: "Choose a password",
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
      "Bolt's safe training terminal contains one log file. List the files, open the log, and enter the location as your answer.",
    hint: "Type “ls” to list files. Then type “cat bolt.txt” to read the log.",
    manualTitle: "Two terminal commands",
    manual:
      "The “ls” command lists files. The “cat filename” command prints a text file. These commands only run in this training window.",
    answer: "charging-station-4",
    placeholder: "Enter Bolt's location",
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
    hint: "Report the fake message, change the password, turn on MFA, and use the real school update system.",
    manualTitle: "Respond and recover",
    manual:
      "When an account may be at risk: stop, report the message, change the password through the real service, enable MFA, and ask a trusted adult or teacher.",
    answer: "report-reset-mfa-update",
    placeholder: "Choose the safe response",
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
      "Bolt is safe, but the fake update left a login link in the club bookmarks. Compare both addresses and choose the real school domain.",
    hint: "Read from the end of each domain. The real address ends exactly in robotclub.school.",
    manualTitle: "Reading a URL",
    manual:
      "The registered domain appears just before the first slash. Padlocks protect the connection, but they do not prove a website belongs to your school.",
    answer: "robotclub.school",
    placeholder: "Choose the real website",
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
      "A new camera controller wants access to almost everything on the club tablet. Bolt only needs it to scan science-fair badges.",
    hint: "A badge scanner needs the camera while you use it—not contacts, messages, or your location.",
    manualTitle: "Least privilege",
    manual:
      "Apps should receive only the permissions required for their job. Deny unrelated access and prefer “while using the app” when available.",
    answer: "camera-while-using",
    placeholder: "Choose the safest permissions",
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
      "Three networks appear near the science fair. One is the protected school network; the others could expose club traffic.",
    hint: "Use the exact network name posted by the teacher and choose the one marked secured.",
    manualTitle: "Safer Wi-Fi",
    manual:
      "Attackers can copy familiar network names. Confirm the exact name with a trusted adult and avoid open networks for accounts or private information.",
    answer: "CQ-School-Secure",
    placeholder: "Choose the trusted network",
  },
  {
    id: 10,
    title: "Photo Footprints",
    subtitle: "Remove hidden location data",
    points: 160,
    skill: "Metadata privacy",
    tool: "Photo share",
    objective: "Share the Bolt photo without revealing its exact location.",
    briefing:
      "The team wants to post a victory photo. Its hidden details include where and when the picture was taken.",
    hint: "Keep the photo, but remove the exact GPS location before posting it publicly.",
    manualTitle: "Photo metadata",
    manual:
      "Photos can store device, time, and GPS details. Review or remove location metadata before sharing an image publicly.",
    answer: "remove-location",
    placeholder: "Choose a privacy-safe share option",
  },
  {
    id: 11,
    title: "Shifted Schedule",
    subtitle: "Decode the final meetup",
    points: 180,
    skill: "Simple ciphers",
    tool: "Decoder",
    objective: "Shift each letter back five places and enter the message.",
    briefing:
      "Riley protected the final setup time with a simple letter shift. Decode it so the club arrives before the doors open.",
    hint: "R becomes M, J becomes E, and Y becomes T. Keep the spaces in the message.",
    manualTitle: "Caesar shifts",
    manual:
      "A Caesar shift moves every letter by the same number of places. It is useful for puzzles, but it is not secure encryption.",
    answer: "MEET AT NOON",
    placeholder: "Enter the decoded message",
  },
  {
    id: 12,
    title: "Science Fair Shield",
    subtitle: "Lock down the launch",
    points: 220,
    skill: "Security planning",
    tool: "Launch checklist",
    objective: "Choose the complete plan that keeps the fair launch safe.",
    briefing:
      "The doors open in minutes. Use everything you learned to finish Bolt’s security checklist and launch the science fair safely.",
    hint: "Verify the real updater, install approved updates, back up the project, and lock unattended devices.",
    manualTitle: "Defense in layers",
    manual:
      "Good security uses several layers: trusted sources, current software, recoverable backups, strong account protection, and locked devices.",
    answer: "verify-update-backup-lock",
    placeholder: "Choose the complete launch plan",
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
    meta: "Coming next · Beginner",
    unlocked: false,
    theme: "social",
  },
  {
    id: 3,
    title: "Library Lockout",
    description: "Recover the library system without losing its files.",
    meta: "Locked · Intermediate",
    unlocked: false,
    theme: "library",
  },
  {
    id: 4,
    title: "Festival Firewall",
    description: "Protect the science fair livestream.",
    meta: "Locked · Intermediate",
    unlocked: false,
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

const choiceChallengeIds = new Set([3, 4, 6, 7, 8, 9, 10, 12]);

const choiceLabels: Record<string, string> = {
  sender: "Sender address selected",
  copy: "Email content selected",
  "robotclub.school": "robotclub.school selected",
  "robot-club-school.example-login.net": "example-login.net selected",
  "camera-while-using": "Camera only · while using selected",
  "camera-contacts-location": "Camera, contacts, and location selected",
  "allow-everything": "Allow everything selected",
  "CQ-School-Secure": "CQ-School-Secure selected",
  "CQ_School_Free": "CQ_School_Free selected",
  "ScienceFair-Guest": "ScienceFair-Guest selected",
  "remove-location": "Remove exact location selected",
  "share-all-details": "Share all hidden details selected",
  "blur-only": "Blur the background selected",
  "verify-update-backup-lock": "Complete launch plan selected",
  "skip-backup": "Fast launch plan selected",
  "reuse-email-update": "Email attachment plan selected",
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
  "EXIF",
  "A→F",
  "SHIELD",
];

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
    hint: "?",
    brief: "i",
  };
  return <span aria-hidden="true">{symbols[name] ?? "•"}</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("levels");
  const [activeChallengeId, setActiveChallengeId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [panel, setPanel] = useState<Panel>("briefing");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedPassword, setSelectedPassword] = useState("");
  const [selectedRecovery, setSelectedRecovery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [hiddenRevealed, setHiddenRevealed] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "Cyber Quest training terminal",
    "Type help if you need the available commands.",
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
  const totalAvailablePoints = challenges.reduce(
    (sum, challenge) => sum + challenge.points,
    0,
  );
  const levelComplete = completed.length === challenges.length;
  const progressPercent = Math.round((completed.length / challenges.length) * 100);

  const nextUnlockedId = useMemo(() => {
    const firstIncomplete = challenges.find((challenge, index) => {
      if (completed.includes(challenge.id)) return false;
      return index === 0 || completed.includes(challenges[index - 1].id);
    });
    return firstIncomplete?.id ?? challenges.length;
  }, [completed]);

  function isUnlocked(id: number) {
    return id === 1 || completed.includes(id - 1);
  }

  function openLevel() {
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
    setHiddenRevealed(false);
    setTerminalInput("");
    setTerminalLines([
      "Cyber Quest training terminal",
      "Type help if you need the available commands.",
    ]);
    setView("challenge");
    window.scrollTo({ top: 0 });
  }

  function markComplete() {
    if (!completed.includes(activeChallengeId)) {
      setCompleted((current) => [...current, activeChallengeId]);
    }
    setCelebration({
      key: Date.now(),
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
        : "That answer does not match yet. Check the challenge or open a hint.",
    );
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted =
      activeChallengeId === 3
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
    checkAnswer(value);
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

    let response = "Command not found. Type help.";
    if (command === "help") {
      response = "Available commands: ls · cat bolt.txt · clear";
    } else if (command === "ls") {
      response = "bolt.txt   readme.txt";
    } else if (command === "cat bolt.txt") {
      response =
        "LAST SIGNAL: charging-station-4\nSTATUS: safe, offline\nNEXT STEP: report the fake update";
    } else if (command === "cat readme.txt") {
      response = "Training files only. Try reading bolt.txt.";
    } else if (command === "clear") {
      setTerminalLines(["Terminal cleared. Type help for commands."]);
      setTerminalInput("");
      return;
    }

    setTerminalLines((lines) => [...lines, `quest@lab:~$ ${terminalInput}`, response]);
    setTerminalInput("");
  }

  const panelCopy =
    panel === "briefing"
      ? activeChallenge.briefing
      : panel === "manual"
        ? activeChallenge.manual
        : activeChallenge.hint;

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
              onClick={openLevel}
            >
              Level 1
            </button>
          </nav>

          <div className="header-stats">
            <span>
              <Icon name="star" />
              <strong>{totalPoints}</strong> points
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
              <p>Start with Level 1. New levels unlock as you finish each story.</p>
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
                  <button disabled={!level.unlocked} onClick={openLevel}>
                    {level.unlocked ? "Go to level" : "Locked"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "challenge-grid" && (
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
              <p>Finish a challenge to unlock the next one.</p>
            </div>
            <span className="story-status">
              {levelComplete ? "Story complete" : `Challenge ${nextUnlockedId} is ready`}
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
                    {!unlocked && (
                      <div className="card-lock">
                        <Icon name="lock" />
                        <small>Finish challenge {challenge.id - 1}</small>
                      </div>
                    )}
                  </div>
                  <div className="challenge-card-copy">
                    <span>{challenge.skill}</span>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.subtitle}</p>
                    <strong>{done ? "Replay challenge" : isReady ? "Start challenge" : "Locked"}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {view === "challenge" && (
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
                  L1 C{String(activeChallenge.id).padStart(2, "0")} · {activeChallenge.tool}
                </p>
              </div>
            </div>

            <div className="points-row">
              <span>Worth</span>
              <strong>
                <Icon name="star" /> {activeChallenge.points} points
              </strong>
            </div>

            <div className="sidebar-tabs" role="tablist" aria-label="Challenge help">
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
                  ? "Instructions"
                  : panel === "manual"
                    ? activeChallenge.manualTitle
                    : "Hint"}
              </span>
              <p>{panelCopy}</p>
              <div className="objective-box">
                <strong>Your task</strong>
                <p>{activeChallenge.objective}</p>
              </div>
            </div>

            <form className="answer-form" onSubmit={submitAnswer}>
              <label htmlFor="challenge-answer">
                {choiceChallengeIds.has(activeChallengeId)
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
                <span>CHALLENGE {activeChallenge.id} OF {challenges.length}</span>
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
                  <button
                    className="select-page-button"
                    onClick={() => setHiddenRevealed(true)}
                  >
                    Select page text
                  </button>
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
                      <p className={`hidden-contact ${hiddenRevealed ? "revealed" : ""}`}>
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
                  <div className="decode-note">
                    <strong>Pattern check</strong>
                    <p>The final word looks like “LAB3” backwards.</p>
                  </div>
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
                    <footer>
                      Real school IT address: <strong>updates@robotclub.school</strong>
                    </footer>
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
                  <p>Choose the password that is hardest to guess and unique to this account.</p>
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
                <div className="terminal-shortcuts">
                  {["help", "ls", "cat bolt.txt"].map((command) => (
                    <button key={command} onClick={() => setTerminalInput(command)}>
                      {command}
                    </button>
                  ))}
                </div>
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
                      <p>Both use HTTPS. Inspect the complete domain before choosing.</p>
                    </div>
                  </div>
                  <div className="url-options">
                    {[
                      {
                        value: "robot-club-school.example-login.net",
                        label: "Shared in the update email",
                        protocol: "https://",
                        domain: "robot-club-school.example-login.net",
                        path: "/signin",
                      },
                      {
                        value: "robotclub.school",
                        label: "Saved by Ms. Alvarez",
                        protocol: "https://",
                        domain: "robotclub.school",
                        path: "/members",
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
                  <div className="url-tip">
                    <strong>Remember:</strong> a padlock means the connection is encrypted—not
                    that the website is trustworthy.
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
                        <p>Choose what this app can use.</p>
                      </div>
                    </div>
                    <div className="permission-options">
                      {[
                        {
                          value: "camera-while-using",
                          title: "Camera · while using the app",
                          copy: "No contacts, messages, microphone, or location.",
                          badge: "MINIMUM",
                        },
                        {
                          value: "camera-contacts-location",
                          title: "Camera, contacts, and precise location",
                          copy: "Allow access every time the tablet is on.",
                          badge: "EXTRA ACCESS",
                        },
                        {
                          value: "allow-everything",
                          title: "Allow every permission",
                          copy: "Let the app decide what it needs later.",
                          badge: "FULL ACCESS",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={selectedOption === option.value ? "selected" : ""}
                          onClick={() => chooseAnswer(option.value, setSelectedOption)}
                        >
                          <i>{selectedOption === option.value ? "✓" : ""}</i>
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
                      <p>Teacher’s network card: <strong>CQ-School-Secure</strong></p>
                    </div>
                  </div>
                  <div className="wifi-list">
                    {[
                      {
                        value: "CQ_School_Free",
                        security: "Open · no password",
                        strength: 3,
                      },
                      {
                        value: "CQ-School-Secure",
                        security: "Secured · school certificate",
                        strength: 4,
                      },
                      {
                        value: "ScienceFair-Guest",
                        security: "Open · sign-in page",
                        strength: 4,
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
                        </span>
                        <em>{network.security.startsWith("Secured") ? "LOCKED" : "OPEN"}</em>
                      </button>
                    ))}
                  </div>
                  <div className="network-warning">
                    Network names can be copied. Match every character with a trusted source.
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 10 && (
              <div className="photo-stage metadata-challenge">
                <div className="photo-preview">
                  <div className="photo-sky" />
                  <div className="photo-floor" />
                  <div className="photo-bolt">
                    <i />
                    <i />
                    <span />
                  </div>
                  <strong>BOLT IS BACK!</strong>
                </div>
                <div className="metadata-panel">
                  <small>PUBLIC POST PREVIEW</small>
                  <h3>Review hidden photo details</h3>
                  <div className="metadata-list">
                    <span>
                      <i>DEVICE</i>
                      Club Tablet 4
                    </span>
                    <span>
                      <i>TAKEN</i>
                      Today · 9:48 AM
                    </span>
                    <span className="sensitive">
                      <i>GPS</i>
                      39.9517, -75.1912 · Science Lab entrance
                    </span>
                  </div>
                  <div className="metadata-options">
                    {[
                      {
                        value: "share-all-details",
                        title: "Post with all details",
                        copy: "Keep the device, time, and exact GPS location.",
                      },
                      {
                        value: "blur-only",
                        title: "Blur the background",
                        copy: "Change the picture but keep its hidden GPS details.",
                      },
                      {
                        value: "remove-location",
                        title: "Remove exact location",
                        copy: "Keep the photo, but strip its GPS details before posting.",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={selectedOption === option.value ? "selected" : ""}
                        onClick={() => chooseAnswer(option.value, setSelectedOption)}
                      >
                        <i>{selectedOption === option.value ? "✓" : ""}</i>
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.copy}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChallengeId === 11 && (
              <div className="decoder-stage cipher-challenge">
                <div className="decoder-header">
                  <span>ROT</span>
                  <div>
                    <small>RILEY’S SHIFT DECODER</small>
                    <h3>Move every letter back 5 places</h3>
                  </div>
                </div>
                <div className="cipher-message">RJJY FY STTS</div>
                <div className="shift-example">
                  <span>
                    <i>ENCRYPTED</i>
                    F G H I J K L M N O P Q R S T U V W X Y Z A B C D E
                  </span>
                  <span>
                    <i>ORIGINAL</i>
                    A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                  </span>
                </div>
                <div className="decoder-clues">
                  <span>
                    <strong>R → M</strong>
                    move back five
                  </span>
                  <span>
                    <strong>J → E</strong>
                    repeat letters
                  </span>
                  <span>
                    <strong>Y → T</strong>
                    preserve spaces
                  </span>
                </div>
                <p>Enter the full decoded message in the answer box.</p>
              </div>
            )}

            {activeChallengeId === 12 && (
              <div className="launch-stage final-challenge">
                <div className="launch-heading">
                  <div className="launch-badge">CQ</div>
                  <div>
                    <small>SCIENCE FAIR · FINAL READINESS CHECK</small>
                    <h3>Choose Bolt’s launch plan</h3>
                    <p>One plan protects the project before, during, and after launch.</p>
                  </div>
                  <span className="launch-time">T− 08:00</span>
                </div>
                <div className="launch-options">
                  {[
                    {
                      value: "reuse-email-update",
                      title: "Use the fastest update",
                      steps: [
                        "Open the update from the email",
                        "Reuse the club password",
                        "Leave tablets unlocked",
                      ],
                    },
                    {
                      value: "skip-backup",
                      title: "Launch now, protect later",
                      steps: [
                        "Skip the backup to save time",
                        "Join any available Wi-Fi",
                        "Update after the fair",
                      ],
                    },
                    {
                      value: "verify-update-backup-lock",
                      title: "Verify, update, back up, lock",
                      steps: [
                        "Use the real school updater",
                        "Back up the Bolt project",
                        "Lock unattended devices",
                      ],
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={selectedOption === option.value ? "selected" : ""}
                      onClick={() => chooseAnswer(option.value, setSelectedOption)}
                    >
                      <span className="plan-number">0{option.value === "reuse-email-update" ? 1 : option.value === "skip-backup" ? 2 : 3}</span>
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
                      <strong>Level 1 complete · 12 / 12</strong>
                      <span>Bolt is online, the club is protected, and the fair can begin.</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
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
