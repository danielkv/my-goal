create function public.handle_fb_user_migration()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  IF (new.raw_user_meta_data->'fbuid' IS NULL) THEN return new; END IF;

  UPDATE public.movement_results SET "userId" = new.id, fb_old_user_id = NULL WHERE fb_old_user_id = new.raw_user_meta_data->>'fbuid';
  UPDATE public.workout_results SET "userId" = new.id, fb_old_user_id = NULL WHERE fb_old_user_id = new.raw_user_meta_data->>'fbuid';
  
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created_migration
  after insert on auth.users
  for each row execute procedure public.handle_fb_user_migration();