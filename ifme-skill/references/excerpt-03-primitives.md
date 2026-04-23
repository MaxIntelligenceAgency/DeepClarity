---
source_file: ifme-source/config/locales/en.yml
yaml_key: pages.faq (moment_answer, strategy_answer, category_answer, mood_answer, group_answer)
license: AGPL-3.0-or-later
attribution: © ifme community — https://github.com/ifmeorg/ifme
---

## Verbatim excerpts (English, FAQ definitions)

**Moment:**
> A Moment is an event and situation that affects your mental health. It can be positive or negative. Think of it as a journal entry or a status update.
>
> You can tag Moments with Strategies, Categories, and Moods. You can also choose which allies can view and comment. You can also make Moments only visible to you. Moment Templates let you create reusable writing prompts.

**Strategy:**
> A Strategy is an activity, train of thought, or form of self-care that helps you cope or focus on recovery.
>
> You can tag Strategies with Categories. You can also choose which allies can view and comment. You can also make Strategies only visible to you. Shared Strategies will be visible to all allies specified, which means you can tag your Moments with their Strategies!

**Category:**
> A Category is a tag that can represent the people, places, and things that are important to you.

**Mood:**
> A Mood is a tag describing your state of mind, feelings, and emotions.

**Group:**
> A Group offers support, mentorship, and discussions on mental health. You can create Groups and your allies have the option of joining. You can only join groups that are created by your allies.

## Pattern exemplified

This is the **product's own definition of its primitives**, written to be read by a user browsing the FAQ. A few patterns stand out:

1. **Every primitive fits in one short paragraph.** No jargon, no nested definitions.
2. **Every sharing control is explicit.** For Moments *and* Strategies, the same three-line clause reappears: *"You can also choose which allies can view and comment. You can also make [it] only visible to you."* Visibility is part of the *definition* of the primitive, not a setting bolted on later.
3. **Strategies are transitively shareable.** *"Shared Strategies will be visible to all allies specified, which means you can tag your Moments with their Strategies!"* — an ally can contribute a Strategy into your life, not just comment on your Moments. The graph of support is bidirectional.
4. **Groups require existing allyship.** *"You can only join groups that are created by your allies."* You can't stumble into a stranger's support circle. The design assumption is that trust precedes peer groups.

## How ifme-skill reuses it

The `SKILL.md` "three ifme primitives" section is distilled from exactly these five definitions. The skill keeps the vocabulary — Moment, Strategy, Ally — as names the model can use when talking back to the user. The skill does *not* try to mimic the Group or Moment Template features; those are app-level affordances that don't translate into a conversational prompt.

The "explicit visibility" pattern — *"you can also make it only visible to you"* — is translated in `SKILL.md` into the rule that the skill helps with *drafting* what might be shared, but never recommends whether to share.
