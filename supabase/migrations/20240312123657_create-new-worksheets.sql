ALTER TABLE worksheets RENAME TO worksheet_weeks;

ALTER TABLE worksheet_weeks RENAME CONSTRAINT worksheets_pkey TO worksheet_weeks_pkey;

create table
  public.worksheets (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    published boolean not null default false,
	amount double precision not null,
	image text,
	community_url text,
    description text,
	stripe_product_id character varying null,
    stripe_payment_link_id character varying null,
    constraint worksheets_pkey primary key (id)
  );

alter table public.worksheets enable row level security;

create table
  public.user_worksheets (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    worksheet_id uuid null,
	user_id uuid not null,
	entitlements text[] not null,
    expires_at timestamp with time zone not null,
    paid_amount double precision not null,
    method text null,
    constraint user_worksheets_pkey primary key (id),
    constraint user_worksheets_worksheet_id_fkey foreign key (worksheet_id) references worksheets(id),
	constraint user_worksheets_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table public.user_worksheets enable row level security;


ALTER TABLE public.worksheet_weeks ADD COLUMN version text default null;
ALTER TABLE worksheet_weeks ADD COLUMN worksheet_id uuid default null;
ALTER TABLE worksheet_weeks ADD constraint worksheet_weeks_worksheet_id_fkey foreign key (worksheet_id) references worksheets (id) on update cascade on delete cascade;

ALTER POLICY "Public worksheets (faces) are viewable by public." ON worksheet_weeks RENAME TO "Public worksheet_weeks are visible to who bought it";
ALTER POLICY "Public worksheet_weeks are visible to who bought it" ON worksheet_weeks
	using ( is_claims_admin() OR EXISTS(SELECT user_id FROM user_worksheets WHERE user_worksheets.worksheet_id = worksheet_weeks.worksheet_id and user_worksheets.user_id = auth.uid() AND expires_at >= now()) );
ALTER POLICY "Only admins can create new worksheets" ON worksheet_weeks RENAME TO "Only admins can create new worksheet_weeks";
ALTER POLICY "Only admins can update worksheets" ON worksheet_weeks RENAME TO "Only admins can update worksheet_weeks";
ALTER POLICY "Only admins and delete worksheets" ON worksheet_weeks RENAME TO "Only admins and delete worksheet_weeks";

create policy "user_worksheets are visible by the admin or owner."
  on user_worksheets for select
  using ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can insert new user_worksheets"
  on user_worksheets for insert
  with check ( is_claims_admin() );

create policy "Only admins can update user_worksheets"
  on user_worksheets for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete user_worksheets"
  on user_worksheets for delete
  using ( is_claims_admin() );


create policy "Public worksheets (faces) are visible to public"
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