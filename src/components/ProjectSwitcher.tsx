import { FolderGit2, Github } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProjectOption } from "@/hooks/useProjectSelection";

interface ProjectSwitcherProps {
  projects: ProjectOption[];
  selectedProjectId: string | null;
  onChange: (projectId: string) => void;
  label?: string;
}

export function ProjectSwitcher({ projects, selectedProjectId, onChange, label = "Projeto" }: ProjectSwitcherProps) {
  if (projects.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={selectedProjectId || undefined} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-[240px]">
          <SelectValue placeholder="Selecionar projeto" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <span className="flex items-center gap-2">
                {project.repository_name ? <Github className="h-3.5 w-3.5" /> : <FolderGit2 className="h-3.5 w-3.5" />}
                <span>{project.client_name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

