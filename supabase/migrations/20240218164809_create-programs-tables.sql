create table
  public.programs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
	image text not null,
    amount double precision not null,
    payment_link_id character varying null,
	payment_link_url text null,
    expiration numeric not null default '0'::numeric,
    block_segments character varying null,
    constraint programs_pkey primary key (id)
  ) tablespace pg_default;

alter table public.programs enable row level security;

create table
  public.program_segments (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying null,
    program_id uuid not null,
	"order" smallint not null default '0'::smallint,
    constraint program_segments_pkey primary key (id),
    constraint program_segments_program_id_fkey foreign key (program_id) references programs (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.program_segments enable row level security;

 create table
  public.program_sessions (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    segment_id uuid not null,
	"order" smallint not null default '0'::smallint,
    constraint program_sessions_pkey primary key (id),
    constraint program_sessions_segment_id_fkey foreign key (segment_id) references program_segments (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.program_sessions enable row level security;

create table
  public.program_groups (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying null,
    video text null,
    text text null,
    jsontext text null,
    session_id uuid not null,
	"order" smallint not null default '0'::smallint,
    constraint program_groups_pkey primary key (id),
    constraint program_groups_session_id_fkey foreign key (session_id) references program_sessions (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.program_groups enable row level security;

create table
  public.program_movements (
    id uuid not null default gen_random_uuid (),
    movement_id uuid not null,
    group_id uuid not null,
	"order" smallint not null default '0'::smallint,
    constraint program_movements_pkey primary key (id),
    constraint program_movements_group_id_fkey foreign key (group_id) references program_groups (id) on update cascade on delete cascade,
    constraint program_movements_movement_id_fkey foreign key (movement_id) references movements (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.program_movements enable row level security;

create table
  public.user_programs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    program_id uuid null,
	user_id uuid not null,
    expires_at timestamp with time zone not null,
    paid_amount double precision not null,
    method text null,
    constraint user_programs_pkey primary key (id),
    constraint user_programs_program_id_fkey foreign key (program_id) references programs (id),
	constraint user_programs_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table public.user_programs enable row level security;


create table
  public.user_groups_details (
    id uuid not null default gen_random_uuid (),
    group_id uuid not null,
    user_id uuid not null,
    watched_at timestamp with time zone null,
    constraint user_groups_details_pkey primary key (id),
    constraint user_groups_details_group_id_fkey foreign key (group_id) references program_groups (id) on update cascade on delete cascade,
    constraint user_groups_details_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.user_groups_details enable row level security;

CREATE VIEW program_groups_details WITH(security_invoker=true) AS
	SELECT program_groups.*, user_groups_details.watched_at as watched_at from
		public.program_groups
		LEFT JOIN public.user_groups_details ON user_groups_details.group_id = program_groups.id;

-- PROGRAMS

create policy "Programs are visible by the user who bought it."
  on programs for select
  using ( is_claims_admin() OR EXISTS(SELECT user_id FROM user_programs WHERE user_programs.program_id = programs.id and user_programs.user_id = auth.uid() AND expires_at >= now()) );

create policy "Only admins can insert new programs"
  on programs for insert
  with check ( is_claims_admin() );

create policy "Only admins can update programs"
  on programs for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete programs"
  on programs for delete
  using ( is_claims_admin() );

-- PROGRAM SEGMENTS

create policy "Program_segments are visible by the user who bought it."
  on program_segments for select
  using ( is_claims_admin() OR EXISTS(SELECT user_id FROM user_programs WHERE user_programs.program_id = program_segments.program_id and user_programs.user_id = auth.uid() AND expires_at >= now()) );

create policy "Only admins can insert new program_segments"
  on program_segments for insert
  with check ( is_claims_admin() );

create policy "Only admins can update program_segments"
  on program_segments for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete program_segments"
  on program_segments for delete
  using ( is_claims_admin() );

-- PROGRAM SESSIONS

create policy "Program_sessions are visible by the user who bought it."
  on program_sessions for select
  using ( auth.uid() IS NOT NULL );

create policy "Only admins can insert new program_sessions"
  on program_sessions for insert
  with check ( is_claims_admin() );

create policy "Only admins can update program_sessions"
  on program_sessions for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete program_sessions"
  on program_sessions for delete
  using ( is_claims_admin() );

-- PROGRAM GROUPS

create policy "program_groups are visible by the user who bought it."
  on program_groups for select
  using ( auth.uid() IS NOT NULL );

create policy "Only admins can insert new program_groups"
  on program_groups for insert
  with check ( is_claims_admin() );

create policy "Only admins can update program_groups"
  on program_groups for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete program_groups"
  on program_groups for delete
  using ( is_claims_admin() );

-- PROGRAM MOVEMENTS

create policy "program_movements are visible by the user who bought it."
  on program_movements for select
  using ( auth.uid() IS NOT NULL );

create policy "Only admins can insert new program_movements"
  on program_movements for insert
  with check ( is_claims_admin() );

create policy "Only admins can update program_movements"
  on program_movements for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete program_movements"
  on program_movements for delete
  using ( is_claims_admin() );

-- USER PROGRAMS

create policy "user_programs are visible by the admin or owner."
  on user_programs for select
  using ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can insert new user_programs"
  on user_programs for insert
  with check ( is_claims_admin() OR user_id = auth.uid() );

create policy "Only admins can update user_programs"
  on user_programs for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete user_programs"
  on user_programs for delete
  using ( is_claims_admin() );

-- USER GROUPS DETAILS

create policy "user_groups_details are visible by the admin and owner."
  on user_groups_details for select
  using ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can insert new user_groups_details"
  on user_groups_details for insert
  with check ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can update user_groups_details"
  on user_groups_details for update
  USING (is_claims_admin())
  with check ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can delete user_groups_details"
  on user_groups_details for delete
  using ( is_claims_admin() OR user_id = auth.uid() );