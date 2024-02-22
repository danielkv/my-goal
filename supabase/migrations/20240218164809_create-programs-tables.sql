create table
  public.programs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
	image text not null,
    amount double precision not null,
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
    constraint program_sessions_pkey primary key (id),
    constraint program_sessions_segment_id_fkey foreign key (segment_id) references program_segments (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.program_sessions enable row level security;

create table
  public.program_classes (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying null,
    video text null,
    text text null,
    session_id uuid not null,
    constraint program_classes_pkey primary key (id),
    constraint program_classes_session_id_fkey foreign key (session_id) references program_sessions (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.program_classes enable row level security;

create table
  public.user_programs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    program_id uuid null,
	user_id uuid not null,
    expires_at timestamp with time zone not null,
    paid_amount double precision not null,
    constraint user_programs_pkey primary key (id),
    constraint user_programs_program_id_fkey foreign key (program_id) references programs (id),
	constraint user_programs_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table public.user_programs enable row level security;


create table
  public.user_seen_classes (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    class_id uuid not null,
    user_id uuid not null,
    constraint user_seen_classes_pkey primary key (id),
    constraint user_seen_classes_class_id_fkey foreign key (class_id) references program_classes (id) on update cascade on delete cascade,
    constraint user_seen_classes_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

alter table public.user_seen_classes enable row level security;

-- PROGRAMS

create policy "Programs are viewable by the user who bought it."
  on programs for select
  using ( true );

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

create policy "Program_segments are viewable by the user who bought it."
  on program_segments for select
  using ( is_claims_admin() OR EXISTS(SELECT user_id FROM user_programs WHERE user_programs.program_id = program_segments.id and user_programs.user_id = auth.uid() AND expires_at >= now()) );

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

create policy "Program_sessions are viewable by the user who bought it."
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

-- PROGRAM CLASSES

create policy "program_classes are viewable by the user who bought it."
  on program_classes for select
  using ( auth.uid() IS NOT NULL );

create policy "Only admins can insert new program_classes"
  on program_classes for insert
  with check ( is_claims_admin() );

create policy "Only admins can update program_classes"
  on program_classes for update
  USING (is_claims_admin())
  with check ( is_claims_admin() );

create policy "Only admins can delete program_classes"
  on program_classes for delete
  using ( is_claims_admin() );

-- USER PROGRAMS

create policy "user_programs are viewable by the admin or owner."
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

-- USER SEEN CLASSES

create policy "User_seen_classes are viewable by the admin and owner."
  on user_seen_classes for select
  using ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can insert new user_seen_classes"
  on user_seen_classes for insert
  with check ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can update user_seen_classes"
  on user_seen_classes for update
  USING (is_claims_admin())
  with check ( is_claims_admin() OR user_id = auth.uid() );

create policy "Admins and owners can delete user_seen_classes"
  on user_seen_classes for delete
  using ( is_claims_admin() OR user_id = auth.uid() );