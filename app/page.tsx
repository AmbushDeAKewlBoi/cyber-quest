"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  type Challenge,
  type Level,
  levels,
  totalChallengeCount,
  totalPointsForLevel,
} from "./challenge-data";

type View = "levels" | "missions" | "challenge";
type SidePanel = "briefing" | "manual" | "hints";

const storageKey = "cyber-quest-progress-v2";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function sameMembers(left: string[], right: string[]) {
  return [...left].sort().join("|") === [...right].sort().join("|");
}

function levelIsComplete(level: Level, completed: string[]) {
  return level.challenges.every((challenge) => completed.includes(challenge.id));
}

function Icon({ children }: { children: string }) {
  return <span aria-hidden="true">{children}</span>;
}

function Evidence({ challenge }: { challenge: Challenge }) {
  return (
    <div className="evidence-grid">
      {challenge.evidence.map((block) => (
        <article className={`evidence-card ${block.format ?? "plain"}`} key={block.title}>
          <div className="evidence-title">
            <span />
            <strong>{block.title}</strong>
          </div>
          <div className="evidence-content">
            {block.lines.map((line, index) => (
              <p key={`${block.title}-${index}`}>{line}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function ResearchDesk({ challenge }: { challenge: Challenge }) {
  if (!challenge.research) return null;

  return (
    <aside className="research-desk">
      <div className="research-icon">R</div>
      <div>
        <p className="eyebrow">RESEARCH DESK · OUTSIDE SOURCES ALLOWED</p>
        <h3>Investigate before you answer</h3>
        <p>{challenge.research.prompt}</p>
        <div className="search-terms">
          {challenge.research.searchTerms.map((term) => (
            <code key={term}>{term}</code>
          ))}
        </div>
        <small>{challenge.research.sourceTip}</small>
      </div>
    </aside>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("levels");
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [activeChallengeId, setActiveChallengeId] = useState("l1-c1");
  const [completed, setCompleted] = useState<string[]>([]);
  const [panel, setPanel] = useState<SidePanel>("briefing");
  const [textAnswer, setTextAnswer] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [revealedHints, setRevealedHints] = useState(0);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalContext, setTerminalContext] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Cyber Quest safe training terminal",
    "Type a read-only command from the Field Manual.",
  ]);
  const [hydrated, setHydrated] = useState(false);

  const activeLevel = levels.find((level) => level.id === activeLevelId) ?? levels[0];
  const activeChallenge =
    activeLevel.challenges.find((challenge) => challenge.id === activeChallengeId) ??
    activeLevel.challenges[0];
  const activeChallengeIndex = activeLevel.challenges.findIndex(
    (challenge) => challenge.id === activeChallenge.id,
  );

  useEffect(() => {
    let savedProgress: string[] | null = null;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { completed?: string[] };
        if (Array.isArray(parsed.completed)) savedProgress = parsed.completed;
      }
    } catch {
      // Corrupt local progress should never block the learning experience.
    }
    const timer = window.setTimeout(() => {
      if (savedProgress) setCompleted(savedProgress);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ completed }));
  }, [completed, hydrated]);

  useEffect(() => {
    const hash =
      view === "levels"
        ? "#stages"
        : view === "missions"
          ? `#level-${activeLevelId}`
          : `#${activeChallengeId}`;
    window.history.replaceState(null, "", hash);
  }, [view, activeLevelId, activeChallengeId]);

  const completedPoints = useMemo(
    () =>
      levels.reduce(
        (total, level) =>
          total +
          level.challenges.reduce(
            (levelTotal, challenge) =>
              levelTotal + (completed.includes(challenge.id) ? challenge.points : 0),
            0,
          ),
        0,
      ),
    [completed],
  );
  const possiblePoints = useMemo(
    () => levels.reduce((total, level) => total + totalPointsForLevel(level), 0),
    [],
  );
  const overallPercent = Math.round((completed.length / totalChallengeCount) * 100);

  function isLevelUnlocked(levelIndex: number) {
    return levelIndex === 0 || levelIsComplete(levels[levelIndex - 1], completed);
  }

  function isChallengeUnlocked(index: number) {
    return index === 0 || completed.includes(activeLevel.challenges[index - 1].id);
  }

  function resetWorkspace() {
    setTextAnswer("");
    setSelected([]);
    setFeedback("");
    setRevealedHints(0);
    setTerminalContext("");
    setTerminalInput("");
    setTerminalLines([
      "Cyber Quest safe training terminal",
      "Type a read-only command from the Field Manual.",
    ]);
  }

  function openLevel(level: Level) {
    const firstIncomplete =
      level.challenges.find((challenge) => !completed.includes(challenge.id)) ??
      level.challenges[0];
    setActiveLevelId(level.id);
    setActiveChallengeId(firstIncomplete.id);
    setView("missions");
    resetWorkspace();
  }

  function openChallenge(challenge: Challenge, index: number) {
    if (!isChallengeUnlocked(index)) return;
    setActiveChallengeId(challenge.id);
    setPanel("briefing");
    setView("challenge");
    resetWorkspace();
  }

  function finishChallenge() {
    if (!completed.includes(activeChallenge.id)) {
      setCompleted((current) => [...current, activeChallenge.id]);
    }
    const isLast = activeChallengeIndex === activeLevel.challenges.length - 1;
    setFeedback(
      isLast
        ? `Stage complete. ${
            activeLevelId === levels.length
              ? "You finished the full Cyber Quest campaign."
              : `Level ${activeLevelId + 1} is now unlocked.`
          }`
        : `Correct. Mission ${activeChallengeIndex + 2} is now unlocked.`,
    );
  }

  function submitAnswer(event: FormEvent) {
    event.preventDefault();
    const expected = activeChallenge.answer;
    let correct = false;

    if (activeChallenge.kind === "text" || activeChallenge.kind === "terminal") {
      correct = typeof expected === "string" && normalize(textAnswer) === normalize(expected);
    } else if (activeChallenge.kind === "choice") {
      correct = typeof expected === "string" && selected[0] === expected;
    } else if (activeChallenge.kind === "multi") {
      correct = Array.isArray(expected) && sameMembers(selected, expected);
    } else if (activeChallenge.kind === "order") {
      correct = Array.isArray(expected) && selected.join("|") === expected.join("|");
    }

    if (correct) {
      finishChallenge();
    } else {
      const guidance =
        activeChallenge.kind === "multi"
          ? "That set is not fully supported by the evidence yet. Recheck each selected action."
          : activeChallenge.kind === "order"
            ? "Those are useful actions, but the order leaves a risk. Trace what must happen before the next step."
            : "Not quite. Recheck the evidence and open the Field Manual before revealing another hint.";
      setFeedback(guidance);
    }
  }

  function toggleOption(id: string) {
    setFeedback("");
    if (activeChallenge.kind === "choice") {
      setSelected([id]);
      return;
    }
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function runTerminal(event: FormEvent) {
    event.preventDefault();
    const command = normalize(terminalInput);
    if (!command) return;
    if (command === "clear") {
      setTerminalLines([]);
      setTerminalInput("");
      return;
    }

    let output: string[] | undefined;
    let nextContext = terminalContext;
    if (command.startsWith("cd ")) {
      const destination = command.slice(3).trim();
      output = activeChallenge.terminal?.[command];
      if (output) nextContext = destination;
    } else if (terminalContext && command === "pwd") {
      output = [`/library/archive/${terminalContext}`];
    } else if (terminalContext) {
      output =
        activeChallenge.terminal?.[`${command} ${terminalContext}`] ??
        activeChallenge.terminal?.[
          command.startsWith("cat ")
            ? `cat ${terminalContext}/${command.slice(4)}`
            : `${command} ${terminalContext}`
        ];
    }
    output ??= activeChallenge.terminal?.[command];
    output ??= ["Command not found in this training mission. Check the Field Manual and exact filename."];

    setTerminalContext(nextContext);
    setTerminalLines((current) => [...current, `$ ${command}`, ...output]);
    setTerminalInput("");
  }

  function goToSibling(direction: -1 | 1) {
    const nextIndex = activeChallengeIndex + direction;
    const next = activeLevel.challenges[nextIndex];
    if (!next || (direction === 1 && !isChallengeUnlocked(nextIndex))) return;
    setActiveChallengeId(next.id);
    setPanel("briefing");
    resetWorkspace();
  }

  function clearProgress() {
    if (!window.confirm("Reset all Cyber Quest progress on this device?")) return;
    setCompleted([]);
    setView("levels");
    resetWorkspace();
  }

  return (
    <main className="app-shell" id="main-content">
      <a className="skip-link" href="#main-content">Skip to mission content</a>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setView("levels")}>
          <span className="brand-mark">CQ</span>
          <span><strong>CYBER QUEST</strong><small>Learn · Solve · Protect</small></span>
        </button>
        <div className="topbar-stats" aria-label="Campaign progress">
          <span><Icon>★</Icon><strong>{completedPoints.toLocaleString()}</strong> / {possiblePoints.toLocaleString()} XP</span>
          <span><strong>{completed.length}</strong> / {totalChallengeCount} missions</span>
          <button className="quiet-button" type="button" onClick={clearProgress}>Reset progress</button>
        </div>
      </header>

      {view === "levels" && (
        <section className="campaign-view">
          <div className="campaign-hero">
            <div>
              <p className="eyebrow">CYBER QUEST ACADEMY · SIX-STAGE CAMPAIGN</p>
              <h1>Think like a defender.<br />Prove every answer.</h1>
              <p className="hero-copy">
                Fifty-two original, playable missions grow from careful observation to research-led incident command. Hints are staged; evidence is neutral; later missions expect you to consult trustworthy outside sources.
              </p>
            </div>
            <div className="campaign-progress" aria-label={`${overallPercent}% campaign complete`}>
              <span>{overallPercent}%</span>
              <strong>Campaign complete</strong>
              <div className="progress-track"><i style={{ width: `${overallPercent}%` }} /></div>
              <small>{completed.length} of {totalChallengeCount} missions solved</small>
            </div>
          </div>

          <div className="stage-legend" aria-label="Difficulty progression">
            <span>OBSERVE</span><i /><span>VERIFY</span><i /><span>ANALYZE</span><i /><span>RESEARCH</span><i /><span>COMMAND</span>
          </div>

          <div className="level-grid">
            {levels.map((level, index) => {
              const unlocked = isLevelUnlocked(index);
              const complete = levelIsComplete(level, completed);
              const solved = level.challenges.filter((challenge) => completed.includes(challenge.id)).length;
              const levelPercent = Math.round((solved / level.challenges.length) * 100);
              return (
                <article className={`level-card ${unlocked ? "unlocked" : "locked"}`} key={level.id} style={{ "--level-color": level.color } as React.CSSProperties}>
                  <div className="level-art">
                    <span className="level-index">0{level.id}</span>
                    <div className="level-glyph">{level.icon}</div>
                    <span className="stage-name">{level.stage}</span>
                    {!unlocked && <div className="lock-mark" aria-label="Locked">⌁</div>}
                    {complete && <div className="complete-mark" aria-label="Complete">✓</div>}
                  </div>
                  <div className="level-card-body">
                    <div className="level-meta"><span>LEVEL {level.id}</span><span>{level.difficulty}</span></div>
                    <h2>{level.title}</h2>
                    <p>{level.description}</p>
                    <div className="mini-progress"><i style={{ width: `${levelPercent}%` }} /></div>
                    <div className="level-footer">
                      <small>{solved}/{level.challenges.length} missions · {totalPointsForLevel(level).toLocaleString()} XP</small>
                      <button type="button" disabled={!unlocked} onClick={() => openLevel(level)}>
                        {complete ? "Replay stage" : unlocked ? "Enter stage" : `Finish Level ${level.id - 1}`}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {view === "missions" && (
        <section className="mission-map">
          <button className="back-button" type="button" onClick={() => setView("levels")}>← All stages</button>
          <div className="mission-map-heading" style={{ "--level-color": activeLevel.color } as React.CSSProperties}>
            <div className="map-glyph">{activeLevel.icon}</div>
            <div>
              <p className="eyebrow">LEVEL {activeLevel.id} · {activeLevel.stage} · {activeLevel.difficulty}</p>
              <h1>{activeLevel.title}</h1>
              <p>{activeLevel.story}</p>
            </div>
            <div className="level-score">
              <strong>{activeLevel.challenges.filter((challenge) => completed.includes(challenge.id)).length}/{activeLevel.challenges.length}</strong>
              <span>missions solved</span>
            </div>
          </div>

          <div className="mission-grid">
            {activeLevel.challenges.map((challenge, index) => {
              const unlocked = isChallengeUnlocked(index);
              const complete = completed.includes(challenge.id);
              return (
                <button className={`mission-card ${complete ? "complete" : unlocked ? "ready" : "locked"}`} type="button" disabled={!unlocked} onClick={() => openChallenge(challenge, index)} key={challenge.id}>
                  <span className="mission-number">{String(challenge.number).padStart(2, "0")}</span>
                  <span className="mission-status">{complete ? "SOLVED" : unlocked ? "READY" : "LOCKED"}</span>
                  <strong>{challenge.title}</strong>
                  <small>{challenge.subtitle}</small>
                  <span className="mission-tags"><i>{challenge.tool}</i><i>{challenge.points} XP</i></span>
                </button>
              );
            })}
          </div>
          <p className="unlock-note">Finish a mission to unlock the next one. Earlier missions remain replayable.</p>
        </section>
      )}

      {view === "challenge" && (
        <section className="challenge-view">
          <aside className="challenge-sidebar">
            <button className="back-button inverse" type="button" onClick={() => setView("missions")}>← Mission map</button>
            <p className="eyebrow">L{activeLevel.id} · M{String(activeChallenge.number).padStart(2, "0")}</p>
            <h1>{activeChallenge.title}</h1>
            <p className="challenge-subtitle">{activeChallenge.subtitle}</p>
            <div className="challenge-meta"><span>{activeChallenge.tool}</span><span>{activeChallenge.points} XP</span></div>

            <div className="panel-tabs" role="tablist" aria-label="Mission guidance">
              {(["briefing", "manual", "hints"] as SidePanel[]).map((item) => (
                <button key={item} type="button" role="tab" aria-selected={panel === item} onClick={() => setPanel(item)}>
                  {item === "briefing" ? "Briefing" : item === "manual" ? "Field Manual" : `Hints ${revealedHints}/${activeChallenge.hints.length}`}
                </button>
              ))}
            </div>

            <div className="panel-content">
              {panel === "briefing" && <><h2>Mission briefing</h2><p>{activeChallenge.briefing}</p><h3>Objective</h3><p>{activeChallenge.objective}</p></>}
              {panel === "manual" && <><h2>Field Manual</h2><ol>{activeChallenge.manual.map((line) => <li key={line}>{line}</li>)}</ol></>}
              {panel === "hints" && (
                <>
                  <h2>Staged hints</h2>
                  <p>Reveal only what you need. Solving with less help builds a stronger investigation habit.</p>
                  {activeChallenge.hints.slice(0, revealedHints).map((hint, index) => <div className="hint-card" key={hint}><span>HINT {index + 1}</span><p>{hint}</p></div>)}
                  {revealedHints < activeChallenge.hints.length && <button className="reveal-button" type="button" onClick={() => setRevealedHints((count) => count + 1)}>Reveal hint {revealedHints + 1}</button>}
                </>
              )}
            </div>

            <div className="sidebar-progress">
              <span>Stage progress</span><strong>{activeChallengeIndex + 1}/{activeLevel.challenges.length}</strong>
              <div><i style={{ width: `${((activeChallengeIndex + 1) / activeLevel.challenges.length) * 100}%` }} /></div>
            </div>
          </aside>

          <div className="workspace">
            <header className="workspace-heading">
              <div><p className="eyebrow">MISSION {activeChallenge.number} OF {activeLevel.challenges.length} · {activeChallenge.skill}</p><h2>{activeChallenge.objective}</h2></div>
              {completed.includes(activeChallenge.id) && <span className="solved-badge">✓ SOLVED</span>}
            </header>

            <ResearchDesk challenge={activeChallenge} />
            <Evidence challenge={activeChallenge} />

            {activeChallenge.kind === "terminal" && (
              <section className="terminal-tool" aria-label="Training terminal">
                <div className="terminal-bar"><span /><span /><span /><strong>safe-shell · read only</strong></div>
                <div className="terminal-output" aria-live="polite">{terminalLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
                <form className="terminal-prompt" onSubmit={runTerminal}><label htmlFor="terminal-command">$</label><input id="terminal-command" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} autoComplete="off" spellCheck={false} /><button type="submit">Run</button></form>
              </section>
            )}

            <form className="answer-panel" onSubmit={submitAnswer}>
              <div className="answer-heading"><div><p className="eyebrow">YOUR FINDING</p><h3>{activeChallenge.kind === "order" ? "Build the sequence" : activeChallenge.kind === "multi" ? "Select every supported answer" : "Submit your conclusion"}</h3></div><span>{activeChallenge.points} XP</span></div>

              {activeChallenge.kind === "order" && (
                <div className="sequence-builder" aria-label="Selected action order">
                  {selected.length === 0 ? <p>Select actions below in the order they should happen.</p> : selected.map((id, index) => { const item = activeChallenge.options?.find((candidate) => candidate.id === id); return <button type="button" key={id} onClick={() => toggleOption(id)}><span>{index + 1}</span>{item?.label}<i>×</i></button>; })}
                </div>
              )}

              {(activeChallenge.kind === "choice" || activeChallenge.kind === "multi" || activeChallenge.kind === "order") && (
                <div className="option-list">
                  {activeChallenge.options?.map((item) => {
                    const isSelected = selected.includes(item.id);
                    const position = selected.indexOf(item.id) + 1;
                    return <button className={isSelected ? "selected" : ""} type="button" aria-pressed={isSelected} onClick={() => toggleOption(item.id)} key={item.id}><span className="option-control">{activeChallenge.kind === "order" && isSelected ? position : isSelected ? "✓" : ""}</span><span><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</span></button>;
                  })}
                </div>
              )}

              {(activeChallenge.kind === "text" || activeChallenge.kind === "terminal") && (
                <label className="text-answer"><span>Answer</span><input value={textAnswer} onChange={(event) => { setTextAnswer(event.target.value); setFeedback(""); }} placeholder={activeChallenge.placeholder ?? "Enter your answer"} autoComplete="off" spellCheck={false} /></label>
              )}

              <div className="submit-row">
                <p className={feedback.startsWith("Correct") || feedback.startsWith("Stage") ? "success" : ""} aria-live="polite">{feedback || "Your answer is checked only after you submit."}</p>
                <button className="submit-button" type="submit">Check finding</button>
              </div>
            </form>

            <nav className="challenge-nav" aria-label="Mission navigation">
              <button type="button" disabled={activeChallengeIndex === 0} onClick={() => goToSibling(-1)}>← Previous</button>
              <button type="button" disabled={activeChallengeIndex === activeLevel.challenges.length - 1 || !isChallengeUnlocked(activeChallengeIndex + 1)} onClick={() => goToSibling(1)}>Next →</button>
            </nav>
          </div>
        </section>
      )}
    </main>
  );
}
