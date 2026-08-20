import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "cyber-quest.example",
        "x-forwarded-host": "cyber-quest.example",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Cyber Quest level dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cyber Quest — Learn\. Solve\. Protect\.<\/title>/i);
  assert.match(html, /Choose a level/);
  assert.match(html, /Signal Lost/);
  assert.match(html, /Go to level/);
  assert.match(html, /https:\/\/cyber-quest\.example\/og\.png/);
  assert.doesNotMatch(html, /Cipher Scouts|codex-preview|Your site is taking shape/);
});

test("ships four playable levels and the requested workspace controls", async () => {
  const [page, levelTwo, levelThree, levelFour, authoringPlan, finalAuthoringPlan, css, packageJson, challengeBank] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/level-two.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/level-three.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/level-four.tsx", import.meta.url), "utf8"),
    readFile(new URL("../docs/challenge-authoring-plan.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/final-level-authoring-plan.md", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../storage/challenge-bank.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Hidden in Plain Sight/);
  assert.equal(page.match(/lesson:\s*\{/g)?.length, 12);
  assert.match(page, /activeChallengeComplete \? "LESSON UNLOCKED" : "LOCKED UNTIL SOLVED"/);
  assert.match(page, /Solve this challenge to unlock the lesson/);
  assert.match(page, /Post-challenge cyber mini-lesson/);
  assert.match(page, /Invisible does not mean absent/);
  assert.match(page, /Incident response is an evidence-driven cycle/);
  assert.doesNotMatch(page, /Select page text/);
  assert.doesNotMatch(page, /select-page-button/);
  assert.match(page, /Bring Bolt Home/);
  assert.match(page, /The Look-Alike Link/);
  assert.match(page, /Permission Patrol/);
  assert.match(page, /Wi-Fi Impostor/);
  assert.match(page, /Login Log Hunt/);
  assert.match(page, /File Fingerprint/);
  assert.match(page, /Junior SOC Shift/);
  assert.match(page, /Foundation/);
  assert.match(page, /Junior Analyst/);
  assert.match(page, /203\.0\.113\.42/);
  assert.match(page, /SHA-256 INTEGRITY CHECK/);
  assert.match(page, /contain-reset-verify-report/);
  assert.match(page, /CHALLENGE \{activeChallenge\.id\} OF \{challenges\.length\}/);
  assert.match(page, /12 challenges · Beginner/);
  assert.match(page, /All 12 challenges are open\. Play them in any order\./);
  assert.match(page, /Free explore · all challenges open/);
  assert.match(page, /return challenges\.some\(\(challenge\) => challenge\.id === id\)/);
  assert.doesNotMatch(page, /<div className="card-lock">/);
  assert.match(page, /Briefing/);
  assert.match(page, /Field manual/);
  assert.match(page, /Hint/);
  assert.match(page, /setPanel\("hint"\)/);
  assert.match(page, /panel === "hint" && <p>\{activeChallenge\.hint\}<\/p>/);
  assert.doesNotMatch(page, /Pattern check/);
  assert.doesNotMatch(page, /The final word looks like/);
  assert.doesNotMatch(page, /Real school IT address/);
  assert.doesNotMatch(page, /Open the Field manual/);
  assert.doesNotMatch(page, /Use the Field manual to decide/);
  assert.match(page, /Previous/);
  assert.match(page, /Next/);
  assert.match(page, /cat bolt\.txt/);
  assert.match(page, /usage: "cat filename\.txt"/);
  assert.match(page, /command: "pwd"/);
  assert.match(page, /manualSteps/);
  assert.doesNotMatch(page, /terminal-shortcuts/);
  assert.match(page, /value: "microphone"/);
  assert.match(page, /value: "location"/);
  assert.match(page, /togglePermission/);
  assert.match(page, /district-login\.school/);
  assert.match(page, /district-it\.school/);
  assert.match(page, /12 chronological events/);
  assert.match(page, /09:54:05/);
  assert.doesNotMatch(page, /status: "alert"/);
  assert.match(page, /schedule\.csv/);
  assert.match(page, /poster\.png/);
  assert.match(page, /readme\.txt/);
  assert.doesNotMatch(page, /file\.approved === file\.downloaded/);
  assert.match(page, /Reset and clean up/);
  assert.match(page, /Block and launch/);
  assert.equal(page.match(/time: "\d{2}:\d{2}:\d{2}"/g)?.length, 12);
  assert.equal(page.match(/approved: "[a-f0-9-]+"/g)?.length, 6);
  assert.equal(page.match(/command: "(?:pwd|ls|cat|clear)"/g)?.length, 4);
  assert.equal(page.match(/certificate: "Certificate:/g)?.length, 3);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /Flag captured!/);
  assert.match(page, /chooseAnswer\("sender", setSelectedPart\)/);
  assert.match(page, /LevelTwoGrid/);
  assert.match(page, /LevelTwoWorkspace/);
  assert.match(page, /8 challenges · Developing/);
  assert.match(page, /unlocked: true,[\s\S]*theme: "social"/);
  assert.match(page, /LevelThreeGrid/);
  assert.match(page, /LevelThreeWorkspace/);
  assert.match(page, /8 challenges · Intermediate/);
  assert.match(page, /LevelFourGrid/);
  assert.match(page, /LevelFourWorkspace/);
  assert.match(page, /8 challenges · Expert/);
  assert.match(page, /unlocked: true,[\s\S]*theme: "festival"/);
  assert.match(page, /All four levels are open for free exploration/);
  assert.equal(levelTwo.match(/title:\s*"(?:Public Breadcrumbs|Role in the URL|Signal in the Static|Broken Route|Token Trail|Hash Hunt|First Knock|Zoom Room)"/g)?.length, 8);
  assert.equal(levelTwo.match(/lesson:\s*\{/g)?.length, 8);
  assert.equal(levelTwo.match(/reference:\s*"/g)?.length, 8);
  assert.match(levelTwo, /All 8 challenges are open\. Play them in any order\./);
  assert.match(levelTwo, /panel === "hint" && <p>\{challenge\.hint\}<\/p>/);
  assert.match(levelTwo, /LOCKED UNTIL SOLVED/);
  assert.match(levelTwo, /challenge\.kind === "packets"/);
  for (const kind of ["social", "url", "search", "source", "terminal", "hash", "packets", "image"]) {
    assert.equal(levelTwo.match(new RegExp(`kind:\\s*"${kind}"`, "g"))?.length, 1);
  }
  assert.match(levelTwo, /@eastview\.zara/);
  assert.match(levelTwo, /same teal notebook/);
  assert.match(levelTwo, /user=guest/);
  assert.match(levelTwo, /Reach the editor view in the training browser and recover its draft ID/);
  assert.match(levelTwo, /searchParams\.get\("user"\)/);
  assert.match(levelTwo, /FAIR-204/);
  assert.match(levelTwo, /evidenceDump/);
  assert.match(levelTwo, /BLUE-METEOR-7/);
  assert.match(levelTwo, /staff\/review-portal/);
  assert.match(levelTwo, /ECHO-441/);
  assert.match(levelTwo, /runEvidenceTerminal/);
  assert.match(levelTwo, /grep SEARCH filename/);
  assert.match(levelTwo, /oauth_77/);
  assert.match(levelTwo, /a827f9ef19bfa35b11643c4b020e301b/);
  assert.match(levelTwo, /purple-orbit/);
  assert.match(levelTwo, /first-knock\.pcapng/);
  assert.match(levelTwo, /TTL=128/);
  assert.match(levelTwo, /135,139,445,5357,6666,7443/);
  assert.match(levelTwo, /VIOLET-LENS-42/);
  assert.match(levelTwo, /imageZoom/);
  assert.match(levelTwo, /CyberStart 2024 archive/);
  assert.match(levelTwo, /CC BY-SA 4\.0/);
  assert.doesNotMatch(levelTwo, /Pattern check|final word looks like|Real school IT address/);
  assert.doesNotMatch(levelTwo, /challenge\.options|runDetectionQuery|detectionEvents/);
  assert.equal(levelThree.match(/title:\s*"(?:Directory Detour|Masquerade|Permission Repair|Decode Desk|Request Recovery|Session Shelf|Memory Trace|Vault Loop)"/g)?.length, 8);
  assert.equal(levelThree.match(/lesson:\s*\{/g)?.length, 8);
  assert.equal(levelThree.match(/reference:\s*"/g)?.length, 8);
  for (const kind of ["filesystem", "magic", "permissions", "decoder", "http", "cookie", "memory", "code"]) {
    assert.equal(levelThree.match(new RegExp(`kind:\\s*"${kind}"`, "g"))?.length, 1);
  }
  assert.match(levelThree, /All 8 challenges are open\. Play them in any order\./);
  assert.match(levelThree, /panel === "hint" && <p>\{challenge\.hint\}<\/p>/);
  assert.match(levelThree, /LOCKED UNTIL SOLVED/);
  assert.match(levelThree, /CyberStart 2024 archive/);
  assert.match(levelThree, /CC BY-SA 4\.0/);
  assert.match(levelThree, /\/library\/archive\/backups\/index\.txt/);
  assert.match(levelThree, /manifest-2026-05-14\.txt/);
  assert.match(levelThree, /poster\.jpg/);
  assert.match(levelThree, /4D 5A/);
  assert.match(levelThree, /permissionMode === challenge\.answer/);
  assert.match(levelThree, /cmVzdG9yZS1jaGFubmVsLTc=/);
  assert.match(levelThree, /restore-channel-7/);
  assert.match(levelThree, /\/api\/restore\/status/);
  assert.match(levelThree, /X-Kiosk-ID: LIB-04/);
  assert.match(levelThree, /library_role/);
  assert.match(levelThree, /archivist → backup inventory/);
  assert.match(levelThree, /shelfcrypt\.exe/);
  assert.match(levelThree, /pid === "4180"/);
  assert.match(levelThree, /unlock_token=UNLOCK-604/);
  assert.match(levelThree, /1000/);
  assert.match(levelThree, /zfill/);
  assert.match(levelThree, /OPEN-SHELF-9/);
  assert.doesNotMatch(levelThree, /challenge\.options|multiple choice|Pattern check/);
  assert.equal(levelFour.match(/title:\s*"(?:Service Sweep|Alias Chain|Certificate Split|Proxy Trust|Stream in the Packets|Socket Sequence|Rule Order|Final Broadcast)"/g)?.length, 8);
  assert.equal(levelFour.match(/lesson:\s*\{/g)?.length, 8);
  assert.equal(levelFour.match(/reference:\s*"/g)?.length, 8);
  for (const kind of ["network", "dns", "certificate", "proxy", "packets", "socket", "firewall", "report"]) {
    assert.equal(levelFour.match(new RegExp(`kind:\\s*"${kind}"`, "g"))?.length, 1);
  }
  assert.match(levelFour, /All 8 expert challenges are open\. Play them in any order\./);
  assert.match(levelFour, /panel === "hint" && <p>\{challenge\.hint\}<\/p>/);
  assert.match(levelFour, /LOCKED UNTIL SOLVED/);
  assert.match(levelFour, /CyberStart 2024 archive/);
  assert.match(levelFour, /CC BY-SA 4\.0/);
  assert.match(levelFour, /scan HOST/);
  assert.match(levelFour, /connect HOST PORT/);
  assert.match(levelFour, /dig \+trace NAME/);
  assert.match(levelFour, /Subject Alternative Name/);
  assert.match(levelFour, /X-Forwarded-For/);
  assert.match(levelFour, /Follow selected stream/);
  assert.match(levelFour, /relay\.connect\(host, port\)/);
  assert.match(levelFour, /First match wins/);
  assert.match(levelFour, /FINAL INCIDENT REPORT DESK/);
  assert.match(levelFour, /203\.0\.113\.88\/32/);
  assert.doesNotMatch(levelFour, /challenge\.options|multiple choice|Pattern check/);
  assert.match(authoringPlan, /Self-use authoring prompt/);
  assert.match(authoringPlan, /closed evidence chain/i);
  assert.match(authoringPlan, /Never require an arbitrary guess/);
  assert.match(authoringPlan, /Solvability gate/);
  assert.match(authoringPlan, /Intended solve paths and reflection/);
  assert.equal(authoringPlan.match(/### L3 C\d/g)?.length, 8);
  assert.match(finalAuthoringPlan, /Self-use authoring prompt/);
  assert.match(finalAuthoringPlan, /closed evidence chain/i);
  assert.match(finalAuthoringPlan, /Keep the main workspace free of hints/);
  assert.match(finalAuthoringPlan, /Solvability gate/);
  assert.equal(finalAuthoringPlan.match(/### L4 C\d/g)?.length, 8);
  assert.match(finalAuthoringPlan, /Intended no-hint solve paths and pre-build critique/);
  assert.match(css, /Level 2 · CyberStart-inspired interactive labs/);
  assert.match(css, /Level 3 · Library Lockout/);
  assert.match(css, /Level 4 · Festival Firewall/);
  assert.match(css, /\.public-archive/);
  assert.match(css, /\.training-browser/);
  assert.match(css, /\.text-evidence-viewer/);
  assert.match(css, /\.source-browser/);
  assert.match(css, /\.evidence-terminal/);
  assert.match(css, /\.hash-lab/);
  assert.match(css, /\.packet-workbench/);
  assert.match(css, /\.packet-report/);
  assert.match(css, /\.zoom-lab/);
  assert.match(css, /\.newsroom-photo/);
  assert.match(css, /\.challenge-inspiration/);
  assert.match(css, /\.library-terminal/);
  assert.match(css, /\.hex-workbench/);
  assert.match(css, /\.permission-workbench/);
  assert.match(css, /\.decoder-workbench/);
  assert.match(css, /\.http-workbench/);
  assert.match(css, /\.session-workbench/);
  assert.match(css, /\.memory-workbench/);
  assert.match(css, /\.code-workbench/);
  assert.match(css, /\.network-sweep/);
  assert.match(css, /\.dns-lab/);
  assert.match(css, /\.certificate-lab/);
  assert.match(css, /\.proxy-lab/);
  assert.match(css, /\.pcap-lab/);
  assert.match(css, /\.socket-lab/);
  assert.match(css, /\.firewall-lab/);
  assert.match(css, /\.report-lab/);
  assert.match(css, /@keyframes confetti-fall/);
  assert.match(css, /\.manual-reference/);
  assert.match(css, /\.sidebar-tabs\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s);
  assert.match(css, /\.log-rows/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /grid-template-columns:\s*310px minmax\(0,\s*1fr\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.equal((challengeBank.match(/id:\s*"l[2-6]-c\d+"/g) ?? []).length, 40);
  assert.match(challengeBank, /The Copycat Account/);
  assert.match(challengeBank, /Library Lockout/);
  assert.match(challengeBank, /Festival Firewall/);
  assert.match(challengeBank, /Midnight Archive/);
  assert.match(challengeBank, /Operation Glasshouse/);
  await access(new URL("../public/og.png", import.meta.url));
});
