#!/usr/bin/env bash
set -euo pipefail

# Inject the reminder that pipeline.instructions.md is authoritative for
# product work under PROJECTS/.

cat <<'EOF'
{
  "systemMessage": "Pipeline source-of-truth reminder: when interacting with project artifacts under PROJECTS/, follow .github/instructions/pipeline.instructions.md and load the artifact-specific skills it references in .github/skills/. If you cannot follow that document, explicitly tell the user. Return to following the document as soon as possible, and explicitly tell the user when you are back in compliance.",
  "continue": true
}
EOF
