#!/usr/bin/env bash
# Apply GitHub rulesets for main + version tags after the public repo exists.
# Usage: ./scripts/apply-github-rulesets.sh [owner/repo]
# Requires: gh auth with repo admin (rulesets).
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
OWNER="${REPO%%/*}"
NAME="${REPO#*/}"

echo "Applying rulesets to ${REPO}…"

# --- main: require PR, require CI check "test", block force-push ---
# bypass for repo admin (owner). Status check name matches jobs.test.name in ci.yml.
gh api --method POST "repos/${OWNER}/${NAME}/rulesets" \
  --input - <<'EOF'
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false,
        "required_status_checks": [
          { "context": "test" }
        ]
      }
    },
    { "type": "non_fast_forward" }
  ],
  "bypass_actors": [
    {
      "actor_id": 5,
      "actor_type": "RepositoryRole",
      "bypass_mode": "always"
    }
  ]
}
EOF

# --- tags: protect v* — restrict create to admins; block delete/update (force) ---
gh api --method POST "repos/${OWNER}/${NAME}/rulesets" \
  --input - <<'EOF'
{
  "name": "version-tags",
  "target": "tag",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/tags/v*"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "creation" },
    { "type": "deletion" },
    {
      "type": "update",
      "parameters": {
        "update_allows_fetch_and_merge": false
      }
    },
    { "type": "non_fast_forward" }
  ],
  "bypass_actors": [
    {
      "actor_id": 5,
      "actor_type": "RepositoryRole",
      "bypass_mode": "always"
    }
  ]
}
EOF

echo "Done. List with: gh api repos/${OWNER}/${NAME}/rulesets"
