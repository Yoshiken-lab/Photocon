-- 1. Create table if not exists (テーブルが存在しない場合のみ作成)
create table if not exists public.system_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Insert initial data (データが存在しない場合のみ挿入、既にキーがあれば何もしない)
insert into public.system_settings (key, value, description)
values ('is_auth_enabled', 'true', 'ログイン必須モードの有効フラグ')
on conflict (key) do nothing;

-- 3. Enable RLS (RLS有効化)
alter table public.system_settings enable row level security;

-- 4. Create Policy safely (ポリシーが既にあるか確認して作成)
do $$
begin
  if not exists (
    select from pg_policies where tablename = 'system_settings' and policyname = 'Allow public read access'
  ) then
    create policy "Allow public read access" on public.system_settings for select using (true);
  end if;
end
$$;

-- Allow only admins (service_role) or potential admin users to update
-- For simplicity in this app context where we use security by obscurity for admin:
-- We allow update if the user has access to the admin interface (which is currently open).
-- However, for better security practice, we should restrict this if possible.
-- Given the current "Security by Obscurity" design for admin, we will allow anon updates 
-- BUT this is risky. Ideally, we should restrict to authenticated users if we had admin headers.
-- Since the user explicitly removed auth for admin, we must allow anon writes OR 
-- use the service_role key in server actions to bypass RLS.
-- We will use service_role in server actions, so we don't strictly need an anon policy for update.
-- But we do need read access for the middleware (which uses service_role mostly, but good to have).

-- Policy for Service Role (Full Access) is implicit.
