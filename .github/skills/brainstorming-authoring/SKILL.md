# Brainstorming — SKILL.md

> Stage B — open-ended creative ideation that turns a raw user idea into a rich exploration of what the product could be.

---

## When to Use

Invoke at **Stage B (Brainstorming)** by the **Writer** when a user has dropped a raw concept into `0-IDEA.md` and the project needs creative breadth before any use case is proposed.

The brainstorm establishes the imaginative envelope of the product — the look, feel, mood, screen flow, audience, possible features, and tonal directions — before downstream stages narrow scope. Use it when:

- A new project folder contains only `0-IDEA.md` (no `1-USE-CASES-PROPOSED.md` yet).
- An existing project's idea has materially changed and the team needs to re-explore.
- Stakeholders want a "what if" exploration before locking intent.

The Brainstorm output is an **inspirational, not prescriptive** document. It informs Stage 0 (User/BA) and Stage 1 (Product Owner) but does not constrain them. Downstream stages (2 onward) read `1-USE-CASES.md`, not this file.

Upstream input: `0-IDEA.md` (user-authored).
Output: `BRAINSTORM.md` (Writer-owned).

---

## Target Files

| Stage | File(s) |
|-------|---------|
| B | `BRAINSTORM.md` |

`0-IDEA.md` is user-authored input and is **not** owned by any pipeline agent. The Writer must not edit it.

---

## Web Research Encouraged

The Writer **should** use web search and research at this stage to ground creative exploration in real-world references:

- Comparable products, games, services, art directions
- Visual style references (films, illustrators, design movements, real-world objects)
- UX patterns from analogous domains
- Mood and audio references where relevant
- Cultural touchstones, mental models, and metaphors

Cite all references inline in the relevant section using a `> Sources:` block with URLs or named citations.

---

## Document Schema

`BRAINSTORM.md` is a freeform creative document — it does **not** use record schemas like `BS-001`. Instead, it must contain the following named sections in order. Each section uses H2 headings.

```markdown
# Brainstorm — <PRODUCT TITLE>

- **STATUS:** Not Started | In Progress | PASS | FAIL
- **STATUS UPDATED:** YYYY-MM-DD
- **AUTHOR:** Writer
- **SOURCE IDEA:** 0-IDEA.md (one-line summary of what the user asked for)

---

## ELEVATOR PITCH
One short paragraph (3–5 sentences) describing in vivid plain language what
the product could be at its most inspiring. Not a feature list — an evocation.

## AUDIENCE & EMOTIONAL GOALS
Who would use this and what feeling should they walk away with? Identify 2–4
candidate audience profiles. For each, name the dominant emotion the product
should evoke (delight, calm, curiosity, mastery, awe, nostalgia…).

## EXPERIENCE EXPLORATION
A wide brainstorm of how the experience could unfold. Use bullet lists or
short narrative scenes. Cover at least:
- The first 30 seconds (what the user sees, hears, does)
- The peak moment of joy or insight
- A surprising or memorable detail
- An optional ambient/idle behaviour

## SCREEN & FLOW IDEAS
Imagine 3–6 candidate screens or surfaces. For each, give:
- A name
- One sentence describing what it shows
- A key interaction it supports
- How it transitions to/from neighbouring screens

A simple ASCII flow diagram or numbered narrative is encouraged.

## VISUAL DIRECTION
Explore at least two distinct visual directions. For each:
- A short descriptor (e.g. "Soft watercolour aquarium", "Neon gridline future")
- Two or three concrete visual references (cite sources where possible)
- Mood adjectives
- Suggested colour palette (3–6 colours with hex codes when known)
- Typography sketch (e.g. "rounded humanist sans + monospace accents")

## MOOD & ATMOSPHERE
Music, soundscape, ambient motion, and sensory tone. Even if the product is
silent, describe the imagined mood as if scoring it.

## UI & INTERACTION PRINCIPLES
3–6 short principles that should guide downstream UI decisions, e.g.
"Direct manipulation always beats menus" or "No screen is a dead end". These
are aspirational — the Tech Lead may refine or override them later.

## METAPHORS & MENTAL MODELS
Name 2–4 metaphors the product could lean on (e.g. "a workshop", "a tide
pool", "a card on a table"). Briefly say what each implies for behaviour and
visual language.

## "WHAT IF" PROVOCATIONS
A list of 5–10 speculative ideas, including at least two intentionally
ambitious or impractical ones. Mark these clearly so downstream stages know
they are exploratory, not committed scope.

## OPEN QUESTIONS FOR PRODUCT OWNER
A short list of clarifying questions to feed into Stage 0 use case proposals.
These are explicit handoffs, not blockers.

## REFERENCES
Inline-cited references collected from this brainstorm, grouped by section.

---

## Exit Gate
- [ ] `0-IDEA.md` exists and was read in full.
- [ ] All required sections are present and non-empty.
- [ ] At least two distinct VISUAL DIRECTIONs are explored.
- [ ] At least one ambitious "What if" provocation is marked exploratory.
- [ ] At least three references with sources are cited.
- [ ] OPEN QUESTIONS FOR PRODUCT OWNER lists at least three concrete questions.
- [ ] STATUS and STATUS UPDATED fields are present.
- [ ] `PIPELINE-STATUS.md` is updated for Stage B with STATUS and STATUS UPDATED date.
- [ ] X-Journal START and COMPLETE entries are appended for Stage B.
- [ ] Gate result is explicitly stated as `GATE B: PASS` or `GATE B: FAIL`.
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Append a Stage B START entry to `X-Journal.md`.
3. Read `0-IDEA.md` in full.
4. Conduct lightweight web research to ground creative exploration. Take notes
   of references, sources, and quotations.
5. Write `BRAINSTORM.md` with all required sections in the order shown above.
6. Be generous with creativity. Cover both grounded and speculative ideas.
   Use the "What if" section to capture wild thinking that the Product Owner
   may later prune.
7. Add inline citations under each section that uses external references, and
   collect them in the final REFERENCES section.
8. Update `PIPELINE-STATUS.md` Stage B status.
9. Validate against the Exit Gate above.
10. **Stop. State `GATE B: PASS` or `GATE B: FAIL` before taking any further
    pipeline action.**
11. Append a Stage B COMPLETE entry to `X-Journal.md` recording the gate
    result.

---

## Anti-Patterns

- **Specifying requirements.** Brainstorming is exploratory — do not write
  shall-language statements or use the BR/UC schema.
- **Locking the visual direction.** Always explore at least two directions.
  Picking one is the Graphic Artist's job at later stages.
- **Editing `0-IDEA.md`.** It is the user's input and remains immutable.
- **Skipping web research.** A brainstorm without external grounding tends to
  be thin. At minimum, cite three references.
- **Treating the Brainstorm as a contract.** Downstream stages read
  `1-USE-CASES.md`. The Brainstorm informs but does not bind.

---

## Handoff to Stage 0

When `GATE B: PASS` is declared, the User/BA picks up `BRAINSTORM.md` as
inspirational reading material when authoring `1-USE-CASES-PROPOSED.md`.
The Product Owner may also reference it when approving Stage 1.
