create function public.handle_social_login_fb_user_migration()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  IF (new.raw_user_meta_data->'fbuid' IS NULL) THEN return new; END IF;
  IF (old.raw_user_meta_data->'fbuid' IS NOT NULL) THEN return new; END IF;

  UPDATE public.movement_results SET "userId" = new.id, fb_old_user_id = NULL WHERE fb_old_user_id = new.raw_user_meta_data->>'fbuid';
  UPDATE public.workout_results SET "userId" = new.id, fb_old_user_id = NULL WHERE fb_old_user_id = new.raw_user_meta_data->>'fbuid';
  
  return new;
end;
$$;

-- trigger the function every time a user is updated
create trigger on_auth_user_created_migration_social_login
  after UPDATE on auth.users
  for each row execute procedure public.handle_social_login_fb_user_migration();