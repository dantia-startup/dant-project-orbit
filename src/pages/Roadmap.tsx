import { roadmapPhases, currentMonth } from "@/data/mockData";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const monthLabels = [
  { num: 1, label: "Quick Win" },
  { num: 2, label: "Quick Win" },
  { num: 3, label: "Coleta" },
  { num: 4, label: "Análise" },
  { num: 5, label: "Análise" },
  { num: 6, label: "Prioriz." },
  { num: 7, label: "Preparo" },
  { num: 8, label: "Orquestr." },
  { num: 9, label: "Piloto" },
  { num: 10, label: "Validação" },
  { num: 11, label: "Expansão" },
  { num: 12, label: "Go-Live" },
];

function getMonthColor(month: number) {
  if (month <= 2) return "bg-success text-success-foreground";
  if (month <= 8) return "bg-primary text-primary-foreground";
  return "bg-warning text-warning-foreground";
}

function getMonthStatus(month: number) {
  if (month < currentMonth) return "done";
  if (month === currentMonth) return "current";
  return "future";
}

const phaseColors = {
  green: "border-success/30",
  blue: "border-primary/30",
  amber: "border-warning/30",
};

const phaseBadgeColors = {
  green: "bg-success/10 text-success",
  blue: "bg-primary/10 text-primary",
  amber: "bg-warning/10 text-warning",
};

export default function Roadmap() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(228,55%,12%)] to-[hsl(225,95%,30%)] rounded-xl p-8 text-primary-foreground">
        <h1 className="text-2xl font-bold">
          Roadmap <span className="text-accent">Dante Decision Engine</span>™
        </h1>
        <p className="text-lg font-medium mt-1 text-primary-foreground/80">12 Meses de Implementação</p>
        <div className="flex gap-8 mt-4 text-sm text-primary-foreground/70">
          <div><span className="font-semibold text-primary-foreground/90">Cliente:</span> Cesgranio — Centro de Seleção e Promoção dos Docentes</div>
          <div><span className="font-semibold text-primary-foreground/90">Data:</span> Março 2025 · Confidencial</div>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="flex gap-1">
        {monthLabels.map((m) => {
          const status = getMonthStatus(m.num);
          return (
            <div
              key={m.num}
              className={`flex-1 rounded-md py-2 px-1 text-center transition-all ${getMonthColor(m.num)} ${status === "future" ? "opacity-40" : ""} ${status === "current" ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
            >
              <div className="text-xs font-bold">M{m.num}</div>
              <div className="text-[10px] leading-tight mt-0.5">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Phases */}
      {roadmapPhases.map((phase) => {
        const phaseMonths = phase.milestones.map((m) => m.month);
        const isActive = phaseMonths.some((m) => m <= currentMonth);
        const isComplete = phaseMonths.every((m) => m < currentMonth);

        return (
          <div key={phase.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${phaseBadgeColors[phase.color]}`}>
                {phase.id}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{phase.name}</h2>
                <p className="text-sm text-muted-foreground">{phase.months}</p>
              </div>
              {isComplete && <CheckCircle2 className="h-5 w-5 text-success ml-auto" />}
              {isActive && !isComplete && <Clock className="h-5 w-5 text-info ml-auto" />}
            </div>

            <p className="text-sm italic text-muted-foreground pl-12">{phase.description}</p>

            <div className={`grid gap-4 pl-12`} style={{ gridTemplateColumns: `repeat(${phase.milestones.length}, minmax(0, 1fr))` }}>
              {phase.milestones.map((milestone) => {
                const status = getMonthStatus(milestone.month);
                return (
                  <div
                    key={milestone.month}
                    className={`rounded-lg border-2 ${phaseColors[phase.color]} bg-card p-5 ${status === "future" ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {status === "done" ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      ) : status === "current" ? (
                        <Clock className="h-4 w-4 text-info shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <h3 className="font-semibold text-sm text-foreground">
                        Mês {milestone.month} — {milestone.title}
                      </h3>
                    </div>
                    <ul className="space-y-1.5">
                      {milestone.items.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-muted-foreground/50 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {milestone.highlights?.map((h, i) => (
                        <li key={`h${i}`} className="text-xs font-medium text-success flex gap-2">
                          <span className="mt-1">●</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
