# 29k Content Patterns

Source: `29k-source/content/` (CC-BY-SA-4.0, © 29k foundation).
Items read in full for this analysis (all under `src/exercises/`):

| # | File | Name | Duration | Modes | Lineage |
|---|------|------|----------|-------|---------|
| 1 | `3843d06f-….json` | Help Now! | 10m | async | SEE Learning (crisis-adjacent micro-intervention) |
| 2 | `c5b1197a-….json` | Setting boundaries | 2m async / 30m live | async+live | In-house (relationships) |
| 3 | `b18c1cff-….json` | Breathing anchor | 7m async / 30m live | async+live | In-house (mindfulness) |
| 4 | `a1da8d37-….json` | Self Compassion | 10m | async | SEE Learning |
| 5 | `61adeaf2-….json` | Personal values | 6m async / 30m live | async+live | In-house (ACT-flavored values) |
| 6 | `0bcb6eb0-….json` | Your 90th birthday | 8m async / 30m live | async+live | Classic ACT-style future-self |
| 7 | `4161a0d8-….json` | PsyPal Difficult conversations | 15m | async | PsyPal (EU-funded palliative care project) |

Scope check: I also grep'd the whole corpus for "crisis", "therapist", "professional", "suicide", "988", "hotline", "emergency", "disclaimer" etc. and read the relevant UI strings (`Modal.SafetyToolkit.json`, `Overlay.AboutEditorial.json`). Findings are folded into §3 and §4 below.

---

## 1. Structural skeleton

Every live-capable exercise follows a rigid, reusable 6-phase arc. The async-only SEE Learning exercises are a slight variation of the same arc with the live-only phases stripped.

**Canonical live arc** (`Setting boundaries`, `Breathing anchor`, `Personal values`, `Your 90th birthday`):

1. **Check-in (host slide)** — host introduces self, states topic + duration, asks everyone 2–3 words: *"How are you feeling right now?"*
2. **Content (content slide)** — a narrated lottie/audio/subtitles payload, reader-paced, with hostNote framing before/after
3. **Private reflection (reflection slide)** — 1–2 minutes, 1–3 specific questions, stock line *"You can take notes on a piece of paper or just mental notes in your head. And there is no right or wrong here, our answers are our own."*
4. **Group sharing (sharing slide)** — preceded by three fixed sharing rules (see §6); 2-minute timer per speaker; pass allowed
5. **(Often) a second reflection + sharing pair** — for topics where one round is not enough (`Setting boundaries` has two)
6. **Mission + check-out (host slide, then mirrored instruction slide)** — a "mission" to carry into the week, followed by 2–3-word check-out: *"What will you bring from this for the rest of your day?"*

The **async-only variant** (`Help Now!`, `Self Compassion`) trims to: instruction → content → reflection questions (framed as instruction slides) → sharing prompts (headings only, no peer group — they become journal prompts) → mission wrap-up. Same bones.

Quoted evidence of the skeleton's rigidity — the opening hostNote template is near-verbatim across unrelated sessions:

> *"Welcome. I am X and today we will work for around 30 minutes on grounding ourselves right here and now. … Let's start with a mini check-in. What are you grateful for right now? Please answer in two-three words."* — `Breathing anchor` slide[0]

> *"Welcome. I am X and today we will work for around 30 minutes on values and purpose in life. … Let's start with a mini check-in. How are you feeling right now? Please answer in two-three words."* — `Personal values` slide[0]

> *"Welcome. I am X and today we will work for around 30 minutes on values and finding our direction in life. … Let's start with a mini check-in. How are you feeling right now?"* — `Your 90th birthday` slide[0]

And the closing wrap-up collapses to the same `Well done / mission / check-out` triplet:

> *"Well done. if you're up for it, you can continue what we started here today with a mission …"* — `Breathing anchor` slide[4]

> *"Well done for defining what matters to you in life… You can continue with this mission …"* — `Personal values` slide[4]

**Template artifacts** (evidence the skeleton is scaffolded, not generated per-session): `PsyPal Difficult conversations` still has placeholder strings in published slides — `"Welcome. I am X and today we will work for around 30 minutes on xx\n\nWe'll be doing xx ex. meditation …"` (slide[0]) and `"xxMain question\n\nxxFurther explanations of main question if needed"` (slide[3]). The content-team hand-fills a template. This is the clearest single evidence for "rigid skeleton."

## 2. Communication style

Metrics over the 7 selected exercises (3,389 words, 347 sentences of narration + hostNotes):

- **Average sentence length**: 9.8 words (median 9).
- **Approx. Flesch-Kincaid grade**: 4.2 (i.e. readable by an average 10-year-old). Very low.
- **Pronoun profile per 1000 words**: `you/your` 50.2, `we/us/our` 35.7, `I/me/my` 2.7.

Implication: 29k speaks **in 1st-person plural collective ("we / our / let's") plus 2nd-person direct ("you / your / yours")**. `I` is near-absent except where the host is introducing themselves ("I am X"). The collective "we" is used even in solo async sessions — the app is written as if a host is pacing you through it. See `Help Now!` async slide[8]:

> *"Well done. Today, we've explored and tried out Help Now! Strategies. These are simple and immediate techniques for helping us return to the resilient zone …"*

Tone descriptors derivable from the sources:

- **Invitational, not directive.** Constantly hedges with `if you're up for it`, `are you up for a mission?`, `if that's not possible right now`. Example: *"If we're up for it, we can continue with a mission"* (`Help Now!` slide[9]); *"Are you up for a mission? If so, decide a simple action …"* (`Your 90th birthday` slide[5]).
- **Normalizing, not prescriptive.** The "there is no right or wrong here, our answers are our own" line appears verbatim in 5 of 7 read exercises. Similarly: *"Everything on the inside is okay. Anger, love, hatred, sadness. Whatever shows up. No wrongs, no rights. It is what it is."* (sharing rule #3, repeated in every live exercise).
- **Warm short closings.** `Thank you all for checking in.` `Thank you so much everyone.` `Well done.` — clipped, affirming, never effusive.

## 3. Scope discipline

29k doesn't explicitly write "we are not therapy" into the **content itself** — but the content's discipline shows in what it *refuses to do*. Across all 7 exercises:

- **No diagnosis, no advice-giving.** The most striking rule is baked into every sharing phase:

  > *"**All you need to do is listen.** There is no fixing, helping or advice-giving needed. We are just showing up and exploring what ourselves and others are going through."* — sharing rule #2, verbatim in `Setting boundaries`, `Breathing anchor`, `Personal values`, `Your 90th birthday`, `PsyPal Difficult conversations`.

  This is a structural ban on the main failure mode of peer mental-health content — other participants can't try to "solve" each other.

- **No solutions from the app either.** Reflections are always questions, never answers. Example from `Setting boundaries` slide[2]: *"1. Which of your needs aren't being met or expressed at the moment? 2. Why are these needs not met or expressed?"* — the content never tells you what the right answer is.

- **Missions are behavioral, not cognitive.** The wrap-up "mission" always resolves to a small observable action ("talk to the people you've identified about your intentions", "take a couple of minutes each day and ground yourself", "decide a simple action you can do today or tomorrow"). No mission says "change your belief" or "stop feeling X."

- **Where they refer out.** The *content* does not refer anyone anywhere — but the *app chrome* does. `src/ui/Modal.SafetyToolkit.json` exposes a "Safety toolkit" modal with four buttons: `Frequently asked questions`, `Calm down`, `Report`, `Emergency helplines` → all link to `wiki.29k.org`. This is the only referral path in the entire codebase.

## 4. Safeguards

**This is where 29k is weakest by our project's standards, and worth documenting honestly.**

- **No in-content crisis language.** Grep across `src/` for `crisis|suicide|988|hotline|emergency|self-harm|therapist|professional help|not a substitute|disclaimer` returns **zero hits in exercise text**. The single "crisis" occurrence in content is in `db239a42-….json` (`Find eco support`) and refers to *ecological* crisis, not mental health: *"One of the most important factors for coping well in a crisis is social support. Of course, this also applies to our reactions to the ecological crises."*
- **No trigger warnings, no opt-outs inside sensitive sessions.** `PsyPal Difficult conversations` and `PsyPal Facing mortality` both engage emotionally loaded material without any "if this feels like too much, stop and do X" escape hatch inside the slide flow.
- **Safety lives in the app shell, not the content.** `Modal.SafetyToolkit.json` exists with a `helplines_url: https://wiki.29k.org/emergency-helplines` pointer, but nothing in any exercise surfaces it contextually — it's a settings-screen affordance.
- **Credentialing happens at the host layer.** `Overlay.AboutEditorial.json` claims: *"Join open live sessions with accredited hosts (**psychologists or trained volunteers**)."* The content itself has no equivalent scope statement. The AboutEditorial text also says the content is *"firmly grounded in psychological research"* but does not claim or disclaim clinical status.

**Takeaway for the distilled skill**: 29k's safeguarding is implicit and infrastructure-level (a curated app chrome with vetted hosts + a link to helplines). A Claude Skill that doesn't ship with that infrastructure can't inherit the safety implicitly — per CLAUDE.md the derived skill must add crisis routing (988) and a "I am not a therapist" scope disclaimer explicitly, because 29k doesn't model them in-content.

## 5. Evidence grounding

Pattern: **claims framed as "proven / research shows / science tells us," almost never with a named study, author, or framework.**

- **Frameworks are never named.** `ACT`, `CBT`, `Acceptance and Commitment Therapy`, `Cognitive Behavioral`, `Compassion-Focused`, `DBT` — zero hits anywhere in `src/`. `mindfulness` is named as a *practice* but never attributed to a school (MBSR, Kabat-Zinn, etc.).
- **Research is invoked generically in descriptions.** A dozen exercise descriptions hedge with phrases like:
  - `Personal values`: *"living a value-based life has been **proven to** increase sense of purpose and long term happiness."*
  - `Allow and accept`: *"Practicing acceptance can help us do more of what matters, and has **proven to be** an effective way …"*
  - `Set SMART goals`: *"SMART goal-setting **has been proven** to be helpful."*
  - `Sky gazing`: *"**Research has it that** practising these skills can help us …"*
  - `Acceptance and willingness` (hostNote): *"But **science tells us** that the things we try to get rid of have a tendency to come knocking over and over again."*
- **Researchers are credited at the collection level, not per claim.** `Self-compassion I: The inside job` lists co-creators as *"Kristin Neff, Chris Germer, original research, Jenny Rickardsson, …"* — the scholars who built the construct are credited as contributors rather than cited for specific claims. Similarly `PsyPal` credits *"Funded by the European Union"*; `SEE Compassion` / `SEE Resilience` / `SEE Awareness` / `SEE systems thinking` are all derived from **SEE Learning** (Emory University's Social, Emotional & Ethical Learning program) but no in-content citation explains that provenance.

**Takeaway for the distilled skill**: 29k's evidence-grounding is **attributional (credits at the asset level), not citational (no inline references).** The distilled skill should be *more* transparent than the source — if it says "research shows," it should name which research. This is an upgrade point, not a faithful copy.

## 6. Accessibility choices

Consistent, deliberate accessibility choices — this is 29k's strongest layer.

- **Low-jargon, plain-English prose.** FK grade ~4. Technical terms when they appear are immediately unpacked. `Breathing anchor` hostNote[1]: *"The meditation exercise we'll be doing now, let's us **practice present-moment-awareness and taking an observing stance**."* — "present-moment-awareness" is defined contextually rather than left as a mindfulness term-of-art.
- **Plural-pronoun defusion from the self.** "Our minds", "our bodies", "what's going on inside" deliberately externalizes the inner experience, which is trauma-informed framing. See `Breathing anchor` content-slide hostNote: *"Sometimes life just goes on and on, with **our minds** set in the future or dwelling on past experiences."*
- **Consent + pacing norms built into the structure, not the prose.**
  - *"If you don't want to share you can always say 'pass'."* (sharing-rule hostNote, verbatim in every live exercise)
  - *"Find a comfortable position and begin the exercise when you are ready."* (opening instruction in every SEE-Learning async exercise)
  - *"You can take notes on a piece of paper or just mental notes in your head."* (reflection-phase hostNote, 5/7 exercises) — accommodates literacy/motor/memory differences.
- **No pathologizing vocabulary.** I didn't find `disorder`, `symptom`, `diagnosis`, `condition`, `patient`, `suffering` in the 7 exercises. People are `we` and `you`; feelings are `anger, love, hatred, sadness` (neutral affect words); the harder vocabulary that *does* appear is limited to `anxiety`, `fear`, `guilt`, `self-critic`, `shame` — all named as common experiences, never framed as illnesses.
- **Inclusive framing for universals.** `Self Compassion` slide[7]: *"A high number of children and adults struggle with anxiety, and self-esteem and self-worth. The expectations of society compound this and can be internalized in unhealthy ways."* — locates the problem in *society's expectations*, not in the individual. That's a deliberate anti-stigma move.
- **Cultural framing is intentionally generic.** No exercise references a specific culture, religion, or national context. The one exception is the **PsyPal** subset (palliative care, EU-funded) which deals with mortality and difficult conversations — and even those avoid culturally specific rituals or frameworks.

**Caveat**: the 29k content doesn't *label* any of this as trauma-informed, and it doesn't distinguish accessibility adaptations for e.g. neurodivergent users, users with trauma histories, or users under acute distress. The accommodations are "one-size inclusive prose" rather than layered. The distilled skill can improve here by making the pacing/consent affordances (pass, stop, skip, note-optional) explicit and programmable, rather than embedded in host scripts.

---

## Pattern summary — what's distillable

| Pattern | Faithfulness vs upgrade |
|---------|-------------------------|
| 6-phase arc (check-in → content → reflect → share → mission → check-out) | **Copy faithfully** — this is the structural DNA |
| Sharing rules #1/#2/#3 | **Copy faithfully** — this is the most surprising and effective constraint |
| Invitational hedging ("if you're up for it", "are you up for a mission?") | **Copy faithfully** — core to voice |
| "No right or wrong" reflection framing | **Copy faithfully** |
| `we / you` pronoun mix, FK grade ~4, ~10-word sentences | **Copy faithfully** as voice constraints |
| Crisis routing / 988 / scope disclaimer | **Add** — 29k delegates this to app chrome; we have no app chrome |
| Named frameworks + citations | **Upgrade** — 29k says "research shows"; we should name the research |
| Trigger-warning / opt-out inside sessions | **Upgrade** — 29k doesn't model this |
