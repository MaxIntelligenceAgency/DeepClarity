---
source_file: ifme-source/db/seeds.rb
license: AGPL-3.0-or-later
attribution: © ifme community — https://github.com/ifmeorg/ifme
notes: Short quotation. This seed file is the only place in the entire codebase where a sample Moment + ally comment is written in the peer-to-peer register the app is designed to elicit.
---

## Verbatim excerpt

From `db/seeds.rb`:

```ruby
# User 1
user1_category1 = Category.create(
  user_id: user1.id,
  name: 'Public Speaking',
  description: 'Speaking in front of an audience at school'
)
user1_mood1 = Mood.create(
  user_id: user1.id,
  name: 'Anxious',
  description: 'Sweaty palms, increased heart rate'
)
user1_mood2 = Mood.create(
  user_id: user1.id,
  name: 'Shy',
  description: 'I swallow my words and start speaking fast'
)
user1_moment1 = Moment.create(
  user_id: user1.id,
  category: [user1_category1.id],
  mood: [user1_mood1.id, user1_mood2.id],
  name: 'Presentation for ENGL 101',
  why: 'I am presenting in front of my classmates and I am worried I will make a fool out of myself',
  viewers: [user2.id, user3.id],
  comment: true,
  resource_recommendations: true
)
user1_moment1_comment = Comment.create(
  commentable_type: 'Moment',
  commentable_id: user1_moment1.id,
  comment_by: user2.id,
  comment: "Good luck on the presentation! Just pretend everyone is in underpants :)",
  visibility: 'private'
)
```

## Pattern exemplified

This seed script is where ifme's **peer voice** is most concretely visible. Four patterns to notice:

1. **Moods are written in first-person body language.** *"Sweaty palms, increased heart rate"*, *"I swallow my words and start speaking fast"*. Not "manifestations of anxiety disorder" — sentences a user would actually say about themselves.
2. **The "why" field is scrappy and plainspoken.** *"I am presenting in front of my classmates and I am worried I will make a fool out of myself"* is embarrassed, honest, specific. No effort is made to reach for clinical vocabulary.
3. **Viewers are two named people, not "my circle".** The data model forces specificity — sharing means choosing `user2` and `user3`, not broadcasting.
4. **The ally's reply is the decisive choice.** *"Good luck on the presentation! Just pretend everyone is in underpants :)"* is a joke. A real friend-to-friend joke. No "I hear you"; no "that sounds really hard"; no therapy-lite mirroring. The app's seed data is endorsing — through example — a register in which an ally can still be a *friend*, not a stand-in for a clinician.

## How ifme-skill reuses it

Two translations into the skill:

- The three-beat response's **first beat** (Name the Moment) draws vocabulary from the seed Mood/why fields: concrete, first-person, body-level, no clinical reach. When a user says *"I'm just so exhausted"*, the skill reflects that back in the same register — *"that kind of flat tired where even small things feel like they take more than they should"* — not *"you're describing anhedonia"*.
- The permission to be light is the single most distinguishing tonal choice vs the other skills. Clarity (29k-derived) is gentler-than-therapist; mhgap is clinical-literate; ifme is **a friend who isn't trying to fix you**. A well-timed lighter line is in range. An underpants joke is in range. The register `SKILL.md` protects is the one this seed file models.
