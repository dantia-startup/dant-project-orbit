import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { useProjectSelection } from "@/hooks/useProjectSelection";
import {
  Calendar, Clock, Users, ChevronRight, ArrowLeft, FileText, ListChecks,
  MessageSquareText, Plus, Pencil, Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Meeting {
  id: string;
  project_id: string;
  title: string;
  meeting_date: string;
  duration: string;
  participants: string[];
  summary: string;
  transcription: string;
  action_items: string[];
  tags: string[];
}

export default function Reunioes() {
  const { isAdmin } = useAuth();
  const { projects, selectedProject, selectedProjectId, setSelectedProjectId, loadingProjects } = useProjectSelection();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Meeting | null>(null);

  // Create/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [fTitle, setFTitle] = useState("");
  const [fDate, setFDate] = useState("");
  const [fDuration, setFDuration] = useState("");
  const [fParticipants, setFParticipants] = useState("");
  const [fSummary, setFSummary] = useState("");
  const [fTranscription, setFTranscription] = useState("");
  const [fActionItems, setFActionItems] = useState("");
  const [fTags, setFTags] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<Meeting | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (loadingProjects) return;
    if (!selectedProject) {
      setMeetings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data } = await supabase
      .from("meetings")
      .select("*")
      .eq("project_id", selectedProject.id)
      .order("meeting_date", { ascending: false });

    setMeetings(
      (data || []).map((m) => ({
        id: m.id,
        project_id: m.project_id,
        title: m.title,
        meeting_date: m.meeting_date,
        duration: m.duration,
        participants: (m.participants as string[]) || [],
        summary: m.summary,
        transcription: m.transcription,
        action_items: (m.action_items as string[]) || [],
        tags: (m.tags as string[]) || [],
      }))
    );
    setLoading(false);
  }, [loadingProjects, selectedProject]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setFTitle(""); setFDate(""); setFDuration("");
    setFParticipants(""); setFSummary(""); setFTranscription("");
    setFActionItems(""); setFTags("");
    setDialogOpen(true);
  }

  function openEdit(m: Meeting) {
    setSelected(null);
    setEditing(m);
    setFTitle(m.title);
    setFDate(m.meeting_date);
    setFDuration(m.duration);
    setFParticipants(m.participants.join(", "));
    setFSummary(m.summary);
    setFTranscription(m.transcription);
    setFActionItems(m.action_items.join("\n"));
    setFTags(m.tags.join(", "));
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!fTitle.trim()) { toast.error("Título é obrigatório"); return; }
    if (!fDate) { toast.error("Data é obrigatória"); return; }
    if (!selectedProjectId) return;

    setSaving(true);
    const payload = {
      project_id: selectedProjectId,
      title: fTitle.trim(),
      meeting_date: fDate,
      duration: fDuration.trim(),
      participants: fParticipants.split(",").map((p) => p.trim()).filter(Boolean),
      summary: fSummary.trim(),
      transcription: fTranscription.trim(),
      action_items: fActionItems.split("\n").map((a) => a.trim()).filter(Boolean),
      tags: fTags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from("meetings").update(payload).eq("id", editing.id);
      if (error) toast.error("Erro ao atualizar reunião");
      else toast.success("Reunião atualizada");
    } else {
      const { error } = await supabase.from("meetings").insert(payload);
      if (error) toast.error("Erro ao criar reunião");
      else toast.success("Reunião criada");
    }
    setSaving(false);
    setDialogOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    const { error } = await supabase.from("meetings").delete().eq("id", deleteConfirm.id);
    if (error) toast.error("Erro ao excluir reunião");
    else {
      toast.success("Reunião excluída");
      if (selected?.id === deleteConfirm.id) setSelected(null);
    }
    setDeleting(false);
    setDeleteConfirm(null);
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>Nenhum projeto encontrado para esta organização.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Reuniões</h1>
          <p className="text-sm text-muted-foreground">Histórico de reuniões do projeto</p>
        </div>
        <div className="flex items-center gap-3">
          <ProjectSwitcher projects={projects} selectedProjectId={selectedProjectId} onChange={setSelectedProjectId} />
        {isAdmin && !selected && (
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nova Reunião
          </Button>
        )}
        </div>
      </div>

      {selected ? (
        <MeetingDetail
          meeting={selected}
          onBack={() => setSelected(null)}
          isAdmin={isAdmin}
          onEdit={() => openEdit(selected)}
          onDelete={() => setDeleteConfirm(selected)}
        />
      ) : meetings.length === 0 ? (
        <div className="bg-card rounded-lg border p-10 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma reunião cadastrada ainda.</p>
          {isAdmin && <p className="text-xs mt-1">Clique em "Nova Reunião" para começar.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="w-full text-left bg-card rounded-lg border p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{m.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(m.meeting_date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                    {m.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {m.duration}
                      </span>
                    )}
                    {m.participants.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {m.participants.length} participantes
                      </span>
                    )}
                  </div>
                  {m.summary && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{m.summary}</p>}
                  {m.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {m.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Reunião" : "Nova Reunião"}</DialogTitle>
            <DialogDescription className="sr-only">
              {editing ? "Edite os campos da reunião" : "Preencha os campos para criar uma reunião"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título *</label>
              <Input value={fTitle} onChange={(e) => setFTitle(e.target.value)} placeholder="Título da reunião" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Data *</label>
                <Input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Duração</label>
                <Input value={fDuration} onChange={(e) => setFDuration(e.target.value)} placeholder="ex: 1h30" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Participantes (separados por vírgula)</label>
              <Input value={fParticipants} onChange={(e) => setFParticipants(e.target.value)} placeholder="ex: Maria Silva, João Souza" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Resumo</label>
              <Textarea value={fSummary} onChange={(e) => setFSummary(e.target.value)} placeholder="Resumo da reunião..." rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Transcrição</label>
              <Textarea value={fTranscription} onChange={(e) => setFTranscription(e.target.value)} placeholder="Transcrição completa..." rows={5} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Itens de ação (um por linha)</label>
              <Textarea value={fActionItems} onChange={(e) => setFActionItems(e.target.value)} placeholder={"Maria: Enviar relatório\nJoão: Agendar próxima reunião"} rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Tags (separadas por vírgula)</label>
              <Input value={fTags} onChange={(e) => setFTags(e.target.value)} placeholder="ex: kick-off, alinhamento" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {editing && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 mr-auto"
                onClick={() => { setDialogOpen(false); setDeleteConfirm(editing); }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir reunião</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>"{deleteConfirm?.title}"</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MeetingDetail({
  meeting, onBack, isAdmin, onEdit, onDelete,
}: {
  meeting: Meeting; onBack: () => void; isAdmin: boolean; onEdit: () => void; onDelete: () => void;
}) {
  const [tab, setTab] = useState<"resumo" | "transcricao" | "acoes">("resumo");

  const tabs = [
    { id: "resumo" as const, label: "Resumo", icon: FileText },
    { id: "transcricao" as const, label: "Transcrição", icon: MessageSquareText },
    { id: "acoes" as const, label: "Ações", icon: ListChecks },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        {isAdmin && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Button>
            <Button size="sm" variant="destructive" className="gap-1.5" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-bold text-foreground">{meeting.title}</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
          {meeting.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {meeting.duration}
            </span>
          )}
        </div>
        {meeting.participants.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">Participantes</p>
            <div className="flex flex-wrap gap-1.5">
              {meeting.participants.map((p) => (
                <Badge key={p} variant="outline" className="text-xs font-normal">{p}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg border p-6">
        {tab === "resumo" && (
          meeting.summary
            ? <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{meeting.summary}</p>
            : <p className="text-sm text-muted-foreground italic">Sem resumo cadastrado.</p>
        )}
        {tab === "transcricao" && (
          meeting.transcription
            ? <pre className="text-sm text-foreground leading-relaxed whitespace-pre-line font-sans">{meeting.transcription}</pre>
            : <p className="text-sm text-muted-foreground italic">Sem transcrição cadastrada.</p>
        )}
        {tab === "acoes" && (
          meeting.action_items.length > 0 ? (
            <ul className="space-y-2">
              {meeting.action_items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground italic">Sem itens de ação cadastrados.</p>
        )}
      </div>
    </div>
  );
}
