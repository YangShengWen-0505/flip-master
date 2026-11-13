-- Execute in Supabase SQL editor. Create teacher/student Auth accounts in the dashboard.
create table public.teachers (id uuid primary key references auth.users(id));
alter table public.teachers enable row level security;
create table public.attempts (
 id uuid primary key,
 student_id uuid not null references auth.users(id),
 teacher_id uuid not null references public.teachers(id),
 payload jsonb not null,
 updated_at timestamptz not null default now()
);
alter table public.attempts enable row level security;
create policy student_read on public.attempts for select to authenticated using (student_id = auth.uid());
create policy teacher_read on public.attempts for select to authenticated using (teacher_id = auth.uid());
create policy student_insert on public.attempts for insert to authenticated with check (student_id = auth.uid());
create policy student_update on public.attempts for update to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
-- Only the administrator can designate teachers, using the SQL editor:
-- insert into public.teachers (id) values ('teacher-auth-user-uuid');
