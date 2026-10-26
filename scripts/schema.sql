-- Chat transcripts. Run once against the Neon database.
--
-- This is one `do` block rather than a list of statements on purpose. Neon's
-- SQL editor sends the script as a single prepared statement, and Postgres
-- refuses a prepared statement containing several commands with "cannot insert
-- multiple commands into a prepared statement". `execute` keeps every change
-- inside one statement, so this runs in the editor as well as through
-- `psql "$DATABASE_URL" -f scripts/schema.sql`.
--
-- Safe to run repeatedly: everything is IF NOT EXISTS.

do $schema$
begin
  -- One row per conversation. session_id is new on every page load. visitor_id
  -- is kept in the browser's localStorage and only exists when the visitor
  -- chose to save the chat, so rows from the same browser can be linked.
  execute $ddl$
    create table if not exists conversations (
      session_id  text primary key,
      visitor_id  text,
      messages    jsonb not null,
      created_at  timestamptz not null default now(),
      updated_at  timestamptz not null default now()
    )
  $ddl$;

  -- Columns added after the table first shipped.
  execute 'alter table conversations add column if not exists visitor_id    text';
  execute 'alter table conversations add column if not exists visitor_name  text';
  execute 'alter table conversations add column if not exists visitor_email text';

  -- "What has this browser asked us over time", and "what did people ask
  -- last month". Those are the two questions this table exists to answer.
  execute 'create index if not exists conversations_visitor_idx
             on conversations (visitor_id, created_at)';
  execute 'create index if not exists conversations_updated_at_idx
             on conversations (updated_at desc)';
end
$schema$;
