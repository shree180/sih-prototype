-- ============================================================================
-- 0005_profiles_trigger.sql — auto-create a profile row on signup
-- Keeps auth.users and public.profiles in 1:1 sync. Default role = citizen;
-- an authority/admin can be provisioned by passing role in user metadata
-- (used by the demo seed script) or updated later by an admin.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'citizen');
begin
  insert into public.profiles (user_id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    case when v_role in ('citizen','volunteer','authority','analyst','admin')
      then v_role else 'citizen' end
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper for admins: create a staff profile/user pair (future admin UI).
create or replace function public.set_user_role(p_user_id uuid, p_role text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set role = p_role
  where user_id = p_user_id
    and p_role in ('citizen','volunteer','authority','analyst','admin');
$$;
