# Narrative / Thematic Vision — MT2: Next-Generation Software Factory Pipeline

## OVERVIEW

MT2 is the second-generation evolution of the MYTEAM software factory pipeline. Where the first generation proved the concept of stage-gated, agent-driven software delivery, MT2 sharpens every edge: tighter governance, one agent per stage, optimised skills, and a pipeline that ships as a self-contained product usable for any future project without modification.

The output of MT2 is not software in the traditional sense — it is a **meta-product**: a complete, portable, opinionated pipeline framework composed of agent configuration files, skill definitions, governance instructions, and repository customisation files. When installed into any new project repository, the MT2 pipeline should run end-to-end with minimal human intervention beyond approval gates.

The vision is a pipeline that is:
- **Predictable** — same inputs produce the same quality of outputs, every time.
- **Traceable** — every artifact can be walked back to the use case that demanded it.
- **Recoverable** — any stage failure is diagnosed, routed, fixed, and re-verified without losing history.
- **Self-contained** — the pipeline is delivered entirely from `./build/` and requires no external scaffolding.

---

## COMPETITIVE & CREATIVE RESEARCH

### Existing Pipeline Frameworks

Several mature pipeline frameworks inform the MT2 design:

**GitHub Actions / GitLab CI** — Industry-standard CI/CD automation. Strong at sequential job ordering and artifact passing, but focused on code execution rather than knowledge-work stages (requirements, architecture, design). MT2 fills this gap by governing the pre-code stages as first-class citizens.

**The C4 Model (Simon Brown)** — Hierarchical architecture documentation with strict level definitions. MT2 borrows the principle of explicit, non-overlapping ownership layers: each stage is its own "level" with its own concerns and outputs.

**SAFe / Scaled Agile** — Large-scale agile framework with defined roles and ceremonies. MT2 simplifies this: no ceremonies, no sprint overhead — just stage gates, artifacts, and agents.

**LLM Agent Frameworks (LangGraph, AutoGen, CrewAI)** — Multi-agent orchestration systems. These demonstrate the value of role specialisation and handoff protocols. MT2 applies these principles within the VS Code Copilot agent model, where each agent is a `.agent.md` file with a defined role, toolset, and skill.

### Key Insight from Research

The most common failure mode in pipeline systems is **ambiguous ownership** — two roles believe they own the same artifact, or no role owns it at all. MT2 resolves this by making ownership a first-class constraint: every artifact is owned by exactly one stage, and no stage may edit another's artifact. This single rule eliminates the majority of pipeline drift.

---

## THEMES AND TONE

### Theme 1: Clarity Over Cleverness

Every agent, skill, and instruction in MT2 is written to be understood on first read. No implicit conventions. No undocumented shortcuts. If a rule exists, it is written down. If a step must happen, it is listed explicitly. The pipeline does not reward intuition — it rewards reading.

### Theme 2: One Thing, Done Completely

Each stage does one job and does it completely before handing off. The pipeline does not move forward until an exit gate passes. This is not bureaucracy — it is the guarantee that downstream agents inherit correct inputs.

### Theme 3: History Is Sacred

Verification evidence, bug reports, and release notes are append-only. The pipeline accumulates a permanent record of every decision, failure, and resolution. This record is the audit trail that makes the pipeline trustworthy across projects and over time.

### Theme 4: The Pipeline Is the Product

MT2's output lives in `./build/`. It is a deployable artifact, not a document. Every file in `./build/.github/` must be installable into a new project and functional immediately. The pipeline ships itself.

### Tone

- **Authoritative but not bureaucratic.** Instructions state what must happen, not why it might happen.
- **Precise.** Every rule uses shall/must language where compliance is required.
- **Concise.** Skill files are reference material — no prose padding.
- **Consistent.** Same vocabulary, same schema patterns, same exit-gate structure across all stages.

---

## WORLD-BUILDING / CONCEPTS

### The Pipeline as a Factory Floor

Visualise MT2 as a production line. Each station (stage) has one trained operator (agent) and one output (artifact). Raw material enters at Stage 0 (a user's idea) and exits at Stage 10 (verified, released software). No station skips ahead. No operator leaves their station to fix the previous one's work — they raise a flag and the Manager routes it back.

### The Agent as a Specialist

Every agent in MT2 is a deep specialist, not a generalist. The Writer does not write requirements. The Business Analyst does not write code. The Developer does not run tests. Each agent's `.agent.md` file is a contract: this is what I do, this is what I produce, this is what I will not touch.

### The Skill as an Executable Checklist

A skill is the difference between an agent that knows its role and an agent that executes it correctly. Skills encode the domain knowledge of each stage as a numbered procedure with a verifiable exit gate. The exit gate is the quality contract between stages. A stage that cannot pass its exit gate does not promote its output.

### The Manager as the Traffic Controller

The Manager holds no artifacts and writes no code. The Manager's only job is to keep the pipeline moving: detect failures, route work to the right stage, confirm recovery, and maintain the record. A Manager that starts editing artifacts has failed its role.

### The Auditor as the Conscience

The Auditor observes each stage, checks for rule violations, and writes them into `X-AUDIT-REPORT.md`. The Auditor does not fix violations — it flags them. The Manager acts on Auditor flags. This separation ensures violations are never silently absorbed.

### Traceability as the Thread

Every artifact in MT2 is connected by IDs. A use case (UC) becomes a requirement (BR). A requirement becomes an architecture recommendation (AR) and a part (PT). A part becomes a design instruction (DI). A design instruction becomes code and a text content record (TC). A test case (T) maps back to a UC and a BR. The full thread from intent to evidence is unbroken.

---

## EXIT GATE — STAGE 2

- [x] OVERVIEW written and captures the product vision.
- [x] COMPETITIVE & CREATIVE RESEARCH section contains at least two relevant comparisons.
- [x] THEMES AND TONE section defines at least three themes and a voice description.
- [x] WORLD-BUILDING / CONCEPTS section establishes the conceptual language for the pipeline.
- [x] All sections derived from approved `1-USE-CASES.md` content.
