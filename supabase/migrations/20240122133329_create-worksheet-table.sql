create table
  public.worksheets (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    published boolean not null default false,
    info text,
    "startDate" date not null,
    "endDate" date not null,
    constraint worksheets_pkey primary key (id)
  );

alter table public.worksheets enable row level security;

create policy "Public worksheets (faces) are viewable by public."
  on worksheets for select
  using ( true );

create policy "Only admins can create new worksheets"
  on worksheets for insert
  with check ( is_claims_admin() );

create policy "Only admins can update worksheets"
  on worksheets for update
  using ( is_claims_admin() );

create policy "Only admins and delete worksheets"
  on worksheets for delete
  using (is_claims_admin());