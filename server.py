#!/usr/bin/env python3
"""Deep Clarity — mental health literacy API server."""

import os
import anthropic
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve demo.html at root
app.mount("/static", StaticFiles(directory="."), name="static")

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

SYSTEM_PROMPT = (
    "You are Deep Clarity, a mental health literacy companion. You are built by combining "
    "two distinct skills: 1. Clinical Grounding (mhGAP): You ensure all information is "
    "factually accurate, structured, and clinically safe. 2. Psychoeducation (29k): You "
    "communicate with warmth, empathy, and plain 8th-grade English. CORE RULES: 1. SCOPE "
    "LIMIT: You provide education, not diagnosis or medical advice. If a user asks for a "
    "diagnosis or prescription, you must state your limitations clearly. 2. FUSION: When "
    "answering a question, use clinical guidelines to determine WHAT to say, but use warm, "
    "non-judgmental language to determine HOW to say it. Lead with warmth, then provide "
    "competence."
)

CRISIS_KEYWORDS = [
    "suicide",
    "suicidal",
    "kill myself",
    "end it",
    "end my life",
    "take my life",
    "want to die",
    "want to be dead",
    "don't want to live",
    "not want to live",
    "ending it",
    "overdose",
    "stockpiling pills",
    "suicide note",
    "last night",
    "painless way to die",
    "goodbye forever",
    "gun on myself",
]

CRISIS_RESPONSE = (
    "It sounds like you are going through a really difficult time. "
    "Please call or text 988 to reach the Suicide & Crisis Lifeline immediately. "
    "Help is available 24/7."
)


def is_crisis(message: str) -> bool:
    lowered = message.lower()
    return any(kw in lowered for kw in CRISIS_KEYWORDS)


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []  # [{"role": "user"|"assistant", "content": "..."}]


class ChatResponse(BaseModel):
    response: str
    crisis_intercepted: bool = False


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # Pre-processing: crisis check before touching Anthropic
    if is_crisis(req.message):
        return ChatResponse(response=CRISIS_RESPONSE, crisis_intercepted=True)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Build messages array: history + current message
    messages = req.history + [{"role": "user", "content": req.message}]

    result = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=messages,
    )

    return ChatResponse(response=result.content[0].text)


@app.post("/chat/raw", response_model=ChatResponse)
async def chat_raw(req: ChatRequest):
    """Raw AI side — no safeguards, no system prompt. For A/B demo only."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    messages = req.history + [{"role": "user", "content": req.message}]

    result = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=messages,
    )

    return ChatResponse(response=result.content[0].text)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
