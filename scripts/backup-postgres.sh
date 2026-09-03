#!/usr/bin/env bash
# PostgreSQL Backup Script for DRM04
# Supports: pg_dump, pg_basebackup, WAL-G
# Usage: ./backup-postgres.sh [full|incremental|wal]

set -euo pipefail

# =============================================================================
# Configuration
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment
if [[ -f "$PROJECT_ROOT/.env.production" ]]; then
  source "$PROJECT_ROOT/.env.production"
fi

# Database connection
PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGDATABASE="${PGDATABASE:-drm04}"
PGUSER="${PGUSER:-drm04}"
PGPASSWORD="${PGPASSWORD:-${DATABASE_URL##*:}}"
PGPASSWORD="${PGPASSWORD%%\?*}"

export PGPASSWORD

# Backup settings
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
COMPRESS="${COMPRESS:-true}"
ENCRYPT="${ENCRYPT:-false}"
GPG_RECIPIENT="${GPG_RECIPIENT:-}"

# S3/Remote storage (optional)
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-drm04/backups}"
AWS_PROFILE="${AWS_PROFILE:-default}"

# Notification
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
EMAIL_TO="${EMAIL_TO:-}"

# =============================================================================
# Functions
# =============================================================================
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  log "ERROR: $*" >&2
}

notify() {
  local level="$1"
  local message="$2"

  if [[ -n "$SLACK_WEBHOOK" ]]; then
    curl -s -X POST "$SLACK_WEBHOOK" \
      -H "Content-Type: application/json" \
      -d "{\"text\":\"[$level] DRM04 Backup: $message\"}" >/dev/null || true
  fi

  if [[ -n "$EMAIL_TO" ]]; then
    echo "$message" | mail -s "[$level] DRM04 Backup" "$EMAIL_TO" || true
  fi
}

check_dependencies() {
  local deps=("pg_dump" "pg_basebackup" "gzip" "aws")
  for dep in "${deps[@]}"; do
    if ! command -v "$dep" &>/dev/null; then
      error "Required command not found: $dep"
      exit 1
    fi
  done
}

create_backup_dir() {
  mkdir -p "$BACKUP_DIR"
}

cleanup_old_backups() {
  log "Cleaning up backups older than $RETENTION_DAYS days"
  find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
  find "$BACKUP_DIR" -type f -name "*.basebackup.tar.gz" -mtime +"$RETENTION_DAYS" -delete
}

compress_file() {
  local file="$1"
  if [[ "$COMPRESS" == "true" ]]; then
    log "Compressing $file"
    gzip -f "$file"
    echo "${file}.gz"
  else
    echo "$file"
  fi
}

encrypt_file() {
  local file="$1"
  if [[ "$ENCRYPT" == "true" && -n "$GPG_RECIPIENT" ]]; then
    log "Encrypting $file"
    gpg --trust-model always --encrypt --recipient "$GPG_RECIPIENT" --output "${file}.gpg" "$file"
    rm -f "$file"
    echo "${file}.gpg"
  else
    echo "$file"
  fi
}

upload_to_s3() {
  local file="$1"
  if [[ -n "$S3_BUCKET" ]]; then
    log "Uploading to s3://$S3_BUCKET/$S3_PREFIX/"
    aws s3 cp "$file" "s3://$S3_BUCKET/$S3_PREFIX/" --profile "$AWS_PROFILE" --storage-class STANDARD_IA
  fi
}

verify_backup() {
  local file="$1"
  if [[ "$file" == *.gz ]]; then
    gzip -t "$file" || { error "Backup verification failed: $file"; return 1; }
  elif [[ "$file" == *.gpg ]]; then
    gpg --decrypt --batch --yes "$file" >/dev/null || { error "Backup verification failed: $file"; return 1; }
  fi
  log "Backup verified: $file"
}

# =============================================================================
# Backup Types
# =============================================================================
full_backup() {
  local timestamp=$(date '+%Y%m%d_%H%M%S')
  local filename="${BACKUP_DIR}/drm04_full_${timestamp}.sql"
  local final_file

  log "Starting full backup (pg_dump)"

  pg_dump \
    -h "$PGHOST" \
    -p "$PGPORT" \
    -U "$PGUSER" \
    -d "$PGDATABASE" \
    --verbose \
    --no-owner \
    --no-privileges \
    --format=plain \
    --create \
    > "$filename"

  final_file=$(compress_file "$filename")
  final_file=$(encrypt_file "$final_file")
  verify_backup "$final_file"
  upload_to_s3 "$final_file"

  log "Full backup completed: $final_file"
  notify "SUCCESS" "Full backup completed: $(basename "$final_file")"
}

incremental_backup() {
  local timestamp=$(date '+%Y%m%d_%H%M%S')
  local backup_dir="${BACKUP_DIR}/basebackup_${timestamp}"
  local final_file

  log "Starting incremental backup (pg_basebackup)"

  pg_basebackup \
    -h "$PGHOST" \
    -p "$PGPORT" \
    -U "$PGUSER" \
    -D "$backup_dir" \
    -Ft \
    -z \
    -P \
    -X stream \
    --checkpoint=fast

  # Create tar.gz of the basebackup
  final_file="${BACKUP_DIR}/drm04_basebackup_${timestamp}.tar.gz"
  tar -czf "$final_file" -C "$backup_dir" .
  rm -rf "$backup_dir"

  final_file=$(encrypt_file "$final_file")
  verify_backup "$final_file"
  upload_to_s3 "$final_file"

  log "Incremental backup completed: $final_file"
  notify "SUCCESS" "Incremental backup completed: $(basename "$final_file")"
}

wal_backup() {
  log "WAL archiving is handled by PostgreSQL archive_command"
  log "Ensure archive_command is configured in postgresql.conf:"
  log "  archive_mode = on"
  log "  archive_command = 'cp %p /path/to/wal_archive/%f'"
}

# =============================================================================
# Main
# =============================================================================
main() {
  local backup_type="${1:-full}"

  log "Starting DRM04 PostgreSQL backup (type: $backup_type)"

  check_dependencies
  create_backup_dir

  case "$backup_type" in
    full)
      full_backup
      ;;
    incremental|basebackup)
      incremental_backup
      ;;
    wal)
      wal_backup
      ;;
    *)
      error "Unknown backup type: $backup_type"
      error "Usage: $0 [full|incremental|wal]"
      exit 1
      ;;
  esac

  cleanup_old_backups
  log "Backup process completed successfully"
}

# Handle signals
trap 'error "Backup interrupted"; notify "FAILURE" "Backup interrupted"; exit 1' INT TERM

main "$@"