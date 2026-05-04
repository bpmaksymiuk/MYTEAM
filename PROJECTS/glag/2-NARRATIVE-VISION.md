# Narrative Vision — Cyrillic to Glagolitic Converter

---

## OVERVIEW

The Cyrillic–Glagolitic Converter is a focused web utility that translates text in both directions between Ukrainian Cyrillic and Glagolitic script. Glagolitic is the oldest known Slavic alphabet, predating Cyrillic by several centuries. It was created in the ninth century by Saints Cyril and Methodius to render Old Church Slavonic — the very language from which Cyrillic later descended. The converter draws a direct line between these two scripts, making a historically dormant alphabet instantly accessible to anyone who can type in modern Ukrainian, and allowing anyone who encounters Glagolitic text to decode it back into Cyrillic.

The product is for students, linguists, historians, Slavic studies enthusiasts, typographers, and cultural heritage workers who want to explore, render, or communicate using Glagolitic script without specialist software or deep palaeographic knowledge. A single mode toggle switches between Cyrillic → Glagolitic and Glagolitic → Cyrillic, serving both those who want to write in the ancient script and those who want to read it. The tool removes the barrier of manual character lookup in either direction, letting the user focus on the text rather than the transliteration.

The problem it solves is both practical and intellectual: Glagolitic is largely inaccessible in everyday digital tools. Most text editors and transliteration aids do not support it. By providing a clean bidirectional mapping interface alongside a character reference table, the converter bridges the gap between the living Ukrainian language and its earliest written ancestor — turning a specialist research activity into a casual, explorable experience in both directions.

---

## COMPETITIVE & CREATIVE RESEARCH

**1. Unicode Character Converter tools (e.g. unicodeconverter.org, branah.com/unicode-converter)**
These tools convert between Unicode ranges or input methods, often targeting developers. Lesson: separating "input" from "output" cleanly as two distinct text areas is universally understood by users and reduces confusion. Clipboard copy is expected as a first-class affordance.

**2. Online transliteration services (e.g. translit.ru, lexilogos.com)**
Broad transliteration platforms covering many scripts. Lesson: a mapping reference table displayed alongside the converter reduces user anxiety about whether the conversion is correct. Showing both source and target characters side by side builds immediate trust.

**3. Old English / Runic transliterators (e.g. valhyr.com, omniglot.com interactive tools)**
Niche script converters for historically significant alphabets. Lesson: historical context and character naming matter to the target audience — users engage more deeply when the tool names the script and acknowledges its cultural significance, rather than treating it as a purely mechanical substitution.

**4. Google Translate (translate.google.com)**
The dominant reference for any text transformation UI. Lesson: live (as-you-type) conversion removes the cognitive overhead of an explicit "convert" button and makes the tool feel responsive and modern. The two-panel layout (source left, result right or below) is deeply familiar.

**5. Keyboard layout / input method tools (e.g. keyman.io)**
Tools for rendering minority and historical scripts. Lesson: unmapped character passthrough is essential — users must trust that the tool will not silently lose punctuation, numbers, or words it cannot handle.

---

## THEMES AND TONE

**1. Living History**
The converter embodies the idea that ancient scripts are not dead relics but living cultural materials that can be typed, shared, and explored today. The tone avoids dry academic register; it should feel like an act of discovery.

**2. Simplicity with Depth**
The primary interaction is as simple as a text box. Underneath that simplicity lies historical and linguistic depth — the reference table is always available for those who want to go further. The product never lectures; it invites.

**3. Faithfulness**
Accuracy to the defined mapping is non-negotiable. The converter makes no assumptions or creative leaps in either direction. Where no mapping exists, the original character is preserved. This principle of faithfulness extends to tone: labels are clear, precise, and never ambiguous.

**4. Accessibility of the Inaccessible**
Glagolitic is not on any standard keyboard. The product exists specifically to make the inaccessible accessible — this theme should permeate the interface language, framing the tool as a bridge rather than a barrier.

**5. Cultural Respect**
The Ukrainian language is the source material. The tool treats it with care. Labels and help text acknowledge both the Ukrainian Cyrillic input and the Glagolitic output with equal dignity — neither is subordinate to the other.

---

## WORLD-BUILDING / CONCEPTS

**The Bridge Metaphor**
The central mental model is a bridge between two alphabets separated by a thousand years. The user chooses which shore to start from — modern Ukrainian text or ancient Glagolitic — and the converter carries it across to the other side. The mode toggle is the direction of travel on the bridge. The passthrough behaviour (unmapped characters cross unchanged) reflects that not everything needs to be translated to remain meaningful.

**The Mapping Table as Living Alphabet**
The 31-character reference table is not merely a lookup grid — it is the full visible alphabet of the application. It makes the conversion rule transparent and inspectable. Users should be able to read the table and understand exactly what the converter does, with no hidden logic. This mental model positions the tool as an educational instrument as much as a utility.

**Passthrough as a Feature, Not a Gap**
Unmapped characters passing through unchanged is framed as a deliberate design decision, not a limitation. Spaces, punctuation, and digits are meaningful in context; silently dropping or altering them would break the reader's ability to parse the output. The product respects the integrity of the full text, not just the scriptable portions.
