import { useState } from "react";
import { meetings, type Meeting } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ChevronRight, ArrowLeft, FileText, ListChecks, MessageSquareText } from "lucide-react";

function MeetingList({ onSelect }: { onSelect: (m: Meeting) => void }) {
  return (
    <div className="space-y-3">
      {meetings.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className="w-full text-left bg-card rounded-lg border p-5 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{m.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(m.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {m.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {m.participants.length} participantes
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{m.summary}</p>
              <div className="flex gap-1.5 mt-2">
                {m.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{tag}</Badge>
                ))}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
          </div>
        </button>
      ))}
    </div>
  );
}

function MeetingDetail({ meeting, onBack }: { meeting: Meeting; onBack: () => void }) {
  const [tab, setTab] = useState<"resumo" | "transcricao" | "acoes">("resumo");

  const tabs = [
    { id: "resumo" as const, label: "Resumo", icon: FileText },
    { id: "transcricao" as const, label: "Transcrição", icon: MessageSquareText },
    { id: "acoes" as const, label: "Ações", icon: ListChecks },
  ];

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-bold text-foreground">{meeting.title}</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(meeting.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {meeting.duration}
          </span>
        </div>
        <div className="mt-3">
          <p className="text-xs text-muted-foreground font-medium mb-1">Participantes</p>
          <div className="flex flex-wrap gap-1.5">
            {meeting.participants.map((p) => (
              <Badge key={p} variant="outline" className="text-xs font-normal">{p}</Badge>
            ))}
          </div>
        </div>
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
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{meeting.summary}</p>
        )}
        {tab === "transcricao" && (
          <pre className="text-sm text-foreground leading-relaxed whitespace-pre-line font-sans">{meeting.transcription}</pre>
        )}
        {tab === "acoes" && (
          <ul className="space-y-2">
            {meeting.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Reunioes() {
  const [selected, setSelected] = useState<Meeting | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Reuniões</h1>
        <p className="text-sm text-muted-foreground">Histórico de reuniões do projeto</p>
      </div>

      {selected ? (
        <MeetingDetail meeting={selected} onBack={() => setSelected(null)} />
      ) : (
        <MeetingList onSelect={setSelected} />
      )}
    </div>
  );
}
