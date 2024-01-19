create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  displayName varchar,
  email varchar,
  photoUrl text,
  phone varchar,

  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id OR is_claims_admin() );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id OR is_claims_admin() );