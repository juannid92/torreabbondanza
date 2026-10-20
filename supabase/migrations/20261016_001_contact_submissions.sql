-- Contact form leads from torreabbondanza.com
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- form fields
  name text not null,
  email text not null default '',
  phone text not null,
  kind text not null,           -- OCCASIONS value (matrimonio, cerimonia, ...)
  date date,
  guests int,
  message text not null,

  -- routing metadata
  ip inet,
  user_agent text,
  honeypot boolean not null default false,
  source text not null default 'whatsapp',

  -- delivery flags
  whatsapp_opened boolean not null default true,
  email_sent boolean not null default false,
  email_error text,

  constraint contact_submissions_kind_nonempty
    check (length(kind) > 0)
);

-- RLS: deny all to anon/authenticated. Service role bypasses RLS for inserts.
alter table public.contact_submissions enable row level security;

-- No policies: the only writer is the server function with service_role.
-- If we ever add an admin view, we add a policy that compares auth.uid() to a
-- dedicated admin table.

create index contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
create index contact_submissions_email_idx
  on public.contact_submissions (email);
