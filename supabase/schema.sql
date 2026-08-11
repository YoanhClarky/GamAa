create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null,
  player_name text not null,
  score integer not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists scores_game_slug_score_idx
  on public.scores (game_slug, score desc);

alter table public.scores enable row level security;

grant select, insert on public.scores to anon, authenticated;

create policy "Lecture publique des scores"
  on public.scores for select
  using (true);

create policy "Ajout d'un score anonyme ou personnel"
  on public.scores for insert
  with check (user_id is null or auth.uid() = user_id);

-- Volontairement aucune règle UPDATE / DELETE : personne ne peut modifier
-- ou supprimer un score via l'API publique, ni le sien ni celui des autres.
