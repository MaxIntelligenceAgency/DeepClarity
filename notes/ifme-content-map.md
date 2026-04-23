# ifme-source/ — Content Map

Source: [ifmeorg/ifme](https://github.com/ifmeorg/ifme) (AGPL-3.0, © ifme community).
Mirrored locally at `ifme-source/` via shallow clone.

## 1. What ifme is

[if-me.org](https://www.if-me.org/) is a Rails 7 web application for peer mental-health support. From the in-app About page: *"a community for mental health experiences that encourages people to share their personal stories with trusted allies. Trusted allies are the people we interact with on a daily basis, including friends, family members, co-workers, teachers, and mental health workers."*

Unlike 29k (pre-authored exercise library) or the WHO mhGAP guide (clinical decision support), **ifme is a software platform whose "content" lives in i18n locale files, seed data, and community docs**. Patterns are distilled from how the app frames its core actions — Moments, Strategies, Categories, Moods, Allies — rather than from prose curricula.

## 2. Directory tree (top-level)

```
ifme-source/
├── app/                 (Rails app: controllers, models, views, services)
├── bin/                 (boot scripts)
├── client/              (JS/React client)
├── config/
│   ├── locales/         ← 43 YAML files: en.yml + 42 translations + devise/devise_invitable variants
│   └── ...
├── db/
│   ├── seeds.rb         ← 46 lines of seed data — users, Allyships, Moments, Strategies, Moods
│   ├── schema.rb
│   └── migrate/         (90+ migrations — useful for data-model archaeology)
├── doc/
├── spec/                (RSpec tests — not relevant here)
├── code_of_conduct.md   ← Contributor Covenant v2.1
├── CONTRIBUTING.md
├── README.md + README-<locale>.md × 14 (language-specific READMEs)
├── LICENSE.txt          ← GNU AGPL-3.0
└── Gemfile, package.json, Dockerfile, Procfile…
```

Total local size: ~26MB (shallow clone). The distillable surface is a small fraction of that.

## 3. File formats

- `.yml` — Rails i18n locales. This is the primary content surface.
- `.md` — community docs (README, CoC, CONTRIBUTING, translated READMEs).
- `.rb` — seeds, models, migrations. Seeds are the only runtime-content source.
- Everything else (controllers, views, specs, JS client) is application code, not distillable content.

## 4. Languages

43 locale YAMLs under `config/locales/`. Observed locales in the filenames: `en`, `es`, `pt-BR`, `it`, `ca`, `de`, `id`, `ko`, `nb` (Norwegian Bokmål). For each locale ifme typically ships three files: `<locale>.yml`, `devise.<locale>.yml`, `devise_invitable.<locale>.yml`. 15 translated READMEs (AR, BN, CA, CN, ES, FA, FR, HI, ID, IT, KO, LK, PT, TR, VI) indicate a genuinely multilingual community.

**English is canonical.** `config/locales/en.yml` is 1,081 lines and defines the full key namespace; other locales are subsets that translate those keys. Per project conventions (CLAUDE.md English-only constraint), we read only `en.yml`.

## 5. Content taxonomy

The conceptual model surfaces clearly from `db/seeds.rb` and `en.yml`'s FAQ:

- **Moment** — "an event and situation that affects your mental health. It can be positive or negative. Think of it as a journal entry or a status update." Fields: name, `why` (free text), category tags, mood tags, viewers (allies), comment permission, resource-recommendation toggle.
- **Strategy** — "an activity, train of thought, or form of self-care that helps you cope or focus on recovery." Tagged with categories; optionally shared with allies; optional daily email reminder.
- **Category** — "a tag that can represent the people, places, and things that are important to you." Premade seed categories: Family, Friends, Work, Meditation.
- **Mood** — "a tag describing your state of mind, feelings, and emotions." Seed examples: *Anxious* ("Sweaty palms, increased heart rate"), *Shy* ("I swallow my words and start speaking fast").
- **Ally** — a specific person (another user) you've added and who accepted. Moments and Strategies can be shared with individual allies or kept private. Allies can **comment** on a Moment.
- **Group / Meeting** — larger-than-dyad support circles led by an ally, with structured Meetings (location/time/agenda).
- **Care Plan** — a user's aggregated bookmarked Moments + Strategies.
- **Moment Template** — reusable writing prompt scaffolds (added 2021).
- **Secret Share** — a time-bounded expiring private link to a Moment.

The top-level `en.yml` sections (47 in total) reflect the same model: `allies`, `moments`, `strategies`, `categories`, `moods`, `groups`, `meetings`, `care_plan`, `moment_templates`, `medications`, `notifications`, `pages` (about/tour/faq/blog/contribute), `mailers`, `devise`, etc.

## 6. Three sample items

### Sample A — About page copy (the mission statement)

`config/locales/en.yml` lines 458–476 (section `pages.about`):

```yaml
pages:
  about:
    main_message_one: >-
      %{app_name} is a community for mental health experiences that encourages
      people to share their personal stories with trusted allies.
    message_text_one: >-
      Trusted allies are the people we interact with on a daily basis,
      including friends, family members, co-workers, teachers, and mental
      health workers.
    main_message_two: >-
      Dealing with mental health is what makes us human. But for a lot of us,
      it's a struggle to be open about it.
    message_text_two: >-
      Not everyone is a counsellor or therapist. The people who we interact
      with everyday shape our emotions and behaviour. Getting them involved in
      mental health treatment is the key to recovery.
```

### Sample B — Moment creation empty-state

`config/locales/en.yml` `moments.index.instructions`:

> You haven't written about any moments yet. Don't know where to start? What's something that happened today that you would like to share and discuss with a loved one? It can be positive or negative! You don't have to share it right away - only when you're ready to! Here's an example of a Moment.

The accompanying `example_name: "Panicking over interview tomorrow!"` — a positive of a Moment is anxiety about a future event, not a symptom report.

### Sample C — Seed data: a Moment and an ally's reply

`db/seeds.rb`:

```ruby
user1_moment1 = Moment.create(
  user_id: user1.id,
  category: [user1_category1.id],        # "Public Speaking"
  mood: [user1_mood1.id, user1_mood2.id],  # Anxious, Shy
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

The seed moment is a school presentation. The ally's reply is casual, warm, low-clinical — a joke. **That voice is not accidental.** It's the register ifme is designed to invite: allies aren't therapists, they're friends.

## 7. Quick takeaways for distillation

- The **distillable DNA** is ifme's *relational model*: Moments are shareable; sharing has controls; allies are named, accepted, and can comment; strategies are self-care activities that can also be shared and reused.
- The **voice** is warmer and more casual than 29k's (29k reads like a facilitator; ifme reads like a supportive peer). The underpants joke in the seed data is load-bearing.
- The **scope** is explicitly *not* clinical ("Not everyone is a counsellor or therapist"). That matches the constraints in our existing clarity CLAUDE.md.
- **Attribution** is to the *ifme community*; specific phrases have clear source paths. Licensing is AGPL-3.0 — the derivative skill will mirror that license.
