import assert from "node:assert/strict";
import test from "node:test";

import { levelTwoChallenges, resolveTrainingPage } from "../app/level-two";
import {
  analyzeVaultSource,
  buildRestoreResponse,
  decodeTrainingValue,
  inventoryKeyForRole,
  levelThreeChallenges,
  levelThreeFileHeaders,
  permissionModeFor,
  simulateFilesystemCommand,
  simulateMemoryCommand,
} from "../app/level-three";

test("Level 2 URL challenge names its target and resolves it without guessing", () => {
  const challenge = levelTwoChallenges.find((item) => item.id === 2)!;
  assert.match(challenge.objective, /editor view/i);
  assert.equal(resolveTrainingPage("https://drafts.eastview.school/review?user=guest"), "guest");
  assert.equal(resolveTrainingPage("https://drafts.eastview.school/review?user=editor"), "editor");
  assert.equal(resolveTrainingPage("not a url"), "missing");
});

test("Directory Detour has a complete no-hint evidence path", () => {
  let path = "/library/archive";
  const listing = simulateFilesystemCommand(path, "ls");
  assert.match(listing.lines.join("\n"), /README\.txt/);

  const readme = simulateFilesystemCommand(path, "cat README.txt");
  assert.match(readme.lines.join("\n"), /\.\/backups/);
  assert.match(readme.lines.join("\n"), /index\.txt/);

  const moved = simulateFilesystemCommand(path, "cd backups");
  path = moved.path;
  assert.equal(path, "/library/archive/backups");

  const index = simulateFilesystemCommand(path, "cat index.txt");
  assert.match(index.lines.join("\n"), /2026-05-14 02:00 \| complete \| manifest-2026-05-14\.txt/);
  assert.match(index.lines.join("\n"), /2026-05-15 09:30 \| failed/);

  const manifest = simulateFilesystemCommand(path, "cat manifest-2026-05-14.txt");
  assert.match(manifest.lines.join("\n"), /set=kiosk-clean-7/);
  assert.doesNotMatch(simulateFilesystemCommand("/library/archive", "cat missing.txt").lines.join("\n"), /kiosk-clean-7/);
});

test("Masquerade supplies a unique content-extension mismatch", () => {
  const poster = levelThreeFileHeaders.find((file) => file.name === "poster.jpg")!;
  assert.match(poster.bytes, /^4D 5A/);
  assert.equal(levelThreeFileHeaders.filter((file) => /^4D 5A/.test(file.bytes)).length, 1);
  assert.equal(levelThreeChallenges.find((item) => item.id === 2)?.answer, poster.name);
});

test("Permission Repair accepts only the policy-compliant 640 state", () => {
  assert.equal(permissionModeFor(["owner-r", "owner-w", "group-r"]), "640");
  assert.equal(permissionModeFor(["owner-r", "owner-w", "group-r", "other-w"]), "642");
  assert.equal(levelThreeChallenges.find((item) => item.id === 3)?.answer, "640");
});

test("Decode Desk reveals its unique answer only with a matching decoder", () => {
  const encoded = "cmVzdG9yZS1jaGFubmVsLTc=";
  assert.equal(decodeTrainingValue("base64", encoded), "restore-channel-7");
  assert.equal(decodeTrainingValue("base64", `preferred_restore=${encoded}`), "restore-channel-7");
  assert.equal(decodeTrainingValue("hex", encoded), "Input does not match the selected decoder.");
});

test("Request Recovery distinguishes path, method, authorization, and success", () => {
  assert.equal(buildRestoreResponse("GET", "/wrong", "X-Kiosk-ID", "LIB-04").status, "404 NOT FOUND");
  assert.equal(buildRestoreResponse("POST", "/api/restore/status", "X-Kiosk-ID", "LIB-04").status, "405 METHOD NOT ALLOWED");
  assert.equal(buildRestoreResponse("GET", "/api/restore/status", "X-Kiosk-ID", "LIB-99").status, "403 FORBIDDEN");
  const success = buildRestoreResponse("GET", "/api/restore/status", "X-Kiosk-ID", "LIB-04");
  assert.equal(success.status, "200 OK");
  assert.match(success.body, /RESTORE-318/);
});

test("Session Shelf exposes the key only to the documented archivist role", () => {
  assert.equal(inventoryKeyForRole("reader"), null);
  assert.equal(inventoryKeyForRole("technician"), null);
  assert.equal(inventoryKeyForRole("archivist"), "SHELF-882");
  assert.equal(inventoryKeyForRole(" ARCHIVIST "), "SHELF-882");
});

test("Memory Trace supports process discovery before targeted strings", () => {
  const processes = simulateMemoryCommand("pslist").join("\n");
  assert.match(processes, /4180\s+3560\s+shelfcrypt\.exe/);
  const tree = simulateMemoryCommand("pstree").join("\n");
  assert.match(tree, /winword\.exe \(3560\)[\s\S]*shelfcrypt\.exe \(4180\)/);
  assert.doesNotMatch(simulateMemoryCommand("strings 2916").join("\n"), /UNLOCK-604/);
  assert.match(simulateMemoryCommand("strings 4180").join("\n"), /unlock_token=UNLOCK-604/);
});

test("Vault Loop accepts a bounded complete algorithm and rejects incomplete ones", () => {
  const valid = `import vault
for code in range(1000):
    password = str(code).zfill(3)
    if vault.try_password(password):
        print(vault.read("recovery.txt"))
        break`;
  assert.deepEqual(analyzeVaultSource(valid), []);
  assert.ok(analyzeVaultSource("import vault").length >= 5);
  assert.match(analyzeVaultSource(valid.replace("break", "pass")).join("\n"), /does not stop/);
});

test("Level 3 answer tokens are unique and every challenge has post-solve teaching", () => {
  assert.equal(new Set(levelThreeChallenges.map((challenge) => challenge.answer)).size, 8);
  assert.ok(levelThreeChallenges.every((challenge) => challenge.lesson.concepts.length >= 3));
  assert.ok(levelThreeChallenges.every((challenge) => challenge.reference.length > 0));
});
