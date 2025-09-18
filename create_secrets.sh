#!/usr/bin/env bash
set -Eeuo pipefail

: "${PROJECT_ID:?Set PROJECT_ID, e.g. export PROJECT_ID='my-gcp-project'}"
ENV_FILE="${1:-.env.secrets}"

# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com --project "$PROJECT_ID" >/dev/null

create_or_update () {
  local name="$1" value="$2"

  if ! gcloud secrets describe "$name" --project "$PROJECT_ID" >/dev/null 2>&1; then
    echo "➕ Creating secret $name"
    gcloud secrets create "$name" \
      --project "$PROJECT_ID" \
      --replication-policy=automatic >/dev/null
  else
    echo "✔︎ Secret $name exists (adding new version)"
  fi

  printf "%s" "$value" | gcloud secrets versions add "$name" \
    --project "$PROJECT_ID" \
    --data-file=- >/dev/null
}

echo "==> Reading $ENV_FILE"
# Read tolerant of: export KEY=VALUE, spaces, quotes, CRLF, and '=' inside value
while IFS= read -r line || [ -n "$line" ]; do
  # strip CR and trim outer whitespace
  line="${line%$'\r'}"
  line="${line#"${line%%[![:space:]]*}"}"
  line="${line%"${line##*[![:space:]]}"}"

  # skip blanks/comments
  [[ -z "$line" || "$line" == \#* ]] && continue

  # drop leading "export " if present
  [[ "$line" == export* ]] && line="${line#export }"

  # split at first '='
  key="${line%%=*}"
  value="${line#*=}"

  # trim key spaces
  key="${key#"${key%%[![:space:]]*}"}"
  key="${key%"${key##*[![:space:]]}"}"
  [[ -z "$key" ]] && continue

  # trim value outer spaces
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"

  # safely strip one leading and/or trailing double-quote
  [[ "$value" == \"* ]] && value="${value#\"}"
  [[ "$value" == *\" ]] && value="${value%\"}"

  create_or_update "$key" "$value"
done < <(sed -e 's/\r$//' "$ENV_FILE")

# ---- IAM grants ----
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
RUNTIME_SA="${RUNTIME_SA:-${PROJECT_NUMBER}-compute@developer.gserviceaccount.com}"
CLOUD_BUILD_SA="${CLOUD_BUILD_SA:-${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com}"

echo "==> Granting roles/secretmanager.secretAccessor to $RUNTIME_SA"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None >/dev/null

if [[ -n "${GRANT_CLOUD_BUILD:-}" ]]; then
  echo "==> Granting Secret Manager access to Cloud Build SA: $CLOUD_BUILD_SA"
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --condition=None >/dev/null
fi

echo "✅ All done."
