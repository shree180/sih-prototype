#!/usr/bin/env bash
# PostgreSQL Restore Script for DRM04
# Supports: pg_dump (SQL), pg_basebackup (tar), WAL-G
# Usage: ./restore-postgres.sh <backup_file> [target_database]

set -euo pipefail

# =============================================================================
# Configuration
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [[ -f "$PROJECT_ROOT/.env.production" ]]; then
  source "$PROJECT_ROOT/.env.production"
fi

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGDATABASE="${PGDATABASE:-drm04}"
PGUSER="${PGUSER:-drm04}"
PGPASSWORD="${PGPASSWORD:-${DATABASE_URL##*:}}"
PGPASSWORD="${PGPASSWORD%%\?*}"

export PGPASSWORD

# =============================================================================
# Functions
# =============================================================================
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  log "ERROR: $*" >&2
}

confirm() {
  local prompt="$1"
  read -r -p "$prompt [y/N]: " response
  [[ "$response" =~ ^[Yy]$ ]]
}

decrypt_file() {
  local file="$1"
  if [[ "$file" == *.gpg ]]; then
    log "Decrypting $file"
    local decrypted="${file%.gpg}"
    gpg --decrypt --batch --yes --output "$decrypted" "$file"
    echo "$decrypted"
  else
    echo "$file"
  fi
}

decompress_file() {
  local file="$1"
  if [[ "$file" == *.gz ]]; then
    log "Decompressing $file"
    local decompressed="${file%.gz}"
    gzip -d -c "$file" > "$decompressed"
    echo "$decompressed"
  else
    echo "$file"
  fi
}

# =============================================================================
# Restore Functions
# =============================================================================
restore_sql() {
  local backup_file="$1"
  local target_db="${2:-${PGDATABASE}_restored_$(date '+%Y%m%d_%H%M%S')}"

  log "Restoring SQL dump to database: $target_db"

  # Create target database
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c "CREATE DATABASE $target_db;"

  # Restore
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$target_db" -f "$backup_file"

  log "SQL restore completed. Database: $target_db"
}

restore_basebackup() {
  local backup_file="$1"
  local data_dir="${2:-/var/lib/postgresql/data}"

  log "Restoring basebackup to: $data_dir"

  # Stop PostgreSQL if running
  if systemctl is-active --quiet postgresql; then
    log "Stopping PostgreSQL"
    systemctl stop postgresql
  fi

  # Backup current data directory
  if [[ -d "$data_dir" ]]; then
    local backup_data_dir="${data_dir}.backup.$(date '+%Y%m%d_%H%M%S')"
    log "Backing up current data directory to: $backup_data_dir"
    mv "$data_dir" "$backup_data_dir"
  fi

  # Create new data directory
  mkdir -p "$data_dir"
  chown -R postgres:postgres "$data_dir"
  chmod 700 "$data_dir"

  # Extract basebackup
  log "Extracting basebackup"
  tar -xzf "$backup_file" -C "$data_dir"

  # Create recovery.signal for PITR
  touch "$data_dir/recovery.signal"

  # Set ownership
  chown -R postgres:postgres "$data_dir"

  # Start PostgreSQL
  log "Starting PostgreSQL"
  systemctl start postgresql

  log "Basebackup restore completed. PostgreSQL will replay WAL files."
}

restore_walg() {
  local backup_name="$1"
  local data_dir="${2:-/var/lib/postgresql/data}"

  log "Restoring from WAL-G backup: $backup_name"

  # Stop PostgreSQL
  systemctl stop postgresql || true

  # Backup current data
  if [[ -d "$data_dir" ]]; then
    mv "$data_dir" "${data_dir}.backup.$(date '+%Y%m%d_%H%M%S')"
  fi

  mkdir -p "$data_dir"
  chown -R postgres:postgres "$data_dir"

  # Restore using WAL-G
  sudo -u postgres wal-g backup-fetch "$data_dir" "$backup_name"

  touch "$data_dir/recovery.signal"
  chown -R postgres:postgres "$data_dir"

  systemctl start postgresql

  log "WAL-G restore completed"
}

# =============================================================================
# Main
# =============================================================================
main() {
  if [[ $# -lt 1 ]]; then
    error "Usage: $0 <backup_file> [target_database]"
    error "Example: $0 backups/postgres/drm04_full_20240115_030000.sql.gz"
    error "Example: $0 backups/postgres/drm04_basebackup_20240115_030000.tar.gz /var/lib/postgresql/data"
    exit 1
  fi

  local backup_file="$1"
  local target="${2:-}"

  if [[ ! -f "$backup_file" ]]; then
    error "Backup file not found: $backup_file"
    exit 1
  fi

  log "Preparing to restore from: $backup_file"

  # Confirm for basebackup (destructive)
  if [[ "$backup_file" == *basebackup* ]]; then
    if ! confirm "WARNING: This will REPLACE the current PostgreSQL data directory. Continue?"; then
      log "Restore cancelled"
      exit 0
    fi
  fi

  # Process file (decrypt/decompress)
  local processed_file
  processed_file=$(decrypt_file "$backup_file")
  processed_file=$(decompress_file "$processed_file")

  # Determine restore method
  if [[ "$processed_file" == *.sql ]]; then
    restore_sql "$processed_file" "$target"
  elif [[ "$processed_file" == *.tar ]]; then
    restore_basebackup "$processed_file" "$target"
  else
    error "Unknown backup format: $processed_file"
    exit 1
  fi

  # Cleanup temp files if we created them
  if [[ "$processed_file" != "$backup_file" ]]; then
    rm -f "$processed_file"
  fi

  log "Restore completed successfully"
}

main "$@"