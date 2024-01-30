create table
  public.days (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    date date not null,
    name character varying null,
    periods jsonb null,
    "worksheetId" uuid not null,
    constraint days_pkey primary key (id),
    constraint days_worksheetId_fkey foreign key ("worksheetId") references worksheets (id) on update cascade on delete cascade
  ) tablespace pg_default;

  alter table public.days enable row level security;

create policy "Public worksheets are viewable by authenticated."
  on days for select
  using ( auth.uid() IS NOT NULL );

create policy "Only admins can create new worksheets"
  on days for insert
  with check ( is_claims_admin() );

create policy "Only admins can update worksheets"
  on days for update
  using ( is_claims_admin() );

create policy "Only admins can delete worksheets"
  on days for delete
  using ( is_claims_admin() );