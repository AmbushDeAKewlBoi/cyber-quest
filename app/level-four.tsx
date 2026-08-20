"use client";

import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";

type Panel = "briefing" | "manual" | "hint";
type ChallengeKind = "network" | "dns" | "certificate" | "proxy" | "packets" | "socket" | "firewall" | "report";

type Lesson = {
  title: string;
  summary: string;
  concepts: string[];
  takeaway: string;
};

export type LevelFourChallenge = {
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
  answer: string;
  placeholder?: string;
  reference: string;
  lesson: Lesson;
};

export const levelFourChallenges: LevelFourChallenge[] = [
  {
    id: 1,
    title: "Service Sweep",
    subtitle: "Find what the inventory missed",
    points: 320,
    skill: "Service discovery",
    tool: "Network console",
    rank: "Recon Specialist",
    kind: "network",
    objective: "Recover the codename returned by the undocumented service on the festival relay.",
    briefing: "The festival network is isolated inside an authorized range. Compare the asset register with live services and connect to anything the register does not explain.",
    hint: "Inventory the hosts, scan the relay, then connect to the open port missing from its documented-services entry.",
    answer: "AURORA-EDGE",
    placeholder: "Enter the service codename",
    reference: "Port of Call and Alien Server",
    lesson: {
      title: "Discovery separates assumptions from reality",
      summary: "Asset registers describe what a network is supposed to contain. A scoped port scan shows what is actually listening, and a service banner can provide the context needed to investigate the difference.",
      concepts: ["An open port identifies a reachable service endpoint, not automatically a vulnerability.", "Comparing scan results with an approved inventory exposes shadow services.", "Connecting to a service can reveal a protocol or banner that a scan alone cannot explain."],
      takeaway: "Scope the target, discover what is listening, then validate the service before drawing conclusions.",
    },
  },
  {
    id: 2,
    title: "Alias Chain",
    subtitle: "Trace the livestream through DNS",
    points: 340,
    skill: "DNS investigation",
    tool: "Resolver console",
    rank: "Recon Specialist",
    kind: "dns",
    objective: "Find the final IPv4 address serving stream.festival.school.",
    briefing: "The public livestream name resolves through multiple aliases. Follow the DNS records until the chain reaches an address record.",
    hint: "Query each CNAME target in turn, or use the console's trace form to print the complete chain.",
    answer: "192.0.2.80",
    placeholder: "Enter the final IPv4 address",
    reference: "First Contact and the Network field manual",
    lesson: {
      title: "DNS names can form chains",
      summary: "A CNAME maps one hostname to another canonical name. Resolution continues until a record such as A or AAAA provides an address that a client can contact.",
      concepts: ["CNAME records create aliases; A records map names to IPv4 addresses.", "Tracing the entire chain helps reveal unexpected infrastructure changes.", "Documentation IP ranges are safe stand-ins for public Internet addresses in training."],
      takeaway: "Follow aliases to their terminal address record and preserve the complete resolution path.",
    },
  },
  {
    id: 3,
    title: "Certificate Split",
    subtitle: "Compare identities at the edge",
    points: 360,
    skill: "TLS certificates",
    tool: "Certificate probe",
    rank: "Protocol Analyst",
    kind: "certificate",
    objective: "Submit the fingerprint of the endpoint whose certificate does not cover stream.festival.school.",
    briefing: "Three edge nodes are meant to serve the same livestream hostname. Probe their certificates and compare the identity fields instead of trusting the endpoint labels.",
    hint: "A certificate covers a hostname only when that hostname appears in its Subject Alternative Name list.",
    answer: "9F:3A:71:C2:08:6D",
    placeholder: "Enter the mismatched fingerprint",
    reference: "Headers and Strings and web request investigations",
    lesson: {
      title: "TLS certificates bind keys to names",
      summary: "A valid TLS connection requires more than encryption. The certificate must be trusted, current, and valid for the hostname the client intended to reach.",
      concepts: ["Subject Alternative Name entries define the hostnames a certificate covers.", "A fingerprint uniquely summarizes certificate bytes for comparison.", "A trusted issuer does not fix a hostname mismatch."],
      takeaway: "Verify the requested hostname against the certificate identity, then compare fingerprints when investigating drift.",
    },
  },
  {
    id: 4,
    title: "Proxy Trust",
    subtitle: "Test a dangerous forwarding assumption",
    points: 380,
    skill: "HTTP trust boundaries",
    tool: "Raw request lab",
    rank: "Protocol Analyst",
    kind: "proxy",
    objective: "Recover the audit marker from /ops/manifest by demonstrating unsafe proxy-header trust.",
    briefing: "The training backend should accept the operations route only through its reverse proxy. Use the network note and raw request editor to test what the backend actually trusts.",
    hint: "Compare the address in X-Forwarded-For with the only address the network note authorizes as a reverse proxy.",
    answer: "PROXY-TRUST-BROKEN",
    placeholder: "Enter the audit marker",
    reference: "Secret Pages and Don't Forget HTTP",
    lesson: {
      title: "Forwarding headers are claims, not proof",
      summary: "Reverse proxies add headers that describe the original request. A backend that accepts those headers from any client lets an attacker impersonate a trusted network position.",
      concepts: ["X-Forwarded-For can be supplied directly by a client unless a trusted proxy overwrites it.", "Backends should trust forwarding metadata only from known proxy connections.", "Authorization must not depend on a spoofable header alone."],
      takeaway: "Establish the proxy trust boundary at the connection layer before using forwarded identity data.",
    },
  },
  {
    id: 5,
    title: "Stream in the Packets",
    subtitle: "Reconstruct an outbound transfer",
    points: 420,
    skill: "Packet analysis",
    tool: "Capture workbench",
    rank: "Network Hunter",
    kind: "packets",
    objective: "Identify the archive transferred out of the festival network.",
    briefing: "Sensors captured traffic around the first alert. Filter or inspect the packet list, then reconstruct the relevant TCP conversation to identify what left the network.",
    hint: "Focus on HTTP requests that send data, then follow the TCP stream used by the external upload.",
    answer: "festival-keys.tar.gz",
    placeholder: "Enter the archive filename",
    reference: "Running Report and Report Part Two",
    lesson: {
      title: "Packets become evidence through context",
      summary: "Individual packets show fragments of a conversation. Display filters narrow the capture, while stream reconstruction places application data back into sequence.",
      concepts: ["HTTP POST commonly carries data from client to server.", "A TCP stream groups packets from one bidirectional connection.", "Headers and multipart bodies can expose filenames and destinations when traffic is unencrypted."],
      takeaway: "Filter broadly enough to find the conversation, then follow the stream to interpret the transfer.",
    },
  },
  {
    id: 6,
    title: "Socket Sequence",
    subtitle: "Implement the relay protocol",
    points: 450,
    skill: "Network scripting",
    tool: "Python protocol runner",
    rank: "Network Hunter",
    kind: "socket",
    objective: "Write a client that completes the relay challenge-response protocol and prints its acceptance code.",
    briefing: "The sandbox exposes a safe relay API and the recovered protocol contract. Implement the complete stateful exchange; a static answer or incomplete receive sequence will be rejected.",
    hint: "Store the first receive as the nonce, hash nonce + ':FESTIVAL', send the digest, then print the second receive.",
    answer: "NEBULA-9050",
    placeholder: "Enter the acceptance code",
    reference: "Sockets and Servers and Galactic Greetings",
    lesson: {
      title: "Network protocols are ordered conversations",
      summary: "A socket client must follow the server's state machine: connect, send the expected message, receive state, transform it correctly, and continue the exchange in order.",
      concepts: ["TCP provides an ordered byte stream, not application message meaning.", "Challenge-response protocols derive a fresh reply from server-provided data.", "Receiving after each required send keeps client and server state synchronized."],
      takeaway: "Translate protocol documentation into explicit ordered send, receive, transform, and validation steps.",
    },
  },
  {
    id: 7,
    title: "Rule Order",
    subtitle: "Repair a first-match firewall",
    points: 480,
    skill: "Firewall policy",
    tool: "Rule-order simulator",
    rank: "Incident Commander",
    kind: "firewall",
    objective: "Reorder the firewall policy so all four traffic tests pass without blocking approved services.",
    briefing: "The gateway applies the first matching rule from top to bottom. The rules are correct individually, but the current order lets one hostile address through a broader partner exception.",
    hint: "A precise exception must be evaluated before any broader rule that also matches the same traffic.",
    answer: "policy verified",
    reference: "Defence Data and the Network field manual",
    lesson: {
      title: "First-match policies are order-sensitive",
      summary: "Many firewalls stop at the first matching rule. A broad allow placed above a narrow deny can shadow the deny even when both rules look correct in isolation.",
      concepts: ["CIDR prefix length controls how specific a network match is.", "Rule shadowing occurs when an earlier rule captures traffic intended for a later rule.", "A policy test suite should protect both security and required availability."],
      takeaway: "Put specific exceptions before overlapping broad rules, then test hostile and approved flows together.",
    },
  },
  {
    id: 8,
    title: "Final Broadcast",
    subtitle: "Correlate the complete incident",
    points: 550,
    skill: "Incident correlation",
    tool: "Evidence report desk",
    rank: "Incident Commander",
    kind: "report",
    objective: "Complete the six-field incident report using the gateway, service, certificate, and stream evidence.",
    briefing: "The livestream is minutes from air. Produce a defensible report from the preserved artifacts so the response team can contain the source without taking approved partners offline.",
    hint: "Treat timestamps, hostnames, fingerprints, and source ranges as join keys; every requested field appears verbatim in one or more artifacts.",
    answer: "report verified",
    reference: "Running Report and Report Part Two",
    lesson: {
      title: "Incident conclusions must be reproducible",
      summary: "A final report turns scattered observations into findings that another responder can verify. Each claim should point back to preserved evidence and support a proportionate containment action.",
      concepts: ["Correlation joins events across logs using time, address, port, hostname, and content.", "A precise source CIDR contains one hostile host without blocking its entire partner network.", "Reports distinguish observed facts from interpretation and recommended action."],
      takeaway: "Make every finding traceable to evidence and every containment step as narrow as the evidence allows.",
    },
  },
];

const cardGlyphs = ["SCAN", "DNS", "TLS", "HTTP", "PCAP", "PY", "ACL", "IR"];

function MiniIcon({ children }: { children: string }) {
  return <span aria-hidden="true">{children}</span>;
}

export function LevelFourGrid({ completed, onBack, onOpen }: { completed: number[]; onBack: () => void; onOpen: (id: number) => void }) {
  const earned = completed.reduce((sum, id) => sum + (levelFourChallenges.find((challenge) => challenge.id === id)?.points ?? 0), 0);
  const available = levelFourChallenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const percent = Math.round((completed.length / levelFourChallenges.length) * 100);

  return (
    <section className="challenge-grid-view level-four-grid" id="main-content">
      <div className="level-banner level-four-banner">
        <button className="back-link" onClick={onBack}>← All levels</button>
        <div className="level-banner-copy">
          <div>
            <p className="kicker">LEVEL 4 · EXPERT</p><h1>Festival Firewall</h1>
            <p>A hostile connection is hiding inside science-fair traffic. Map the edge, test its trust boundaries, reconstruct the transfer, and contain the source before the livestream begins.</p>
            <div className="rank-track" aria-label="Challenge skill progression"><span>Recon Specialist</span><i>→</i><span>Protocol Analyst</span><i>→</i><span>Network Hunter</span><i>→</i><span>Incident Commander</span></div>
          </div>
          <div className="level-score"><span>{completed.length} / 8 complete</span><strong>{earned} / {available} points</strong><div><i style={{ width: `${percent}%` }} /></div></div>
        </div>
      </div>
      <div className="challenge-section-heading"><div><h2>Final-level challenges</h2><p>All 8 expert challenges are open. Play them in any order.</p></div><span className="story-status">{completed.length === 8 ? "Broadcast secured" : "Free explore · all challenges open"}</span></div>
      <div className="challenge-card-grid level-four-card-grid">
        {levelFourChallenges.map((challenge, index) => {
          const done = completed.includes(challenge.id);
          return <button className={`challenge-card level-four-card ${done ? "complete" : ""}`} key={challenge.id} onClick={() => onOpen(challenge.id)}><div className="challenge-card-top"><span className="challenge-index">{done ? <MiniIcon>✓</MiniIcon> : String(challenge.id).padStart(2, "0")}</span><span className="challenge-points">+{challenge.points} pts</span></div><div className={`challenge-graphic level-four-graphic graphic-l4-${challenge.id}`}><div className="mini-window"><span /><span /><span /><strong>{cardGlyphs[index]}</strong></div></div><div className="challenge-card-copy"><div className="challenge-labels"><span>{challenge.skill}</span><em className="rank-level-four">{challenge.rank}</em></div><h3>{challenge.title}</h3><p>{challenge.subtitle}</p><strong>{done ? "Replay challenge" : "Start challenge"}</strong></div></button>;
        })}
      </div>
    </section>
  );
}

const networkHosts: Record<string, { name: string; documented: string; ports: Record<string, string> }> = {
  "10.44.8.10": { name: "festival-gateway", documented: "80/http, 443/https", ports: { "80": "HTTP/1.1 301 Moved Permanently", "443": "TLS gateway · stream.festival.school" } },
  "10.44.8.20": { name: "media-relay", documented: "22/ssh, 443/https", ports: { "22": "SSH-2.0-OpenSSH_9.6", "443": "TLS relay health endpoint", "8443": "FESTIVAL RELAY CONTROL\nservice_codename=AURORA-EDGE\nmode=training" } },
  "10.44.8.30": { name: "stage-encoder", documented: "1935/rtmp", ports: { "1935": "RTMP encoder input · authentication required" } },
};

export function simulateNetworkCommand(input: string) {
  const raw = input.trim();
  const parts = raw.split(/\s+/);
  const command = parts[0]?.toLowerCase();
  if (!raw) return [];
  if (command === "hosts" && parts.length === 1) return ["ADDRESS       HOSTNAME           DOCUMENTED SERVICES", ...Object.entries(networkHosts).map(([address, host]) => `${address.padEnd(13)} ${host.name.padEnd(18)} ${host.documented}`)];
  if (command === "scan" && parts.length === 2) {
    const host = networkHosts[parts[1]];
    return host ? [`Scan report for ${host.name} (${parts[1]})`, ...Object.keys(host.ports).map((port) => `${port}/tcp open`)] : [`scan: ${parts[1]} is outside the registered training assets`];
  }
  if (command === "connect" && parts.length === 3) {
    const host = networkHosts[parts[1]];
    if (!host) return [`connect: unknown training host ${parts[1]}`];
    return host.ports[parts[2]] ? host.ports[parts[2]].split("\n") : [`connect: ${parts[1]}:${parts[2]} refused`];
  }
  return ["usage: hosts | scan HOST | connect HOST PORT"];
}

const dnsRecords: Record<string, string[]> = {
  "stream.festival.school": ["stream.festival.school. 60 IN CNAME live.media.school."],
  "live.media.school": ["live.media.school. 60 IN CNAME edge2.media.school."],
  "edge2.media.school": ["edge2.media.school. 60 IN A 192.0.2.80"],
};

export function simulateDnsQuery(input: string) {
  const parts = input.trim().toLowerCase().split(/\s+/);
  if (parts[0] !== "dig" || parts.length < 2 || parts.length > 3) return ["usage: dig NAME | dig +trace NAME"];
  if (parts[1] === "+trace") {
    if (parts[2] !== "stream.festival.school") return [`${parts[2] || "(missing)"}: NXDOMAIN`];
    return [...dnsRecords["stream.festival.school"], ...dnsRecords["live.media.school"], ...dnsRecords["edge2.media.school"]];
  }
  return dnsRecords[parts[1]] ?? [`${parts[1]}: NXDOMAIN`];
}

export const festivalCertificates = [
  { endpoint: "edge1.media.school", subject: "CN=stream.festival.school", sans: ["stream.festival.school", "status.festival.school"], issuer: "Eastview Training CA", valid: "2026-07-01 → 2026-10-01", fingerprint: "42:11:AC:70:2D:9B" },
  { endpoint: "edge2.media.school", subject: "CN=preview.festival.school", sans: ["preview.festival.school", "staging.festival.school"], issuer: "Eastview Training CA", valid: "2026-07-01 → 2026-10-01", fingerprint: "9F:3A:71:C2:08:6D" },
  { endpoint: "backup.media.school", subject: "CN=stream.festival.school", sans: ["stream.festival.school"], issuer: "Eastview Training CA", valid: "2026-07-15 → 2026-11-15", fingerprint: "61:BB:04:E9:33:7A" },
];

export function simulateProxyRequest(raw: string) {
  const lines = raw.replace(/\r/g, "").split("\n");
  const [method = "", path = ""] = (lines[0] ?? "").trim().split(/\s+/);
  const headers = Object.fromEntries(lines.slice(1).map((line) => { const index = line.indexOf(":"); return index > 0 ? [line.slice(0, index).trim().toLowerCase(), line.slice(index + 1).trim()] : ["", ""]; }).filter(([name]) => name));
  if (path !== "/ops/manifest") return { status: "404 NOT FOUND", body: "route not found" };
  if (method.toUpperCase() !== "GET") return { status: "405 METHOD NOT ALLOWED", body: "GET required" };
  if (headers.host !== "relay.festival.school") return { status: "421 MISDIRECTED REQUEST", body: "unexpected host" };
  if (!headers["x-forwarded-for"]) return { status: "400 BAD REQUEST", body: "forwarding context missing" };
  if (headers["x-forwarded-for"] !== "10.44.8.10") return { status: "403 FORBIDDEN", body: "operations route restricted to gateway" };
  return { status: "200 OK", body: "manifest_state=exposed\naudit_marker=PROXY-TRUST-BROKEN" };
}

export type FestivalPacket = { no: number; time: string; source: string; destination: string; protocol: string; stream: number; method?: string; info: string };
export const festivalPackets: FestivalPacket[] = [
  { no: 1, time: "14:02:10.102", source: "10.44.8.30", destination: "10.44.8.10", protocol: "TCP", stream: 0, info: "50422 → 1935 [ACK]" },
  { no: 2, time: "14:02:11.408", source: "10.44.8.41", destination: "192.0.2.53", protocol: "DNS", stream: 1, info: "Standard query A schedule.festival.school" },
  { no: 3, time: "14:02:13.220", source: "10.44.8.10", destination: "198.51.100.25", protocol: "HTTP", stream: 2, method: "GET", info: "GET /health HTTP/1.1" },
  { no: 4, time: "14:02:14.701", source: "198.51.100.25", destination: "10.44.8.10", protocol: "HTTP", stream: 2, info: "HTTP/1.1 200 OK" },
  { no: 5, time: "14:03:01.009", source: "10.44.8.20", destination: "203.0.113.17", protocol: "TLS", stream: 3, info: "Application Data" },
  { no: 6, time: "14:03:44.318", source: "10.44.8.20", destination: "198.51.100.77", protocol: "HTTP", stream: 4, method: "POST", info: "POST /drop/upload HTTP/1.1" },
  { no: 7, time: "14:03:44.562", source: "198.51.100.77", destination: "10.44.8.20", protocol: "HTTP", stream: 4, info: "HTTP/1.1 201 Created" },
  { no: 8, time: "14:04:10.221", source: "10.44.8.30", destination: "10.44.8.10", protocol: "HTTP", stream: 5, method: "POST", info: "POST /telemetry HTTP/1.1" },
];

export function filterFestivalPackets(filter: string) {
  const value = filter.trim().toLowerCase();
  if (!value) return { rows: festivalPackets, error: "" };
  if (value === "http") return { rows: festivalPackets.filter((packet) => packet.protocol === "HTTP"), error: "" };
  if (value === "http.request.method == post" || value === "http.request.method == \"post\"") return { rows: festivalPackets.filter((packet) => packet.method === "POST"), error: "" };
  const stream = value.match(/^tcp\.stream\s+(?:eq|==)\s+(\d+)$/);
  if (stream) return { rows: festivalPackets.filter((packet) => packet.stream === Number(stream[1])), error: "" };
  const address = value.match(/^ip\.addr\s*==\s*([\d.]+)$/);
  if (address) return { rows: festivalPackets.filter((packet) => packet.source === address[1] || packet.destination === address[1]), error: "" };
  return { rows: festivalPackets, error: "Invalid display filter." };
}

export function followFestivalStream(stream: number) {
  if (stream === 4) return ["POST /drop/upload HTTP/1.1", "Host: fileshare.example", "Content-Type: multipart/form-data; boundary=festival", "", "Content-Disposition: form-data; name=\"file\"; filename=\"festival-keys.tar.gz\"", "Content-Type: application/gzip", "", "[18432 bytes]", "", "HTTP/1.1 201 Created"];
  if (stream === 2) return ["GET /health HTTP/1.1", "Host: partner-monitor.example", "", "HTTP/1.1 200 OK", "status=green"];
  if (stream === 5) return ["POST /telemetry HTTP/1.1", "Host: gateway.festival.school", "Content-Type: application/json", "", '{"encoder":"stage-a","temperature":41}'];
  return ["No reconstructable plaintext application stream for this selection."];
}

export function analyzeSocketSource(source: string) {
  const receiveCount = source.match(/relay\.recv\s*\(/g)?.length ?? 0;
  const checks = [
    { valid: /relay\.connect\s*\(\s*["']10\.44\.8\.20["']\s*,\s*9050\s*\)/.test(source), message: "Connection does not match the protocol endpoint." },
    { valid: /relay\.send\s*\(\s*["']HELLO["']\s*\)/.test(source), message: "The required greeting was not sent." },
    { valid: receiveCount >= 2, message: "The protocol requires two receive operations." },
    { valid: /sha256\s*\(/.test(source) && /FESTIVAL/.test(source), message: "The nonce response is not derived with the required SHA-256 construction." },
    { valid: /relay\.send\s*\([^)]*(?:digest|hexdigest|response)/is.test(source), message: "The derived digest is not sent to the relay." },
    { valid: /print\s*\(\s*relay\.recv\s*\(/.test(source) || /print\s*\(\s*(?:reply|result|response|code)\s*\)/.test(source), message: "The final relay reply is not printed." },
  ];
  return checks.filter((check) => !check.valid).map((check) => check.message);
}

export type FirewallRule = { id: string; action: "ALLOW" | "DENY"; source: string; port: string; label: string };
export const initialFirewallRules: FirewallRule[] = [
  { id: "crew", action: "ALLOW", source: "10.44.8.0/24", port: "443", label: "Festival crew HTTPS" },
  { id: "partner", action: "ALLOW", source: "203.0.113.0/24", port: "443", label: "Approved partner HTTPS" },
  { id: "hostile", action: "DENY", source: "203.0.113.88/32", port: "ANY", label: "Confirmed hostile source" },
  { id: "admin", action: "DENY", source: "ANY", port: "8443", label: "Block relay control from outside" },
  { id: "default", action: "DENY", source: "ANY", port: "ANY", label: "Default deny" },
];

function sourceMatches(ruleSource: string, address: string) {
  if (ruleSource === "ANY") return true;
  if (ruleSource.endsWith("/32")) return ruleSource.slice(0, -3) === address;
  if (ruleSource.endsWith("/24")) return ruleSource.split(".").slice(0, 3).join(".") === address.split(".").slice(0, 3).join(".");
  return ruleSource === address;
}

const firewallTests = [
  { name: "Festival crew stream", source: "10.44.8.33", port: "443", expected: "ALLOW" },
  { name: "Approved partner", source: "203.0.113.40", port: "443", expected: "ALLOW" },
  { name: "Hostile partner address", source: "203.0.113.88", port: "443", expected: "DENY" },
  { name: "External relay control", source: "198.51.100.44", port: "8443", expected: "DENY" },
] as const;

export function evaluateFirewallOrder(rules: FirewallRule[]) {
  const results = firewallTests.map((test) => {
    const match = rules.find((rule) => sourceMatches(rule.source, test.source) && (rule.port === "ANY" || rule.port === test.port));
    const actual = match?.action ?? "DENY";
    return { ...test, actual, rule: match?.label ?? "Implicit deny", pass: actual === test.expected };
  });
  return { results, pass: results.every((result) => result.pass) };
}

export type FinalReport = { source: string; port: string; service: string; endpoint: string; archive: string; containment: string };
export function validateFinalReport(report: FinalReport) {
  const expected: FinalReport = { source: "203.0.113.88", port: "8443", service: "AURORA-EDGE", endpoint: "edge2.media.school", archive: "festival-keys.tar.gz", containment: "203.0.113.88/32" };
  const invalid = (Object.keys(expected) as (keyof FinalReport)[]).filter((key) => report[key].trim().toLowerCase() !== expected[key].toLowerCase());
  return { pass: invalid.length === 0, invalid };
}

const reportArtifacts = {
  gateway: ["2026-08-19T14:02:58Z allow src=203.0.113.40 dst=10.44.8.10:443 rule=partner", "2026-08-19T14:03:02Z allow src=203.0.113.88 dst=10.44.8.20:8443 rule=partner", "2026-08-19T14:03:05Z alert src=203.0.113.88 signature=relay-control-probe", "2026-08-19T14:04:12Z allow src=10.44.8.30 dst=10.44.8.10:443 rule=crew"],
  service: ["host=10.44.8.20 port=22 state=approved service=ssh", "host=10.44.8.20 port=443 state=approved service=https", "host=10.44.8.20 port=8443 state=unregistered", "probe=10.44.8.20:8443 server=FESTIVAL_RELAY service_codename=AURORA-EDGE"],
  certificate: ["endpoint=edge1.media.school san=stream.festival.school fingerprint=42:11:AC:70:2D:9B", "endpoint=edge2.media.school san=preview.festival.school fingerprint=9F:3A:71:C2:08:6D", "endpoint=backup.media.school san=stream.festival.school fingerprint=61:BB:04:E9:33:7A", "expected_hostname=stream.festival.school"],
  stream: ["tcp.stream=4 src=10.44.8.20 dst=198.51.100.77", "POST /drop/upload HTTP/1.1", "Content-Disposition: form-data; name=\"file\"; filename=\"festival-keys.tar.gz\"", "HTTP/1.1 201 Created", "containment_scope=single confirmed source; preserve approved partner subnet"],
};

export function LevelFourWorkspace({ activeId, completed, setCompleted, onBack, onNavigate }: { activeId: number; completed: number[]; setCompleted: Dispatch<SetStateAction<number[]>>; onBack: () => void; onNavigate: (id: number) => void }) {
  const challenge = levelFourChallenges.find((item) => item.id === activeId)!;
  const [panel, setPanel] = useState<Panel>("briefing");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [networkInput, setNetworkInput] = useState("");
  const [networkLines, setNetworkLines] = useState(["Festival range console · authorized assets only", "Type a supported command to begin."]);
  const [dnsInput, setDnsInput] = useState("");
  const [dnsLines, setDnsLines] = useState(["Resolver console · festival training zone loaded"]);
  const [certificate, setCertificate] = useState(festivalCertificates[0]);
  const [rawRequest, setRawRequest] = useState("GET /ops/manifest HTTP/1.1\nHost: relay.festival.school\nX-Forwarded-For: 198.51.100.44\nConnection: close");
  const [proxyResponse, setProxyResponse] = useState({ status: "NO REQUEST", body: "Send the raw request to inspect the response." });
  const [packetFilter, setPacketFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [selectedPacket, setSelectedPacket] = useState(1);
  const [streamLines, setStreamLines] = useState(["Select a packet and follow its TCP stream."]);
  const [socketCode, setSocketCode] = useState("from hashlib import sha256\nimport relay\n\n# Implement the recovered protocol contract.\n");
  const [socketOutput, setSocketOutput] = useState(["Runner idle."]);
  const [rules, setRules] = useState<FirewallRule[]>(initialFirewallRules);
  const [firewallResult, setFirewallResult] = useState<ReturnType<typeof evaluateFirewallOrder> | null>(null);
  const [reportTab, setReportTab] = useState<keyof typeof reportArtifacts>("gateway");
  const [report, setReport] = useState<FinalReport>({ source: "", port: "", service: "", endpoint: "", archive: "", containment: "" });
  const [reportInvalid, setReportInvalid] = useState<(keyof FinalReport)[]>([]);

  const isComplete = completed.includes(activeId);
  const packetResult = useMemo(() => filterFestivalPackets(appliedFilter), [appliedFilter]);

  function runNetwork(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!networkInput.trim()) return; const response = simulateNetworkCommand(networkInput); setNetworkLines((current) => [...current, `net> ${networkInput.trim()}`, ...response]); setNetworkInput(""); }
  function runDns(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!dnsInput.trim()) return; const response = simulateDnsQuery(dnsInput); setDnsLines((current) => [...current, `resolver> ${dnsInput.trim()}`, ...response]); setDnsInput(""); }
  function sendProxy(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setProxyResponse(simulateProxyRequest(rawRequest)); }
  function applyPacketFilter(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setAppliedFilter(packetFilter); }
  function runSocketCode() { const missing = analyzeSocketSource(socketCode); setSocketOutput(missing.length ? ["Protocol run rejected.", ...missing] : ["connected 10.44.8.20:9050", "recv nonce=7f13c2", "digest accepted", "NEBULA-9050", "connection closed"]); }
  function moveRule(index: number, direction: -1 | 1) { const target = index + direction; if (target < 0 || target >= rules.length) return; const next = [...rules]; [next[index], next[target]] = [next[target], next[index]]; setRules(next); setFirewallResult(null); }
  function updateReport(key: keyof FinalReport, value: string) { setReport((current) => ({ ...current, [key]: value })); setReportInvalid((current) => current.filter((field) => field !== key)); }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let correct = answer.trim().toLowerCase() === challenge.answer.toLowerCase();
    if (challenge.kind === "firewall") { const result = evaluateFirewallOrder(rules); setFirewallResult(result); correct = result.pass; }
    if (challenge.kind === "report") { const result = validateFinalReport(report); setReportInvalid(result.invalid); correct = result.pass; }
    if (correct) { setCompleted((current) => current.includes(activeId) ? current : [...current, activeId]); setFeedback(activeId === 8 ? "Final level complete! The broadcast response is verified." : "Correct! Challenge complete."); setCelebrating(true); }
    else setFeedback(challenge.kind === "report" ? "Report not verified. Recheck the marked fields against the evidence." : challenge.kind === "firewall" ? "Policy tests still fail. Review first-match behavior." : "Not quite. Review the evidence and try again.");
  }

  const usesTextAnswer = challenge.kind !== "firewall" && challenge.kind !== "report";

  return (
    <section className="challenge-workspace level-four-workspace" id="main-content">
      {celebrating && <div className="success-celebration"><section className="flag-notification level-four-flag" role="status" aria-live="assertive"><button className="flag-close" onClick={() => setCelebrating(false)} aria-label="Close success notification">×</button><span className="flag-check" aria-hidden="true">✓</span><div><small>LEVEL 4 · CHALLENGE {activeId} COMPLETE</small><strong>Finding verified!</strong><code>CQ-L4-C{String(activeId).padStart(2, "0")}</code></div><button className="flag-continue" onClick={() => { setCelebrating(false); if (activeId < 8) onNavigate(activeId + 1); else onBack(); }}>{activeId < 8 ? "Next challenge →" : "View completed level"}</button></section></div>}

      <aside className="challenge-sidebar level-four-sidebar">
        <div className="sidebar-top"><button className="round-back" onClick={onBack}>←<span className="sr-only">Back to challenge grid</span></button><div><h1>{challenge.title}</h1><p>L4 C{String(activeId).padStart(2, "0")} · {challenge.tool} · {challenge.rank}</p></div></div>
        <div className="points-row"><span>Worth</span><strong><MiniIcon>★</MiniIcon> {challenge.points} points</strong></div>
        <div className="sidebar-tabs" role="tablist" aria-label="Challenge information"><button role="tab" aria-selected={panel === "briefing"} className={panel === "briefing" ? "active" : ""} onClick={() => setPanel("briefing")}><MiniIcon>i</MiniIcon>Briefing</button><button role="tab" aria-selected={panel === "manual"} className={panel === "manual" ? "active" : ""} onClick={() => setPanel("manual")}><MiniIcon>▤</MiniIcon>Field manual</button><button role="tab" aria-selected={panel === "hint"} className={panel === "hint" ? "active" : ""} onClick={() => setPanel("hint")}><MiniIcon>?</MiniIcon>Hint</button></div>
        <div className="sidebar-info" role="tabpanel"><span>{panel === "briefing" ? "Mission briefing" : panel === "manual" ? "Post-challenge lesson" : "Hint"}</span>{panel === "briefing" && <p>{challenge.briefing}</p>}{panel === "hint" && <p>{challenge.hint}</p>}{panel === "manual" && <section className={`mini-lesson ${isComplete ? "unlocked" : "locked"}`} aria-label="Post-challenge cyber mini-lesson"><div className="mini-lesson-heading"><span>{isComplete ? "LESSON UNLOCKED" : "LOCKED UNTIL SOLVED"}</span><strong>Cyber mini-lesson</strong></div>{isComplete ? <><h3>{challenge.lesson.title}</h3><p>{challenge.lesson.summary}</p><h4>What you learned</h4><ul>{challenge.lesson.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul><div className="lesson-takeaway"><strong>Remember</strong><p>{challenge.lesson.takeaway}</p></div><p className="challenge-inspiration">Mechanic inspired by “{challenge.reference}” from the CyberStart 2024 archive (CC BY-SA 4.0). Scenario and artifacts were remade for Cyber Quest.</p></> : <p className="lesson-locked-copy">Solve this challenge to unlock the lesson explaining the real cybersecurity idea behind it.</p>}</section>}<div className="objective-box"><strong>Your task</strong><p>{challenge.objective}</p></div></div>
        <form className="answer-form" onSubmit={submit}>{usesTextAnswer ? <label htmlFor="level-four-answer">Your answer</label> : <span className="answer-form-label">{challenge.kind === "firewall" ? "Current firewall policy" : "Current incident report"}</span>}{usesTextAnswer ? <input id="level-four-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={challenge.placeholder} autoComplete="off" /> : <div className="selection-status" id="level-four-answer">{challenge.kind === "firewall" ? (firewallResult ? `${firewallResult.results.filter((result) => result.pass).length} / 4 tests passing` : "Traffic tests not run") : `${Object.values(report).filter((value) => value.trim()).length} / 6 fields completed`}</div>}<button className="submit-answer" type="submit">Check answer ↵</button><p className={`answer-feedback ${feedback.startsWith("Correct") || feedback.startsWith("Final") ? "success" : ""}`} aria-live="polite">{feedback || "You can try as many times as you need."}</p></form>
        <div className="challenge-nav"><button disabled={activeId === 1} onClick={() => onNavigate(activeId - 1)}>← Previous</button><button disabled={activeId === 8} onClick={() => onNavigate(activeId + 1)}>Next →</button></div>
      </aside>

      <div className="challenge-main level-four-main">
        <div className="challenge-stage-heading"><div><span>CHALLENGE {activeId} OF 8 · {challenge.rank}</span><h2>{challenge.objective}</h2></div><button onClick={onBack}>View all challenges</button></div>

        {activeId === 1 && <div className="expert-stage network-sweep"><div className="expert-window"><div className="expert-titlebar"><span>FESTIVAL RANGE CONSOLE</span><strong>AUTHORIZED · 10.44.8.0/24</strong></div><div className="scope-note"><strong>Asset register</strong><span>Three registered hosts · service inventory included in `hosts` output</span></div><div className="expert-console" aria-live="polite">{networkLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div><form className="expert-command" onSubmit={runNetwork}><label htmlFor="network-command">net&gt;</label><input id="network-command" value={networkInput} onChange={(event) => setNetworkInput(event.target.value)} autoComplete="off" autoFocus /><button type="submit">Run</button></form><div className="command-reference"><span>hosts</span><span>scan HOST</span><span>connect HOST PORT</span></div></div></div>}

        {activeId === 2 && <div className="expert-stage dns-lab"><div className="expert-window"><div className="expert-titlebar"><span>TRAINING DNS RESOLVER</span><strong>festival.school zone</strong></div><div className="dns-target"><small>TARGET HOSTNAME</small><strong>stream.festival.school</strong><span>Record types available: CNAME · A</span></div><div className="expert-console" aria-live="polite">{dnsLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div><form className="expert-command" onSubmit={runDns}><label htmlFor="dns-command">resolver&gt;</label><input id="dns-command" value={dnsInput} onChange={(event) => setDnsInput(event.target.value)} autoComplete="off" /><button type="submit">Query</button></form><div className="command-reference"><span>dig NAME</span><span>dig +trace NAME</span></div></div></div>}

        {activeId === 3 && <div className="expert-stage certificate-lab"><div className="expert-window"><div className="expert-titlebar"><span>EDGE CERTIFICATE PROBE</span><strong>Expected host · stream.festival.school</strong></div><div className="certificate-layout"><aside><small>ENDPOINTS</small>{festivalCertificates.map((item) => <button key={item.endpoint} className={certificate.endpoint === item.endpoint ? "active" : ""} onClick={() => setCertificate(item)}><strong>{item.endpoint}</strong><span>Probe certificate</span></button>)}</aside><section className="certificate-sheet"><div><small>CONNECTED ENDPOINT</small><strong>{certificate.endpoint}:443</strong></div><dl><div><dt>Subject</dt><dd>{certificate.subject}</dd></div><div><dt>Subject Alternative Name</dt><dd>{certificate.sans.join(" · ")}</dd></div><div><dt>Issuer</dt><dd>{certificate.issuer}</dd></div><div><dt>Validity</dt><dd>{certificate.valid}</dd></div><div><dt>SHA-256 fingerprint</dt><dd><code>{certificate.fingerprint}</code></dd></div></dl></section></div></div></div>}

        {activeId === 4 && <div className="expert-stage proxy-lab"><div className="expert-window"><div className="expert-titlebar"><span>RAW HTTP REQUEST LAB</span><strong>relay.festival.school</strong></div><div className="proxy-layout"><aside><small>NETWORK NOTE · net-17.txt</small><p>Public clients reach the relay backend through the festival gateway.</p><dl><div><dt>Reverse proxy</dt><dd>10.44.8.10</dd></div><div><dt>Backend</dt><dd>10.44.8.20</dd></div><div><dt>Operations route</dt><dd>/ops/manifest</dd></div></dl><p>Only requests arriving from the reverse proxy may access operations routes.</p></aside><form onSubmit={sendProxy}><label htmlFor="raw-request">Raw request</label><textarea id="raw-request" value={rawRequest} onChange={(event) => setRawRequest(event.target.value)} spellCheck={false} /><button type="submit">Send request</button></form><section className="proxy-response" aria-live="polite"><span>RESPONSE</span><strong>HTTP/1.1 {proxyResponse.status}</strong><pre>{proxyResponse.body}</pre></section></div></div></div>}

        {activeId === 5 && <div className="expert-stage pcap-lab"><div className="expert-window"><div className="expert-titlebar"><span>festival-edge.pcapng</span><strong>8 packets · preserved capture</strong></div><form className="packet-filter" onSubmit={applyPacketFilter}><label htmlFor="packet-filter">Display filter</label><input id="packet-filter" value={packetFilter} onChange={(event) => setPacketFilter(event.target.value)} placeholder="e.g. http or tcp.stream eq 4" /><button type="submit">Apply</button><span aria-live="polite">{packetResult.error || `${packetResult.rows.length} packet(s) displayed`}</span></form><div className="packet-split"><section className="packet-table-wrap"><table className="expert-table"><thead><tr><th>No.</th><th>Time</th><th>Source</th><th>Destination</th><th>Protocol</th><th>Info</th></tr></thead><tbody>{packetResult.rows.map((packet) => <tr key={packet.no} className={selectedPacket === packet.no ? "selected" : ""} onClick={() => setSelectedPacket(packet.no)}><td>{packet.no}</td><td>{packet.time}</td><td>{packet.source}</td><td>{packet.destination}</td><td>{packet.protocol}</td><td>{packet.info}</td></tr>)}</tbody></table></section><aside className="stream-view"><div><span>TCP STREAM</span><button onClick={() => { const packet = festivalPackets.find((item) => item.no === selectedPacket); setStreamLines(packet ? followFestivalStream(packet.stream) : ["Select a packet first."]); }}>Follow selected stream</button></div><pre>{streamLines.join("\n")}</pre></aside></div></div></div>}

        {activeId === 6 && <div className="expert-stage socket-lab"><div className="expert-window"><div className="expert-titlebar"><span>PYTHON RELAY SANDBOX</span><strong>Stateful protocol simulation</strong></div><div className="socket-layout"><aside><small>RECOVERED PROTOCOL CONTRACT</small><dl className="protocol-sheet"><div><dt>Endpoint</dt><dd><code>10.44.8.20:9050</code></dd></div><div><dt>Client frame 1</dt><dd><code>HELLO</code></dd></div><div><dt>Server frame 1</dt><dd><code>NONCE &lt;hex&gt;</code></dd></div><div><dt>Client frame 2</dt><dd><code>SHA256_HEX(&lt;nonce&gt; + &quot;:FESTIVAL&quot;)</code></dd></div><div><dt>Server frame 2</dt><dd><code>ACCEPT &lt;code&gt;</code></dd></div></dl><p>Read each server frame. Print the acceptance payload.</p><code>relay.connect(host, port)</code><code>relay.send(text)</code><code>relay.recv() → text</code></aside><section><div className="code-editor-heading"><span>relay_client.py</span><button onClick={() => setSocketCode("from hashlib import sha256\nimport relay\n\n# Implement the recovered protocol contract.\n")}>Reset</button></div><textarea className="code-editor" aria-label="Python relay client" value={socketCode} onChange={(event) => setSocketCode(event.target.value)} spellCheck={false} /><button className="run-code" onClick={runSocketCode}>Run client</button><div className="code-output" aria-live="polite"><span>OUTPUT</span>{socketOutput.map((line, index) => <code key={`${line}-${index}`}>{line}</code>)}</div></section></div></div></div>}

        {activeId === 7 && <div className="expert-stage firewall-lab"><div className="expert-window"><div className="expert-titlebar"><span>FESTIVAL GATEWAY POLICY</span><strong>First match wins</strong></div><div className="firewall-layout"><section><div className="rule-heading"><span>ORDER</span><span>ACTION</span><span>SOURCE</span><span>PORT</span><span>DESCRIPTION</span><span>MOVE</span></div>{rules.map((rule, index) => <div className="firewall-rule" key={rule.id}><b>{index + 1}</b><strong className={rule.action.toLowerCase()}>{rule.action}</strong><code>{rule.source}</code><code>{rule.port}</code><span>{rule.label}</span><div><button aria-label={`Move ${rule.label} up`} disabled={index === 0} onClick={() => moveRule(index, -1)}>↑</button><button aria-label={`Move ${rule.label} down`} disabled={index === rules.length - 1} onClick={() => moveRule(index, 1)}>↓</button></div></div>)}<button className="run-policy" onClick={() => setFirewallResult(evaluateFirewallOrder(rules))}>Run traffic tests</button></section><aside><small>TRAFFIC TEST SUITE</small>{firewallResult ? firewallResult.results.map((result) => <div className={result.pass ? "pass" : "fail"} key={result.name}><strong>{result.pass ? "PASS" : "FAIL"} · {result.name}</strong><span>{result.source}:{result.port}</span><code>expected {result.expected} · got {result.actual}</code></div>) : <div className="not-run"><strong>NOT RUN</strong><span>Execute the policy to populate results.</span></div>}</aside></div></div></div>}

        {activeId === 8 && <div className="expert-stage report-lab"><div className="expert-window"><div className="expert-titlebar"><span>FINAL INCIDENT REPORT DESK</span><strong>CQ-2026-0819</strong></div><div className="report-layout"><section className="artifact-viewer"><nav aria-label="Report evidence">{(Object.keys(reportArtifacts) as (keyof typeof reportArtifacts)[]).map((key) => <button key={key} className={reportTab === key ? "active" : ""} onClick={() => setReportTab(key)}>{key === "gateway" ? "gateway.log" : key === "service" ? "service_inventory.txt" : key === "certificate" ? "certificates.tsv" : "tcp-stream-4.txt"}</button>)}</nav><div><small>PRESERVED EVIDENCE · READ ONLY</small>{reportArtifacts[reportTab].map((line, index) => <code key={`${line}-${index}`}>{line}</code>)}</div></section><section className="incident-report"><div><small>REPORT FIELDS</small><strong>Containment briefing</strong></div>{([{ key: "source", label: "Confirmed attack source", placeholder: "IPv4 address" }, { key: "port", label: "Targeted relay port", placeholder: "Port" }, { key: "service", label: "Unregistered service codename", placeholder: "Codename" }, { key: "endpoint", label: "Certificate-mismatch endpoint", placeholder: "Hostname" }, { key: "archive", label: "Transferred archive", placeholder: "Filename" }, { key: "containment", label: "Minimal source containment", placeholder: "CIDR" }] as { key: keyof FinalReport; label: string; placeholder: string }[]).map((field) => <label key={field.key} className={reportInvalid.includes(field.key) ? "invalid" : ""}>{field.label}<input value={report[field.key]} onChange={(event) => updateReport(field.key, event.target.value)} placeholder={field.placeholder} /><span>{reportInvalid.includes(field.key) ? "Not verified against evidence" : ""}</span></label>)}</section></div>{completed.length === 8 && <div className="level-complete-banner"><MiniIcon>★</MiniIcon><div><strong>Final level complete · Incident Commander earned</strong><span>The hostile source is contained and the festival broadcast is cleared to begin.</span></div></div>}</div></div>}
      </div>
    </section>
  );
}
