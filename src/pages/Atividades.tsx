import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, AlertTriangle, ChevronRight, Plus, GripVertical, Trash2, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";

type TaskPriority = "alta" | "média" | "baixa";
type TaskStatus = "backlog" | "priorizada" | "em_andamento" | "bloqueada" | "aguardando_validacao" | "concluida";

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  due_date: string | null;
  position: number;
}

const kanbanColumns: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "priorizada", label: "Priorizada" },
  { id: "em_andamento", label: "Em Andamento" },
  { id: "bloqueada", label: "Bloqueada" },
  { id: "aguardando_validacao", label: "Aguardando Validação" },
  { id: "concluida", label: "Concluída" },
];

const columnAccent: Record<string, string> = {
  backlog: "border-t-muted-foreground/30",
  priorizada: "border-t-primary",
  em_andamento: "border-t-info",
  bloqueada: "border-t-destructive",
  aguardando_validacao: "border-t-warning",
  concluida: "border-t-success",
};

const priorityStyles: Record<TaskPriority, string> = {
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  média: "bg-warning/10 text-warning border-warning/20",
  baixa: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<TaskStatus, string> = Object.fromEntries(
  kanbanColumns.map((c) => [c.id, c.label])
) as Record<TaskStatus, string>;

export default function Atividades() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moveMenuTask, setMoveMenuTask] = useState<string | null>(null);

  // View dialog
  const [viewTask, setViewTask] = useState<Task | null>(null);

  // Create/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<TaskPriority>("média");
  const [formAssignee, setFormAssignee] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState<TaskStatus>("backlog");
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user?.id || "")
      .maybeSingle();

    if (!profile?.organization_id) {
      setLoading(false);
      return;
    }

    const { data: projects } = await supabase
      .from("projects")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .limit(1);

    if (!projects || projects.length === 0) {
      setLoading(false);
      return;
    }

    const pid = projects[0].id;
    setProjectId(pid);

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", pid)
      .order("position");

    setTasks(
      (data || []).map((t) => ({
        id: t.id,
        project_id: t.project_id,
        title: t.title,
        description: t.description,
        status: t.status as TaskStatus,
        priority: t.priority as TaskPriority,
        assignee: t.assignee,
        tags: (t.tags as string[]) || [],
        due_date: t.due_date,
        position: t.position,
      }))
    );
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openCreateDialog(status: TaskStatus = "backlog") {
    setEditingTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("média");
    setFormAssignee("");
    setFormTags("");
    setFormDueDate("");
    setFormStatus(status);
    setDialogOpen(true);
  }

  function openEditDialog(task: Task) {
    setViewTask(null);
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormPriority(task.priority);
    setFormAssignee(task.assignee);
    setFormTags(task.tags.join(", "));
    setFormDueDate(task.due_date || "");
    setFormStatus(task.status);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (!projectId) return;

    setSaving(true);
    const tags = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      project_id: projectId,
      title: formTitle.trim(),
      description: formDescription.trim(),
      status: formStatus,
      priority: formPriority,
      assignee: formAssignee.trim(),
      tags,
      due_date: formDueDate || null,
    };

    if (editingTask) {
      const { error } = await supabase.from("tasks").update(payload).eq("id", editingTask.id);
      if (error) {
        toast.error("Erro ao atualizar tarefa");
      } else {
        toast.success("Tarefa atualizada");
      }
    } else {
      const colTasks = tasks.filter((t) => t.status === formStatus);
      const { error } = await supabase.from("tasks").insert({
        ...payload,
        position: colTasks.length,
      });
      if (error) {
        toast.error("Erro ao criar tarefa");
      } else {
        toast.success("Tarefa criada");
      }
    }

    setSaving(false);
    setDialogOpen(false);
    loadTasks();
  }

  async function handleDelete() {
    if (!deleteConfirmTask) return;
    setDeleting(true);
    const { error } = await supabase.from("tasks").delete().eq("id", deleteConfirmTask.id);
    if (error) {
      toast.error("Erro ao excluir tarefa");
    } else {
      toast.success("Tarefa excluída");
      if (viewTask?.id === deleteConfirmTask.id) setViewTask(null);
    }
    setDeleting(false);
    setDeleteConfirmTask(null);
    loadTasks();
  }

  async function moveTask(taskId: string, newStatus: TaskStatus) {
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);
    if (error) {
      toast.error("Erro ao mover tarefa");
    } else {
      setMoveMenuTask(null);
      loadTasks();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>Nenhum projeto encontrado para esta organização.</p>
        {isAdmin && <p className="text-sm mt-1">Crie um projeto na Gestão do Roadmap primeiro.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Atividades</h1>
          <p className="text-sm text-muted-foreground">Kanban do projeto</p>
        </div>
        {isAdmin && (
          <Button onClick={() => openCreateDialog()} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        )}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-72">
              <div className={`rounded-lg border border-t-4 ${columnAccent[col.id]} bg-muted/30 p-3 min-h-[calc(100vh-220px)]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-card rounded-lg border p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
                      onClick={() => setViewTask(task)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium text-foreground leading-snug">{task.title}</h4>
                        {isAdmin && (
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5 p-0.5 rounded hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMoveMenuTask(moveMenuTask === task.id ? null : task.id);
                            }}
                          >
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>

                      {isAdmin && moveMenuTask === task.id && (
                        <div className="absolute right-2 top-10 z-10 bg-popover border rounded-md shadow-lg p-1 min-w-[180px]">
                          <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Mover para:</p>
                          {kanbanColumns
                            .filter((c) => c.id !== task.status)
                            .map((c) => (
                              <button
                                key={c.id}
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted flex items-center gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTask(task.id, c.id);
                                }}
                              >
                                <ChevronRight className="h-3 w-3" />
                                {c.label}
                              </button>
                            ))}
                        </div>
                      )}

                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {task.assignee && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span>{task.assignee}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          {task.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.due_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${priorityStyles[task.priority]}`}>
                            {task.priority === "alta" && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <p className="text-xs text-muted-foreground/50 italic text-center py-4">Sem tarefas</p>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => openCreateDialog(col.id)}
                      className="w-full text-xs text-muted-foreground/60 hover:text-muted-foreground py-2 rounded-md border border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Adicionar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Task Dialog */}
      <Dialog open={!!viewTask} onOpenChange={(open) => !open && setViewTask(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{viewTask?.title}</DialogTitle>
            <DialogDescription className="sr-only">Detalhes da tarefa</DialogDescription>
          </DialogHeader>
          {viewTask && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${priorityStyles[viewTask.priority]}`}>
                  {viewTask.priority === "alta" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  Prioridade: {viewTask.priority}
                </span>
                <Badge variant="outline" className="text-xs">{statusLabels[viewTask.status]}</Badge>
              </div>

              {viewTask.description ? (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{viewTask.description}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sem descrição</p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewTask.assignee && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">Responsável</p>
                    <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{viewTask.assignee}</p>
                  </div>
                )}
                {viewTask.due_date && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">Data de entrega</p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(viewTask.due_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>

              {viewTask.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewTask.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEditDialog(viewTask)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1.5"
                    onClick={() => setDeleteConfirmTask(viewTask)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
            <DialogDescription className="sr-only">
              {editingTask ? "Edite os campos da tarefa" : "Preencha os campos para criar uma tarefa"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título *</label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Título da tarefa" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descreva a tarefa..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Prioridade</label>
                <Select value={formPriority} onValueChange={(v) => setFormPriority(v as TaskPriority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as TaskStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {kanbanColumns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Responsável</label>
                <Input value={formAssignee} onChange={(e) => setFormAssignee(e.target.value)} placeholder="Nome" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Data de entrega</label>
                <Input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Tags (separadas por vírgula)</label>
              <Input value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="ex: backend, urgente" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {editingTask && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 mr-auto"
                onClick={() => {
                  setDialogOpen(false);
                  setDeleteConfirmTask(editingTask);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : editingTask ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmTask} onOpenChange={(open) => !open && setDeleteConfirmTask(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>"{deleteConfirmTask?.title}"</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmTask(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
