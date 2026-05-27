import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ProjectOption {
  id: string;
  organization_id: string;
  client_name: string;
  total_months: number;
  project_key: string | null;
  repository_name: string | null;
  repository_url: string | null;
  local_path: string | null;
}

const storageKey = "dantia:selected-project-id";

export function useProjectSelection() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(() =>
    localStorage.getItem(storageKey)
  );
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user?.id || "")
      .maybeSingle();

    if (!profile?.organization_id) {
      setOrganizationId(null);
      setProjects([]);
      setLoadingProjects(false);
      return;
    }

    setOrganizationId(profile.organization_id);

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("client_name");

    const nextProjects = (data || []) as ProjectOption[];
    setProjects(nextProjects);

    const storedId = localStorage.getItem(storageKey);
    if (nextProjects.length > 0 && !nextProjects.some((project) => project.id === storedId)) {
      setSelectedProjectIdState(nextProjects[0].id);
      localStorage.setItem(storageKey, nextProjects[0].id);
    }

    if (nextProjects.length === 0) {
      setSelectedProjectIdState(null);
      localStorage.removeItem(storageKey);
    }

    setLoadingProjects(false);
  }, [user?.id]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const setSelectedProjectId = useCallback((projectId: string) => {
    setSelectedProjectIdState(projectId);
    localStorage.setItem(storageKey, projectId);
  }, []);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || projects[0] || null,
    [projects, selectedProjectId]
  );

  return {
    organizationId,
    projects,
    selectedProject,
    selectedProjectId: selectedProject?.id || null,
    setSelectedProjectId,
    loadingProjects,
    reloadProjects: loadProjects,
  };
}

