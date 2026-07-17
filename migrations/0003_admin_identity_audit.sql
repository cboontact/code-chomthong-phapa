ALTER TABLE admin_sessions ADD COLUMN username TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_sessions ADD COLUMN display_name TEXT NOT NULL DEFAULT '';

ALTER TABLE audit_logs ADD COLUMN actor_username TEXT NOT NULL DEFAULT '';
ALTER TABLE audit_logs ADD COLUMN actor_name TEXT NOT NULL DEFAULT '';

-- Existing sessions predate identity tracking; require a fresh login.
DELETE FROM admin_sessions;
