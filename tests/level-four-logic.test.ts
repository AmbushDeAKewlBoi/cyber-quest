import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeSocketSource,
  evaluateFirewallOrder,
  festivalCertificates,
  filterFestivalPackets,
  followFestivalStream,
  initialFirewallRules,
  levelFourChallenges,
  simulateDnsQuery,
  simulateNetworkCommand,
  simulateProxyRequest,
  validateFinalReport,
} from "../app/level-four";

test("Service Sweep has a bounded discovery-to-connection solve path", () => {
  const hosts = simulateNetworkCommand("hosts").join("\n");
  assert.match(hosts, /10\.44\.8\.20\s+media-relay/);
  assert.match(hosts, /22\/ssh, 443\/https/);
  const scan = simulateNetworkCommand("scan 10.44.8.20").join("\n");
  assert.match(scan, /8443\/tcp open/);
  assert.match(simulateNetworkCommand("connect 10.44.8.20 8443").join("\n"), /service_codename=AURORA-EDGE/);
  assert.doesNotMatch(simulateNetworkCommand("connect 10.44.8.20 443").join("\n"), /AURORA-EDGE/);
  assert.match(simulateNetworkCommand("scan 192.168.1.1").join("\n"), /outside the registered training assets/);
});

test("Alias Chain resolves each explicit record and the complete trace", () => {
  assert.match(simulateDnsQuery("dig stream.festival.school").join("\n"), /CNAME live\.media\.school/);
  assert.match(simulateDnsQuery("dig live.media.school").join("\n"), /CNAME edge2\.media\.school/);
  assert.match(simulateDnsQuery("dig edge2.media.school").join("\n"), /A 192\.0\.2\.80/);
  const trace = simulateDnsQuery("dig +trace stream.festival.school").join("\n");
  assert.match(trace, /stream\.festival\.school[\s\S]*live\.media\.school[\s\S]*edge2\.media\.school[\s\S]*192\.0\.2\.80/);
  assert.match(simulateDnsQuery("dig absent.festival.school").join("\n"), /NXDOMAIN/);
});

test("Certificate Split contains exactly one hostname mismatch", () => {
  const expected = "stream.festival.school";
  const mismatches = festivalCertificates.filter((certificate) => !certificate.sans.includes(expected));
  assert.equal(mismatches.length, 1);
  assert.equal(mismatches[0].endpoint, "edge2.media.school");
  assert.equal(mismatches[0].fingerprint, "9F:3A:71:C2:08:6D");
});

test("Proxy Trust distinguishes malformed and successful header tests", () => {
  const ordinary = simulateProxyRequest("GET /ops/manifest HTTP/1.1\nHost: relay.festival.school\nX-Forwarded-For: 198.51.100.44");
  assert.equal(ordinary.status, "403 FORBIDDEN");
  const success = simulateProxyRequest("GET /ops/manifest HTTP/1.1\nHost: relay.festival.school\nX-Forwarded-For: 10.44.8.10");
  assert.equal(success.status, "200 OK");
  assert.match(success.body, /PROXY-TRUST-BROKEN/);
  assert.equal(simulateProxyRequest("POST /ops/manifest HTTP/1.1\nHost: relay.festival.school\nX-Forwarded-For: 10.44.8.10").status, "405 METHOD NOT ALLOWED");
});

test("Stream in the Packets supports filtering and reconstructs only the relevant upload", () => {
  const posts = filterFestivalPackets("http.request.method == POST");
  assert.equal(posts.error, "");
  assert.deepEqual(posts.rows.map((packet) => packet.stream), [4, 5]);
  assert.match(followFestivalStream(4).join("\n"), /filename="festival-keys\.tar\.gz"/);
  assert.doesNotMatch(followFestivalStream(5).join("\n"), /festival-keys/);
  assert.match(filterFestivalPackets("definitely not valid").error, /Invalid/);
});

test("Socket Sequence accepts a complete stateful client and rejects shortcuts", () => {
  const valid = `from hashlib import sha256
import relay

relay.connect("10.44.8.20", 9050)
relay.send("HELLO")
nonce = relay.recv()
digest = sha256((nonce + ":FESTIVAL").encode()).hexdigest()
relay.send(digest)
print(relay.recv())`;
  assert.deepEqual(analyzeSocketSource(valid), []);
  assert.ok(analyzeSocketSource('print("NEBULA-9050")').length >= 5);
  assert.match(analyzeSocketSource(valid.replace("print(relay.recv())", "print(digest)")).join("\n"), /final relay reply/);
});

test("Rule Order fails initially and passes after the precise deny moves above partner allow", () => {
  const initial = evaluateFirewallOrder(initialFirewallRules);
  assert.equal(initial.pass, false);
  assert.equal(initial.results.find((result) => result.name === "Hostile partner address")?.actual, "ALLOW");
  const repaired = [...initialFirewallRules];
  [repaired[1], repaired[2]] = [repaired[2], repaired[1]];
  const result = evaluateFirewallOrder(repaired);
  assert.equal(result.pass, true);
  assert.ok(result.results.every((flow) => flow.pass));
});

test("Final Broadcast requires all six evidence-backed findings", () => {
  const complete = {
    source: "203.0.113.88",
    port: "8443",
    service: "AURORA-EDGE",
    endpoint: "edge2.media.school",
    archive: "festival-keys.tar.gz",
    containment: "203.0.113.88/32",
  };
  assert.deepEqual(validateFinalReport(complete), { pass: true, invalid: [] });
  const wrong = validateFinalReport({ ...complete, containment: "203.0.113.0/24" });
  assert.equal(wrong.pass, false);
  assert.deepEqual(wrong.invalid, ["containment"]);
});

test("Level 4 is a unique, fully taught eight-challenge set", () => {
  assert.equal(levelFourChallenges.length, 8);
  assert.equal(new Set(levelFourChallenges.map((challenge) => challenge.kind)).size, 8);
  assert.equal(new Set(levelFourChallenges.map((challenge) => challenge.answer)).size, 8);
  assert.ok(levelFourChallenges.every((challenge) => challenge.lesson.concepts.length >= 3));
  assert.ok(levelFourChallenges.every((challenge) => challenge.reference.length > 0));
});
