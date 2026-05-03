# Admin Panel Plan (Phase 2)

## Scope
- Blog CRUD
- Service CRUD
- SEO fields management (`meta_title`, `meta_description`, `slug`)
- Basic publish workflow (`draft`, `published`)

## Data Models

### Blog
- `id` (string)
- `slug` (string, unique)
- `title` (string)
- `excerpt` (string)
- `content` (rich text)
- `image` (string)
- `meta_title` (string)
- `meta_description` (string)
- `status` (`draft` | `published`)
- `published_at` (datetime)
- `updated_at` (datetime)

### Service
- `id` (string)
- `slug` (string, unique)
- `name` (string)
- `category` (`reconstructive` | `cosmetic`)
- `summary` (string)
- `content` (rich text)
- `key_points` (string[])
- `faq` ({`question`, `answer`}[])
- `image` (string)
- `meta_title` (string)
- `meta_description` (string)
- `status` (`draft` | `published`)
- `updated_at` (datetime)

## Recommended API Endpoints

### Blogs
- `GET /api/admin/blogs`
- `GET /api/admin/blogs/:id`
- `POST /api/admin/blogs`
- `PUT /api/admin/blogs/:id`
- `DELETE /api/admin/blogs/:id`

### Services
- `GET /api/admin/services`
- `GET /api/admin/services/:id`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

### Utilities
- `POST /api/admin/media/upload`
- `GET /api/admin/seo/slug-check?slug=...`

## Suggested Implementation Options
- Custom admin in Next.js (`/admin`) with role-based auth and Prisma.
- Headless CMS option: Strapi or Sanity if non-developers will publish frequently.
- If migration speed is critical: start with custom admin APIs + minimal dashboard, then evolve to richer editorial workflow.

## Validation Rules
- Slugs must be lowercase, URL-safe, and unique.
- `meta_title` max 60 characters.
- `meta_description` max 160 characters.
- Reject publish when required SEO fields are missing.

## Migration Notes
- Keep existing slugs unchanged.
- Maintain stable IDs during migration for easier rollback.
- Preserve historical publish dates for blog credibility and schema accuracy.