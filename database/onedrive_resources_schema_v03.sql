-- ======================================
-- StudyHub OneDrive Resource Library v0.3 Schema Draft
-- For later Supabase setup
-- ======================================

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  resource_type text not null,
  subject text,
  author text,
  edition_or_week text,
  file_name text,
  file_size text,
  local_location text,
  onedrive_link text,
  onedrive_file_id text,
  status text default 'not_linked',
  index_status text default 'not_indexed',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists resource_tags (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  tag text not null,
  created_at timestamptz default now()
);

create table if not exists resource_chapters (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  title text not null,
  sort_order int,
  notes text,
  created_at timestamptz default now()
);

-- Future AI indexing tables:
-- resource_chunks: extracted page/chapter chunks from PDFs/slides
-- resource_embeddings: vector embeddings for semantic search

-- Important:
-- Do not upload copyrighted textbooks or lecture files to public GitHub.
-- Store big files in OneDrive and store only metadata/links in StudyHub.
