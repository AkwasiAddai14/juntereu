#!/usr/bin/env bash
set -Eeuo pipefail

# Required input
: "${PROJECT_ID:?Set PROJECT_ID, e.g. export PROJECT_ID='my-gcp-project'}"
ENV_FILE="${1:-.env.secrets}"

# Enable the API once
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
# Strip CRLF, read KEY=VALUE (keep everything after first '=' as the value)
while IFS='=' read -r raw_key rest; do
  # remove Windows \r endings
  rest="${rest%$'\r'}"
  raw_key="${raw_key%$'\r'}"

  # skip blanks/comments
  [[ -z "${raw_key// }" || "${raw_key}" =~ ^# ]] && continue

  # normalize key (no spaces)
  key="$(echo -n "$raw_key" | tr -d '[:space:]')"

  # trim leading spaces from value
  value="${rest#"${rest%%[![:space:]]*}"}"
  # strip surrounding quotes if present
  [[ "$value" =~ ^\".*\"$ ]] && value="${value:1:-1}"

  create_or_update "$key" "$value"
done < <(sed -e 's/\r$//' "$ENV_FILE")

# ---- IAM grants ----
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
# Default Cloud Run SA unless you override RUNTIME_SA in the env
RUNTIME_SA="${RUNTIME_SA:-${PROJECT_NUMBER}-compute@developer.gserviceaccount.com}"
# Cloud Build SA (only used if GRANT_CLOUD_BUILD is set)
CLOUD_BUILD_SA="${CLOUD_BUILD_SA:-${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com}"

echo "==> Granting roles/secretmanager.secretAccessor to $RUNTIME_SA"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor" >/dev/null

if [[ -n "${GRANT_CLOUD_BUILD:-}" ]]; then
  echo "==> Granting Secret Manager access to Cloud Build SA: $CLOUD_BUILD_SA"
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/secretmanager.secretAccessor" >/dev/null
fi

echo "✅ All done."
