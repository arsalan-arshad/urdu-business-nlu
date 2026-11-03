#!/usr/bin/env bash
# Privacy scan for urdu-business-nlu. Exits 1 on any hit.
# Reports file, line and pattern TYPE only, never the matched value.
# Usage: scripts/privacy-scan.sh [directory]   (default: current directory)
# Heuristic regexes: a clean run is not proof of no personal data.

set -u
ROOT="${1:-.}"
ALLOWED_EMAIL="arsalanarshad.dev@gmail.com"
hits=0

scan() { # $1 = label, $2 = ERE
  local label="$1" pattern="$2" out
  out=$(grep -rEIn \
      --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=coverage \
      --exclude='privacy-scan.sh' --exclude='package-lock.json' --exclude='pnpm-lock.yaml' \
      -e "$pattern" "$ROOT" 2>/dev/null | cut -d: -f1,2 | sed "s/\$/  [$label]/")
  if [ -n "$out" ]; then
    echo "$out"
    hits=$((hits + $(echo "$out" | wc -l)))
  fi
}

# Pakistani mobile numbers: +92 3xx..., 0092 3xx..., 03xx-xxxxxxx
scan "pk-phone" '(\+|00)92[ -]?3[0-9]{2}[ -]?[0-9]{7}|(^|[^0-9])03[0-9]{2}[ -]?[0-9]{7}([^0-9]|$)'
# CNIC: 12345-1234567-1
scan "cnic" '[0-9]{5}-[0-9]{7}-[0-9]'
# Generic international phone-like numbers
scan "intl-phone" '\+[0-9]{1,3}[ -]?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}'
# Common secret formats
scan "secret" '(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'

# Emails other than the project contact address
em=$(grep -rEIno \
    --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=coverage \
    --exclude='privacy-scan.sh' \
    -e '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' "$ROOT" 2>/dev/null \
  | grep -vF "$ALLOWED_EMAIL" | cut -d: -f1,2 | sed 's/$/  [email]/')
if [ -n "$em" ]; then echo "$em"; hits=$((hits + $(echo "$em" | wc -l))); fi

# Audio, video and chat-export files must never be in the repo
files=$(find "$ROOT" -type f \( -iname '*.mp3' -o -iname '*.wav' -o -iname '*.ogg' -o -iname '*.opus' \
  -o -iname '*.m4a' -o -iname '*.aac' -o -iname '*.amr' -o -iname '*.flac' -o -iname '*.mp4' -o -iname '*.mov' \
  -o -iname 'WhatsApp Chat*' -o -iname '_chat.txt' -o -iname '.env' \) \
  -not -path '*/.git/*' -not -path '*/node_modules/*' 2>/dev/null | sed 's/$/  [forbidden-file]/')
if [ -n "$files" ]; then echo "$files"; hits=$((hits + $(echo "$files" | wc -l)));  fi

if [ "$hits" -gt 0 ]; then
  echo "privacy-scan: $hits potential issue(s). Resolve or justify before committing." >&2
  exit 1
fi
echo "privacy-scan: no hits (heuristic check; not proof of absence)."
