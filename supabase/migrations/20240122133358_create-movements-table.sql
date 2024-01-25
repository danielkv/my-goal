create table
  public.movements (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    "countResults" bigint not null default '0'::bigint,
    movement character varying not null,
    "resultType" character varying not null,
    constraint movements_pkey primary key (id)
  );

alter table public.movements enable row level security;

create policy "Movements are viewable by everyone."
  on movements for select
  using ( auth.uid() IS NOT NULL );

create policy "Only admins can create new Movements"
  on movements for insert
  with check ( is_claims_admin() );

create policy "Only admins can update worksheets"
  on movements for update
  using ( is_claims_admin() );
