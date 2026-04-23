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
| `safeguard_result` | `{crisis, crisis_for, severity, latency_ms}` | after safeguard resolves |
| `crisis_fallback` | `{text}` | if `crisis && crisis_for==="self" && severity==="high"` — short-circuits, no Opus call |
| `router_decision` | `{selected_skills, reasoning, user_role, latency_ms}` | after router resolves, when not short-circuiting |
| `first_token` | `{latency_ms}` | on first Opus content delta |
| `content` | `{delta}` | per 16ms batch of Opus tokens |
| `specialist_done` | `{stopReason}` | after Opus stream ends |
| `error` | `{message, recoverable}` | on any error |
| `done` | `{}` | terminator |

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
│   ├── router.ts              # Haiku + zod, safe default ["mhgap","29k"]
│   ├── specialist.ts          # Opus streaming with AbortController + 16ms token batching
│   └── fallback.ts            # FALLBACK_RESPONSE constant (988 / 741741)
├── skills/
│   └── loader.ts              # reads ../skills/<name>/SKILL.md body + references/*
├── prompts/
│   ├── template.ts            # fillTemplate({{placeholder}}) helper
│   ├── safeguard.ts           # SAFEGUARD_PROMPT
│   ├── router.ts              # ROUTER_PROMPT
│   └── clarity.ts             # CLARITY_SYSTEM_TEMPLATE (takes {{skill_contents}} + {{message}})
├── utils/
│   ├── sse.ts                 # openSSE(res) → {send, close, closed}
│   └── logger.ts              # appendRequestLog to logs/requests.jsonl
└── test.ts                    # 5-prompt SSE test harness + p50 TTFT
../skills/                     # sibling dir (production = git submodule)
├── 29k → ../clarity-skill    # symlinked for the hackathon
└── mhgap/                     # WHO mhGAP Intervention Guide distillation (stub for now)
./logs/requests.jsonl          # append-only per-request log
```
