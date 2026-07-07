-- ======================================
-- StudyHub Database Schema (Draft v1)
-- ======================================

create table libraries (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    created_at timestamptz default now()
);

create table resources (
    id uuid primary key default gen_random_uuid(),
    library_id uuid references libraries(id),
    resource_type text not null, -- textbook, lecture_slides, pdf, image
    title text not null,
    edition text,
    author text,
    created_at timestamptz default now()
);

create table chapters (
    id uuid primary key default gen_random_uuid(),
    resource_id uuid references resources(id),
    chapter_number text,
    title text not null,
    created_at timestamptz default now()
);

create table topics (
    id uuid primary key default gen_random_uuid(),
    chapter_id uuid references chapters(id),
    parent_topic_id uuid references topics(id),
    title text not null
);

create table notes (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    body text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table study_maps (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    map_mode text default 'checklist', -- checklist, concept, both
    description text
);

create table remediation (
    id uuid primary key default gen_random_uuid(),
    source text,
    topic text,
    correct_answer text,
    why_missed text,
    status text default 'Needs Review'
);

create table tags (
    id uuid primary key default gen_random_uuid(),
    name text unique not null
);

create table links (
    id uuid primary key default gen_random_uuid(),
    from_type text,
    from_id uuid,
    to_type text,
    to_id uuid,
    relationship text
);

-- Notes are linked through the links table.
-- This keeps one source of truth while allowing
-- notes to appear in chapters, study maps,
-- remediation, and search results.
