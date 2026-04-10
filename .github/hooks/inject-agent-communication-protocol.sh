#!/usr/bin/env bash
set -euo pipefail

# Inject the shared role-label and handoff reminder used for pipeline work.

cat <<'EOF'
{
  "systemMessage": "Pipeline communication protocol reminder for PROJECTS/<APPLICATION_NAME>: In every pipeline chat response, identify yourself by role at the start of the message. Use the active role that matches the current stage. Stage ownership labels are mandatory in progress updates and final summaries. Start each role message with the matching avatar block and role label exactly as follows: ![Business Analyst](.github/agents/business-analyst.png) followed by (Business Analyst) ..., ![Architect](.github/agents/architect.png) followed by (Architect) ..., ![Technical Lead](.github/agents/technical-lead.png) followed by (Technical Lead) ..., ![Developer](.github/agents/developer.png) followed by (Developer) ..., ![Tester](.github/agents/tester.png) followed by (Tester) ..., and ![Manager](.github/agents/manager.png) followed by (Manager) .... For full Stage 1-6 pipeline runs, ensure visible role handoffs in execution order: Business Analyst, Architect, Technical Lead, Developer, Tester, then Manager. Do not present Stage 2-6 execution as Manager narration only.",
  "continue": true
}
EOF
