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

test("ships twelve progressive challenges and the requested workspace controls", async () => {
  const [page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Hidden in Plain Sight/);
  assert.match(page, /Bring Bolt Home/);
  assert.match(page, /The Look-Alike Link/);
  assert.match(page, /Permission Patrol/);
  assert.match(page, /Wi-Fi Impostor/);
  assert.match(page, /Photo Footprints/);
  assert.match(page, /Shifted Schedule/);
  assert.match(page, /Science Fair Shield/);
  assert.match(page, /CHALLENGE \{activeChallenge\.id\} OF \{challenges\.length\}/);
  assert.match(page, /12 challenges · Beginner/);
  assert.match(page, /Finish a challenge to unlock the next one/);
  assert.match(page, /Briefing/);
  assert.match(page, /Field manual/);
  assert.match(page, /Hint/);
  assert.match(page, /Previous/);
  assert.match(page, /Next/);
  assert.match(page, /cat bolt\.txt/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /Flag captured!/);
  assert.match(page, /chooseAnswer\("sender", setSelectedPart\)/);
  assert.match(css, /@keyframes confetti-fall/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /grid-template-columns:\s*310px minmax\(0,\s*1fr\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/og.png", import.meta.url));
});
