// ARCHIVED CHALLENGE BANK
// Not imported by the Stage 1 legacy experience. Stages 2–6 stay here until they are added one at a time.

export type ChallengeKind = "text" | "choice" | "multi" | "order" | "terminal";

export type EvidenceBlock = {
  title: string;
  lines: string[];
  format?: "plain" | "code" | "log" | "email" | "hidden";
};

export type ChallengeOption = {
  id: string;
  label: string;
  detail?: string;
};

export type Challenge = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  points: number;
  skill: string;
  tool: string;
  kind: ChallengeKind;
  objective: string;
  briefing: string;
  manual: string[];
  hints: string[];
  answer: string | string[];
  placeholder?: string;
  evidence: EvidenceBlock[];
  options?: ChallengeOption[];
  research?: {
    prompt: string;
    searchTerms: string[];
    sourceTip: string;
  };
  terminal?: Record<string, string[]>;
};

export type Level = {
  id: number;
  title: string;
  stage: string;
  difficulty: string;
  description: string;
  story: string;
  color: string;
  icon: string;
  challenges: Challenge[];
};

const option = (id: string, label: string, detail?: string): ChallengeOption => ({
  id,
  label,
  detail,
});

export const levels: Level[] = [
  {
    id: 1,
    title: "Signal Lost",
    stage: "Cyber Scout",
    difficulty: "Beginner",
    description: "Find Bolt before the science fair begins.",
    story:
      "One hour before the science fair, Bolt disappears from the Robot Club network. Follow the trail, separate trustworthy evidence from distractions, and bring the helper robot home safely.",
    color: "#2f78c4",
    icon: ">_",
    challenges: [
      {
        id: "l1-c1",
        number: 1,
        title: "Hidden in Plain Sight",
        subtitle: "Find the club contact",
        points: 100,
        skill: "Page inspection",
        tool: "Website",
        kind: "text",
        objective: "Recover the contact address hidden in Riley's profile.",
        briefing:
          "Riley's public profile contains a contact line that looks blank. The page is safe and fictional; inspect what the browser is already showing.",
        manual: [
          "Webpages can contain text whose color matches its background.",
          "Selecting text is a harmless first inspection technique.",
          "Copy the complete address exactly, including the domain.",
        ],
        hints: [
          "The empty-looking line still takes up space.",
          "Drag across the blank line as if selecting a sentence.",
        ],
        answer: "riley@robotclub.school",
        placeholder: "Enter the hidden email address",
        evidence: [
          {
            title: "Riley Chen · Robot Club",
            lines: [
              "Builder of Bolt · Science Fair Team",
              "riley@robotclub.school",
              "If Bolt wanders, check the charging map before calling.",
            ],
            format: "hidden",
          },
        ],
      },
      {
        id: "l1-c2",
        number: 2,
        title: "Mixed-Up Message",
        subtitle: "Recognize the pattern",
        points: 100,
        skill: "Text patterns",
        tool: "Message board",
        kind: "text",
        objective: "Decode Riley's post and enter the room code.",
        briefing:
          "A hurried post was stored backward by a buggy display. Find the pattern before reaching for a complicated decoder.",
        manual: [
          "Encoding changes representation; reversing only changes order.",
          "Test a small piece of a message before applying a theory to all of it.",
        ],
        hints: ["Compare the first and last three characters.", "Read from right to left."],
        answer: "LAB3",
        placeholder: "Enter the room code",
        evidence: [
          {
            title: "Robot Club post · 3:42 PM",
            lines: [".3BAL ni pam gnigrahc eht kcehC"],
            format: "code",
          },
        ],
      },
      {
        id: "l1-c3",
        number: 3,
        title: "The Fake Update",
        subtitle: "Read beyond the display name",
        points: 120,
        skill: "Phishing",
        tool: "Email",
        kind: "choice",
        objective: "Select the detail that proves the update email is not from the district.",
        briefing:
          "An urgent email claims Bolt needs an update. Several details feel odd, but only one directly disproves the sender's claim.",
        manual: [
          "A display name can say anything; the address after @ identifies the sending domain.",
          "Urgency and awkward wording are warning signs, not proof by themselves.",
          "Compare the full domain with a known-good source.",
        ],
        hints: ["Use the footer as a known-good reference.", "Compare the two domains letter by letter."],
        answer: "sender",
        options: [
          option("subject", "Subject: URGENT — Bolt update expires today"),
          option("sender", "From: District Robotics <updates@distrlct-it.school>"),
          option("greeting", "Greeting: Hello Robot Club member"),
          option("footer", "Footer: District IT · district-it.school"),
        ],
        evidence: [
          {
            title: "Message preview",
            lines: [
              "From: District Robotics <updates@distrlct-it.school>",
              "Subject: URGENT — Bolt update expires today",
              "Hello Robot Club member. Sign in before 4:00 PM.",
              "District IT help center: district-it.school",
            ],
            format: "email",
          },
        ],
      },
      {
        id: "l1-c4",
        number: 4,
        title: "Password Pitfall",
        subtitle: "Judge strength, not appearance",
        points: 120,
        skill: "Password safety",
        tool: "Security check",
        kind: "choice",
        objective: "Choose the best new password for the shared club account.",
        briefing:
          "The fake update may have captured the old password. Choose a replacement that is long, unique, and unrelated to public club facts.",
        manual: [
          "Length and uniqueness matter more than swapping one letter for a symbol.",
          "Public details such as mascot names and graduation years are guessable.",
          "A password manager can create and store a unique password.",
        ],
        hints: ["Eliminate anything tied to Robot Club.", "Prefer several unrelated words over predictable substitutions."],
        answer: "orbit-cactus-lantern-47!",
        options: [
          option("B0lt2026!", "B0lt2026!", "Uses the robot name and current year"),
          option("RobotClub#1", "RobotClub#1", "Uses the account's purpose"),
          option("orbit-cactus-lantern-47!", "orbit-cactus-lantern-47!", "Long unrelated phrase"),
          option("ScienceFair!", "ScienceFair!", "Uses a public event"),
        ],
        evidence: [
          {
            title: "Public club facts",
            lines: ["Robot: Bolt", "Event: 2026 Science Fair", "Club room: Lab 3"],
          },
        ],
      },
      {
        id: "l1-c5",
        number: 5,
        title: "Terminal Trail",
        subtitle: "Read Bolt's last log",
        points: 150,
        skill: "Command line",
        tool: "Training terminal",
        kind: "terminal",
        objective: "Use terminal commands to find Bolt's last recorded location.",
        briefing:
          "A safe training terminal contains Bolt's final status file. Explore with read-only commands, then submit the location found inside.",
        manual: [
          "pwd prints the current folder.",
          "ls lists available files.",
          "cat filename.txt reads a text file without changing it.",
          "Run one command, inspect its output, then decide what to do next.",
        ],
        hints: ["Start by listing files.", "The filename mentioning Bolt is worth reading with cat."],
        answer: "charging-station-4",
        placeholder: "Enter Bolt's location",
        evidence: [
          {
            title: "Read-only training shell",
            lines: ["Allowed commands: pwd, ls, cat <file>, clear", "No real device or shell is connected."],
            format: "code",
          },
        ],
        terminal: {
          pwd: ["/school/robot-club/logs"],
          ls: ["bolt.txt  inventory.txt  welcome.txt"],
          "cat bolt.txt": ["15:41 status=offline", "last_seen=charging-station-4", "route=manual-return"],
          "cat inventory.txt": ["spare-wheel=2", "battery-pack=1"],
          "cat welcome.txt": ["Robot Club diagnostic archive"],
        },
      },
      {
        id: "l1-c6",
        number: 6,
        title: "Bring Bolt Home",
        subtitle: "Respond without destroying evidence",
        points: 180,
        skill: "Safe recovery",
        tool: "Control center",
        kind: "order",
        objective: "Put the four recovery steps in a safe order.",
        briefing:
          "Bolt is physically safe. The account and update path may not be. Build a response that reports, secures, verifies, and restores.",
        manual: [

          "Report suspicious activity before details are lost.",
          "Secure affected access through the real service.",
          "Verify software before reconnecting a device.",
          "Restore only after the risky path is contained.",
        ],
        hints: ["Do not reconnect first.", "Reporting and account containment come before restoration."],
        answer: ["report", "secure", "verify", "restore"],
        options: [
          option("restore", "Reconnect Bolt to the club network"),
          option("verify", "Verify the update through district-it.school"),
          option("report", "Report and preserve the suspicious email"),
          option("secure", "Reset the password and enable MFA through the real portal"),
        ],
        evidence: [
          { title: "Known facts", lines: ["Bolt is powered off", "Fake update email preserved", "No verified update installed"] },
        ],
      },
      {
        id: "l1-c7",
        number: 7,
        title: "The Look-Alike Link",
        subtitle: "Find the registered domain",
        points: 150,
        skill: "URL analysis",
        tool: "Browser",
        kind: "choice",
        objective: "Choose the real Robot Club sign-in address.",
        briefing:
          "Four bookmarks use familiar words. Read the hostname precisely; a padlock only protects the connection to whichever site you chose.",
        manual: [
          "The hostname sits after https:// and before the next slash.",
          "Read hostnames from right to left to find the registered domain.",
          "Words placed before a registered domain are subdomains; words after a familiar phrase may belong to a different domain.",
        ],
        hints: ["Ignore the path after the first single slash.", "Only one hostname ends exactly in robotclub.school."],
        answer: "real",
        options: [
          option("helper", "https://robotclub.school.login-helper.org/portal"),
          option("real", "https://accounts.robotclub.school/sign-in"),
          option("plural", "https://robotclub-schools.org/login"),
          option("dash", "https://robot-club-school.net/secure"),
        ],
        evidence: [
          { title: "Trusted note from the teacher", lines: ["Official registered domain: robotclub.school"] },
        ],
      },
      {
        id: "l1-c8",
        number: 8,
        title: "Permission Patrol",
        subtitle: "Apply least privilege",
        points: 160,
        skill: "App permissions",
        tool: "Tablet",
        kind: "multi",
        objective: "Grant only what a printed badge scanner needs.",
        briefing:
          "The Badge Scanner reads a QR code and shows a booth number. Select every permission it genuinely needs—and no others.",
        manual: [
          "Least privilege means granting only access needed for the stated task.",
          "A feature description is evidence; a developer's preference is not.",
          "Permissions can be revisited if a real feature later requires them.",
        ],
        hints: ["Map each promised feature to hardware.", "Scanning a printed code requires seeing it, not hearing or tracking the user."],
        answer: ["camera"],
        options: [
          option("camera", "Camera while using the app"),
          option("microphone", "Microphone"),
          option("location", "Precise location always"),
          option("contacts", "Contacts"),
        ],
        evidence: [
          { title: "App description", lines: ["Scans printed QR badges", "Displays a booth number from the code", "Works offline"] },
        ],
      },
      {
        id: "l1-c9",
        number: 9,
        title: "Wi-Fi Impostor",
        subtitle: "Verify more than the name",
        points: 170,
        skill: "Wireless safety",
        tool: "Network list",
        kind: "choice",
        objective: "Choose the network matching the district setup card.",
        briefing:
          "Nearby networks have almost identical names. Signal strength is convenience, not identity. Compare security and certificate details.",
        manual: [
          "Attackers can copy a network name.",
          "A managed school network can prove identity with a certificate issued by the district.",
          "Match all trusted details, not just one.",
        ],
        hints: ["The strongest signal is not automatically safest.", "Require both WPA3-Enterprise and the named certificate issuer."],
        answer: "secure",
        options: [
          option("open", "CQ-204-Secure · Open · no certificate"),
          option("copy", "CQ-204_Secure · WPA2-Personal · no certificate"),
          option("secure", "CQ-204-Secure · WPA3-Enterprise · District Network CA"),
          option("guest", "CQ-204-Guest · WPA3-Personal · Fair Kiosk CA"),
        ],
        evidence: [
          { title: "District setup card", lines: ["SSID: CQ-204-Secure", "Security: WPA3-Enterprise", "Issuer: District Network CA"] },
        ],
      },
      {
        id: "l1-c10",
        number: 10,
        title: "Login Log Hunt",
        subtitle: "Count patterns across time",
        points: 190,
        skill: "Log analysis",
        tool: "Access log",
        kind: "choice",
        objective: "Identify the source performing repeated password guesses.",
        briefing:
          "A single failure can be a typo. Scan the full timeline and count repeated failures by source before choosing.",
        manual: [
          "Read each row across: time, account, source, result.",
          "Group repeated events by a stable field such as source IP.",
          "Judge a pattern, not a scary-looking isolated event.",
        ],
        hints: ["Make a tally for each source.", "One source fails four times against two accounts."],
        answer: "203.0.113.42",
        options: [
          option("198.51.100.18", "198.51.100.18"),
          option("198.51.100.77", "198.51.100.77"),
          option("192.0.2.15", "192.0.2.15"),
          option("203.0.113.42", "203.0.113.42"),
        ],
        evidence: [
          {
            title: "12 chronological events",
            format: "log",
            lines: [
              "09:52:11 riley 198.51.100.18 SUCCESS",
              "09:52:43 club 203.0.113.42 FAILED",
              "09:53:02 guest 192.0.2.15 SUCCESS",
              "09:53:18 club 203.0.113.42 FAILED",
              "09:53:40 sam 198.51.100.77 FAILED",
              "09:53:55 sam 198.51.100.77 SUCCESS",
              "09:54:05 riley 203.0.113.42 FAILED",
              "09:54:19 club 203.0.113.42 FAILED",
              "09:54:33 guest 192.0.2.15 LOGOUT",
              "09:54:48 riley 198.51.100.18 LOGOUT",
              "09:55:01 admin 198.51.100.18 MFA_CHALLENGE",
              "09:55:10 admin 198.51.100.18 SUCCESS",
            ],
          },
        ],
      },
      {
        id: "l1-c11",
        number: 11,
        title: "File Fingerprint",
        subtitle: "Verify integrity",
        points: 210,
        skill: "Hash comparison",
        tool: "Integrity checker",
        kind: "choice",
        objective: "Identify the downloaded file whose SHA-256 fingerprint changed.",
        briefing:
          "Do not trust filenames or file icons. Compare each approved fingerprint with its downloaded copy.",
        manual: [
          "A cryptographic hash is a file fingerprint.",
          "Matching names do not prove matching content.",
          "Compare long values in small groups to reduce mistakes.",
        ],
        hints: ["Compare from both ends.", "The mismatch is in the second group, not the filename."],
        answer: "bolt_update.zip",
        options: [
          option("schedule.csv", "schedule.csv"),
          option("poster.png", "poster.png"),
          option("readme.txt", "readme.txt"),
          option("bolt_update.zip", "bolt_update.zip"),
        ],
        evidence: [
          {
            title: "SHA-256 integrity check",
            format: "code",
            lines: [
              "schedule.csv     approved 4a91-f26c-77bd   downloaded 4a91-f26c-77bd",
              "poster.png       approved 11de-9a40-c882   downloaded 11de-9a40-c882",
              "readme.txt       approved a042-91ce-00f1   downloaded a042-91ce-00f1",
              "bolt_update.zip  approved 7bc2-18d4-a991   downloaded 7bc2-81d4-a991",
            ],
          },
        ],
      },
      {
        id: "l1-c12",
        number: 12,
        title: "Junior SOC Shift",
        subtitle: "Connect the evidence",
        points: 240,
        skill: "Incident response",
        tool: "Security console",
        kind: "multi",
        objective: "Select every justified response to the combined incident.",
        briefing:
          "The console combines the phishing email, login guessing, and changed update file. Choose actions supported by evidence; avoid both panic and underreaction.",
        manual: [
          "Identify what is known, contain the risky path, recover from trusted sources, and document what happened.",
          "Preserve logs and messages unless policy says otherwise.",
          "Do not accuse a person when the evidence identifies only an account or device.",
        ],
        hints: ["Choose actions that preserve evidence and reduce risk.", "There are four correct actions; deleting all logs is not one."],
        answer: ["isolate", "reset", "replace", "report"],
        options: [
          option("isolate", "Keep Bolt offline until the update path is verified"),
          option("reset", "Reset the club account and require MFA"),
          option("replace", "Discard the changed file and download from the verified portal"),
          option("report", "Preserve evidence and report the incident"),
          option("delete", "Delete every log so nobody can reuse it"),
          option("accuse", "Publicly name the student whose account was targeted"),
        ],
        evidence: [
          { title: "Case summary", lines: ["Look-alike sender domain", "Four failed logins from one source", "Update hash mismatch", "Bolt currently offline"] },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "The Copycat Account",
    stage: "Digital Defender",
    difficulty: "Developing",
    description: "Trace a fake student-news profile without blaming the wrong person.",
    story:
      "A copycat account is posting fake club announcements. Verify identity signals, analyze headers and account activity, and build a careful evidence-based report.",
    color: "#7c55c7",
    icon: "@?",
    challenges: [
      {
        id: "l2-c1", number: 1, title: "Handle With Care", subtitle: "Separate names from identity", points: 180,
        skill: "Identity signals", tool: "Profile comparison", kind: "multi",
        objective: "Select every field that differs between the real and copycat profiles.",
        briefing: "Display names and pictures are easy to copy. Compare stable account details instead of deciding by appearance.",
        manual: ["Usernames are exact strings.", "Account creation dates and verified links add context.", "A copied photo does not prove shared ownership."],
        hints: ["Compare character by character.", "There are three differences beyond the identical photo."],
        answer: ["handle", "created", "link"],
        options: [option("handle", "Username"), option("photo", "Profile photo"), option("created", "Creation date"), option("link", "Linked club site"), option("name", "Display name")],
        evidence: [
          {title:"Known club profile", lines:["Name: Eastview News", "@eastview.news", "Created: Aug 2022", "Link: news.eastview.school"]},
          {title:"Suspect profile", lines:["Name: Eastview News", "@eastvlew.news", "Created: Today", "Link: eastview-news.school-login.net"]},
        ],
      },
      {
        id: "l2-c2", number: 2, title: "Context Collapse", subtitle: "Question a cropped screenshot", points: 190,
        skill: "Source verification", tool: "Post archive", kind: "choice",
        objective: "Choose the strongest next step before treating the screenshot as authentic.",

        briefing: "A cropped image appears to show the principal canceling the fair. You have not yet seen the original post.",
        manual: ["Screenshots can remove dates, replies, usernames, and edits.", "Find the original source or an independent official confirmation.", "Do not amplify uncertain claims while checking."],
        hints: ["The question is not whether the pixels look edited.", "Seek a primary source."],
        answer: "official",
        options: [option("repost", "Repost it with a warning emoji"), option("pixels", "Zoom in until compression artifacts appear"), option("official", "Check the principal's verified page and school alert system"), option("poll", "Ask followers whether it feels real")],
        evidence: [{title:"Cropped screenshot", lines:["...fair is canceled. Do not come tonight.", "No username visible", "No date visible", "Reply count cropped out"]}],
      },
      {
        id: "l2-c3", number: 3, title: "Header Trail", subtitle: "Follow the delivery path", points: 220,
        skill: "Email headers", tool: "Message source", kind: "text",
        objective: "Identify which domain actually authorized the announcement email.",
        briefing: "The visible From line says Eastview News. Inspect the authentication summary rather than trusting the friendly name.",
        manual: ["SPF and DKIM results show whether sending infrastructure was authorized for a domain.", "A message can display one address while using a different return path.", "Authentication passing for an unrelated domain does not authenticate the claimed school identity."],
        hints: ["Find dkim=pass and read the d= value.", "The passing signature belongs to a non-school domain."],
        answer: "mailer-promo.net",
        placeholder: "Enter the signing domain",
        evidence: [{title:"Authentication-Results", format:"code", lines:["from: Eastview News <alerts@eastview.school>", "spf=pass smtp.mailfrom=bounce@mailer-promo.net", "dkim=pass header.d=mailer-promo.net", "dmarc=fail header.from=eastview.school"]}],
      },
      {
        id: "l2-c4", number: 4, title: "Reset Window", subtitle: "Correlate account events", points: 230,
        skill: "Timeline analysis", tool: "Account audit", kind: "choice",
        objective: "Choose the event that most likely enabled the account takeover.",
        briefing: "The copycat posted at 14:22. Work backward through the audit trail and identify the security-changing event—not just the nearest event in time.",
        manual: ["Security-relevant changes include password resets, MFA changes, and recovery updates.", "Correlation is stronger when an event changes access before suspicious activity begins.", "Routine reads and logouts are context, not causes."],
        hints: ["Look for a change to recovery or authentication.", "It happened before the new-device sign-in."],
        answer: "recovery",
        options: [option("view", "13:48 profile viewed"), option("recovery", "13:51 recovery email changed"), option("login", "14:03 new-device sign-in"), option("post", "14:22 announcement posted")],
        evidence: [{title:"Audit events", format:"log", lines:["13:48 PROFILE_VIEW source=school-tablet", "13:51 RECOVERY_EMAIL_CHANGED source=198.51.100.91", "14:03 LOGIN_SUCCESS source=198.51.100.91 device=new", "14:22 POST_CREATED source=198.51.100.91", "14:27 LOGOUT source=198.51.100.91"]}],
      },
      {
        id: "l2-c5", number: 5, title: "Consent Screen", subtitle: "Audit connected-app access", points: 240,
        skill: "OAuth permissions", tool: "App review", kind: "multi",
        objective: "Select the permissions that exceed a caption-writing helper's stated job.",
        briefing: "A connected app says it suggests captions from text the user types. Review its requested access.",
        manual: ["Connected apps can act through granted scopes without learning a password.", "Match each scope to the stated feature.", "Read-only profile access is different from posting or managing recovery settings."],
        hints: ["Typing a caption does not require account administration.", "Three scopes exceed the stated feature."],
        answer: ["post", "messages", "recovery"],
        options: [option("profile", "Read basic profile"), option("post", "Create and delete posts"), option("messages", "Read private messages"), option("recovery", "Change recovery email")],
        evidence: [{title:"Caption Spark", lines:["Claimed feature: suggest captions for text you enter", "No scheduling, inbox, or account-recovery features listed"]}],
      },
      {
        id: "l2-c6", number: 6, title: "The One-Letter Alibi", subtitle: "Use evidence without overclaiming", points: 250,
        skill: "Attribution limits", tool: "Case notes", kind: "choice",
        objective: "Choose the conclusion fully supported by the evidence.",
        briefing: "Investigators found the copycat handle, an external IP, and a reused stock photo. Decide what the evidence proves—and what it does not.",
        manual: ["An IP may identify a network or service, not a person.", "A reused photo can connect artifacts without proving who operated an account.", "Good reports distinguish observations, inferences, and unknowns."],
        hints: ["Avoid naming a student.", "State the account behavior and preserve the attribution uncertainty."],
        answer: "limited",
        options: [option("student", "A specific student definitely ran the account"), option("country", "The operator definitely lives where the IP is registered"), option("limited", "The account was operated from an external network; the person is not yet identified"), option("bot", "The account must be fully automated")],
        evidence: [{title:"Evidence", lines:["Handle differs by lowercase l for i", "Source IP belongs to a commercial mobile carrier", "Profile photo appears on a public stock-image site"]}],
      },
      {
        id: "l2-c7", number: 7, title: "Notice and Contain", subtitle: "Sequence a platform response", points: 260,
        skill: "Account incident response", tool: "Response planner", kind: "order",
        objective: "Order the response so evidence is preserved and further posts are stopped.",
        briefing: "The real news adviser is available. Build a response that avoids deleting evidence before it can be reviewed.",
        manual: ["Capture volatile evidence first when it is safe.", "Then contain access, recover the account, and communicate through verified channels.", "Use platform reporting tools for impersonation."],
        hints: ["Screenshots and URLs can disappear after containment.", "Verified communication should come after access is secured."],
        answer: ["preserve", "contain", "recover", "notify"],
        options: [option("notify", "Publish a correction through verified school channels"), option("recover", "Reset recovery details, password, sessions, and MFA"), option("preserve", "Record URLs, timestamps, headers, and screenshots"), option("contain", "Report the impersonation and suspend connected apps")],
        evidence: [{title:"Constraints", lines:["Fake post still live", "Adviser controls official school alert system", "Platform has an impersonation report form"]}],
      },
      {
        id: "l2-c8", number: 8, title: "Evidence Brief", subtitle: "Build a defensible report", points: 300,
        skill: "Evidence synthesis", tool: "Case board", kind: "multi",
        objective: "Select every statement suitable for the final verified incident summary.",
        briefing: "Finish the case with precise statements. Include what logs prove; leave speculation out.",
        manual: ["Cite artifacts and timestamps.", "Use calibrated words such as observed, consistent with, and unknown.", "Recommendations should follow from the evidence."],
        hints: ["Three statements are evidence-backed.", "Anything claiming motive or naming an operator goes beyond the record."],
        answer: ["handle", "auth", "timeline"],
        options: [option("handle", "The impersonating handle replaced i with lowercase l"), option("auth", "Email authentication failed for eastview.school and passed for mailer-promo.net"), option("timeline", "A recovery change preceded a new-device login and fake post from the same source"), option("motive", "The operator wanted revenge on the principal"), option("identity", "A named eighth-grade student operated the account")],
        evidence: [{title:"Case board", lines:["Profile comparison saved", "Authentication-Results header saved", "Account audit exported", "Operator identity: unknown"]}],
      },
    ],
  },
  {
    id: 3,
    title: "Library Lockout",
    stage: "Systems Investigator",
    difficulty: "Intermediate",
    description: "Recover a locked library kiosk without erasing the evidence.",
    story: "The library kiosks display a ransom-style note after a failed update. Explore a simulated filesystem, distinguish corruption from compromise, and restore from a verified backup.",
    color: "#d97727",
    icon: "FS",
    challenges: [
      {
        id:"l3-c1", number:1, title:"Directory Detour", subtitle:"Navigate by evidence", points:220, skill:"Filesystem navigation", tool:"Training terminal", kind:"terminal",
        objective:"Find the filename of the most recent kiosk backup manifest.",
        briefing:"The training shell mirrors the library archive. Use read-only commands to locate the backup manifest; do not guess from the ransom note.",
        manual:["ls lists entries; cd changes the simulated folder; pwd confirms location; cat reads text.", "A manifest describes what a backup contains and when it was created."],
        hints:["List the starting folder, then enter backups.", "Read index.txt before choosing a manifest."], answer:"manifest-2026-05-14.txt", placeholder:"Enter the manifest filename",
        evidence:[{title:"Archive console", format:"code", lines:["Allowed: pwd, ls, cd <folder>, cat <file>, clear", "This shell cannot execute programs or change files."]}],
        terminal:{pwd:["/library/archive"], ls:["backups  notices  quarantine"], "cd backups":["/library/archive/backups"], "ls backups":["index.txt  manifest-2026-05-07.txt  manifest-2026-05-14.txt"], "cat backups/index.txt":["2026-05-07 weekly complete", "2026-05-14 weekly complete (latest)"], "cat backups/manifest-2026-05-14.txt":["set=kiosk-clean", "created=2026-05-14T02:00Z", "hash=6f2a-019d-c118"]},
      },
      {
        id:"l3-c2", number:2, title:"Magic, Not Names", subtitle:"Identify a disguised file", points:230, skill:"File signatures", tool:"Hex viewer", kind:"choice",
        objective:"Identify the file whose contents do not match its extension.",
        briefing:"An extension is only part of a filename. Compare the first bytes with the signature reference.",
        manual:["Many formats begin with recognizable magic bytes.", "Renaming a file does not rewrite its contents.", "Treat mismatches as suspicious and quarantine for review."],
        hints:["Match each leading byte sequence to the reference.", "One .jpg starts with an executable signature."], answer:"poster.jpg",
        options:[option("catalog.pdf","catalog.pdf"), option("poster.jpg","poster.jpg"), option("schedule.png","schedule.png"), option("notes.txt","notes.txt")],
        evidence:[{title:"Signature reference", format:"code", lines:["PDF  25 50 44 46", "JPEG FF D8 FF", "PNG  89 50 4E 47", "Windows executable 4D 5A"]},{title:"File headers", format:"code", lines:["catalog.pdf  25 50 44 46", "poster.jpg   4D 5A 90 00", "schedule.png 89 50 4E 47", "notes.txt    4C 69 62 72"]}],
      },
      {
        id:"l3-c3", number:3, title:"Permission Puzzle", subtitle:"Read the access bits", points:250, skill:"Linux permissions", tool:"File listing", kind:"choice",
        objective:"Choose the file incorrectly writable by every user.",
        briefing:"A kiosk service account should write only to its cache. Inspect the permission strings.",
        manual:["Permission groups are owner, group, and others.", "r means read, w write, x execute.", "A w in the final group allows any local user to modify the file."],
        hints:["Inspect the last three characters.", "Look for w in the others group."], answer:"startup.conf",
        options:[option("catalog.db","-rw-r----- catalog.db"), option("startup.conf","-rw-rw-rw- startup.conf"), option("kiosk.log","-rw-rw---- kiosk.log"), option("rotate.sh","-rwxr-x--- rotate.sh")],
        evidence:[{title:"Policy", lines:["Owner: kiosk-service", "Group: library-it", "Other users: no write access"]}],
      },
      {
        id:"l3-c4", number:4, title:"Encoded Note", subtitle:"Identify representation before decoding", points:260, skill:"Base64", tool:"Decoder desk", kind:"text",
        objective:"Decode the note and enter the backup label.",
        briefing:"A maintenance note uses a common transport encoding. Identify it from the alphabet and padding, then decode it.",
        manual:["Base64 commonly uses A–Z, a–z, 0–9, +, / and optional = padding.", "Encoding is not encryption; anyone can reverse it.", "Never treat Base64 as protection for secrets."],
        hints:["The trailing equals signs are a clue.", "Decode: a2lvc2stY2xlYW4tNw=="], answer:"kiosk-clean-7", placeholder:"Enter the decoded backup label",
        evidence:[{title:"Maintenance note", format:"code", lines:["preferred_restore=a2lvc2stY2xlYW4tNw==", "encoding_hint=64 symbols"]}],
        research:{prompt:"If this encoding is unfamiliar, research how Base64 represents binary data as text.", searchTerms:["Base64 decode", "Base64 padding equals sign"], sourceTip:"Prefer a standards or university reference; do not paste real secrets into unknown decoder sites."},
      },
      {
        id:"l3-c5", number:5, title:"Backup or Bait?", subtitle:"Verify before restore", points:280, skill:"Backup validation", tool:"Restore console", kind:"choice",
        objective:"Choose the safest restore candidate.",
        briefing:"Three backup sets exist. Newest is not automatically safest. Compare completion status, time, and published hash.",
        manual:["A usable backup should be complete, predate the incident, and pass integrity checks.", "Failed or post-incident snapshots may preserve the problem.", "Keep the current system isolated until validation finishes."],
        hints:["The lockout began May 15 at 09:10.", "Require complete plus hash match plus pre-incident."], answer:"may14",
        options:[option("may15","May 15 09:30 · complete · hash mismatch"), option("may14","May 14 02:00 · complete · hash match"), option("may07","May 7 02:00 · incomplete · hash match"), option("live","Current kiosk image · complete · unknown hash")],
        evidence:[{title:"Incident clock", lines:["First lockout: 2026-05-15 09:10", "Approved manifest hash: 6f2a-019d-c118"]}],
      },
      {
        id:"l3-c6", number:6, title:"Quiet Persistence", subtitle:"Read scheduled tasks", points:300, skill:"Persistence detection", tool:"Task inventory", kind:"choice",
        objective:"Identify the scheduled task that deserves investigation.",
        briefing:"Most scheduled jobs are routine. Compare owner, path, frequency, and creation time against the incident.",
        manual:["Persistence lets a program run again after reboot or on a schedule.", "A task is suspicious when several context clues conflict with normal operations.", "Do not delete it before preserving configuration and logs."],
        hints:["Look for a new task outside approved paths.", "One task runs from a user's temporary folder every minute."], answer:"sync-helper",
        options:[option("updates","LibraryUpdate · SYSTEM · C:\\Program Files\\Library\\update.exe · daily"), option("cleanup","CacheCleanup · kiosk-service · C:\\Library\\cleanup.exe · hourly"), option("sync-helper","Sync Helper · student-temp · C:\\Users\\Public\\Temp\\sync.exe · every minute"), option("clock","ClockSync · SYSTEM · C:\\Windows\\System32\\w32tm.exe · daily")],
        evidence:[{title:"Approved task policy", lines:["Executables: C:\\Program Files\\Library or C:\\Library", "Owners: SYSTEM or kiosk-service", "Minimum interval: hourly"]}],
      },
      {
        id:"l3-c7", number:7, title:"Restore Runbook", subtitle:"Recover methodically", points:320, skill:"System recovery", tool:"Runbook builder", kind:"order",
        objective:"Order the recovery actions for the locked kiosks.",
        briefing:"The clean backup is verified and the suspicious task is documented. Recover without allowing the same access path to remain.",
        manual:["Contain and preserve before rebuilding.", "Restore from verified media, patch the entry point, rotate affected credentials, then monitor.", "A successful boot is not proof of a clean recovery."],
        hints:["Isolation comes before restoration.", "Monitoring is the last step, not the first."], answer:["isolate","preserve","restore","secure","monitor"],
        options:[option("monitor","Reconnect gradually and monitor authentication and task logs"), option("restore","Reimage from the verified May 14 backup"), option("preserve","Export logs and the suspicious task definition"), option("secure","Patch, remove persistence, and rotate kiosk credentials"), option("isolate","Keep affected kiosks isolated")],
        evidence:[{title:"Recovery readiness", lines:["May 14 backup verified", "Task definition captured: no", "Kiosks isolated: no", "Root cause patch available: yes"]}],
      },
      {
        id:"l3-c8", number:8, title:"Library Reopens", subtitle:"Prove recovery, not just uptime", points:350, skill:"Recovery validation", tool:"Health dashboard", kind:"multi",
        objective:"Select every check needed before declaring recovery complete.",
        briefing:"The kiosks boot and the catalog opens. Decide what else must be verified before students use them.",
        manual:["Validate security controls, data integrity, expected function, and monitoring.", "A green login screen alone is weak evidence.", "Document recovery decisions for later review."],
        hints:["Four checks are justified.", "Cosmetic appearance and speed alone are insufficient."], answer:["hash","task","auth","monitor"],
        options:[option("hash","Verify restored catalog and system hashes"), option("task","Confirm unauthorized scheduled task is absent"), option("auth","Test kiosk accounts and MFA policy"), option("monitor","Review fresh logs for recurrence"), option("wallpaper","Confirm the wallpaper matches last semester"), option("fast","Declare success because boot took under 30 seconds")],
        evidence:[{title:"Current status", lines:["Boot: success", "Catalog search: success", "Security validation: pending", "Monitoring window: not started"]}],
      },
    ],
  },
  {
    id: 4,
    title: "Festival Firewall",
    stage: "Network Analyst",
    difficulty: "Advanced",
    description: "Keep the school festival stream online during suspicious traffic.",
    story: "The festival livestream slows as unfamiliar requests hit the media server. Analyze web, DNS, certificate, and firewall evidence, then contain abuse without blocking the audience.",
    color: "#12947f",
    icon: "NET",
    challenges: [
      {
        id:"l4-c1", number:1, title:"Status Without Panic", subtitle:"Interpret HTTP responses", points:280, skill:"HTTP status codes", tool:"Request log", kind:"choice",
        objective:"Identify which request reached a missing page rather than proving an attack.",
        briefing:"Do not label every non-200 response malicious. Interpret what each status code actually means.",
        manual:["2xx means successful processing; 3xx redirects; 4xx client-side request problems; 5xx server failures.", "A status code describes an outcome, not intent."],
        hints:["Research 404 if needed.", "Missing resource is different from forbidden or overloaded."], answer:"404",
        options:[option("301","301 /schedule"), option("404","404 /old-map.png"), option("403","403 /admin"), option("503","503 /stream")],
        evidence:[{title:"Access sample", format:"log", lines:["10:01:02 GET /schedule 301", "10:01:04 GET /old-map.png 404", "10:01:06 GET /admin 403", "10:01:08 GET /stream 503"]}],
        research:{prompt:"Use an authoritative HTTP status reference to distinguish the four outcomes.", searchTerms:["MDN HTTP 404", "RFC 9110 status codes"], sourceTip:"Prefer MDN or the HTTP RFC over an unsourced listicle."},
      },
      {
        id:"l4-c2", number:2, title:"DNS Double Take", subtitle:"Follow the canonical name", points:300, skill:"DNS analysis", tool:"Zone viewer", kind:"text",
        objective:"Determine the final hostname used by stream.festival.school.",
        briefing:"The visible hostname is an alias. Follow the CNAME chain until you reach the address record.",
        manual:["A CNAME maps one hostname to another hostname.", "An A record maps a hostname to an IPv4 address.", "Follow aliases until an address record ends the chain."],
        hints:["Start at stream.festival.school.", "The name with the A record is the final hostname."], answer:"edge2.media.school", placeholder:"Enter the final hostname",
        evidence:[{title:"DNS answers", format:"code", lines:["stream.festival.school. CNAME live.media.school.", "live.media.school. CNAME edge2.media.school.", "edge2.media.school. A 192.0.2.80", "archive.media.school. A 192.0.2.44"]}],
      },
      {
        id:"l4-c3", number:3, title:"Certificate Subject", subtitle:"Verify the endpoint", points:320, skill:"TLS certificates", tool:"Certificate viewer", kind:"choice",
        objective:"Choose the certificate valid for the livestream hostname.",
        briefing:"All three certificates are unexpired. Match hostname coverage and issuer policy, not just the green lock icon.",
        manual:["The Subject Alternative Name list defines covered hostnames.", "A wildcard such as *.festival.school covers one subdomain level, not festival.school itself or deeper levels.", "Trust also depends on an approved issuer and valid dates."],
        hints:["The host is stream.festival.school.", "Require SAN coverage and District Web CA."], answer:"cert-b",
        options:[option("cert-a","SAN festival.school · District Web CA · valid"), option("cert-b","SAN *.festival.school · District Web CA · valid"), option("cert-c","SAN stream.festival.school · QuickCert Test CA · valid"), option("cert-d","SAN *.media.school · District Web CA · valid")],
        evidence:[{title:"Connection", lines:["Requested host: stream.festival.school", "Approved issuer: District Web CA"]}],
      },
      {
        id:"l4-c4", number:4, title:"Rate, Then Block", subtitle:"Distinguish a crowd from automation", points:340, skill:"Traffic baselining", tool:"Request summary", kind:"choice",
        objective:"Identify the source most consistent with automated request flooding.",
        briefing:"High traffic is expected during the concert. Compare rate, path diversity, session behavior, and timing regularity.",
        manual:["Real audiences create varied requests and timing.", "Automation often repeats a narrow action at regular intervals.", "Use several signals before blocking."],
        hints:["Requests per minute alone is not enough.", "Look for high, uniform traffic with no session or asset variety."], answer:"198.51.100.60",
        options:[option("203.0.113.5","203.0.113.5 · 420 rpm · 18 paths · sessions yes · timing varied"), option("198.51.100.60","198.51.100.60 · 600 rpm · 1 path · no sessions · every 100 ms"), option("192.0.2.91","192.0.2.91 · 210 rpm · 24 paths · sessions yes · timing varied"), option("203.0.113.88","203.0.113.88 · 12 rpm · 2 paths · session yes · timing varied")],
        evidence:[{title:"Expected audience pattern", lines:["Many viewers share carrier IPs", "Video players request manifests plus segments", "Normal timing varies with buffering"]}],
      },
      {
        id:"l4-c5", number:5, title:"Rule Order Matters", subtitle:"Evaluate the firewall top-down", points:360, skill:"Firewall logic", tool:"Rule simulator", kind:"text",
        objective:"Enter the rule number that currently allows the flood source through.",
        briefing:"The firewall stops at the first matching rule. Trace the source against the ordered list.",
        manual:["Top-down rule sets apply the first match.", "A broad allow placed before a narrow deny can make the deny unreachable.", "Test rule behavior before changing production policy."],
        hints:["The source is within 198.51.100.0/24.", "Which matching rule appears first?"], answer:"2", placeholder:"Enter the rule number",
        evidence:[{title:"Ordered firewall rules", format:"code", lines:["1 ALLOW district-monitor 192.0.2.10/32", "2 ALLOW media-partners 198.51.100.0/24", "3 DENY flood-source 198.51.100.60/32", "4 ALLOW public-stream any", "5 DENY any any"]}],
      },
      {
        id:"l4-c6", number:6, title:"Smallest Safe Change", subtitle:"Contain without collateral damage", points:380, skill:"Network containment", tool:"Change planner", kind:"choice",
        objective:"Choose the least disruptive rule change that blocks the verified flood source.",
        briefing:"Other media partners in the same /24 are legitimate. Preserve their access while stopping one abusive host.",
        manual:["Prefer precise, reversible containment.", "Rule specificity is useless if order makes the rule unreachable.", "Document an expiry and review time for emergency rules."],
        hints:["Do not block the whole partner range.", "Move a /32 deny above the broader allow."], answer:"specific",
        options:[option("range","Deny 198.51.100.0/24 above all rules"), option("specific","Place DENY 198.51.100.60/32 above the partner allow, with review time"), option("public","Disable the public stream rule"), option("server","Power off the streaming server")],
        evidence:[{title:"Impact check", lines:["7 approved partners use other addresses in 198.51.100.0/24", "Flood evidence currently identifies only 198.51.100.60"]}],
      },
      {
        id:"l4-c7", number:7, title:"Detection, Not Guessing", subtitle:"Build a useful alert", points:400, skill:"Detection engineering", tool:"Rule builder", kind:"multi",
        objective:"Select every condition needed for a low-noise flood alert.",
        briefing:"Create a detection that captures the observed behavior without firing on ordinary viewers or carrier NAT.",
        manual:["Good detections combine volume, time window, behavior, and exclusions.", "Tune against known normal traffic.", "An alert is a prompt to investigate, not automatic proof."],
        hints:["Four conditions define the pattern.", "Country and user-agent brand are weak by themselves."], answer:["rate","path","session","allowlist"],
        options:[option("rate",">500 requests per minute from one source"), option("path","90%+ requests to the same manifest path"), option("session","No valid player session cookie"), option("allowlist","Exclude district health checks"), option("country","Source country is outside the state"), option("browser","User-Agent is not Chrome")],
        evidence:[{title:"Observed flood", lines:["600 rpm", "100% /stream/master.m3u8", "No sessions", "District health check: 192.0.2.10"]}],
      },
      {
        id:"l4-c8", number:8, title:"Keep the Show Online", subtitle:"Coordinate the response", points:450, skill:"Network incident response", tool:"Operations board", kind:"order",
        objective:"Order the actions that protect availability and preserve evidence.",
        briefing:"The flood source is verified and a precise rule is ready. Coordinate containment without losing the logs needed for review.",
        manual:["Capture current evidence, apply bounded containment, validate service, then monitor and review.", "Prepare rollback before a network change.", "Communicate impact to event staff."],
        hints:["Snapshot before changing the rule.", "Validation comes immediately after containment."], answer:["capture","change","validate","monitor","review"],
        options:[option("review","Document, notify partners, and review the temporary rule"), option("validate","Test the stream from inside and outside the district"), option("capture","Export traffic and firewall logs; record baseline and rollback"), option("monitor","Watch availability, errors, and source behavior"), option("change","Place the precise temporary deny above the broader allow")],
        evidence:[{title:"Operations status", lines:["Stream degraded but online", "Emergency change window open", "Rollback approved", "Logs retained for 24 hours"]}],
      },
    ],
  },
  {
    id: 5,
    title: "Midnight Archive",
    stage: "Forensics Specialist",
    difficulty: "Expert",
    description: "Reconstruct what happened from files, metadata, and competing timelines.",
    story: "A scholarship archive was accessed overnight. Work from preserved copies, decode timestamps and file structures, and build a timeline that separates fact from coincidence.",
    color: "#b34f69",

    icon: "0x",
    challenges: [
      {
        id:"l5-c1", number:1, title:"Clock Drift", subtitle:"Normalize the timeline", points:360, skill:"Time normalization", tool:"Timeline desk", kind:"text",
        objective:"Convert the camera event to UTC and enter the time as HH:MM.",
        briefing:"The door camera records Eastern Daylight Time (UTC−4). The server logs UTC. Normalize before correlating.",
        manual:["UTC−4 means local time is four hours behind UTC.", "Add four hours to convert this local timestamp to UTC.", "Record the original zone and converted value."],
        hints:["Add four hours to 22:37.", "Crossing midnight changes the date."], answer:"02:37", placeholder:"HH:MM UTC",
        evidence:[{title:"Camera metadata", format:"code", lines:["Captured: 2026-06-11 22:37:18 EDT", "Offset: UTC-04:00"]}],
        research:{prompt:"Research why timestamps require an explicit time-zone offset during forensic correlation.", searchTerms:["UTC offset forensic timeline", "EDT UTC minus 4"], sourceTip:"Prefer NIST, CISA, or established digital-forensics documentation."},
      },
      {
        id:"l5-c2", number:2, title:"Extension Masquerade", subtitle:"Read structure, not labels", points:380, skill:"Binary triage", tool:"Hex and strings", kind:"choice",
        objective:"Identify the file that is actually a ZIP archive.",
        briefing:"Several attachments have misleading names. Use the signature table and first bytes.",
        manual:["ZIP files commonly begin 50 4B 03 04.", "Office Open XML files are ZIP containers too, so context and internal names matter.", "Triage identifies format; it does not prove malicious intent."],
        hints:["Look for 50 4B 03 04.", "The suspect is named like an image."], answer:"award-photo.jpg",
        options:[option("award-photo.jpg","award-photo.jpg · 50 4B 03 04"), option("scores.pdf","scores.pdf · 25 50 44 46"), option("rules.png","rules.png · 89 50 4E 47"), option("notes.txt","notes.txt · 55 54 46 2D")],
        evidence:[{title:"Known signatures", format:"code", lines:["ZIP 50 4B 03 04", "PDF 25 50 44 46", "PNG 89 50 4E 47", "UTF-8 text varies"]}],
      },
      {
        id:"l5-c3", number:3, title:"Strings in the Noise", subtitle:"Extract a stable indicator", points:400, skill:"String analysis", tool:"Strings viewer", kind:"text",
        objective:"Enter the hostname embedded in the suspicious updater sample.",
        briefing:"Most extracted strings are ordinary library names. Find the network destination hidden among them.",
        manual:["The strings technique extracts printable sequences from binary data.", "Look for indicators such as domains, URLs, paths, commands, and error messages.", "A string is a lead to validate, not proof that code executed."],
        hints:["Search visually for a dot-separated hostname.", "Ignore standard DLL names and local paths."], answer:"sync-cache.example", placeholder:"Enter the hostname",
        evidence:[{title:"Extracted strings", format:"code", lines:["KERNEL32.dll", "C:\\ProgramData\\Archive\\cache", "update complete", "https://sync-cache.example/api/v2/check", "invalid manifest", "USER32.dll"]}],
      },
      {
        id:"l5-c4", number:4, title:"Regex Relay", subtitle:"Search a large log precisely", points:420, skill:"Regular expressions", tool:"Pattern lab", kind:"choice",
        objective:"Choose the regex that matches failed admin logins from any IPv4 address.",
        briefing:"The log format is RESULT user=NAME src=IP. Select a pattern broad enough for any IPv4 text but narrow enough to require FAIL and admin.",
        manual:["^ anchors the start; $ anchors the end.", "\\d matches a digit; + means one or more.", "\\. matches a literal dot; . alone means any character."],
        hints:["Require FAIL and user=admin.", "Escape the dots in the IP shape."], answer:"regex-b",
        options:[option("regex-a","admin.*FAIL"), option("regex-b","^FAIL user=admin src=\\d+\\.\\d+\\.\\d+\\.\\d+$"), option("regex-c","^SUCCESS user=admin src=.*$"), option("regex-d","^FAIL user=.* src=admin$")],
        evidence:[{title:"Sample rows", format:"log", lines:["FAIL user=admin src=203.0.113.9", "SUCCESS user=admin src=192.0.2.7", "FAIL user=reader src=203.0.113.9"]}],
        research:{prompt:"Research regex anchors and escaped literal dots, then test the pattern mentally against all sample rows.", searchTerms:["regular expression anchors caret dollar", "regex escaped dot"], sourceTip:"Use MDN or another language reference rather than a pattern copied without explanation."},
      },
      {
        id:"l5-c5", number:5, title:"Parent and Child", subtitle:"Read a process tree", points:440, skill:"Process analysis", tool:"Process tree", kind:"choice",
        objective:"Identify the process chain most inconsistent with normal document viewing.",
        briefing:"A process name alone may be legitimate. Analyze parent-child relationships and command lines.",
        manual:["Processes normally spawn related child processes.", "A document viewer launching a script interpreter with an encoded command deserves investigation.", "Preserve memory and process details before containment when safe."],
        hints:["Compare each parent with its child.", "One document application launches a shell interpreter."], answer:"chain-c",
        options:[option("chain-a","explorer.exe → browser.exe --new-window"), option("chain-b","services.exe → printspool.exe"), option("chain-c","documentviewer.exe → powershell.exe -EncodedCommand ..."), option("chain-d","taskhost.exe → timesync.exe")],
        evidence:[{title:"Analyst note", lines:["User opened scholarship-rules.pdf at 02:35 UTC", "Unexpected outbound connection began at 02:36 UTC"]}],
      },
      {
        id:"l5-c6", number:6, title:"Three-Source Timeline", subtitle:"Correlate without forcing a story", points:470, skill:"Timeline correlation", tool:"Event matrix", kind:"multi",
        objective:"Select every event that forms the strongest supported activity chain.",
        briefing:"Normalize timestamps and connect events by time, device, and artifact. Ignore unrelated background activity.",
        manual:["Correlation is stronger when multiple independent sources agree.", "A close timestamp alone is not enough; look for shared device, user, path, or indicator.", "Keep alternative explanations in the notes."],
        hints:["The chain spans file open, process launch, and outbound DNS.", "Four events share time and artifact context."], answer:["door","file","process","dns"],
        options:[option("door","02:37 badge door: maintenance account entered archive room"), option("file","02:35 workstation: scholarship-rules.pdf opened"), option("process","02:36 workstation: documentviewer spawned PowerShell"), option("dns","02:36 DNS: workstation queried sync-cache.example"), option("backup","02:00 server: scheduled backup completed"), option("printer","03:10 printer: low toner alert")],
        evidence:[{title:"Scope", lines:["Archive workstation: LIB-ARCH-04", "Relevant window: 02:30–02:40 UTC", "Known indicator: sync-cache.example"]}],
      },
      {
        id:"l5-c7", number:7, title:"Chain of Custody", subtitle:"Protect evidence integrity", points:500, skill:"Evidence handling", tool:"Custody log", kind:"order",
        objective:"Order the steps for collecting the suspicious USB drive.",
        briefing:"The drive may be evidence. Preserve integrity and accountability so later findings can be trusted.",
        manual:["Document the item and condition before handling.", "Use approved acquisition methods and calculate hashes.", "Seal originals and analyze verified copies.", "Record every transfer."],
        hints:["Photograph and label before acquisition.", "Analysis happens on a verified copy, not the original."], answer:["document","acquire","hash","seal","analyze"],
        options:[option("analyze","Analyze the verified working copy"), option("seal","Seal the original and update custody log"), option("hash","Calculate and record source and image hashes"), option("document","Photograph, label, and record who found it"), option("acquire","Create a forensic image with an approved write blocker")],
        evidence:[{title:"Evidence item", lines:["Item CQ-USB-07", "Found connected to LIB-ARCH-04", "Current custodian: Ms. Ortiz", "Collection time not yet recorded"]}],
      },
      {
        id:"l5-c8", number:8, title:"What Can We Say?", subtitle:"Write the forensic finding", points:540, skill:"Forensic reporting", tool:"Finding builder", kind:"multi",
        objective:"Select every conclusion supported by the preserved evidence.",
        briefing:"The timeline is complete. Choose precise findings while leaving identity and intent unresolved where evidence is insufficient.",
        manual:["Separate observed facts, supported inferences, and unknowns.", "Avoid absolute attribution without identity evidence.", "Include limitations such as clock drift or missing telemetry."],
        hints:["Four findings are supported.", "The evidence links a badge account and workstation activity, not necessarily a specific human."], answer:["opened","spawned","connected","badge"],
        options:[option("opened","The PDF was opened on LIB-ARCH-04 at 02:35 UTC"), option("spawned","Its viewer spawned PowerShell one minute later"), option("connected","The workstation queried the embedded hostname during that minute"), option("badge","A maintenance badge account entered near the event window"), option("person","The maintenance employee personally caused the incident"), option("motive","The goal was to alter scholarship scores")],
        evidence:[{title:"Limitations", lines:["Badge account can be shared under current policy", "No camera view of keyboard", "Endpoint, DNS, and badge logs preserved", "Score database hashes match approved baseline"]}],
      },
    ],
  },
  {
    id: 6,
    title: "Operation Glasshouse",
    stage: "Incident Commander",
    difficulty: "Capstone",
    description: "Lead a district-wide investigation with incomplete and conflicting evidence.",
    story: "Several schools report related alerts. Research public standards, prioritize risk, write a detection, and brief leaders without overstating what the evidence proves.",
    color: "#3550a3",
    icon: "IR",
    challenges: [
      {
        id:"l6-c1", number:1, title:"Priority Is Not Fear", subtitle:"Interpret CVSS context", points:450, skill:"Risk prioritization", tool:"Vulnerability desk", kind:"choice",
        objective:"Choose the vulnerability the school should address first using severity and exposure together.",
        briefing:"A high score matters, but reachable systems and active exploitation change urgency. Compare the complete context.",
        manual:["CVSS estimates technical severity; it does not include every local business factor.", "Exposure, exploit activity, asset importance, and compensating controls affect priority.", "Record why a priority was chosen."],
        hints:["Do not pick the largest number automatically.", "One issue is internet-facing and appears in active-exploitation alerts."], answer:"b",
        options:[option("a","A · CVSS 9.8 · isolated lab image · system powered off"), option("b","B · CVSS 8.1 · internet-facing portal · active exploitation reported · student records"), option("c","C · CVSS 7.5 · internal printer · network ACL limits access"), option("d","D · CVSS 4.3 · public brochure site · no sensitive data")],
        evidence:[{title:"District policy", lines:["Prioritize active exploitation and exposed sensitive systems", "CVSS is one input, not the queue by itself"]}],
        research:{prompt:"Research what CVSS measures and why threat/exposure context still matters.", searchTerms:["FIRST CVSS v4 overview", "CISA known exploited vulnerabilities catalog"], sourceTip:"Use FIRST for CVSS and CISA for exploitation context."},
      },
      {
        id:"l6-c2", number:2, title:"Technique, Not Tool Name", subtitle:"Map behavior to ATT&CK", points:480, skill:"Threat behavior mapping", tool:"Research desk", kind:"choice",
        objective:"Choose the ATT&CK technique category that best describes a scheduled task used to rerun code.",
        briefing:"Map the observed behavior, not a guessed actor or malware family.",
        manual:["ATT&CK describes adversary behaviors as tactics and techniques.", "Scheduled Task/Job is commonly used for execution or persistence.", "Mapping supports shared language; it does not identify an attacker."],
        hints:["Search the official ATT&CK site for scheduled task/job.", "The behavior keeps code running after the initial event."], answer:"persistence",
        options:[option("recon","Reconnaissance only"), option("persistence","Scheduled Task/Job used for persistence"), option("impact","Data destruction"), option("exfil","Exfiltration over physical medium")],
        evidence:[{title:"Observed behavior", format:"log", lines:["Task name: UpdateHealth", "Trigger: every logon", "Action: C:\\Users\\Public\\update-health.exe", "Created after suspicious document opened"]}],
        research:{prompt:"Use MITRE ATT&CK to identify the behavior represented by a scheduled task that reruns code at logon.", searchTerms:["site:attack.mitre.org Scheduled Task Job technique"], sourceTip:"Use the official MITRE ATT&CK technique page."},
      },
      {
        id:"l6-c3", number:3, title:"Impossible-ish Travel", subtitle:"Normalize identity logs", points:510, skill:"Identity analytics", tool:"Sign-in matrix", kind:"choice",
        objective:"Identify the account whose activity is strongest evidence of session theft rather than ordinary travel.",
        briefing:"Locations are approximate and VPNs exist. Compare time, device identity, MFA result, and concurrent session behavior.",
        manual:["Impossible travel is a lead, not proof.", "Device continuity, token type, MFA events, VPN ranges, and concurrent activity add context.", "Revoke risky sessions while preserving logs."],
        hints:["One account has concurrent sessions on two devices, a token replay signal, and no new MFA.", "Do not flag the approved district VPN."], answer:"morgan",
        options:[option("lee","Lee · Boston then district VPN · same managed device · MFA approved"), option("morgan","Morgan · New York and Berlin concurrently · different device · refresh token reused · no MFA"), option("patel","Patel · Toronto after 6 hours · same managed device · MFA approved"), option("guest","Guest kiosk · two schools · shared kiosk policy · passwordless device auth")],
        evidence:[{title:"Identity alert notes", lines:["District VPN egress: 192.0.2.0/24", "Geolocation may be wrong at city level", "Token replay alert confidence: high when concurrent device IDs differ"]}],
      },
      {
        id:"l6-c4", number:4, title:"Write the Detection", subtitle:"Translate evidence into logic", points:540, skill:"Detection logic", tool:"Rule workshop", kind:"multi",
        objective:"Select every condition for a high-confidence refresh-token replay alert.",
        briefing:"Build a transparent rule from the Morgan case without alerting on approved VPN use or normal device changes after MFA.",
        manual:["Detection logic should state required events, correlation keys, time windows, and exclusions.", "Test both true-positive and normal examples.", "Document data gaps and expected false positives."],
        hints:["Correlate by account and token within a short window.", "Require different device IDs and exclude fresh MFA or approved VPN transitions."], answer:["token","devices","window","exclude"],
        options:[option("token","Same refresh-token identifier reused"), option("devices","Different device IDs with overlapping sessions"), option("window","Events occur within 10 minutes"), option("exclude","No fresh MFA and neither transition is approved VPN egress"), option("distance","Cities are more than 500 miles apart"), option("browser","Browser versions differ")],
        evidence:[{title:"Detection goal", lines:["Behavior: token replay", "Correlation key: account + token ID", "Available fields: time, device ID, MFA, IP, VPN tag, session end"]}],
      },
      {
        id:"l6-c5", number:5, title:"Supply Chain Check", subtitle:"Verify the update path", points:570, skill:"Software integrity", tool:"Release ledger", kind:"choice",
        objective:"Identify the release that fails the strongest provenance check.",
        briefing:"All packages pass antivirus. Compare signature identity, build attestation, source revision, and transparency-log entry.",
        manual:["Malware scanning is only one control.", "Signed provenance can connect an artifact to an expected builder and source revision.", "A valid signature from an unexpected identity is still a mismatch."],
        hints:["Require all four provenance fields to agree.", "One package is signed, but by a new identity absent from the transparency log."], answer:"2.4.1-hotfix",
        options:[option("2.4.0","2.4.0 · District Build CA · attested · commit a91c · log entry 8821"), option("2.4.1-hotfix","2.4.1-hotfix · QuickRelease LLC · attested · commit a91c · no log entry"), option("2.3.9","2.3.9 · District Build CA · attested · commit 771b · log entry 8604"), option("2.4.2-rc","2.4.2-rc · District Test CA · test channel · commit c209 · test log 104")],
        evidence:[{title:"Production policy", lines:["Signer: District Build CA", "Attestation builder: district-ci/prod", "Source revision must match release record", "Production transparency log entry required"]}],
        research:{prompt:"Research software supply-chain provenance and why signatures, attestations, and transparency logs answer different questions.", searchTerms:["SLSA provenance overview", "Sigstore transparency log overview"], sourceTip:"Prefer the official SLSA and Sigstore documentation."},
      },
      {
        id:"l6-c6", number:6, title:"Containment Tradeoffs", subtitle:"Protect people and evidence", points:600, skill:"Incident command", tool:"Decision matrix", kind:"choice",
        objective:"Choose the containment plan with the best risk reduction and least unnecessary disruption.",
        briefing:"Token replay affects one administrator, while the update provenance issue affects a portal used across schools. Emergency services and classroom systems share some identity infrastructure.",
        manual:["Containment should be targeted, reversible, and proportional where possible.", "Prioritize safety-critical availability while reducing attacker access.", "Assign owners, review times, and rollback criteria."],
        hints:["Avoid shutting down the whole district.", "Address both the identity and update paths with scoped controls."], answer:"targeted",
        options:[option("shutdown","Disconnect every school and disable all accounts"), option("wait","Wait for perfect attribution before changing anything"), option("targeted","Revoke Morgan's sessions, suspend the suspect release, isolate affected portal nodes, preserve logs, and keep safety systems on monitored known-good paths"), option("delete","Delete the suspect package and identity logs immediately")],
        evidence:[{title:"Operational constraints", lines:["Emergency notification must remain online", "Known affected admin account: Morgan", "Suspect release deployed only to portal pool B", "Clean pool A available"]}],
      },
      {
        id:"l6-c7", number:7, title:"Executive Truth", subtitle:"Brief without jargon or certainty theater", points:630, skill:"Risk communication", tool:"Briefing editor", kind:"multi",
        objective:"Select every sentence appropriate for the first leadership briefing.",
        briefing:"Leaders need current impact, confidence, action, and next update—not raw logs or unsupported blame.",
        manual:["Lead with what is affected and what users should do.", "State confidence and unknowns plainly.", "Give containment status, decision needs, and next-update time."],
        hints:["Four sentences belong.", "Exclude blame and unexplained technical detail."], answer:["impact","evidence","action","next"],
        options:[option("impact","We are investigating unauthorized use of one admin session and a questionable portal update; classroom and emergency systems remain available."), option("evidence","Evidence supports token replay and a release-provenance mismatch; the responsible person is not yet known."), option("action","We revoked the session, suspended the release, isolated pool B, and preserved evidence."), option("next","We will update leadership at 14:30 or sooner if impact changes."), option("blame","A foreign hacking group definitely targeted the superintendent."), option("jargon","T1078 plus anomalous OIDC RT reuse triggered UEBA severity 9.")],
        evidence:[{title:"Situation report · 13:45", lines:["Emergency systems normal", "Portal pool B isolated", "Morgan sessions revoked", "Attribution unknown", "Next command checkpoint 14:30"]}],
      },
      {
        id:"l6-c8", number:8, title:"Glasshouse Capstone", subtitle:"Lead the full response", points:700, skill:"Incident leadership", tool:"Command board", kind:"order",
        objective:"Order the command actions from immediate control through long-term learning.",
        briefing:"You have incomplete but sufficient evidence to act. Build a response that protects services, supports investigation, communicates clearly, and improves defenses afterward.",
        manual:["Incident command maintains shared facts, owners, priorities, and decision times.", "Containment, eradication, recovery, and lessons learned overlap but should have explicit gates.", "Recovery requires evidence of safety, not pressure to reopen."],
        hints:["Establish command and preserve facts before broad action.", "Lessons learned follows validated recovery."], answer:["command","contain","investigate","recover","learn"],
        options:[option("recover","Restore from known-good pool A, validate identity and provenance controls, then expand service gradually"), option("learn","Publish lessons, fix shared recovery access, tune detections, and track owners to completion"), option("contain","Revoke risky sessions, suspend suspect release, isolate pool B, and preserve volatile evidence"), option("command","Establish incident lead, scope, safety priorities, evidence log, owners, and update cadence"), option("investigate","Correlate identity, build, endpoint, and network evidence; test competing explanations")],
        evidence:[{title:"Success criteria", lines:["Safety-critical services maintained", "Unauthorized access contained", "Evidence preserved", "Known-good recovery verified", "Leadership and schools informed", "Corrective actions owned"]}],
        research:{prompt:"Use a reputable incident-response framework to compare preparation, detection, containment, recovery, and post-incident learning.", searchTerms:["NIST incident response lifecycle", "CISA incident response playbook"], sourceTip:"Prefer NIST or CISA. Note that framework names may differ while the underlying responsibilities overlap."},
      },
    ],
  },
];

export const totalChallengeCount = levels.reduce(
  (total, level) => total + level.challenges.length,
  0,
);

export function totalPointsForLevel(level: Level) {
  return level.challenges.reduce((total, challenge) => total + challenge.points, 0);
}


