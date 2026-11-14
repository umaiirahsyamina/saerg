# SAERG build prompt — "Day One at Nexora"

> **How to use this file (for me, the student):**
> 1. Install Node.js (LTS) and Git. Create an empty GitHub repo, clone it and open the folder in VS Code.
> 2. Copy my assets into the repo: 3D models and NPCs → `public/assets/models/`, textures → `public/assets/textures/`, voice lines → `public/assets/audio/voice/`, sound effects → `public/assets/audio/sfx/`.
> 3. Save this file in the repo root as `CLAUDE.md` (Claude Code reads it automatically every session).
> 4. Open Claude Code in VS Code and say: **"Read CLAUDE.md and do Milestone 0 only. Stop when it's done."**
> 5. After each milestone, test it using its checklist, then say: **"Milestone N works. Do Milestone N+1."**

---

## 1. Your role and how to work

You are the lead developer for my Final Year Project (Universiti Putra Malaysia): **SAERG, a Social-engineering Awareness Escape Room Game**. It is a browser-based 3D first-person escape room that teaches university students and new employees (age 18–30) to recognise and report six social engineering attacks. It is also a research instrument: it collects pre/post quiz scores, in-game decisions and usability ratings for my study.

Rules for working with me:

- **Build in milestones (Section 12). Do one milestone, then stop.** Summarise what you built, list the files you changed, and tell me exactly how to test it. Commit with a clear message (`M2: HUD, timer and scoring`).
- **This spec is the source of truth.** If something is unclear, or you think a design change would be better, ask me first. Don't silently change game rules, text, scores or order.
- **All game text lives in JSON data files (Section 7), not in code**, so I can edit wording without touching TypeScript.
- **Never block on a missing asset.** If a model, texture or sound isn't there, use a labelled placeholder (a coloured box, silent audio) and log a warning, then keep going.
- Ask before adding any dependency not listed in Section 2, before deleting files, and before changing the folder structure.
- Write clean, commented TypeScript. I need to explain this code in my thesis and viva, so prefer readable over clever.
- If you can't access the repo (chat mode), output every file in full with its path. Never write "rest unchanged".

---

## 2. Tech stack (fixed)

| Part | Choice |
|---|---|
| 3D engine | Babylon.js, latest stable, ES-module packages (`@babylonjs/core`, `@babylonjs/loaders`), tree-shaken imports |
| Language | TypeScript, `strict: true` |
| Build tool | Vite |
| 2D screens (quiz, email, phone, dialogue, HUD, debriefs) | Plain HTML/CSS overlays above the canvas (no React). One small UI module per screen |
| Tests | Vitest for game logic (state machine, timer, scoring, outcomes) |
| Analytics backend | Node.js + Express + SQLite (`better-sqlite3`) in `/server` |
| Frontend hosting | GitHub Pages, deployed by a GitHub Actions workflow on push to `main` |
| Target | Desktop Chrome, Edge and Firefox. Keyboard + mouse. Mobile is out of scope |

Performance targets: at least 30 fps at 1080p on a laptop with integrated graphics (Ryzen 5 class); total download ≤ 40 MB; first playable in ≤ 15 s on a normal connection. Use baked lighting, `freezeWorldMatrix()` on static meshes, frozen materials, and no real-time shadows unless they're cheap.

---

## 3. Repository structure

```
/
├─ CLAUDE.md                  ← this file
├─ index.html
├─ vite.config.ts             ← base path set for GitHub Pages
├─ package.json / tsconfig.json
├─ .github/workflows/deploy.yml
├─ public/assets/
│   ├─ models/                ← my .glb files
│   ├─ textures/              ← poster_997.png etc.
│   └─ audio/
│       ├─ voice/             ← AIN_01.mp3 … DAN_06.mp3 (33 files, already made)
│       └─ sfx/               ← optional, may be empty at first
├─ src/
│   ├─ main.ts
│   ├─ config.ts              ← API URL, debug flags
│   ├─ core/                  ← GameState machine, Timer, Scoring, EventBus
│   ├─ world/                 ← scene loading, player controller, interactables, NPCs, lighting
│   ├─ scenarios/             ← ScenarioRunner (generic) + per-scenario hooks for 3D effects
│   ├─ ui/                    ← overlays: hud, consent, title, quiz, choicePanel, email, phone, call, debrief, ending, feedback, pause
│   ├─ audio/                 ← AudioManager + subtitles
│   ├─ analytics/             ← event queue, batching, sendBeacon, local fallback
│   ├─ data/                  ← all JSON content (Section 7)
│   └─ styles/
├─ server/                    ← Express + SQLite analytics API
└─ tests/
```

---

## 4. My 3D assets

My models are `.glb` files in `public/assets/models/`. **Before writing any scene code, list that folder and fill `src/data/assets.json`** to map each logical ID below to a file (and a mesh/node name if one file holds several objects). Show me the mapping table and ask me to confirm anything you're unsure about. Any ID without a file gets a placeholder.

| Logical ID | What it is |
|---|---|
| `office` | Office floor shell: walls, windows, ceiling, floor, lights |
| `playerDesk`, `chair`, `laptop`, `smartphone`, `monitor` | The player's workstation |
| `printer` | Shared printer area |
| `usbDrive` | Yellow USB drive with a label |
| `secureDoor`, `badgeReader`, `wallPhone` | Server-room door, its reader, the security phone |
| `itDropBox` | IT drop box beside the secure door |
| `exitDoor`, `exitKeypad`, `lockdownLight` | Exit door, keypad, red light |
| `pantry`, `posterFrame` | Pantry area and a frame for the 997 poster texture |
| `npcAina`, `npcCourier`, `npcDaniel` | Rigged characters (idle, walk, talk animations if available) |

**NPCs:** for each NPC `.glb`, list its animation groups and map them to `idle`, `walk` and `talk` in `assets.json`. If an animation is missing, use idle and tell me.

**Audio:** I already have all audio. List `public/assets/audio/voice/` and `public/assets/audio/sfx/`.
- Map each voice file to the IDs in Section 10, and each SFX file to the names in Section 10.
- If my file names don't match, build the mapping in `voice.json` and `assets.json` rather than renaming files.
- Show me the table, and ask about anything you can't match.

The 997 awareness poster is `public/assets/textures/poster_997.png`. Put it on the `posterFrame` plane in the pantry as decoration. It isn't interactive.

---

## 5. Look and feel

Match my mockups:

- **UI colours:** background `#0F1419`, panels `#1A2129`, borders `#2C3640`/`#3A4650`, text `#E8ECEF`, muted text `#9AA6B2`, accent amber `#F2A93B`, earned/good `#4CC38A`, breach/danger `#F0645A`.
- **Fonts:** Space Grotesk (UI), JetBrains Mono (timer, code digits, labels), loaded from Google Fonts.
- **Choice buttons all look identical**, so the style never gives away the right answer.
- Panels have 8–12 px rounded corners, no gradients and no emoji. Buttons are at least 44 px tall.
- **Accessibility:** real `<button>`/`<label>`/`<input>` elements, visible keyboard focus, and text contrast of at least 4.5:1. Every voice line has a subtitle.

---

## 6. Game overview and rules

**Story:** The player is a new intern on day one at **Nexora Sdn Bhd** (a fictional company). At 5:00 pm IT locks the office down after a suspected breach. The exit needs a **6-digit code**, and the system releases one digit each time the player handles an attack. The six attacks come in a fixed order.

| # | Scenario | Location | Digit | Scenario badge |
|---|---|---|---|---|
| 1 | Phishing (with fake login page) | Laptop on player desk | 4 | Phish Finder |
| 2 | Smishing (WhatsApp job scam) | Smartphone on desk | 7 | Scam Blocker |
| 3 | Vishing (fake police call) | Smartphone call | 1 | Call Checker |
| 4 | Baiting (USB drive) | Printer area | 9 | Bait Breaker |
| 5 | Tailgating (courier) | Secure server-room door | 3 | Door Guardian |
| 6 | Shoulder surfing (finale) | Player workstation | 6 | Screen Shield |

Exit code: **4 7 1 9 3 6**.

### Outcomes (every scenario)

| Outcome | Reward / penalty |
|---|---|
| **Safe** (verify and report) | Digit + 100 XP + scenario badge + clue to the next scenario |
| **Partly safe** (ignore/avoid but don't report) | Digit + 50 XP + a tip on why reporting matters + clue |
| **Unsafe** | Consequence sequence → Breach Meter +1 → −60 s → debrief → retry from the scenario's last decision point |
| Retry after unsafe | Safe on retry: digit + 50 XP, no badge. Partly safe on retry: digit + 25 XP |

Every outcome ends with a **debrief** (red flags shown one by one, then a one-line lesson). Then the clue for the next scenario plays.

### Global rules

| Rule | Value |
|---|---|
| Lockdown timer | 20:00 countdown. Starts when the tutorial ends. Turns red and pulses under 3:00; PA subtitle "Three minutes remaining" at 3:00 |
| Timer pauses during | Pause menu, consequence sequences, debriefs (penalty still applies) |
| Breach Meter | 3 slots. The 3rd breach ends the game immediately (Lockdown Failed) |
| Hints | 3 per game, H key or button. Each costs 30 s and highlights one red flag not yet found. Greyed out at 0 |
| Order | Fixed. Interacting with a later scenario's object shows "Not now. Finish your current check first." and flashes the objective card |
| Idle | After 60 s without progress, the objective card pulses and the current target object glows |
| Max XP | 600 |

### Endings

| Ending | Condition |
|---|---|
| Clean Escape | All 6 digits, 0 breaches |
| Escaped | All 6 digits, 1–2 breaches |
| Lockdown Failed | 3rd breach, or timer reaches 00:00 |

Bonus badges (9 badges in total with the 6 scenario badges):
- **Clean Escape:** 0 breaches.
- **Speed Escaper:** finished with more than 8:00 left.
- **Reporter:** safe outcome on the first try in all 6 scenarios.

### Controls

WASD move · mouse look (pointer lock) · **E** or left click interact · **I** toggle inspect mode on a screen · **H** hint · **Tab** badges/progress panel · **Esc** pause. Browsers release pointer lock on Esc, so open the pause menu on `pointerlockchange`.

### HUD

- Top left: lockdown timer and exit code (6 slots, filled green as earned).
- Top right: Breach Meter (3 bars) and XP.
- Left, under the timer: objective card ("Objective 4 / 6: Something was dropped by the printer").
- Centre: crosshair, which becomes a hand over interactables. An interact prompt appears beside the object ("E · Pick up USB drive").
- Bottom right: hint button ("Hint · 2 left · −30 s").
- Bottom left: controls strip.

---

## 7. Data files (`src/data/`)

Make all content data-driven:

- `assets.json`: logical ID → file, node name, position/rotation overrides.
- `scenarios.json`: one entry per scenario with:
  - `id`, `order`, `digit`, `badge`, `locationObjectId`, `objectiveText`
  - `redFlags[]`: `id`, `text`, `anchor` (DOM element id in the overlay that reveals it on hover)
  - `nodes`: a decision tree. Each node has `speakerLines[]` (voice IDs), `prompt`, and `options[]`. Each option has `label`, plus either `next` (node id) or `outcome` (`safe` | `partly` | `unsafe`), `consequenceId`, `tip` and `feedbackVoice`.
  - `debrief` (`flagsOrder`, `lesson`), `clue` (text + voice/sfx + what activates next), `consequences{}` (text and which sequence to play).
- `voice.json`: voice ID → `{ speaker, file, subtitle }` (Section 10).
- `quiz.json`: Form A (pre) and Form B (post), 12 multiple-choice items each, 2 per attack type, parallel in difficulty. **Draft the items and mark the file `"status": "DRAFT – researcher to replace with validated items"`.** I'll replace them with items adapted from HAIS-Q.
- `survey.json`: the 10 standard SUS items (5-point), MEEGA+ placeholders (I'll fill these), and 2 open questions: "What was most useful?" and "What was confusing?".
- `text.json`: consent text (placeholder I will replace), title, how-to-play, PA lines, ending texts, the six-habits card, and the thank-you text.

**Choice order:** show options in the order written in `scenarios.json`. I've ordered them below so the safe answer isn't always last; keep that.

---

## 8. Full game flow (state machine)

Implement an explicit state machine in `src/core/GameState.ts`:

```
BOOT → CONSENT → TITLE → PRE_QUIZ → INTRO → TUTORIAL → LOCKDOWN → EXIT_SEQUENCE
     → ENDING → POST_QUIZ → FEEDBACK → THANKS
LOCKDOWN has sub-states per scenario: EXPLORE → INTERACT → (CONSEQUENCE) → DEBRIEF → CLUE → next scenario
Any time in LOCKDOWN: 3rd breach or 00:00 → FAILED → ENDING
REPLAY: THANKS → (skip CONSENT and both quizzes) → INTRO
```

### 8.1 Opening

1. **BOOT:** loading screen "Loading Nexora HQ…" with a real progress bar from the asset loader.
2. **CONSENT:**
   - Information sheet text, a consent checkbox, and a **participant code** field given by the researcher (format check only). No name or email is ever collected.
   - Declining shows a thank-you screen and ends the session.
3. **TITLE:** "Day One at Nexora" with **Start security briefing** and **How to play**. How to play opens a one-page overlay: goal, the three outcomes, timer, Breach Meter and hints.
4. **PRE_QUIZ:** "HR · First-day security check", Form A, 12 questions with a progress bar. **No feedback or score shown.** Store every answer.
5. **INTRO** (about 30 s, Skip button):
   - 4:55 pm. Player sits at the desk. Aina says AIN_01, AIN_02, AIN_03 and walks out.
   - 5:00 pm. Lights fade to red, alarm SFX, exit door locks.
   - PA subtitle: "Security lockdown in effect. A breach is suspected. Staff must pass six security checks to release the exit code."
6. **TUTORIAL** (untimed):
   - Prompt the player to walk to the desk (WASD), look at the laptop, and press E to sit.
   - Open a harmless HR "Welcome to Nexora!" email and practise inspect mode: hovering the sender reveals the real domain `nexora.com.my`.
   - Tooltips explain the HUD and hints.
7. **LOCKDOWN starts:** timer at 20:00. The laptop pings "New email from IT Helpdesk". Objective 1 / 6.

### 8.2 Scenario 1: Phishing (digit 4)

**Overlay:** a "NexMail" client on the laptop.
- Inbox: IT Helpdesk (unread, top), HR "Welcome to Nexora!", Aina "Your first-week tasks".
- Email:
  - From: `IT Helpdesk <it-support@nexora-secure.co>`
  - Subject: "URGENT: Re-verify your account before lockdown or lose access"
  - Body: "Dear Staff, Due to tonight's security lockdown, all accounts must be re-verified. Accounts not verified within 15 minutes will be permanently disabled. Regards, IT Support Team"
  - Button "Re-verify my account". Hovering it shows `http://nexora-staff-login.co/verify?id=8812`.
- The toolbar has **Report Phishing** and **Delete**.
- Clicking the button opens a fake "Nexora Staff Portal" page at that URL, with email/password fields and a Close button.

**Red flags (5):**
1. Lookalike sender domain, not `nexora.com.my`.
2. Generic greeting "Dear Staff".
3. Threat plus a short deadline.
4. The button's real link doesn't match.
5. The portal is on a lookalike `http` domain asking for a password.

**Options (in this order):**
- "Delete the email" → partly. Tip: "Deleting protects you. Reporting protects everyone."
- "Report it with the Report Phishing button" → safe.
- "Click Re-verify my account" → portal opens, with these options:
  - "Close the page without logging in" → partly. Tip: "Leaving the page was right, but report it so IT can warn others."
  - "Log in with my email and password" → unsafe.

**Consequence:** screen glitch. The attacker logs in, and the same email is sent to 40 colleagues. Message: "Your account was taken over."

**Debrief:** the email reappears with each red flag highlighted in turn. Lesson: "Check the sender, hover before you click, and report it to IT."

**Clue:**
- If the player reported: IT replies "Thanks for reporting. Attackers are also messaging staff phones tonight."
- Otherwise: an IT broadcast says "All staff: attackers are also messaging staff phones tonight."
- Then the phone buzzes. Objective 2 / 6.

### 8.3 Scenario 2: Smishing, WhatsApp job scam (digit 7)

**Overlay:** a phone with a WhatsApp-style chat from "+60 11-XXXX XXXX", with no profile photo and "Not in your contacts".

**Node flow:**
1. Message: "Hi, I'm Sarah from HR Recruitment. Part-time online task, earn RM300/day just liking products. Interested?" Options:
   - "Block and report the number" → safe.
   - "Reply 'Interested'" → node 2.
   - "Ignore it and put the phone down" → partly.
2. Task 1: "Like these 3 products and send a screenshot." Player taps Done. "Task 1 done ✓ RM15 credited to you!" with a fake receipt. Task 2 works the same way: "RM30 credited!". Then:
   - "VIP task unlocked! Pay RM100 registration deposit to earn RM800 today. Pay here: pay-taskvip.online/vip"
   - "Only 3 slots left, hurry ya!"
3. Options:
   - "Pay the RM100 deposit to unlock RM800" → unsafe.
   - "Block and report the number" → safe.
   - "Stop replying and close the chat" → partly. Tip: "You stopped in time, but block and report so they can't target you again."

**Red flags (5):**
1. Unknown number, no company identity.
2. Pay far too high for trivial work.
3. Small payouts first to build trust.
4. Upfront payment to start earning.
5. Payment link to a non-official site.

**Consequence:** each new "task" demands a bigger deposit (RM300, then RM1,000) until the balance shows RM0. "You've lost RM1,400."

**Debrief:** the chat replays with the flags marked. Fact card: "Job scams rose sharply in Malaysia in 2025. Real employers never ask you to pay to work."

**Clue:** the phone rings with "Private Number". Objective 3 / 6.

### 8.4 Scenario 3: Vishing, fake police call (digit 1)

**Overlay:** a call screen ("Private Number"), the dialogue as subtitles, and option buttons. Voice lines in Section 10.
- **"Hang up"** is always available.
- **"Hang up, call the official number and report to 997"** is available from node 2 onward. It opens a dialer with 997 prefilled; confirming = **safe**.

**Node flow:**
0. Incoming call. Options:
   - "Answer" → node 1.
   - "Decline" → the phone rings again after 10 s. On answer, play RAH_07 then continue to node 1. Declining twice → partly.
1. Play RAH_01, RAH_02. Options:
   - "Can I call you back on the official number?" → RAH_04 → node 2.
   - "What? I didn't do anything!" → RAH_03 → node 2.
   - "Hang up" → partly.
2. Play RAH_05. Options:
   - "Okay, I'll cooperate" → node 3.
   - "Hang up, call the official number and report to 997" → safe.
   - "Hang up" → partly.
3. Play RAH_06, then BNK_01, BNK_02, BNK_03. If idle for 8 s, play BNK_05. Options:
   - "Refuse to give any details" → BNK_07, the caller hangs up → partly.
   - "Give my IC number" → BNK_04 → node 4.
   - "Hang up, call the official number and report to 997" → safe.
4. TAC request. Options:
   - "Hang up, call the official number and report to 997" → safe.
   - "Read the TAC to him" → BNK_06 → unsafe.
   - "Refuse and hang up" → partly. Tip: "Report quickly so the bank can freeze funds."

**Red flags (5):**
1. Threat of arrest over the phone.
2. Demand for secrecy.
3. Handover between "agencies".
4. Request to transfer money or read out a TAC.
5. Pressure not to hang up and call back.

**Consequence:** RM18,400 leaves the account, splits through mule accounts and ends in a crypto wallet (animated flow on screen).

**Debrief:** "Police and Bank Negara never ask you to transfer money or share a TAC over the phone." Card: "The faster you call 997, the more money can be frozen."

**Clue:** while hanging up, the player notices the USB drive glowing on the floor by the printer. Objective 4 / 6: "Something was dropped by the printer."

### 8.5 Scenario 4: Baiting, USB drive (digit 9)

**3D:**
- The USB drive lies on the floor by the printer and glows faintly when looked at.
- E picks it up and shows a close-up overlay of the label: "Gaji & Bonus 2026 – SULIT". Thought text: "Whose is this? Maybe the files say who owns it."
- The player now **carries** it. Valid targets glow: the laptop, the IT drop box (by the secure door), and the spot where it was found.

**Options (by where the player takes it):**
- IT drop box, then a "Report found device" confirm → safe.
- Put it back where it was → partly. Tip: "The next person might plug it in. Hand it to IT."
- Plug into the laptop → unsafe.

**Red flags (4):**
1. Unknown owner.
2. Tempting "confidential" label.
3. Left in a shared area.
4. Appeared during a security incident.

**Consequence:** the file `Bonus_2026.xlsx.exe` runs, then a ransomware screen locks the files with a countdown.

**Debrief:** attackers plant drives in car parks, lobbies and printers. The file used a double extension to hide that it was a program. IT checks found devices on an isolated machine.

**Clue:** at the drop box, the courier is waiting by the secure door. Objective 5 / 6.

### 8.6 Scenario 5: Tailgating (digit 3)

**3D:**
- The player taps their badge at `badgeReader` and the reader turns green.
- `npcCourier` walks up carrying boxes, with no badge visible. Play COU_01, COU_02.
- A dialogue panel appears at the bottom.

**Options (in this order):**
- "Do you have a visitor pass?" → COU_03. The same options show again without this one. If the player hesitates for 8 s or picks it again, play COU_04.
- "Refuse politely and call security" → COU_05, the courier walks off fast, and the player uses `wallPhone` → safe.
- "Hold the door for him" → COU_06 → unsafe.
- "Walk through and let the door close" → COU_07 → partly. Tip: "Good you didn't let him in. Alert security so they can check."

**Red flags (5):**
1. No badge or visitor pass.
2. Hands full, so refusing feels rude.
3. Urgency: "boss is waiting".
4. Name-dropping a real manager.
5. Arriving during a lockdown.

**Consequence:** the courier enters the server room and leaves with a laptop and a hard drive, shown as a grainy "CCTV replay".

**Debrief:** the "one card, one person" rule, plus a polite line to use: "Sorry, I can't let anyone in. Reception can sign you in."

**Clue:** security radio subtitle: "Thanks. All checks are nearly done. Enter the exit code at your workstation to unlock the door." Objective 6 / 6.

### 8.7 Scenario 6: Shoulder surfing, finale (digit 6)

**3D + overlay:**
- The player sits at the workstation. The screen shows "Exit release: log in, then enter the 6-digit code".
- `npcDaniel` walks up and stands close behind. Play DAN_01, then DAN_02 after 3 s.
- A short camera cut shows Daniel's line of sight and his reflection in the window.
- When the password field is focused, play DAN_03.

**Options (before typing, in this order):**
- "Ask Daniel to step back and tilt the screen" → DAN_04, Daniel steps back → safe.
- "Type your password anyway" → DAN_06, Daniel leaves → unsafe.
- "Cover the keyboard with one hand" → DAN_05 → partly. Tip: "The screen still showed your username and the code."

**Red flags (4):**
1. Someone standing directly behind you.
2. Unusual interest in your screen.
3. Small talk used as a distraction.
4. A "colleague" you've never met, during a lockdown.

**Consequence:** a replay from Daniel's point of view shows the password being typed; later he logs in from another desk. The code must be re-entered.

**Debrief:** show what Daniel could see from where he stood. Lesson: "Check behind you, block the view, and lock your screen (Windows + L) when you step away."

**Then:**
- The password auto-types with masked dots.
- The player types the 6 digits on a keypad (the HUD shows the earned digits). A wrong code shakes the field, and the player can retry.
- The correct code goes to EXIT_SEQUENCE.

### 8.8 Exit and endings

1. **EXIT_SEQUENCE:** lights return to normal. PA subtitle "Lockdown lifted." The exit door opens, the player walks out, and the screen fades.
2. **ENDING:**
   - Show the rank, time used, XP, breaches, and all 9 badges (earned in colour, missed greyed out).
   - Play Aina's voicemail: AIN_04 (Clean Escape), AIN_05 (Escaped) or AIN_06 (Lockdown Failed).
   - Escaped lists the breached scenarios. Lockdown Failed lists the scenarios reached and the red flags missed.
   - Button "Write the incident report".
3. **POST_QUIZ:** "Incident report" styled as an IT form, Form B, 12 questions. Show the score only after submitting.
4. **FEEDBACK:** SUS (10 items), MEEGA+ items, and the 2 open questions.
5. **THANKS:**
   - Pre-quiz vs post-quiz score.
   - The six-habits card:

     | Attack | Habit |
     |---|---|
     | Phishing | Check the sender, hover before you click, report to IT |
     | Smishing | Real jobs never ask you to pay; block and report |
     | Vishing | Hang up, call the official number, report to 997 |
     | Baiting | Never plug in a found device; hand it to IT |
     | Tailgating | One card, one person; send visitors to reception |
     | Shoulder surfing | Check behind you, block the view, lock your screen |

   - "Scammed? Call your bank and NSRC 997 immediately."
   - Buttons: **Play again** (no quizzes, no consent) and **Close**.

### 8.9 Edge cases

| Situation | Behaviour |
|---|---|
| Pause (Esc) | Timer stops. Menu: Resume, Settings (master volume, voice volume, mouse sensitivity, subtitles on/off, subtitle size), Quit |
| Quit mid-game | Confirm dialog. Send `game_end` with `ending: "quit"`, then go to THANKS |
| Tab closed or refreshed | Flush queued events with `navigator.sendBeacon` on `pagehide`. The session is marked incomplete on the server |
| WebGL unavailable | Friendly message asking the player to use a recent Chrome, Edge or Firefox on a laptop/desktop |
| Replay | Same scenarios, `replay_start` logged, quizzes skipped |

---

## 9. Scenario engine (generic)

Write one `ScenarioRunner` that plays any scenario from `scenarios.json`:

- Activate the scenario's object.
- Open its overlay.
- Walk the node tree: play voice lines with subtitles, show options, handle idle timers.
- Track red flags revealed through inspect hover.
- Apply the outcome via `Scoring`, play the consequence, run the debrief and clue, then advance.

Per-scenario 3D effects (lights, NPC walk paths, camera cuts, carrying the USB) go in small hook files (`src/scenarios/hooks/baiting.ts` etc.) that the runner calls by `consequenceId` or node id. Game rules stay out of the hooks.

`Scoring` and `Timer` must be pure logic with no Babylon imports, so they can be unit-tested.

---

## 10. Audio and subtitles

All 33 voice files already exist in `public/assets/audio/voice/`. Phone-filtered lines are already processed.

| ID | Speaker | Subtitle |
|---|---|---|
| AIN_01 | Aina | Hey, settling in okay? Sorry, I have to run, my kid's school event. |
| AIN_02 | Aina | IT is running a security drill tonight. If anything gets locked, just follow the instructions on screen. |
| AIN_03 | Aina | And if something looks weird, report it to IT. That's what they're there for. See you tomorrow! |
| AIN_04 | Aina | Heard you handled the drill really well. Not bad for day one! |
| AIN_05 | Aina | You made it out. A couple of things got through, but that's what drills are for. Let's go through them tomorrow. |
| AIN_06 | Aina | Rough first day, huh? Don't worry, everyone gets caught by something. We'll go through it together tomorrow. |
| RAH_01 | Inspector Rahman | Hello, this is Inspector Rahman from Bukit Aman, Commercial Crime Investigation Department. |
| RAH_02 | Inspector Rahman | Your IC number has been linked to a money-laundering case. A warrant for your arrest will be issued tonight. |
| RAH_03 | Inspector Rahman | Then you must cooperate fully. If you are innocent, you have nothing to worry about. |
| RAH_04 | Inspector Rahman | No. If you hang up, the warrant goes through immediately. This call is being recorded. |
| RAH_05 | Inspector Rahman | This case is confidential. Do not tell anyone, not your family, not your colleagues. Understand? |
| RAH_06 | Inspector Rahman | I'm transferring you now to a Bank Negara officer. He will help protect your money. |
| RAH_07 | Inspector Rahman | Why did you hang up? This is very serious, you know. |
| BNK_01 | Encik Faizal | Good evening, I'm Faizal from Bank Negara's security unit. Don't worry, I'm here to help you. |
| BNK_02 | Encik Faizal | To protect your savings, we'll move them to a safe government account while the investigation is ongoing. |
| BNK_03 | Encik Faizal | First, please confirm your full IC number for me. |
| BNK_04 | Encik Faizal | I've just sent a TAC to your phone. Read it to me so I can verify the transfer. |
| BNK_05 | Encik Faizal | The longer we wait, the more risk to your money. Quickly, please. |
| BNK_06 | Encik Faizal | Thank you. Your money is safe now. |
| BNK_07 | Encik Faizal | Okay, but if anything happens to your money, that's your own responsibility. |
| COU_01 | Courier | Bro, sorry, sorry! Delivery for your manager, Aina. |
| COU_02 | Courier | I forgot my access card in the van. Can hold the door for me? Quick ya, boss is waiting. |
| COU_03 | Courier | Aiyo, it's in the van also. Just two minutes only, I put the boxes and go. |
| COU_04 | Courier | Come on, my hands full lah. You want me to carry all this back down? |
| COU_05 | Courier | Okay, okay, no need to call anyone. I'll go to reception. |
| COU_06 | Courier | Thanks ah, you're a lifesaver! |
| COU_07 | Courier | Eh... never mind lah. |
| DAN_01 | Daniel | Wah, you're the new intern? I'm Daniel, from Finance. Still stuck here also ah? |
| DAN_02 | Daniel | Crazy drill, right? Every year they do this. |
| DAN_03 | Daniel | Go on, type lah. Faster you finish, faster we can all go home. |
| DAN_04 | Daniel | Oh, sorry, sorry. Old habit. |
| DAN_05 | Daniel | Haha, so serious ah. |
| DAN_06 | Daniel | Okay, I'm off. Good luck ya! |

**Subtitles:**
- Speaker name in amber, at most 2 lines of about 42 characters.
- Split longer lines at sentence breaks.
- Each card shows for the audio's length, minimum 2 s.

**SFX** in `public/assets/audio/sfx/`, mapped to these logical names (my file names may differ; see Section 4): `alarm`, `ping`, `phone_ring`, `door_beep`, `ransomware`, `office_ambience` (loop), `success`, `breach`. If one is missing, log a warning and skip it.

PA announcements are subtitles only, with a short chime.

Browsers block audio until the first user gesture, so unlock the audio context on the consent button click.

---

## 11. Analytics

**Privacy:** send only the participant code and a random session ID (`crypto.randomUUID()`). No names, emails or IP logging in the database.

**Client** (`src/analytics/`):
- Queue events and POST them in batches every 5 s to `${API_URL}/api/events`.
- Flush with `sendBeacon` on `pagehide`.
- If `API_URL` is empty or unreachable, keep events in `localStorage` and show a researcher-only **"Download session data (JSON)"** button on the THANKS screen when `?researcher=1` is in the URL.

| Event | Sent when | Fields |
|---|---|---|
| `session_start` | Consent given | participantCode, userAgent, timestamp |
| `prequiz_submit` | Pre-quiz done | score, answers[] |
| `scenario_start` | Scenario object first used | scenarioId, timeLeft |
| `redflag_found` | Red flag revealed | scenarioId, flagId |
| `hint_used` | Hint used | scenarioId, flagId |
| `choice_made` | Option chosen | scenarioId, nodeId, optionId, outcome?, secondsSinceScenarioStart, attempt |
| `reported` | Safe report chosen | scenarioId, channel (`it` / `block` / `997` / `security`) |
| `breach` | Unsafe outcome | scenarioId, breachCount |
| `game_end` | Ending reached or quit | ending, timeUsed, xp, badges[], breaches |
| `postquiz_submit` | Post-quiz done | score, answers[] |
| `survey_submit` | Feedback done | sus[], meega[], open1, open2 |
| `replay_start` | Play again | replayNumber |

Every event also carries `sessionId`, `participantCode`, `ts` and `isReplay`.

**Server** (`/server`, Express + better-sqlite3):
- `POST /api/events`: validate the shape, insert rows.
- `GET /api/export.csv`: protected by an `ADMIN_TOKEN` environment variable. One row per event.
- `GET /api/health`.
- CORS allows only my GitHub Pages origin (from `.env`) and localhost.
- Include a README section on running it locally and deploying to a free Node host. **Don't deploy it yourself.**

---

## 12. Milestones

Do one at a time. Each ends with:
- A short summary.
- A test checklist I can follow.
- A commit.
- Vitest passing for any logic changed.

| # | Milestone | Done when |
|---|---|---|
| M0 | Scaffold: Vite + TS + Babylon, folder structure, lint/format, Vitest, GitHub Actions deploy to Pages, empty scene with a "Hello SAERG" overlay | The live GitHub Pages URL shows the page |
| M1 | World: fill `assets.json` from my files, load the office with a progress bar, first-person controller with collisions, interactables (look-at highlight + E prompt), placeholders for missing assets, 997 poster on the pantry wall | I can walk around the office and see prompts on all key objects |
| M2 | Core logic: GameState machine, Timer, Scoring, Breach Meter, hints, endings logic, HUD, pause menu. Unit tests for timer, scoring (incl. retry rules) and all ending conditions. Debug panel at `?debug=1` (jump to any state/scenario, set timer, add breach, show FPS) | Tests pass. The HUD updates from the debug panel |
| M3 | Screens: consent, title, how to play, quiz engine (Form A/B from JSON), choice panel, debrief, ending, feedback, thanks | I can click through the whole flow with scenarios stubbed |
| M4 | ScenarioRunner + Scenarios 1–3 (email client, fake portal, WhatsApp chat, call screen, dialer) with inspect mode and red flags | Every option in S1–S3 reaches the correct outcome |
| M5 | Scenarios 4–6 (carrying the USB, courier NPC, Daniel + camera cut, code keypad), exit sequence, intro cutscene and tutorial | A full playthrough from consent to thanks works |
| M6 | Audio + subtitles: AudioManager, `voice.json`, subtitle cards, SFX hooks, settings volumes | Every voice ID in Section 10 plays with the right subtitle |
| M7 | Analytics client + server, local fallback, CSV export, README for running the server | Events from one playthrough appear in the CSV |
| M8 | Polish: performance pass (meet Section 2 targets, report fps and bundle size), idle nudges, edge cases (8.9), accessibility check, browser test on Chrome/Edge/Firefox | I sign off |

**Final test (end of M8):** write `docs/TEST_PLAN.md` listing every path through every scenario (safe, partly, unsafe, retry) with the expected digit, XP, breach and event log. Then confirm each path works via the debug panel.

---

## 13. Out of scope

Don't build these unless I ask: multiplayer, leaderboards, accounts or login, an admin dashboard (CSV export is enough), mobile/touch controls, procedural or random scenarios, or languages other than English.
