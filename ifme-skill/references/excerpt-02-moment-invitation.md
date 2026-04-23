---
source_file: ifme-source/config/locales/en.yml
yaml_key: moments.index.instructions + moments.index.example_name
license: AGPL-3.0-or-later
attribution: © ifme community — https://github.com/ifmeorg/ifme
---

## Verbatim excerpt (English)

From `moments.index`:

> You haven't written about any moments yet.
>
> Don't know where to start? What's something that happened today that you would like to share and discuss with a loved one? It can be positive or negative! You don't have to share it right away - only when you're ready to! Here's an example of a Moment.

Adjacent key `moments.index.example_name`:

> Panicking over interview tomorrow!

## Pattern exemplified

Three things worth noticing happen in this empty-state string:

1. **The question is mundane.** *"What's something that happened today that you would like to share and discuss with a loved one?"* — not "what's troubling you most?", not "describe your symptoms". The framing is event-level, not pathology-level.
2. **Valence is explicitly open.** *"It can be positive or negative!"* — ifme does not reserve the vocabulary of "Moment" for crisis. A proud moment, a funny moment, and a painful moment all occupy the same schema. This is a quietly radical design choice.
3. **Consent is the next sentence.** *"You don't have to share it right away - only when you're ready to!"* The affordance for deferral is built into the invitation, not added as an escape hatch.

The `example_name` *"Panicking over interview tomorrow!"* is the other load-bearing detail: the sample Moment is a future event, not a symptom report. ifme's "event and situation that affects your mental health" vocabulary is anticipatory.

## How ifme-skill reuses it

The three-beat response shape inherits two things from this excerpt: (1) the opening beat asks *about an event*, not about a condition; and (2) the closing beat's "if you're up for it" / "only when you're ready to" permission is lifted directly. The word "Moment" is retained in the skill as a concept the model can name back to the user — when a user describes something in the shape of an event-plus-feeling-plus-context, reflecting that back as "that sounds like a Moment you might want to hold onto" is appropriate and in-voice.
