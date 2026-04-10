---
name: implementation-stage
description: 'Implement approved Stage 5 work in ./build from 4-DESIGN-INSTRUCTIONS.md. Use for developer execution, DI traceability, build hygiene, secure browser implementation, and Stage 5 exit-gate checks.'
argument-hint: 'Describe the implementation tranche or DI scope to build.'
---

# Implementation Stage

## When to Use
- Implementing approved Stage 5 work in PROJECTS/**/build
- Verifying DI traceability for code changes
- Checking Stage 5 exit-gate compliance before testing

## Scope
- Input: 4-DESIGN-INSTRUCTIONS.md
- Output: ./build/** plus a matching 5-RELEASE-NOTES.md update

## Procedure
1. Read the canonical pipeline file first.
2. Read 4-DESIGN-INSTRUCTIONS.md and limit work to approved DI-linked scope.
3. Write all implementation code under ./build.
4. Keep every changed file traceable to at least one DI ID.
5. Validate boundary inputs, add safe user-visible failure handling, and avoid unrelated refactors.
6. Resolve diagnostics in the modified scope before claiming completion.
7. If runtime caveats exist, document them in release notes and coordinate any required upstream caveat handling through the owning role.

## Build Output Rules
- Chrome extensions go in ./build/extension/
- Browser games go in ./build/ or ./build/www/
- Do not write implementation code outside ./build

## Exit Gate
- All code under ./build is traceable to DI IDs.
- Build output location conventions are followed.
- Modified scope has no unresolved diagnostics.
- Release notes are updated with full traceability.
