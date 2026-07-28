"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type ChallengeStep = "briefing" | "inspect" | "terminal" | "complete";

const clues = [
  {
    id: "sender",
    label: "Odd sender",
    detail: "The address says beacon-pr1zes, not Beacon Bay.",
  },
  {
    id: "rush",
    label: "Pressure words",
    detail: "“RIGHT NOW” tries to rush you before you can think.",
  },
  {
    id: "link",
    label: "Tricky link",
    detail: "The display text and the real destination do not match.",
  },
  {
    id: "secret",
    label: "Asks for a secret",
    detail: "Real helpers never ask you to send a password.",
  },
];

const missions = [
  { number: "01", title: "The Phantom Prize", skill: "Spot a phish", state: "active" },
  { number: "02", title: "Passphrase Forge", skill: "Build strong passwords", state: "next" },
  { number: "03", title: "Two Keys at Twilight", skill: "Use MFA", state: "locked" },
  { number: "04", title: "The Update Express", skill: "Update safely", state: "locked" },
];

export default function Home() {
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [step, setStep] = useState<ChallengeStep>("briefing");
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [command, setCommand] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "Signal Shell v1.0 — training sandbox",
    "Type help to see safe commands.",
  ]);
  const [scanned, setScanned] = useState(false);
  const blueprintRef = useRef<HTMLElement>(null);

  const clueCount = foundClues.length;
  const missionProgress = useMemo(() => {
    if (step === "complete") return 100;
    if (step === "terminal") return 72;
    if (step === "inspect") return 28 + clueCount * 9;
    return 12;
  }, [step, clueCount]);

  function openChallenge() {
    setChallengeOpen(true);
    setStep("briefing");
    setFoundClues([]);
    setHintOpen(false);
    setCommand("");
    setScanned(false);
    setTerminalLines([
      "Signal Shell v1.0 — training sandbox",
      "Type help to see safe commands.",
    ]);
  }

  function toggleClue(id: string) {
    setFoundClues((current) =>
      current.includes(id) ? current.filter((clue) => clue !== id) : [...current, id],
    );
  }

  function runCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = command.trim().toLowerCase();
    if (!value) return;

    let response = "Command not found. Type help.";
    if (value === "help") {
      response = "Commands: scan message.eml · inspect link · report · clear";
    } else if (value === "scan message.eml") {
      response =
        "SCAN: 4 warning signs found — look-alike sender, urgency, hidden link, password request.";
      setScanned(true);
    } else if (value === "inspect link") {
      response =
        "LINK: beacon-bay-gifts.example → not an official beaconbay.school address. Do not open it.";
    } else if (value === "report") {
      if (scanned) {
        setTerminalLines((lines) => [...lines, `scout@signal:~$ ${command}`, "REPORT SENT: Pip is safe!"]);
        setCommand("");
        window.setTimeout(() => setStep("complete"), 350);
        return;
      }
      response = "Scan the message first so your report includes evidence.";
    } else if (value === "clear") {
      setTerminalLines(["Signal Shell cleared. Type help for commands."]);
      setCommand("");
      return;
    }

    setTerminalLines((lines) => [...lines, `scout@signal:~$ ${command}`, response]);
    setCommand("");
  }

  return (
    <main>
      <a className="skip-link" href="#mission-map">
        Skip to mission map
      </a>

      <header className="topbar">
        <button className="brand" aria-label="Cipher Scouts home">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span>
            <strong>CIPHER SCOUTS</strong>
            <small>BEACON BAY DIVISION</small>
          </span>
        </button>

        <nav aria-label="Primary">
          <a className="nav-active" href="#mission-map">
            Mission map
          </a>
          <button onClick={() => setGuideOpen(true)}>Field guide</button>
          <button onClick={() => blueprintRef.current?.scrollIntoView({ behavior: "smooth" })}>
            Project blueprint
          </button>
        </nav>

        <div className="top-actions">
          <button
            className="icon-button"
            onClick={() => setSoundOn((value) => !value)}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            aria-pressed={soundOn}
          >
            {soundOn ? "♪" : "×"}
          </button>
          <div className="agent-chip">
            <span className="avatar" aria-hidden="true">
              LS
            </span>
            <span>
              <small>SCOUT</small>
              <strong>Nova</strong>
            </span>
          </div>
        </div>
      </header>

      <section className="game-shell" id="mission-map">
        <aside className="story-rail" aria-label="Current story">
          <p className="eyebrow">CASE FILE 01</p>
          <h1>Something strange is humming beneath Beacon Bay.</h1>
          <p>
            The school festival opens tonight—but a fake prize message is bouncing through the
            town network. Find its warning signs before Pip the robot mascot clicks.
          </p>

          <div className="briefing-note">
            <span className="mentor-face" aria-hidden="true">
              M
            </span>
            <div>
              <strong>Mira, Signal Keeper</strong>
              <p>“Great scouts slow down, look closely, and protect their crew.”</p>
            </div>
          </div>

          <button className="primary-button" onClick={openChallenge}>
            Start mission <span aria-hidden="true">→</span>
          </button>
          <p className="safe-note">Training sandbox · No real accounts or websites</p>
        </aside>

        <div className="map-stage" aria-label="Illustrated map of Beacon Bay">
          <div className="map-sky">
            <span className="cloud cloud-one" />
            <span className="cloud cloud-two" />
            <span className="signal-moon">⌁</span>
          </div>
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="bay" />
          <div className="building school">
            <span>BEACON SCHOOL</span>
            <i />
          </div>
          <div className="building library">
            <span>BYTE LIBRARY</span>
            <i />
          </div>
          <div className="lighthouse">
            <i />
            <span />
          </div>
          <button className="mission-pin active-pin" onClick={openChallenge}>
            <span className="pin-pulse" />
            <strong>01</strong>
            <small>PHANTOM PRIZE</small>
          </button>
          <button className="mission-pin locked-pin" aria-label="Mission 2 locked">
            <strong>02</strong>
            <small>LOCKED</small>
          </button>
          <div className="map-label">BEACON BAY</div>
          <div className="map-compass" aria-hidden="true">
            N
          </div>
        </div>

        <aside className="progress-rail" aria-label="Mission progress">
          <div className="rank-card">
            <div className="rank-top">
              <span>RANK 01</span>
              <strong>120 XP</strong>
            </div>
            <div className="rank-bar">
              <span style={{ width: "36%" }} />
            </div>
            <small>80 XP to Trailblazer</small>
          </div>

          <div className="mission-list">
            <div className="section-title">
              <span>BEACON BAY</span>
              <small>1 / 4</small>
            </div>
            {missions.map((mission) => (
              <button
                key={mission.number}
                className={`mission-row ${mission.state}`}
                onClick={mission.state === "active" ? openChallenge : undefined}
                disabled={mission.state === "locked"}
              >
                <span className="mission-number">{mission.number}</span>
                <span>
                  <strong>{mission.title}</strong>
                  <small>{mission.skill}</small>
                </span>
                <i aria-hidden="true">{mission.state === "locked" ? "•" : "›"}</i>
              </button>
            ))}
          </div>

          <div className="toolkit-card">
            <div>
              <span className="tool-icon" aria-hidden="true">
                ?
              </span>
              <span>
                <strong>Need a clue?</strong>
                <small>The Field Guide teaches, never spoils.</small>
              </span>
            </div>
            <button onClick={() => setGuideOpen(true)}>Open guide</button>
          </div>
        </aside>
      </section>

      <section className="blueprint" ref={blueprintRef} id="blueprint">
        <div className="blueprint-heading">
          <div>
            <p className="eyebrow">PRODUCT VISION & PLAN</p>
            <h2>A mystery series where digital safety becomes a superpower.</h2>
          </div>
          <p>
            Cipher Scouts is designed for grades 4–8: story-first for younger learners,
            authentic tools for older learners, and enough scaffolding for a first cyber
            experience.
          </p>
        </div>

        <div className="blueprint-grid">
          <article className="vision-card">
            <span className="card-index">01</span>
            <h3>The promise</h3>
            <p>
              “I can recognize risky moments online, explain what makes them risky, and choose
              a safer next step.”
            </p>
          </article>
          <article className="vision-card">
            <span className="card-index">02</span>
            <h3>The play loop</h3>
            <p>Story beat → investigate → try a tool → get feedback → explain the safe choice.</p>
          </article>
          <article className="vision-card">
            <span className="card-index">03</span>
            <h3>The first season</h3>
            <p>
              Phishing, passwords, MFA, software updates, privacy, kind communication, and
              beginner command-line thinking.
            </p>
          </article>
          <article className="vision-card">
            <span className="card-index">04</span>
            <h3>Success signal</h3>
            <p>
              Learners complete a mission, name the warning signs, and transfer the lesson to
              a new scenario without a hint.
            </p>
          </article>
        </div>

        <div className="mvp-strip">
          <div>
            <p className="eyebrow">PLAYABLE MVP</p>
            <h3>One world. Six missions. Three ways to learn.</h3>
          </div>
          <ul>
            <li>
              <strong>Mission map</strong>
              <span>Visible progress and story choices</span>
            </li>
            <li>
              <strong>Challenge engine</strong>
              <span>Messages, websites, puzzles, and safe terminal tasks</span>
            </li>
            <li>
              <strong>Field guide</strong>
              <span>Concept cards, hints, and end-of-mission reflection</span>
            </li>
            <li>
              <strong>Educator view</strong>
              <span>Skill mastery, attempts, and where help was used</span>
            </li>
          </ul>
        </div>
      </section>

      <footer>
        <strong>CIPHER SCOUTS</strong>
        <span>Original educational game concept · Demo build</span>
        <button onClick={openChallenge}>Replay mission 01</button>
      </footer>

      {guideOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setGuideOpen(false)}>
          <section
            className="guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="close-button" onClick={() => setGuideOpen(false)} aria-label="Close">
              ×
            </button>
            <p className="eyebrow">FIELD GUIDE · MESSAGE SAFETY</p>
            <h2 id="guide-title">The four-second pause</h2>
            <p className="guide-intro">
              Before you tap a surprising message, pause and check four things.
            </p>
            <div className="guide-grid">
              {[
                ["1", "Who sent it?", "Look closely at the full address, not only the name."],
                ["2", "How does it feel?", "Scams often use panic, pressure, or prizes."],
                ["3", "Where does it go?", "A link can hide a different destination."],
                ["4", "What does it ask?", "Passwords and codes should stay secret."],
              ].map(([number, title, copy]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <button className="primary-button" onClick={() => setGuideOpen(false)}>
              Back to the case
            </button>
          </section>
        </div>
      )}

      {challengeOpen && (
        <div className="challenge-layer" role="dialog" aria-modal="true" aria-label="Mission 01">
          <header className="challenge-header">
            <button
              className="challenge-brand"
              onClick={() => setChallengeOpen(false)}
              aria-label="Exit mission"
            >
              <span>←</span> EXIT CASE
            </button>
            <div className="challenge-title">
              <small>CASE 01</small>
              <strong>THE PHANTOM PRIZE</strong>
            </div>
            <div className="challenge-progress">
              <span style={{ width: `${missionProgress}%` }} />
            </div>
            <button className="guide-shortcut" onClick={() => setGuideOpen(true)}>
              ? FIELD GUIDE
            </button>
          </header>

          <div className={`challenge-content step-${step}`}>
            {step === "briefing" && (
              <section className="briefing-screen">
                <div className="pip-portrait" aria-hidden="true">
                  <div className="antenna" />
                  <div className="robot-face">
                    <i />
                    <i />
                    <span />
                  </div>
                  <div className="robot-body">PIP</div>
                </div>
                <div className="briefing-copy">
                  <p className="eyebrow">INCOMING FROM MIRA</p>
                  <h2>Pip got a message promising a rare festival badge.</h2>
                  <p>
                    It says the prize disappears in five minutes and asks for Pip’s password.
                    Your mission: inspect the message, collect evidence, and report it safely.
                  </p>
                  <div className="objective-list">
                    <span>
                      <b>1</b> Find at least 3 warning signs
                    </span>
                    <span>
                      <b>2</b> Scan the message in Signal Shell
                    </span>
                    <span>
                      <b>3</b> Report it without opening the link
                    </span>
                  </div>
                  <button className="primary-button" onClick={() => setStep("inspect")}>
                    Open evidence
                  </button>
                </div>
              </section>
            )}

            {step === "inspect" && (
              <section className="inspect-screen">
                <div className="task-instructions">
                  <p className="eyebrow">STEP 1 OF 2 · INSPECT</p>
                  <h2>Tap the parts that feel suspicious.</h2>
                  <p>Find at least three warning signs. You can change your choices.</p>
                  <div className="clue-counter">
                    <span>{clueCount} / 4 clues</span>
                    <div>
                      {[0, 1, 2, 3].map((item) => (
                        <i key={item} className={clueCount > item ? "found" : ""} />
                      ))}
                    </div>
                  </div>
                  <button className="text-button" onClick={() => setHintOpen((value) => !value)}>
                    {hintOpen ? "Hide hint" : "Give me a hint"}
                  </button>
                  {hintOpen && (
                    <p className="hint-box">
                      Read the sender one character at a time. Then notice how the message makes
                      you feel.
                    </p>
                  )}
                </div>

                <div className="message-card">
                  <div className="message-toolbar">
                    <span>New message</span>
                    <i>•••</i>
                  </div>
                  <button
                    className={`inspectable sender ${foundClues.includes("sender") ? "selected" : ""}`}
                    onClick={() => toggleClue("sender")}
                  >
                    <span className="mail-avatar">B</span>
                    <span>
                      <strong>Beacon Bay Prize Team</strong>
                      <small>prizes@beacon-pr1zes.example</small>
                    </span>
                    <i>{foundClues.includes("sender") ? "✓" : "+"}</i>
                  </button>
                  <div className="message-body">
                    <p>Hi Pip,</p>
                    <button
                      className={`inspectable inline ${foundClues.includes("rush") ? "selected" : ""}`}
                      onClick={() => toggleClue("rush")}
                    >
                      YOU WON! Claim your ultra-rare festival badge RIGHT NOW. It disappears in
                      five minutes!
                      <i>{foundClues.includes("rush") ? "✓" : "+"}</i>
                    </button>
                    <button
                      className={`inspectable fake-link ${foundClues.includes("link") ? "selected" : ""}`}
                      onClick={() => toggleClue("link")}
                    >
                      beaconbay.school/claim-prize
                      <i>{foundClues.includes("link") ? "✓" : "+"}</i>
                    </button>
                    <button
                      className={`inspectable inline ${foundClues.includes("secret") ? "selected" : ""}`}
                      onClick={() => toggleClue("secret")}
                    >
                      Reply with your password so we can check that it is really you.
                      <i>{foundClues.includes("secret") ? "✓" : "+"}</i>
                    </button>
                    <p>Hurry!<br />The Prize Crew</p>
                  </div>
                  <div className="message-footer">
                    <span>Safety tip: selecting evidence does not open the link.</span>
                    <button
                      className="primary-button"
                      disabled={clueCount < 3}
                      onClick={() => setStep("terminal")}
                    >
                      Send to Signal Shell
                    </button>
                  </div>
                </div>

                <aside className="evidence-tray">
                  <p className="eyebrow">EVIDENCE</p>
                  {foundClues.length === 0 ? (
                    <p className="empty-evidence">Your clues will appear here.</p>
                  ) : (
                    foundClues.map((id) => {
                      const clue = clues.find((item) => item.id === id)!;
                      return (
                        <div className="evidence-item" key={id}>
                          <span>✓</span>
                          <div>
                            <strong>{clue.label}</strong>
                            <p>{clue.detail}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </aside>
              </section>
            )}

            {step === "terminal" && (
              <section className="terminal-screen">
                <div className="terminal-brief">
                  <p className="eyebrow">STEP 2 OF 2 · VERIFY</p>
                  <h2>Give the evidence one last safe check.</h2>
                  <p>
                    Use the Signal Shell training terminal. Start with{" "}
                    <code>scan message.eml</code>, then type <code>report</code>.
                  </p>
                  <div className="mission-rule">
                    <strong>Scout rule</strong>
                    <p>This terminal only works inside our pretend training world.</p>
                  </div>
                </div>
                <div className="terminal-window">
                  <div className="terminal-toolbar">
                    <span>
                      <i /> <i /> <i />
                    </span>
                    <strong>SIGNAL SHELL · TRAINING SANDBOX</strong>
                    <span>SAFE MODE</span>
                  </div>
                  <div className="terminal-output" aria-live="polite">
                    {terminalLines.map((line, index) => (
                      <p key={`${line}-${index}`}>{line}</p>
                    ))}
                  </div>
                  <form onSubmit={runCommand} className="terminal-input">
                    <label htmlFor="signal-command">scout@signal:~$</label>
                    <input
                      id="signal-command"
                      autoFocus
                      autoComplete="off"
                      value={command}
                      onChange={(event) => setCommand(event.target.value)}
                      aria-label="Signal Shell command"
                    />
                    <button type="submit">RUN</button>
                  </form>
                  <div className="command-chips">
                    {["help", "scan message.eml", "inspect link", "report"].map((item) => (
                      <button key={item} onClick={() => setCommand(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {step === "complete" && (
              <section className="complete-screen">
                <div className="badge-burst" aria-hidden="true">
                  <span>★</span>
                </div>
                <p className="eyebrow">MISSION COMPLETE</p>
                <h2>Pip is safe—and Beacon Bay has a new phishing expert.</h2>
                <p>
                  You paused, checked the sender, noticed the pressure, inspected the link, and
                  kept the password secret.
                </p>
                <div className="reward-row">
                  <div>
                    <span>+120</span>
                    <small>XP EARNED</small>
                  </div>
                  <div>
                    <span>4 / 4</span>
                    <small>CLUES FOUND</small>
                  </div>
                  <div>
                    <span>NEW</span>
                    <small>PHISH FINDER BADGE</small>
                  </div>
                </div>
                <div className="reflection-card">
                  <strong>Take it into the real world</strong>
                  <p>
                    If a message surprises or rushes you, stop. Ask a trusted adult or teacher
                    before you tap, reply, or share a secret.
                  </p>
                </div>
                <div className="complete-actions">
                  <button className="secondary-button" onClick={openChallenge}>
                    Replay case
                  </button>
                  <button className="primary-button" onClick={() => setChallengeOpen(false)}>
                    Return to Beacon Bay
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
