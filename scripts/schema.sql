-- Chat transcripts. Run once against the Neon database, from the Neon SQL
-- editor or `psql "$DATABASE_URL" -f scripts/schema.sql`.
--
-- One row per conversation, keyed by the random id the browser generates for
-- it. Nothing identifying is stored: no IP address, no cookie, no account.
create table if not exists conversations (
  session_id  text primary key,
  visitor_id  text,
  messages    jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Databases created before visitor_id existed. Safe to run repeatedly.
alter table conversations add column if not exists visitor_id text;

-- "What has this browser asked us over time" is the question the visitor id
-- exists to answer.
create index if not exists conversations_visitor_idx
  on conversations (visitor_id, created_at);

-- "What did people ask about last month" is the question this table exists to
-- answer, and it is ordered by time.
create index if not exists conversations_updated_at_idx
  on conversations (updated_at desc);

-- Details a visitor gives when they ask us to save the conversation. Null for
-- one-off chats, which are never linked to a person.
alter table conversations add column if not exists visitor_name  text;
alter table conversations add column if not exists visitor_email text;
