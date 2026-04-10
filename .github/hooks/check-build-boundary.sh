#!/usr/bin/env bash
set -euo pipefail

# Warn when a proposed file edit targets a project path under PROJECTS/<APP>/
# that is outside the expected implementation and known artifact locations.

tool_input="${COPILOT_TOOL_INPUT:-}"

extract_paths() {
  printf '%s' "$tool_input" \
    | grep -oE '"filePath":[[:space:]]*"[^"]+"' \
    | sed -E 's/^"filePath":[[:space:]]*"([^"]+)"$/\1/'
}

while IFS= read -r file_path; do
  [[ -n "$file_path" ]] || continue

  if [[ "$file_path" =~ PROJECTS/[^/]+/ ]] \
    && [[ ! "$file_path" =~ PROJECTS/[^/]+/(build/|[0-9]-|6-TEST|7-BUG|testresults/|[a-z_]+_test_pipeline|goal\.md|annotate_) ]]; then
    printf "WARNING: '%s' is outside ./build/ and is not a recognized pipeline artifact. Confirm this edit is intentional.\n" "$file_path"
  fi
done < <(extract_paths || true)

exit 0