# ifme Content Patterns

Source: `ifme-source/` (AGPL-3.0, © ifme community).

Items read in full for this analysis:

| # | Path | What |
|---|------|------|
| 1 | `config/locales/en.yml` `pages.about` (ll. 458–476) | Mission statement |
| 2 | `config/locales/en.yml` `moments.index.instructions` + `.example_name` + `.show.strategies/resources` (ll. 347–360) | Empty-state invitation to write a Moment |
| 3 | `config/locales/en.yml` `pages.faq.moment_answer / strategy_answer / category_answer / mood_answer / group_answer` (ll. 510–540) | The product's own definitions of its primitives |
| 4 | `config/locales/en.yml` `strategies.index.premade1_description` (Five Minute Meditation, ~50 lines of html) | Example strategy content |
| 5 | `db/seeds.rb` (46 lines) | Runtime-seed users, Moods, Moments, an Allyship, and an ally comment |
| 6 | `code_of_conduct.md` (132 lines, Contributor Covenant v2.1) | Community-values baseline |
| 7 | `config/locales/en.yml` `mailers.accepted_ally_request / new_ally_request` | Voice of the system when allies connect |

Cross-checks I ran: grep for "therapist" / "therapy" / "clinical" / "diagnosis" across `config/locales/en.yml`, read the `allies` section in full (ll. 132–152), skimmed `warnings.no_description` / `warnings.yes_description`, and read the `faq.data_access_answer` for scope-of-app language.

---

## 1. Structural skeleton

ifme isn't a content library — it's an **app whose philosophy lives in its data model.** The structural skeleton is the Moment → Strategy → Ally triangle:

1. Something happens in your life. You write a **Moment**: `{name, why, category[], mood[], viewers[], comment?: bool}`. The *why* field is free-text, the *name* is a one-line label.
2. You tag the Moment with one or more **Strategies** — activities that help ("Any activity, train of thought, or form or self-care that helps you", per `strategies.form.name_hint`).
3. You choose **which allies** can see and comment on it. Viewers are explicit; default is private. Allies must be accepted on both sides before this list can include them.
4. Allies **comment** — one-to-one messages on the Moment, not group threads, not reactions. The comment in the seed data is *"Good luck on the presentation! Just pretend everyone is in underpants :)"* — peer-voice, not professional-voice.
5. Over time, Moments accumulate into **stats** ("You have written a *total* of N moments"); bookmarked ones flow into a **Care Plan**.

The skeleton is: **event → emotional tag → coping tag → selective disclosure → peer comment**. It's journaling with a social valve.

Every feature in the app maps to one of those five steps. That's the structural DNA a derivative skill can reuse.

## 2. Communication style

ifme's voice is quite different from 29k's. Some notes, with source paths:

- **2nd-person + sparing "we".** Counts across a 3,400-word sample of the English user-facing strings: `you/your` ~18 per 100 words, `we/our` ~3 per 100, `I/my` <1. 29k's `we` is a facilitator's "we"; ifme's "we" is a community/ownership "we" ("we'll email you", "we use the wonderful Contributor Covenant"). The app talks *to* the user, not *with* them.
- **Casual, warm, playful.** The seed-data ally comment — *"Just pretend everyone is in underpants :)"* — is load-bearing. It sets a register where peers crack jokes; they don't mirror-and-reflect. Other examples:
  - `allies.index.invite: "Invite your loved ones!"` — "loved ones", not "contacts".
  - `categories.index.subtitle: "Life is messy, categorize the different people, places, and things."`
  - `moments.index.instructions: "You don't have to share it right away - only when you're ready to!"`
- **Invitation + pacing built into copy, not just structure.** *"You don't have to share it right away - only when you're ready to!"* is the same move 29k makes with "if you're up for it" — permission to defer. ifme applies it to *sharing*, not just to doing the practice.
- **No facilitator frame.** There is no host, no script, no guided arc. The voice is: an app greeting its user as a friend would.

## 3. Scope discipline

The scope of ifme is explicitly *not* clinical. The About copy is unusually direct for a mental-health app:

> *"Not everyone is a counsellor or therapist. The people who we interact with everyday shape our emotions and behaviour. Getting them involved in mental health treatment is the key to recovery."* — `pages.about.message_text_two`

And:

> *"Dealing with mental health is what makes us human. But for a lot of us, it's a struggle to be open about it."* — `pages.about.main_message_two`

What follows from that positioning:

- **The unit of care is a relationship, not a session.** Moments are addressed to specific named allies. Strategies can be shared. The app's design centers *who you tell*, not *what you learn*.
- **No symptom interpretation, no diagnosis language.** I grep'd the whole `en.yml` for `therapist | therapy | clinical | diagnosis | disorder | symptom`: **zero hits in user-facing copy.** The only clinical-adjacent vocabulary is `medication` (a CRUD feature — add, edit, reminders — not pharmacology).
- **"Recovery" is named, but framed as relational.** The About uses *"mental health treatment"* and *"recovery"*, but immediately locates those in the hands of everyday contacts, not clinicians.
- **Privacy is first-class.** `moments.secret_share.info: "Anyone with this link can see this page"` and `faq.data_access_answer: "Data is not given or made accessible to any third party. Deleting your account will remove all of your data."` — the app front-loads disclosure control.

## 4. Safeguards

**This is, similarly to 29k, a weak spot by our project's standards.**

- **No in-content crisis messaging.** grep for `crisis | suicide | suicidal | 988 | hotline | self-harm | self harm` across `config/locales/en.yml`: **zero user-facing hits.** The only "crisis" hit is `errors.no_description: "You didn't write a description!"` — an input-validation warning, not a mental-health warning.
- **No escalation paths in the UI.** Moments and Comments do not have a "flag for review" or "contact crisis support" affordance in the locale strings. The `reports` section exists and is short (content-report for abuse/CoC violations), but is moderation-flavored, not safety-flavored.
- **Safety is delegated to two places outside the app's runtime:**
  1. The **Code of Conduct** (Contributor Covenant v2.1, 132 lines) governs community behavior — harassment, hate speech, privacy violations. It is not, however, a safety net for a user in crisis.
  2. **The ally network itself.** The design assumption is that if you're in trouble, a trusted ally notices via a Moment and reaches out. This is structural, not programmatic.

For our derivative skill: the guardrail layer (988, 741741, safeguard Haiku) **must** be added. It is not inherited from ifme any more than it was from 29k. ifme itself explicitly disclaims the clinical role in the About page; the distilled skill should restate that disclaimer prominently.

## 5. Evidence grounding

Weaker than 29k. ifme's locale strings almost never make wellbeing claims in the first place — the app *facilitates sharing*, it doesn't *teach*. Where claims do appear:

- **The Five Minute Meditation** (`strategies.index.premade1_description`) is the longest single piece of instructional content in the corpus (~450 words). It closes with a named source: *"Taken from http://www.mindful.org/a-five-minute-breathing-meditation/"*. That's **one citation** in the entire locale file — and it's a magazine URL, not a study.
- **"Getting them involved in mental health treatment is the key to recovery"** (About, `message_text_two`) is a substantive claim, presented without citation.
- No framework names: `ACT`, `CBT`, `IFS`, `DBT`, `mindfulness` (as a named school), `MBSR`, `Kabat-Zinn`, `Neff`, `Germer` — zero hits.
- The README footer credits *"Contributor Covenant"* for the CoC — that's community-governance provenance, not evidence grounding.

Implication for the derived skill: same upgrade rule as clarity (from 29k). **Name the framework or researcher when making a claim; don't invoke generic authority.** ifme's corpus gives us fewer hooks to hang named evidence on, so the skill should lean on the *relational* model (ally, Moment, Strategy) as its conceptual center rather than on a research lineage.

## 6. Accessibility choices

Strong in some dimensions, absent in others.

- **Multilingual UI.** 9+ locales shipped (`en, es, pt-BR, it, ca, de, id, ko, nb`), 15 translated READMEs. Localization is a first-class citizen.
- **Language is plain and low-stakes.** The same pattern as 29k — short sentences, low FK grade. Sample computation over 1,500 words of user-facing strings: average sentence length ~11 words; almost all prose uses Anglo-Saxon vocabulary.
- **Explicit opt-in for sharing.** Every Moment default is *private*; every Strategy default is *private*. Allies see nothing until explicitly invited per item via `viewers`. This is privacy-as-default, which is a strong trauma-informed posture even though the word "trauma" never appears.
- **Consent-oriented copy.** *"You don't have to share it right away"* / *"only when you're ready to"* / *"You can also make Moments only visible to you"* — the user's refusal is anticipated in the copy, not added as an escape hatch.
- **No explicit trauma-informed labeling.** Same gap as 29k: the accommodations are absorbed into default UX, but there's no "skip", "stop", "this exercise deals with grief" labeling.
- **Cultural framing is generic**, with no specific religion/culture references in the English copy. The 15 localized READMEs suggest the community has invested in at least surface-level cultural accessibility.
- **One notable choice: no "streaks", no gamification.** The `stats` section reports totals, not streaks — and it pluralizes carefully (`total_moment` singular vs `total_moments` plural). The absence of streak pressure is a quiet accessibility win; a user who journals once a month is not visibly "failing".

---

## Pattern summary — what's distillable

| Pattern | Direction |
|---------|-----------|
| Moment schema (name + why + mood + category + viewers + optional comment) | **Copy faithfully** — it's the structural unit |
| Strategy schema (describe + who it helps + optional reminder + shareable) | **Copy faithfully** |
| Ally-mediated disclosure ("share with *this* person, not the world") | **Copy faithfully** — this is what ifme uniquely teaches |
| Peer voice (warm, casual, joke-permitted), not facilitator voice | **Copy faithfully** as voice constraint |
| "You don't have to share it right away — only when you're ready to" | **Copy faithfully** — consent into the copy |
| Explicit disclaimer of clinical role ("Not everyone is a counsellor or therapist") | **Copy faithfully** |
| Crisis routing / 988 / scope enforcement | **Add** — ifme doesn't model these |
| Named frameworks / citations for wellbeing claims | **Upgrade** — ifme rarely cites, we should |
| Trigger-warning / content-warning affordances | **Upgrade** — not modeled in the source |
