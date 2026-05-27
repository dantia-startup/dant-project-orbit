ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_key TEXT,
  ADD COLUMN IF NOT EXISTS repository_name TEXT,
  ADD COLUMN IF NOT EXISTS repository_url TEXT,
  ADD COLUMN IF NOT EXISTS local_path TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS projects_organization_project_key_unique
  ON public.projects (organization_id, project_key)
  WHERE project_key IS NOT NULL;

