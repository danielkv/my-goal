CREATE VIEW public.profiles AS 
SELECT
  users.id,
  users.email,
  users.phone,
  users.last_sign_in_at,
  users.created_at,
  (users.raw_user_meta_data -> 'displayName') #>> '{}' as "displayName",
  (users.raw_user_meta_data -> 'photoURL') #>> '{}' as "photoUrl"
FROM
  auth.users
WHERE
  users.deleted_at IS NULL;

-- create table public.profiles (
--   id uuid not null references auth.users on delete cascade,
--   "displayName" varchar,
--   email varchar,
--   "photoUrl" text,
--   phone varchar,
--   primary key (id)
-- );

-- alter table public.profiles enable row level security;

-- create policy "Public profiles are viewable by everyone."
--   on profiles for select
--   using ( true );

-- create policy "Users can insert their own profile."
--   on profiles for insert
--   with check ( auth.uid() = id OR is_claims_admin() );

-- create policy "Users can update own profile."
--   on profiles for update
--   using ( auth.uid() = id OR is_claims_admin() );


-- create function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = public
-- as $$
-- begin
--   insert into public.profiles (id, "displayName", email, "photoUrl", phone)
--   values (new.id, new.raw_user_meta_data->>'displayName', new.email, new.raw_user_meta_data->>'photoUrl', new.phone);
  
--   return new;
-- end;
-- $$;

-- -- trigger the function every time a user is created
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- create function public.handle_update_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = public
-- as $$
-- begin
--   UPDATE public.profiles SET "displayName" = new.raw_user_meta_data->>'displayName', email = new.email, "photoUrl" = new.raw_user_meta_data->>'photoUrl', phone = new.phone
--   WHERE id = old.id;

--   return new;
-- end;
-- $$;

-- -- trigger the function every time a user is created
-- create trigger on_auth_user_updated
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();