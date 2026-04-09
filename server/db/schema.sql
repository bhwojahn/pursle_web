-- pursle leads table — run as database superuser, then apply grants below.

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  slowing TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

-- Least-privilege application user (section 6.4 of context.md)
-- Replace placeholders before running:
--
-- CREATE ROLE pursle_app WITH LOGIN PASSWORD 'use_a_strong_password';
-- GRANT CONNECT ON DATABASE pursle TO pursle_app;
-- GRANT USAGE ON SCHEMA public TO pursle_app;
-- GRANT INSERT ON TABLE leads TO pursle_app;
-- GRANT USAGE, SELECT ON SEQUENCE leads_id_seq TO pursle_app;
--
-- The app user must NOT have SELECT, UPDATE, DELETE on leads unless you add
-- an internal admin path (not in v1). Use a separate read-only reporting role if needed.
