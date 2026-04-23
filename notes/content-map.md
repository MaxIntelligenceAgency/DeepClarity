# 29k-source/content/ — Content Map

Source: `29k-source/content/` (CC-BY-SA-4.0, © 29k foundation).

## 1. Directory tree (one level deep, file counts)

```
content/
├── .eslintrc.js, .gitignore, *.ts, package.json, tsconfig*.json, yarn.lock, LICENSE
├── buildContent.ts, exportToCsv.ts, importFromCsv.ts, fixContentIds.ts  (build/IO scripts)
└── src/
    ├── categories/   4 files   (top-level taxonomy nodes)
    ├── collections/  22 files  (curated bundles of exercises)
    ├── email/        3 files   (footer, header, userReport — named, not UUID)
    ├── exercises/    82 files  (the core content unit)
    ├── featured/     1 file    (content.json — hand-curated home feed)
    ├── tags/         7 files   (cross-cutting labels)
    ├── ui/           97 files  (app string resources, namespaced by screen/component)
    └── utils/        2 files   (utils.ts + utils.spec.ts — TS, not content)
```

Total content JSON: ~116 per-item files (exercises + collections + categories + tags) + 97 UI resource files + 3 email + 1 featured = **~217 JSON files**.

## 2. File formats

Only two extensions: `.json` and `.ts`.

- `.ts` is limited to `utils/` and the top-level build scripts.
- `.json` is everything else. Every content JSON follows the same **locale-keyed envelope**: a single object whose top-level keys are BCP-47 locale codes, each mapping to that locale's payload.

## 3. Languages (i18n)

Locale keys observed at the top level of every content file:

```
en, pt-PT, sv, ja, da, cs, nl, es, pt-BR
```

That's English, Portuguese (Portugal & Brazil), Swedish, Japanese, Danish, Czech, Dutch, Spanish. **`en` is the canonical/most-complete locale** — other locales frequently have only `{id, tags, liveDuration, ...}` stubs with no translated prose, or `{}` entirely. Example (`exercises/023ad824-…json`):

- `en` → full payload (17 keys incl. slides, name, description, card, coCreators)
- `pt-BR` → full payload (17 keys)
- `pt-PT, sv, ja` → partial (no `name`/`description`, but has structural fields)
- `da, cs, nl` → stub (`tags`, `liveDuration`, `id` only)
- `es` → `{id}` only

**Implication for this project**: per the CLAUDE.md English-only constraint, read from the `en` key on every file. Skip locales where `en` is missing (rare).

## 4. Content taxonomy

The content graph has four node types, linked by UUID references:

**Categories** (4) — top-level themes, each pointing at lists of exercises + collections:
- Deal with stress
- Work on your relationships
- Understand yourself
- Find meaning

**Tags** (7) — cross-cutting skill/quality labels:
- Acceptance, Gratitude, Perspective-taking, Resilience, Purpose, Mindfulness, Self-compassion

**Collections** (22) — curated, named bundles of exercises with their own card art, co-creators, and outbound link (e.g. "Move forward to nature"). Tagged.

**Exercises** (82) — the atomic unit. Each exercise has:
- `name`, `description`, `card` (image/lottie metadata), `coCreators`
- `theme` (color/asset styling — sometimes a hex string, sometimes a nested dict)
- `tags` (UUID refs into `tags/`)
- `live: bool`, `async: bool`, `liveDuration`, `asyncDuration` — most (81/82) support async (solo) mode, 57/82 support live (hosted group) mode
- `slides[]` — the ordered playbook; 5 slide types observed:
  - `instruction` (169) — heading + text + image, reader-paced
  - `host`       (134) — host-facing notes / script (live mode only)
  - `sharing`    (116) — prompts for group sharing
  - `content`    (82)  — narrated lottie + audio + subtitles (the "body" of the exercise)
  - `reflection` (72)  — post-exercise reflection prompts
- `introPortal`, `outroPortal` — framing media for entering/leaving the session

So the shape is: **category → (collections, exercises) → slides(typed) + tags**.

**Email** (3, named files) and **UI** (97, named `Namespace.Name.json`) are app-chrome strings, not therapeutic content — important for the app but mostly out of scope for skill distillation beyond tone/voice sampling.

**Featured** (1) is hand-curated homepage content referenced by UUIDs into the above.

## 5. Three sample items (first 30 lines each)

### Sample A — Exercise: `exercises/023ad824-8009-4667-b148-13d0e966ffd2.json` ("Mind Jar")

```json
{
  "en": {
    "liveDuration": 0,
    "slides": [
      {
        "type": "instruction",
        "content": {
          "heading": "Welcome",
          "text": "This session works on exploring how to cultivate greater attention, awareness, mindfulness and heedfulness.\n\nFind a comfortable position and begin the exercise when you are ready.",
          "image": {
            "source": "https://res.cloudinary.com/cupcake-29k/image/upload/q_auto,t_global/v1731441064/SEE/SEELearning_CompassionTree_Green_2024_hiqhwi.png"
          }
        }
      },
      {
        "type": "content",
        "hostNotes": [],
        "content": {
          "lottie": {
            "subtitles": "https://res.cloudinary.com/cupcake-29k/raw/upload/q_auto,t_global/v1715752248/SEE/SRT/Awareness/Mind_Jar_1_kqgt7u.srt",
            "audio": "https://res.cloudinary.com/cupcake-29k/video/upload/v1715195090/SEE/Audio/Awareness/Mind_Jar_kpthpe.mp3",
            "source": "https://res.cloudinary.com/cupcake-29k/raw/upload/v1715663489/SEE/Lottie/Awareness/Awareness4_xwwr2o.json"
          },
          "text": ""
        }
      },
      {
        "type": "instruction",
        "content": {
          "heading": "Reflection",
```

### Sample B — Category: `categories/07c58365-832b-4b3f-b926-c09682632441.json` ("Deal with stress")

```json
{
  "en": {
    "id": "07c58365-832b-4b3f-b926-c09682632441",
    "name": "Deal with stress",
    "exercises": [
      "961656ea-021c-4faa-ae03-46d6ace4be4b",
      "f4f8a536-5683-40a3-a139-5e3031687cec",
      "3188a5ed-a1d6-451c-ae2a-f44f4df37495",
      "2d096e25-3f0b-48da-8557-3db607b98ef8",
      "c7911238-ca9f-4499-9cae-63dfcd0c79c5",
      "94575e97-fe03-4bfd-94a6-50aaf721d47e",
      "b18c1cff-bb43-44b1-81a1-2877cc018ab4",
      "1e96f73b-8193-4aa6-a52c-31355eac3c08",
      "b7f8731c-64d7-4c0f-9bc8-a3e50ec2eaf7",
      "095f9642-73b6-4c9a-ae9a-ea7dea7363f5",
      "c5b1197a-4eec-4699-9dad-0e3d6323967b",
      "12f448d2-39bc-4232-b8cf-b6cb570c7e00",
      "33a188a2-6871-47d6-a754-f5c246bd6b9a"
    ],
    "collections": [
      "af1c4ac9-1bae-4cb1-8c98-e1f98a8aea66",
      "8cb72f0d-3aad-4fe6-bf08-560b108bb439",
      "716c2b31-612c-40c4-8e85-90f0a2af380e",
      "1d35e981-4b8e-47f0-887a-0c90d21fb991"
    ],
    "published": true,
    "lottie": {
      "source": "https://res.cloudinary.com/cupcake-29k/raw/upload/v1702302654/Lottie/deal_with_stress_kodv1x.json"
    }
  },
```

### Sample C — Collection: `collections/0eda04e3-4b45-44d6-b779-7b40f43f966c.json` ("Move forward to nature")

```json
{
  "en": {
    "hidden": false,
    "name": "Move forward to nature",
    "published": true,
    "sortOrder": 20,
    "card": {
      "image": {
        "source": "https://res.cloudinary.com/cupcake-29k/image/upload/t_card_image/v1702310278/Images/forward_to_nature_wbpa1o.png"
      }
    },
    "coCreators": [
      {
        "image": "https://res.cloudinary.com/cupcake-29k/image/upload/t_cocreator_image/v1697717486/Images/Houdini_co-creator_v2bbwc.png",
        "name": "Houdini, initiator",
        "url": "https://houdinisportswear.com/"
      }
    ],
    "tags": [
      "cfc00217-f65b-4a4d-8b82-8ccc8f852dd6",
      "9c2c08a9-7dc6-4058-bc78-016d0eb00614"
    ],
    "link": "https://aware.29k.org/forward-to-nature",
    "id": "0eda04e3-4b45-44d6-b779-7b40f43f966c",
    "exercises": [
      "1a53e633-6916-4fea-a072-977c4b215288",
      "0bcb6eb0-fdfe-466d-8603-ae6de15fcbc5",
      "095f9642-73b6-4c9a-ae9a-ea7dea7363f5",
      "ea0b48c1-745e-418d-93e7-2d8a6cd72898",
      "b7f8731c-64d7-4c0f-9bc8-a3e50ec2eaf7",
```

## Quick takeaways for distillation

- The **distillable structural DNA** lives in exercise `slides[]`: the five-step arc `instruction → content → instruction → sharing/reflection → instruction` and variations of it.
- The **taxonomy** (4 categories × 7 tags × 22 collections) is small enough to represent whole in the skill.
- **Attribution** is straightforward: every item has a UUID filename, so citations can be `29k-source/content/<type>/<uuid>.json` + `coCreators[]` from the item itself.
- **English-only** filter is easy: read `d["en"]`; drop files where `en.name` is missing.
