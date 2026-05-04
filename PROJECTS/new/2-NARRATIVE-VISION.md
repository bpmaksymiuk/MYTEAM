# Narrative Vision — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Writer
- **TRACEABILITY:** UC-001 through UC-011

---

## OVERVIEW

ViralReword is a precision rewriting tool for people who already have something worth saying and need the platform's algorithm to let them say it. The attention economy penalises honest, straightforward writing — not because the ideas are weak, but because the packaging does not match the psychological grammar that feeds are trained to surface. ViralReword closes that gap. A user pastes any text — an idea, a paragraph, a press release, a data point — and receives up to five versions of it, each tuned to a distinct engagement strategy: curiosity-first, data-led authority, narrative arc, clean minimalism, or calibrated controversy. Every version is measured against the original for semantic fidelity; the tool promises amplification, not distortion.

The product is for the people who refuse to write badly just to be heard: the independent analyst whose newsletter quality far exceeds their reach; the journalist who knows exactly what story they are breaking but cannot write a hook that leaves the timeline; the brand strategist who needs five A/B variants without five hours of copywriting. These are users who care about craft and about truth. The product must honour both: the intelligence of what they are trying to say, and the mechanical reality of how feeds work.

At its most considered, ViralReword is a tool that makes the attention economy slightly more honest — by helping good writing compete with sensational writing on its own structural terms, while enforcing a hard floor on meaning fidelity that sensational writing routinely ignores.

---

## COMPETITIVE & CREATIVE RESEARCH

**Copy.ai and Jasper (AI copywriting tools).** These tools generate marketing copy from scratch, optimised for conversion. They are helpful when the user has no content yet. ViralReword starts from the opposite premise: the user already has content and refuses to replace it. The lesson from Copy.ai and Jasper is that users habituate quickly to volume and calibrate trust based on how often the output is embarrassing. ViralReword must be embarrassment-proof by design — the fidelity score mechanism is the structural response to this risk.

**Hemingway App and ProWritingAid (writing analysis tools).** These tools diagnose clarity and readability. They are passive and editorial. ViralReword is active and strategic: it does not tell the user what is wrong; it shows them five ways to make it work. The lesson is that feedback-as-rewrite is more useful than feedback-as-diagnosis, especially for time-constrained professionals.

**Hootsuite and Buffer (social media scheduling platforms).** These tools manage when content is posted; they do not touch what is written. ViralReword's hashtag and timing recommendation features (UC-008) put it adjacent to this category as a content-intelligence layer, not a scheduling tool. The distinction matters for positioning: ViralReword is not a dashboard and should never feel like one.

**Refinery29's headline A/B testing model (editorial practice).** Large digital media organisations routinely A/B test headline variants at publication. ViralReword makes this practice available to individual creators. The lesson is that variant generation is not inherently manipulative — it is a professional editorial practice that has been inaccessible to solo operators. The product should communicate this framing without apology.

**X's own algorithmic curation (the native environment).** The feed is the adversarial context. ViralReword is not building for an abstract ideal of the internet — it is building for the specific, documented behavioural patterns of X's algorithm and audience: the first-line hook, the curiosity gap, the thread structure, the 280-character constraint. All design decisions should respect this context as a first-class reality. The lesson: the product only works if it stays close to the platform it is optimising for.

---

## THEMES AND TONE

### Theme 1: Signal Over Noise

The foundational metaphor. Every feature exists to help the user's signal reach the people it should reach, without distorting the signal. This theme licenses the precision, the fidelity score, the minimal UI, and the ethos. Language throughout the product should be spare and accurate — no corporate enthusiasm, no marketing superlatives. The product itself is the argument for clarity.

### Theme 2: Craft, Not Manipulation

ViralReword operates in a space that is easy to mistake for spin. The product's ethical position is clear and must be felt in every micro-copy moment: the tool amplifies what is already there; it does not invent claims or change implications. The guardrail is not a compliance feature bolted on — it is the expression of the product's core value. Tone throughout should be quietly confident, not defensive.

### Theme 3: Professional Parity

The variant-generation and A/B testing practices that large media organisations use as standard are inaccessible to solo creators. ViralReword corrects an imbalance. This theme licenses the product's ambition without requiring it to be loud about it. The tone is matter-of-fact: *of course* you should have this. It should have existed already.

### Theme 4: Respect for the Reader

Every optimisation choice must assume an intelligent reader on the other end of the post. The goal is not to trick people into engaging with content they would not otherwise care about — it is to package ideas so they can be judged fairly by the people they were written for. The UI language should always speak to the user as an intelligent professional, not as a marketer.

### Theme 5: Transparency as Strength

The Meaning Fidelity Score, the strategy labels, the "why this works" annotations, and the optional AI-disclosure marking are all expressions of the same principle: the user should always be able to see what the tool is doing and why. Opacity is a vulnerability. Every design decision that increases explainability also increases trust.

**Voice and register:** Direct, spare, and confident. Sentences that do not waste the reader's attention. No exclamation marks, no "game-changing", no "powerful features". The product speaks like a good editor — briefly, specifically, without performance. When the interface speaks, it says exactly what needs to be said and then stops. Error messages are honest and constructive; success states are quiet. The voice is the product's own claim that good writing is better than loud writing.

---

## WORLD-BUILDING / CONCEPTS

### The Rewrite Workspace

The central mental model is the workspace of a skilled editor at the moment of revision. There is a text in front of them, and their job is to find the version of it that travels furthest without losing what makes it worth reading. The five strategy tiles are not options in a menu — they are different editorial philosophies held in parallel, each saying *what if we tried it this way?* The user is always the final editor. The tool shows; the user decides.

### The Fidelity Contract

Every rewrite comes with a Meaning Fidelity Score. This is not a warning; it is a commitment. The product is promising the user that it understands the difference between their idea and the packaging of their idea, and that it is only touching the packaging. The fidelity score makes this promise visible and measurable. It is the product's proof of good faith, displayed quietly but always present.

### The Five Strategies as Registers

The five optimisation strategies — Hook-First, Controversy-Max, Authority, Story-Mode, Minimalist — are not just technical modes. They are tonal registers, each with a distinct personality and use case. Hook-First is the street performer; Controversy-Max is the debate club champion; Authority is the peer-reviewed paper abstract; Story-Mode is the opening paragraph of a longread; Minimalist is the person in the meeting who speaks once and ends the argument. Users should come to know these registers and choose between them with editorial judgement, not just tactical optimization.

### The Ethics Floor

The guardrail is not a regulatory feature — it is a structural value. Below a certain threshold of fidelity, the tool refuses. This is the ethics floor, and it is non-negotiable. The product communicates this not through lecture but through behaviour: the blocked tile, the explanation, the offer to try again. The floor is what makes every feature above it trustworthy.

---

## Exit Gate

- [x] `2-NARRATIVE-VISION.md` contains all four required sections (OVERVIEW, COMPETITIVE & CREATIVE RESEARCH, THEMES AND TONE, WORLD-BUILDING / CONCEPTS).
- [x] OVERVIEW explains what the product does in plain language (three paragraphs, grounded in UC-001–UC-011).
- [x] COMPETITIVE & CREATIVE RESEARCH cites specific references (Copy.ai, Jasper, Hemingway App, ProWritingAid, Hootsuite, Buffer, Refinery29, X algorithm).
- [x] THEMES AND TONE names at least three distinct themes (five named: Signal Over Noise, Craft Not Manipulation, Professional Parity, Respect for the Reader, Transparency as Strength).
- [x] WORLD-BUILDING / CONCEPTS identifies at least two key mental models (four identified: Rewrite Workspace, Fidelity Contract, Five Strategies as Registers, Ethics Floor).
- [x] `PIPELINE-STATUS.md` is updated for Stage 2 with STATUS and STATUS UPDATED date.
