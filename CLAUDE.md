# Clarity — Skill Distillation Project

## Goal
Extract structural DNA from 29k-source/content/ (the CC-BY-SA-4.0 content of the 29k Aware mental health app) and produce a reusable Claude Skill at clarity-skill/ that encodes 29k's patterns for use in a mental health literacy agent.

## Hard constraints
- Content is CC-BY-SA-4.0. Every extracted excerpt must carry attribution (29k foundation, source file path, license).
- Derivative skill must be published under CC-BY-SA-4.0.
- English-language content only. Skip Swedish/Portuguese unless nothing else exists.
- Safeguards are non-negotiable: the distilled skill must include crisis routing (988) and an explicit "I am not a therapist" scope disclaimer.

## Non-goals
- Do not copy 29k content verbatim into the skill. Extract patterns; reference a handful of excerpts.
- Do not train, fine-tune, or modify any model. This is a skills-only pipeline.

## Working directories
- 29k-source/content/ — read-only source material
- clarity-skill/ — the distilled output skill (SKILL.md + references/ + examples/)
- distillation-engine/ — the reusable meta-skill that automates this process for other repos
- notes/ — scratch (content-map.md, patterns.md)
