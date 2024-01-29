create table
  public.movement_results (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    "userId" uuid,
    date date not null,
    "isPrivate" boolean not null,
    "movementId" uuid not null,
	"resultType" character varying not null,
    "resultValue" numeric not null,
    fb_old_user_id text null,
    constraint movement_results_pkey primary key (id),
    constraint movement_results_userId_fkey foreign key ("userId") references public.profiles (id) on update cascade on delete cascade,
    constraint movement_results_movementId_fkey foreign key ("movementId") references movements (id) on update cascade on delete cascade
  );

alter table public.movement_results enable row level security;

create policy "Movements are viewable by everyone."
  on movement_results for select
  using (auth.uid() IS NOT NULL AND (auth.uid() = "userId" OR "isPrivate" = false));

create policy "Only admins and user can add its own Movements results"
  on movement_results for insert
  with check ( auth.uid() = "userId" OR is_claims_admin() );

create policy "Only admins and user can update its own Movements results"
  on movement_results for update
  using (  auth.uid() = "userId" OR is_claims_admin() );

CREATE VIEW highest_movement_results AS SELECT
  DISTINCT ON ("movementId") "movementId",
  "userId",
  "date",
  "resultType",
  "resultValue"
FROM public.movement_results
WHERE "userId" IS NOT NULL
ORDER BY "movementId",
  CASE WHEN "resultType" = 'time' THEN "resultValue" END ASC,
  CASE WHEN "resultType" <> 'time' THEN "resultValue" END DESC;

create function public.COUNT_MOVEMENTS()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
	IF (TG_OP = 'INSERT') then
  
    UPDATE public.movements
    SET "countResults" = (SELECT count(*) FROM public.movement_results WHERE "movementId" = new."movementId") 
    WHERE id = new."movementId";
    
  else
  
  	UPDATE public.movements
    SET "countResults" = (SELECT count(*) FROM public.movement_results WHERE "movementId" = old."movementId") 
    WHERE id = old."movementId";
    
  end if;
  
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger ON_ADD_NEW_MOVEMENT_RESULT
  after insert OR delete on public.movement_results
  for each row execute procedure public.COUNT_MOVEMENTS();