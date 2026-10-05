CREATE TABLE IF NOT EXISTS releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  supported_roblox_version text NOT NULL,
  channel text NOT NULL DEFAULT 'stable',
  published_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS releases_single_active ON releases (active) WHERE active;

CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('installer', 'module')),
  path text NOT NULL,
  display_name text NOT NULL,
  size bigint NOT NULL,
  sha256 text NOT NULL,
  blob_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS files_release_id_idx ON files (release_id);

CREATE TABLE IF NOT EXISTS changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  ordinal integer NOT NULL,
  body text NOT NULL
);

CREATE INDEX IF NOT EXISTS changelog_release_id_idx ON changelog (release_id);

CREATE TABLE IF NOT EXISTS compatibility (
  target text PRIMARY KEY,
  result text NOT NULL
);

CREATE TABLE IF NOT EXISTS known_gaps (
  name text PRIMARY KEY,
  impact text NOT NULL,
  resolved_in text
);
