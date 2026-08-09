-- Initialize the radius schema and mark the baseline migration as applied.
-- This avoids the Zerops platform-managed `heartbeat` table in the public schema
-- which the app user cannot modify and which triggers Prisma P3005/P3016.
--
-- Idempotent: safe to run on every deploy.

CREATE SCHEMA IF NOT EXISTS radius;

CREATE TABLE IF NOT EXISTS radius."_prisma_migrations" (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  checksum VARCHAR(64) NOT NULL,
  finished_at TIMESTAMPTZ NOT NULL,
  migration_name VARCHAR(255) NOT NULL,
  logs TEXT,
  rolled_back_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  applied_steps_count INTEGER NOT NULL DEFAULT 0
);

-- Mark the no-op baseline migration as applied (only if not already recorded).
-- This accounts for the pre-existing heartbeat table in public without touching it.
INSERT INTO radius."_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT replace(gen_random_uuid()::text, '-', ''), '', NOW(), '20260303140315_baseline', NOW(), 0
WHERE NOT EXISTS (
  SELECT 1 FROM radius."_prisma_migrations" WHERE migration_name = '20260303140315_baseline'
);
