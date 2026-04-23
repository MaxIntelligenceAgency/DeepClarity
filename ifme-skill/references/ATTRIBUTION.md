# Attribution

This skill (`ifme-skill/`) is a derivative work of [ifmeorg/ifme](https://github.com/ifmeorg/ifme), a peer-support mental-health platform released under the **GNU Affero General Public License v3.0** (AGPL-3.0-or-later).

- **Source repository:** `ifme-source/` (shallow clone of github.com/ifmeorg/ifme at the time of distillation)
- **Source license:** [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html)
- **This derivative's license:** AGPL-3.0-or-later (see `../LICENSE`)
- **Copyright:** © the ifme community and contributors

## What was copied, and what wasn't

- **Not copied:** ifme's Rails codebase, JavaScript client, and database schema. None of the source code or seed scripts is reproduced in this skill.
- **Distilled, not copied:** the *relational model* ifme encodes (Moments, Strategies, Allies, Moods, Categories), the *voice register* of ifme's user-facing copy, and the *scope stance* ("Not everyone is a counsellor or therapist") that shapes how the app talks to its users. These are documented in `notes/ifme-patterns.md` and re-expressed in Clarity's own words in `../SKILL.md`.
- **Quoted verbatim under short-quotation/fair-use norms with attribution:** the five excerpts in this `references/` directory. Each cites its source file path (`config/locales/en.yml` line ranges, `db/seeds.rb` line ranges, `code_of_conduct.md`).

## Source files excerpted here

| Excerpt | Source file | What it is |
|---------|-------------|-----------|
| `excerpt-01-mission.md` | `ifme-source/config/locales/en.yml` (`pages.about`) | The app's own mission statement — "Not everyone is a counsellor or therapist" |
| `excerpt-02-moment-invitation.md` | `ifme-source/config/locales/en.yml` (`moments.index.instructions`) | Empty-state invitation to write a Moment, with the "only when you're ready to" consent frame |
| `excerpt-03-primitives.md` | `ifme-source/config/locales/en.yml` (`pages.faq.*_question/answer`) | ifme's own one-paragraph definitions of Moment, Strategy, Category, Mood, Group |
| `excerpt-04-ally-voice.md` | `ifme-source/db/seeds.rb` | Seed Moment + Allyship + ally's comment ("Just pretend everyone is in underpants :)") — the peer-voice register |
| `excerpt-05-code-of-conduct.md` | `ifme-source/code_of_conduct.md` (§ Our Standards) | Community-behavior norms from the Contributor Covenant v2.1 |

## AGPL & this derivative

AGPL-3.0's core condition is that **network-accessible derivatives must make their corresponding source available to users over the network**. The code that serves this skill (the TypeScript backend in `backend/`) is the AGPL-relevant "source" when the skill is deployed. In our hackathon context that source is published in this same repository, which satisfies the obligation by containment. Anyone redistributing or re-hosting this skill should:

1. Maintain this attribution file intact.
2. Publish the backend source alongside any live deployment.
3. Keep `LICENSE` (the full AGPL-3.0 text) at the skill root.

## Co-creator acknowledgement

ifme is maintained by a distributed community of designers, developers, testers, translators, and writers — most of whom are credited via the project's GitHub Contributors page and Open Collective backers/sponsors lists. This skill does not name individuals because the source code attribution pattern is per-commit, not per-feature. The Contributor Covenant Code of Conduct excerpted in `excerpt-05-code-of-conduct.md` is separately © the Contributor Covenant project (https://www.contributor-covenant.org/), licensed under CC BY 4.0.
