create table
  public.workout_results (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
	"userId" uuid,
    date date not null,
    "isPrivate" boolean not null,
    workout jsonb not null,
    "workoutSignature" character varying not null,
	"resultType" character varying not null,
    "resultValue" numeric not null,
	fb_old_user_id text null,
    constraint workout_results_pkey primary key (id),
	constraint workout_results_userId_fkey foreign key ("userId") references auth.users (id) on update cascade on delete cascade
  );

alter table public.workout_results enable row level security;

create policy "Workouts are viewable by authenticated user."
  on workout_results for select
  using ( auth.uid() IS NOT NULL AND (auth.uid() = "userId" OR "isPrivate" = false) );

create policy "Only admins and user can add its own Workouts results"
  on workout_results for insert
  with check ( auth.uid() = "userId" OR is_claims_admin() );

create policy "Only admins and user can update its own Workouts results"
  on workout_results for update
  using (  auth.uid() = "userId" OR is_claims_admin() );