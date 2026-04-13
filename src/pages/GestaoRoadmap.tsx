import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Map, Plus, Pencil, Trash2, CheckCircle2, Clock, Circle, GripVertical, Palette } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  organization_id: string;
  client_name: string;
  total_months: number;
}

interface ProjectMonth {
  id: string;
  project_id: string;
  month_number: number;
  label: string;
  status: "done" | "current" | "future";
  title: string;
  items: string[];
  highlights: string[];
}

interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description: string;
  color: "green" | "blue" | "amber";
  phase_order: number;
  start_month: number;
  end_month: number;
}

const colorOptions = [
  { value: "green", label: "Verde", class: "bg-success" },
  { value: "blue", label: "Azul", class: "bg-primary" },
  { value: "amber", label: "Âmbar", class: "bg-warning" },
];

export default function GestaoRoadmap() {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [months, setMonths] = useState<ProjectMonth[]>([]);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Create project form
  const [createOpen, setCreateOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [totalMonths, setTotalMonths] = useState(12);

  // Edit month
  const [editMonthOpen, setEditMonthOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<ProjectMonth | null>(null);
  const [monthForm, setMonthForm] = useState({ label: "", title: "", status: "future" as string, items: "", highlights: "" });

  // Phase form
  const [phaseOpen, setPhaseOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<ProjectPhase | null>(null);
  const [phaseForm, setPhaseForm] = useState({ name: "", description: "", color: "blue" as string, start_month: 1, end_month: 1, phase_order: 1 });

  const fetchProject = useCallback(async () => {
    // Get user's org
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
      .select("*")
      .eq("organization_id", profile.organization_id)
      .limit(1);

    if (projects && projects.length > 0) {
      const p = projects[0] as Project;
      setProject(p);
      await fetchMonthsAndPhases(p.id);
    }
    setLoading(false);
  }, [user?.id]);

  async function fetchMonthsAndPhases(projectId: string) {
    const [monthsRes, phasesRes] = await Promise.all([
      supabase.from("project_months").select("*").eq("project_id", projectId).order("month_number"),
      supabase.from("project_phases").select("*").eq("project_id", projectId).order("phase_order"),
    ]);
    if (monthsRes.data) setMonths(monthsRes.data.map(m => ({ ...m, items: (m.items as string[]) || [], highlights: (m.highlights as string[]) || [] })) as ProjectMonth[]);
    if (phasesRes.data) setPhases(phasesRes.data as ProjectPhase[]);
  }

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  async function handleCreateProject() {
    if (!clientName.trim() || totalMonths < 1) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user?.id || "")
      .maybeSingle();

    if (!profile?.organization_id) {
      toast.error("Usuário não vinculado a uma organização.");
      return;
    }

    setSaving(true);

    const { data: newProject, error } = await supabase
      .from("projects")
      .insert({ client_name: clientName.trim(), total_months: totalMonths, organization_id: profile.organization_id })
      .select()
      .single();

    if (error || !newProject) {
      toast.error("Erro ao criar projeto: " + (error?.message || ""));
      setSaving(false);
      return;
    }

    // Create months
    const monthInserts = Array.from({ length: totalMonths }, (_, i) => ({
      project_id: newProject.id,
      month_number: i + 1,
      label: `Mês ${i + 1}`,
      status: "future" as const,
      title: "",
      items: [],
      highlights: [],
    }));

    await supabase.from("project_months").insert(monthInserts);

    setProject(newProject as Project);
    await fetchMonthsAndPhases(newProject.id);
    setCreateOpen(false);
    setClientName("");
    setSaving(false);
    toast.success("Projeto criado com sucesso!");
  }

  function openEditMonth(month: ProjectMonth) {
    setEditingMonth(month);
    setMonthForm({
      label: month.label,
      title: month.title,
      status: month.status,
      items: (month.items || []).join("\n"),
      highlights: (month.highlights || []).join("\n"),
    });
    setEditMonthOpen(true);
  }

  async function handleSaveMonth() {
    if (!editingMonth) return;
    if (monthForm.label.length > 15) {
      toast.error("A descrição do mês deve ter no máximo 15 caracteres.");
      return;
    }

    // If setting to current, set all others to done/future
    let extraUpdates: Promise<unknown>[] = [];
    if (monthForm.status === "current") {
      extraUpdates = [
        supabase.from("project_months")
          .update({ status: "done" })
          .eq("project_id", editingMonth.project_id)
          .lt("month_number", editingMonth.month_number)
          .neq("status", "done")
          .then(),
        supabase.from("project_months")
          .update({ status: "future" })
          .eq("project_id", editingMonth.project_id)
          .gt("month_number", editingMonth.month_number)
          .neq("status", "future")
          .then(),
      ];
    }

    setSaving(true);
    const items = monthForm.items.split("\n").map(s => s.trim()).filter(Boolean);
    const highlights = monthForm.highlights.split("\n").map(s => s.trim()).filter(Boolean);

    const { error } = await supabase
      .from("project_months")
      .update({ label: monthForm.label.trim(), title: monthForm.title.trim(), status: monthForm.status, items, highlights })
      .eq("id", editingMonth.id);

    await Promise.all(extraUpdates);

    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success("Mês atualizado!");
      setEditMonthOpen(false);
      await fetchMonthsAndPhases(editingMonth.project_id);
    }
  }

  function openPhaseDialog(phase?: ProjectPhase) {
    if (phase) {
      setEditingPhase(phase);
      setPhaseForm({ name: phase.name, description: phase.description, color: phase.color, start_month: phase.start_month, end_month: phase.end_month, phase_order: phase.phase_order });
    } else {
      setEditingPhase(null);
      setPhaseForm({ name: "", description: "", color: "blue", start_month: 1, end_month: project?.total_months || 12, phase_order: phases.length + 1 });
    }
    setPhaseOpen(true);
  }

  async function handleSavePhase() {
    if (!project) return;
    if (!phaseForm.name.trim()) {
      toast.error("Informe o nome da fase.");
      return;
    }
    setSaving(true);

    if (editingPhase) {
      const { error } = await supabase.from("project_phases").update({
        name: phaseForm.name.trim(),
        description: phaseForm.description.trim(),
        color: phaseForm.color,
        start_month: phaseForm.start_month,
        end_month: phaseForm.end_month,
        phase_order: phaseForm.phase_order,
      }).eq("id", editingPhase.id);
      if (error) toast.error("Erro: " + error.message);
      else toast.success("Fase atualizada!");
    } else {
      const { error } = await supabase.from("project_phases").insert({
        project_id: project.id,
        name: phaseForm.name.trim(),
        description: phaseForm.description.trim(),
        color: phaseForm.color,
        start_month: phaseForm.start_month,
        end_month: phaseForm.end_month,
        phase_order: phaseForm.phase_order,
      });
      if (error) toast.error("Erro: " + error.message);
      else toast.success("Fase criada!");
    }

    setSaving(false);
    setPhaseOpen(false);
    await fetchMonthsAndPhases(project.id);
  }

  async function handleDeletePhase(phaseId: string) {
    if (!project) return;
    setSaving(true);
    await supabase.from("project_phases").delete().eq("id", phaseId);
    setSaving(false);
    toast.success("Fase excluída.");
    await fetchMonthsAndPhases(project.id);
  }

  function getStatusIcon(status: string) {
    if (status === "done") return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === "current") return <Clock className="h-4 w-4 text-info" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // No project — show creation prompt
  if (!project) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Map className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Nenhum projeto cadastrado</h1>
        <p className="text-muted-foreground">Crie um projeto para começar a configurar o Roadmap da organização.</p>
        <Button size="lg" onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Criar Projeto
        </Button>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Projeto</DialogTitle>
              <DialogDescription>Informe os dados iniciais do projeto.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome do Cliente *</Label>
                <Input placeholder="Ex: Cesgranio" value={clientName} onChange={e => setClientName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Duração do Projeto (meses) *</Label>
                <Input type="number" min={1} max={60} value={totalMonths} onChange={e => setTotalMonths(Number(e.target.value))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateProject} disabled={saving || !clientName.trim()}>
                {saving ? "Criando..." : "Criar Projeto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            Gestão do Roadmap
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cliente: <strong>{project.client_name}</strong> · {project.total_months} meses
          </p>
        </div>
      </div>

      <Tabs defaultValue="months" className="space-y-4">
        <TabsList>
          <TabsTrigger value="months">Meses</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
        </TabsList>

        {/* MONTHS TAB */}
        <TabsContent value="months" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure a descrição, o status e os tópicos de cada mês do roadmap. A descrição aparece na barra de timeline (máx. 15 caracteres).
          </p>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Mês</TableHead>
                  <TableHead className="w-[130px]">Label</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]">Tópicos</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {months.map(m => (
                  <TableRow key={m.id} className={m.status === "future" ? "opacity-50" : ""}>
                    <TableCell className="font-bold text-center">M{m.month_number}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">{m.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{m.title || <span className="text-muted-foreground italic">Sem título</span>}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(m.status)}
                        <span className="text-xs capitalize">{m.status === "done" ? "Concluído" : m.status === "current" ? "Atual" : "Futuro"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{(m.items?.length || 0) + (m.highlights?.length || 0)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEditMonth(m)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* PHASES TAB */}
        <TabsContent value="phases" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Defina as fases do projeto. Cada fase agrupa um intervalo de meses.
            </p>
            <Button size="sm" className="gap-1.5" onClick={() => openPhaseDialog()}>
              <Plus className="h-4 w-4" /> Nova Fase
            </Button>
          </div>

          {phases.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhuma fase cadastrada. Clique em "Nova Fase" para começar.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {phases.map(phase => (
                <Card key={phase.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${phase.color === "green" ? "bg-success" : phase.color === "amber" ? "bg-warning" : "bg-primary"}`} />
                        <CardTitle className="text-base">{phase.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Meses {phase.start_month}–{phase.end_month}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openPhaseDialog(phase)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePhase(phase.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {phase.description && <CardDescription className="pl-6">{phase.description}</CardDescription>}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Month Dialog */}
      <Dialog open={editMonthOpen} onOpenChange={setEditMonthOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Mês {editingMonth?.month_number}</DialogTitle>
            <DialogDescription>Configure as informações deste mês do roadmap.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Label da Timeline (máx. 15 caracteres)</Label>
              <Input
                maxLength={15}
                placeholder="Ex: Quick Win"
                value={monthForm.label}
                onChange={e => setMonthForm({ ...monthForm, label: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{monthForm.label.length}/15 caracteres</p>
            </div>
            <div className="space-y-2">
              <Label>Título do Mês</Label>
              <Input
                placeholder="Ex: Kick-off + Primeiros Resultados"
                value={monthForm.title}
                onChange={e => setMonthForm({ ...monthForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={monthForm.status} onValueChange={v => setMonthForm({ ...monthForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="done">✅ Concluído</SelectItem>
                  <SelectItem value="current">🕐 Atual</SelectItem>
                  <SelectItem value="future">⏳ Futuro</SelectItem>
                </SelectContent>
              </Select>
              {monthForm.status === "current" && (
                <p className="text-xs text-info">Definir como atual marcará os meses anteriores como concluídos e os posteriores como futuros.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tópicos (um por linha)</Label>
              <Textarea
                rows={5}
                placeholder={"Workshop de alinhamento\nMapeamento de processos\nDefinição de KPIs"}
                value={monthForm.items}
                onChange={e => setMonthForm({ ...monthForm, items: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Destaques (um por linha, opcional)</Label>
              <Textarea
                rows={3}
                placeholder="Quick Win: Varredura automatizada de editais"
                value={monthForm.highlights}
                onChange={e => setMonthForm({ ...monthForm, highlights: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMonthOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveMonth} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phase Dialog */}
      <Dialog open={phaseOpen} onOpenChange={setPhaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPhase ? "Editar Fase" : "Nova Fase"}</DialogTitle>
            <DialogDescription>Defina o agrupamento de meses em uma fase.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da Fase *</Label>
              <Input placeholder="Ex: Quick Wins & Alinhamento" value={phaseForm.name} onChange={e => setPhaseForm({ ...phaseForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input placeholder="Breve descrição da fase" value={phaseForm.description} onChange={e => setPhaseForm({ ...phaseForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Cor</Label>
                <Select value={phaseForm.color} onValueChange={v => setPhaseForm({ ...phaseForm, color: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${c.class}`} />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mês Início</Label>
                <Input type="number" min={1} max={project.total_months} value={phaseForm.start_month} onChange={e => setPhaseForm({ ...phaseForm, start_month: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Mês Fim</Label>
                <Input type="number" min={1} max={project.total_months} value={phaseForm.end_month} onChange={e => setPhaseForm({ ...phaseForm, end_month: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" min={1} value={phaseForm.phase_order} onChange={e => setPhaseForm({ ...phaseForm, phase_order: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhaseOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePhase} disabled={saving || !phaseForm.name.trim()}>
              {saving ? "Salvando..." : editingPhase ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
