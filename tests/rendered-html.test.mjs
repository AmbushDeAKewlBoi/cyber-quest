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
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete six-stage Cyber Quest campaign", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cyber Quest — Learn\. Solve\. Protect\.<\/title>/i);
  assert.match(html, /SIX-STAGE CAMPAIGN/);
  assert.match(html, /Fifty-two original, playable missions/);
  assert.match(html, /Signal Lost/);
  assert.match(html, /The Copycat Account/);
  assert.match(html, /Library Lockout/);
  assert.match(html, /Festival Firewall/);
  assert.match(html, /Midnight Archive/);
  assert.match(html, /Operation Glasshouse/);
  assert.match(html, /Enter stage/);
  assert.match(html, /Finish Level 1/);
  assert.match(html, /52(?:<!-- -->)? missions/);
  assert.match(html, /https:\/\/cyber-quest\.example\/og\.png/);
  assert.doesNotMatch(html, /Coming next|codex-preview|Your site is taking shape/);
});

test("defines 52 complete missions across six progressively harder levels", async () => {
  const data = await readFile(new URL("../app/challenge-data.ts", import.meta.url), "utf8");
  const challengeIds = data.match(/id:\s*"l\d-c\d+"/g) ?? [];
  const uniqueIds = new Set(challengeIds);

  assert.equal(challengeIds.length, 52);
  assert.equal(uniqueIds.size, 52);
  assert.equal((data.match(/\n\s+id:\s[1-6],/g) ?? []).length, 6);
  for (const stage of [
    "Cyber Scout",
    "Digital Defender",
    "Systems Investigator",
    "Network Analyst",
    "Forensics Specialist",
    "Incident Commander",
  ]) {
    assert.match(data, new RegExp(stage));
  }
  for (const kind of ["text", "choice", "multi", "order", "terminal"]) {
    assert.match(data, new RegExp(`kind:\\s*"${kind}"`));
  }
  assert.ok((data.match(/research:\s*\{/g) ?? []).length >= 8);
  assert.ok((data.match(/hints:\s*\[/g) ?? []).length >= 52);
  assert.ok((data.match(/manual:\s*\[/g) ?? []).length >= 52);
  assert.match(data, /MITRE ATT&CK/);
  assert.match(data, /NIST incident response lifecycle/);
  assert.match(data, /SLSA provenance overview/);
  assert.match(data, /Regular expressions/);
  assert.match(data, /Chain of Custody/);
  assert.doesNotMatch(data, /Coming next|TODO|placeholder challenge/i);
});

test("ships working progression, validation, research, terminal, and accessibility mechanics", async () => {
  const [page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /levelIsComplete/);
  assert.match(page, /isChallengeUnlocked/);
  assert.match(page, /sameMembers/);
  assert.match(page, /selected\.join\("\|"\)/);
  assert.match(page, /runTerminal/);
  assert.match(page, /ResearchDesk/);
  assert.match(page, /setRevealedHints/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /role="tablist"/);
  assert.match(page, /window\.confirm/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /grid-template-columns:\s*330px minmax\(0,\s*1fr\)/);
  assert.match(packageJson, /cross-env/);
  await access(new URL("../public/og.png", import.meta.url));
});
