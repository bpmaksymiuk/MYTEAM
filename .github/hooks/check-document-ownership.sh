#!/usr/bin/env bash
set -euo pipefail

# Inspect edit targets and warn before pipeline-owned artifacts are changed.
# The hook does not block outright; it asks for confirmation so intentional
# owner-approved edits can still proceed.

tool_input="${COPILOT_TOOL_INPUT:-}"

extract_paths() {
  {
    printf '%s' "$tool_input" \
      | grep -oE '"filePath":[[:space:]]*"[^"]+"' \
      | sed -E 's/^"filePath":[[:space:]]*"([^"]+)"$/\1/'

    printf '%s' "$tool_input" \
      | grep -oE '\*\*\* (Update|Add|Delete) File: [^\n]+' \
      | sed -E 's/^\*\*\* (Update|Add|Delete) File: //' \
      | sed -E 's/[[:space:]]+->[[:space:]].*$//'
  } | awk 'NF && !seen[$0]++'
}

owner_for_path() {
  case "$1" in
    */1-USE-CASES.md|*/1-USE-CASES-PROPOSED.md)
      printf '%s' 'User / Product Owner'
      ;;
    */2-REQUIREMENTS.md)
      printf '%s' 'Business Analyst'
      ;;
    */3-ARCHITECTURE-RECOMMENDATIONS.md|*/3-PARTS\ LIST.md)
      printf '%s' 'Architect'
      ;;
    */4-DESIGN-INSTRUCTIONS.md)
      printf '%s' 'Technical Lead'
      ;;
    */5-RELEASE-NOTES.md|*/5-IMPLEMENTATION-RELEASE-NOTES.md)
      printf '%s' 'Developer'
      ;;
    */6-TEST-REPORT.md|*/7-BUG-REPORT.md)
      printf '%s' 'Tester'
      ;;
    *)
      return 1
      ;;
  esac
}

matches=()
while IFS= read -r path; do
  [[ -n "$path" ]] || continue
  if owner=$(owner_for_path "$path"); then
    matches+=("$path::$owner")
  fi
done < <(extract_paths || true)

if [[ ${#matches[@]} -eq 0 ]]; then
  exit 0
fi

reason='Pipeline artifact ownership rule: documents shall only be updated by their owner. Confirm this edit is intentional.'
pipeline_ref='Follow .github/instructions/pipeline.instructions.md and the artifact-specific skills it references in .github/skills/. If you cannot follow them, tell the user, then return to compliance as soon as possible and say so.'
details=''
for match in "${matches[@]}"; do
  path="${match%%::*}"
  owner="${match##*::}"
  details+="- ${path} -> ${owner}\\n"
done

printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"},"systemMessage":"%s\\n%s\\n%s"}\n' \
  "$reason" \
  "$reason" \
  "$pipeline_ref" \
  "$details"
