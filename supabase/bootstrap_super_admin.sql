insert into public.user_roles (user_id, role)
select id, 'super_admin' from public.profiles where username = 'aspas'
on conflict (user_id) do update set role = 'super_admin';
