-- Chat transcripts. Run once against the Neon database, from the Neon SQL
-- editor or `psql "$DATABASE_URL" -f scripts/schema.sql`.
--
-- One row per conversation, keyed by the random id the browser generates for
-- it. Nothing identifying is stored: no IP address, no cookie, no account.
create table if not exists conversations (
  session_id  text primary key,
  messages    jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- "What did people ask about last month" is the question this table exists to
-- answer, and it is ordered by time.
create index if not exists conversations_updated_at_idx
  on conversations (updated_at desc);
