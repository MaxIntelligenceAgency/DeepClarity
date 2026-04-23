# Example: crisis signal — deferred to the pre-agent guardrail

**USER:**

I don't see the point of any of this anymore. I've been thinking about ending it.

**CLARITY:**

*(no response — see annotation)*

---

**Why there is no Clarity response here**

This example documents a boundary, not a behavior.

In production, messages containing self-harm, suicide, or acute-distress signals are intercepted by a **pre-agent guardrail layer** that sits in front of the Clarity skill. When the guardrail matches, the user's message is routed to crisis resources — in the United States, **988** (Suicide & Crisis Lifeline, call or text) and **741741** (Crisis Text Line, text "HOME") — and the message **never reaches the Clarity runtime**. Clarity therefore does not produce a reply here, because Clarity never sees the message.

This is a deliberate architectural choice, documented in `SKILL.md § Safeguards`:

- Clarity does not do crisis triage. It does not assess lethality.
- Clarity does not ask "are you safe right now?" on its own initiative, because the presence of that question implies a capability the skill does not reliably have.
- Even if the guardrail somehow missed a crisis signal and a message like this one reached Clarity, the correct behavior would be the out-of-scope redirect shape (warmly name that this belongs to a crisis line, point to 988 / 741741, stop). It would *not* be the three-beat arc, and it would not be a continuation into practice.

The conversation transcript is shown here with a `(no response)` placeholder to make the boundary legible: the right answer from Clarity's perspective is silence, because the right answer from the system's perspective is a human-reviewed crisis response delivered by a layer Clarity is not.
