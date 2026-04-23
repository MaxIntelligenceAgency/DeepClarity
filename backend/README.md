# Clarity backend (Node + Express + SSE)

Three-stage pipeline in front of a multi-skill responder:

```
POST /chat           → safeguard (Haiku, zod) ∥ router (Haiku, zod) → [crisis_fallback]
                                                                    ↘ loadSkills + streamSpecialist (Opus, 16ms token batching)
POST /chat-baseline  → direct Opus with "You are a helpful AI assistant." (no safeguard, no router, no skills)
GET  /skills         → frontmatter index of ../skills/*/SKILL.md
GET  /health         → { ok: true }
```

Runs on `PORT=3001` by default. Responds to `/chat` and `/chat-baseline` as `text/event-stream`.

## Run

```sh
npm install
cp .env.example .env     # add ANTHROPIC_API_KEY
npm run dev              # tsx watch src/server.ts
```

Verify with curl:

```sh
curl -N -X POST http://127.0.0.1:3001/chat \
  -H 'content-type: application/json' \
  -d '{"message":"I feel stuck"}'
```

Run the five-prompt A/B harness:

```sh
npm run test             # tsx src/test.ts
```

## Events emitted by `/chat`

| event | data shape | when |
|-------|-----------|------|
| `meta` | `{request_id, timestamp, endpoint}` | immediately |
| `safeguard_result` | `{crisis, crisis_for, severity, latency_ms}` | after safeguard resolves; `latency_ms` is the real per-call time |
| `crisis_fallback` | `{text}` | if `crisis && crisis_for==="self" && severity==="high"` — short-circuits, no Opus call |
| `router_decision` | `{selected_skills, reasoning, user_role, latency_ms}` | after router resolves, when not short-circuiting |
| `first_token` | `{latency_ms}` | on first Opus content delta |
| `content` | `{delta}` | per 16ms batch of Opus tokens |
| `specialist_done` | `{stopReason}` | after Opus stream ends |
| `error` | `{message, recoverable}` | on any error |
| `done` | `{}` | terminator |

**`/chat-baseline` emits the same events** except no `safeguard_result` / `router_decision` (the baseline skips both stages by design — it is the A/B control showing what a generic Opus reply looks like).

## Layout

```
src/
├── server.ts                  # Express, CORS (localhost only), dotenv, mounts routes
├── routes/
│   ├── health.ts              # GET /health
│   ├── skills.ts              # GET /skills — [{name, description, license}]
│   ├── chat.ts                # POST /chat — the pipeline
│   └── baseline.ts            # POST /chat-baseline — A/B control
├── pipeline/
│   ├── safeguard.ts           # Haiku + zod, safe default on any failure
│   ├── router.ts              # Haiku + zod, safe default ["mhgap","29k","ifme"]
│   ├── specialist.ts          # Opus streaming with AbortController + 16ms token batching
│   └── fallback.ts            # FALLBACK_RESPONSE constant (988 / 741741)
├── skills/
│   └── loader.ts              # reads ../skills/<id>/SKILL.md body + references/*
├── prompts/
│   ├── template.ts            # fillTemplate({{placeholder}}) helper
│   ├── safeguard.ts           # SAFEGUARD_PROMPT — passed as `system`
│   ├── router.ts              # ROUTER_PROMPT   — passed as `system`
│   └── clarity.ts             # CLARITY_SYSTEM_TEMPLATE (takes {{skill_contents}})
├── utils/
│   ├── sse.ts                 # openSSE(res) → {send, close, closed}
│   ├── token_batcher.ts       # createTokenBatcher(ms, onFlush) — 16ms coalescing
│   └── logger.ts              # appendRequestLog to logs/requests.jsonl
└── test.ts                    # 5-prompt A/B harness (/chat vs /chat-baseline) + p50 TTFT
../skills/                     # sibling dir (production = git submodule)
├── 29k  → ../clarity-skill   # symlinked for the hackathon (display name: "clarity")
├── ifme → ../ifme-skill      # symlinked for the hackathon
└── mhgap/                     # WHO mhGAP Intervention Guide distillation (stub for now)
./logs/requests.jsonl          # append-only per-request log
```

### Skill identity

`GET /skills` returns both `id` (stable directory name — `"29k"`, `"ifme"`, `"mhgap"`) and `name` (human-readable display string from the SKILL.md frontmatter; may differ — e.g. the `"29k"` skill's display name is `"clarity"`). The router always uses `id`.
