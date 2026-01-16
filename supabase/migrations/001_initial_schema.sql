-- art portfolio cms initial schema
-- creates tables for sections, artworks, gallery items, site settings, and inquiries

-- =============================================================================
-- trigger function for auto-updating updated_at timestamps
-- =============================================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- sections table
-- represents portfolio sections (galleries, pages) with physical book mapping
-- =============================================================================

create table sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  physical_page_start int not null,
  display_order int not null,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_sections_slug on sections(slug);
create index idx_sections_display_order on sections(display_order);
create index idx_sections_is_visible on sections(is_visible);

create trigger sections_updated_at
  before update on sections
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- artworks table
-- stores individual artwork metadata and media references
-- =============================================================================

create table artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  long_description text,
  media_type text not null check (media_type in ('image', 'video')),
  cloudinary_public_id text,
  cloudinary_url text,
  thumbnail_url text,
  external_url text,
  materials text,
  dimensions text,
  year_created int,
  is_for_sale boolean default false,
  shop_url text,
  price_range text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_artworks_media_type on artworks(media_type);
create index idx_artworks_is_for_sale on artworks(is_for_sale);
create index idx_artworks_year_created on artworks(year_created);

create trigger artworks_updated_at
  before update on artworks
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- gallery_items table
-- junction table linking artworks to sections with display ordering
-- =============================================================================

create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references sections(id) on delete cascade,
  artwork_id uuid not null references artworks(id) on delete cascade,
  display_order int not null default 0,
  created_at timestamptz default now(),
  constraint unique_section_artwork unique (section_id, artwork_id)
);

create index idx_gallery_items_section_id on gallery_items(section_id);
create index idx_gallery_items_artwork_id on gallery_items(artwork_id);
create index idx_gallery_items_display_order on gallery_items(display_order);

-- =============================================================================
-- site_settings table
-- key-value store for configurable site settings
-- =============================================================================

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create trigger site_settings_updated_at
  before update on site_settings
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- inquiries table
-- stores contact form submissions and purchase/commission inquiries
-- =============================================================================

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  inquiry_type text not null check (inquiry_type in ('commission', 'purchase', 'general')),
  artwork_id uuid references artworks(id) on delete set null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'responded', 'archived')),
  created_at timestamptz default now()
);

create index idx_inquiries_email on inquiries(email);
create index idx_inquiries_inquiry_type on inquiries(inquiry_type);
create index idx_inquiries_artwork_id on inquiries(artwork_id);
create index idx_inquiries_status on inquiries(status);
create index idx_inquiries_created_at on inquiries(created_at desc);

-- =============================================================================
-- row level security policies
-- =============================================================================

-- enable rls on all tables
alter table sections enable row level security;
alter table artworks enable row level security;
alter table gallery_items enable row level security;
alter table site_settings enable row level security;
alter table inquiries enable row level security;

-- sections policies
create policy "sections_public_read"
  on sections for select
  to anon, authenticated
  using (true);

create policy "sections_authenticated_insert"
  on sections for insert
  to authenticated
  with check (true);

create policy "sections_authenticated_update"
  on sections for update
  to authenticated
  using (true)
  with check (true);

create policy "sections_authenticated_delete"
  on sections for delete
  to authenticated
  using (true);

-- artworks policies
create policy "artworks_public_read"
  on artworks for select
  to anon, authenticated
  using (true);

create policy "artworks_authenticated_insert"
  on artworks for insert
  to authenticated
  with check (true);

create policy "artworks_authenticated_update"
  on artworks for update
  to authenticated
  using (true)
  with check (true);

create policy "artworks_authenticated_delete"
  on artworks for delete
  to authenticated
  using (true);

-- gallery_items policies
create policy "gallery_items_public_read"
  on gallery_items for select
  to anon, authenticated
  using (true);

create policy "gallery_items_authenticated_insert"
  on gallery_items for insert
  to authenticated
  with check (true);

create policy "gallery_items_authenticated_update"
  on gallery_items for update
  to authenticated
  using (true)
  with check (true);

create policy "gallery_items_authenticated_delete"
  on gallery_items for delete
  to authenticated
  using (true);

-- site_settings policies
create policy "site_settings_public_read"
  on site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_authenticated_insert"
  on site_settings for insert
  to authenticated
  with check (true);

create policy "site_settings_authenticated_update"
  on site_settings for update
  to authenticated
  using (true)
  with check (true);

create policy "site_settings_authenticated_delete"
  on site_settings for delete
  to authenticated
  using (true);

-- inquiries policies (no public read for privacy)
create policy "inquiries_authenticated_read"
  on inquiries for select
  to authenticated
  using (true);

create policy "inquiries_public_insert"
  on inquiries for insert
  to anon, authenticated
  with check (true);

create policy "inquiries_authenticated_update"
  on inquiries for update
  to authenticated
  using (true)
  with check (true);

create policy "inquiries_authenticated_delete"
  on inquiries for delete
  to authenticated
  using (true);

-- =============================================================================
-- seed default site settings
-- =============================================================================

insert into site_settings (key, value) values
  ('site_title', '"Christina Shi Art Portfolio"'),
  ('site_description', '"3D artist portfolio showcasing digital and traditional artwork"'),
  ('contact_email', '"contact@example.com"'),
  ('social_links', '{"instagram": "", "twitter": "", "artstation": "", "linkedin": ""}'),
  ('theme', '{"primary_color": "#9c27b0", "secondary_color": "#e91e63"}');
