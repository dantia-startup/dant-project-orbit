import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { roadmapPhases as mockPhases, currentMonth as mockCurrentMonth } from "@/data/mockData";
import { CheckCircle2, Clock, Circle } from "lucide-react";

interface MonthData {
  month_number: number;
  label: string;
  status: "done" | "current" | "future";
  title: string;
  items: string[];
  highlights: string[];
}

interface PhaseData {
  name: string;
  description: string;
  color: "green" | "blue" | "amber";
  start_month: number;
  end_month: number;
  phase_order: number;
}

interface ProjectData {
  client_name: string;
  total_months: number;
}

function getMonthColor(month: number, months: MonthData[]) {
  const m = months.find(mm => mm.month_number === month);
  if (!m) return "bg-primary text-primary-foreground";
  // Color by position ratio
  const ratio = month / months.length;
  if (ratio <= 0.2) return "bg-success text-success-foreground";
  if (ratio <= 0.7) return "bg-primary text-primary-foreground";
  return "bg-warning text-warning-foreground";
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
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [months, setMonths] = useState<MonthData[]>([]);
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("user_id", user?.id || "")
        .maybeSingle();

      if (!profile?.organization_id) {
        setUseMock(true);
        setLoading(false);
        return;
      }

      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .limit(1);

      if (!projects || projects.length === 0) {
        setUseMock(true);
        setLoading(false);
        return;
      }

      const p = projects[0];
      setProject({ client_name: p.client_name, total_months: p.total_months });

      const [mRes, pRes] = await Promise.all([
        supabase.from("project_months").select("*").eq("project_id", p.id).order("month_number"),
        supabase.from("project_phases").select("*").eq("project_id", p.id).order("phase_order"),
      ]);

      const monthsData = (mRes.data || []).map(m => ({
        month_number: m.month_number,
        label: m.label,
        status: m.status as "done" | "current" | "future",
        title: m.title,
        items: (m.items as string[]) || [],
        highlights: (m.highlights as string[]) || [],
      }));

      if (monthsData.length === 0 || monthsData.every(m => !m.title && m.items.length === 0)) {
        setUseMock(true);
        setLoading(false);
        return;
      }

      setMonths(monthsData);
      setPhases((pRes.data || []).map(ph => ({
        name: ph.name,
        description: ph.description,
        color: ph.color as "green" | "blue" | "amber",
        start_month: ph.start_month,
        end_month: ph.end_month,
        phase_order: ph.phase_order,
      })));

      setLoading(false);
    }
    load();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback to mock data
  if (useMock) return <MockRoadmap />;

  // Dynamic roadmap
  const currentMonthNum = months.find(m => m.status === "current")?.month_number || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[hsl(228,55%,12%)] to-[hsl(225,95%,30%)] rounded-xl p-8 text-primary-foreground">
        <h1 className="text-2xl font-bold">
          Roadmap <span className="text-accent">Dante Decision Engine</span>™
        </h1>
        <p className="text-lg font-medium mt-1 text-primary-foreground/80">{project?.total_months} Meses de Implementação</p>
        <div className="flex gap-8 mt-4 text-sm text-primary-foreground/70">
          <div><span className="font-semibold text-primary-foreground/90">Cliente:</span> {project?.client_name}</div>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="flex gap-1">
        {months.map(m => (
          <div
            key={m.month_number}
            className={`flex-1 rounded-md py-2 px-1 text-center transition-all ${getMonthColor(m.month_number, months)} ${m.status === "future" ? "opacity-40" : ""} ${m.status === "current" ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
          >
            <div className="text-xs font-bold">M{m.month_number}</div>
            <div className="text-[10px] leading-tight mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Phases */}
      {phases.map((phase, idx) => {
        const phaseMonths = months.filter(m => m.month_number >= phase.start_month && m.month_number <= phase.end_month);
        const isActive = phaseMonths.some(m => m.status !== "future");
        const isComplete = phaseMonths.every(m => m.status === "done");

        return (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${phaseBadgeColors[phase.color]}`}>
                {idx + 1}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{phase.name}</h2>
                <p className="text-sm text-muted-foreground">Meses {phase.start_month}–{phase.end_month}</p>
              </div>
              {isComplete && <CheckCircle2 className="h-5 w-5 text-success ml-auto" />}
              {isActive && !isComplete && <Clock className="h-5 w-5 text-info ml-auto" />}
            </div>

            {phase.description && <p className="text-sm italic text-muted-foreground pl-12">{phase.description}</p>}

            <div className="grid gap-4 pl-12" style={{ gridTemplateColumns: `repeat(${phaseMonths.length}, minmax(0, 1fr))` }}>
              {phaseMonths.map(month => (
                <div
                  key={month.month_number}
                  className={`rounded-lg border-2 ${phaseColors[phase.color]} bg-card p-5 ${month.status === "future" ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {month.status === "done" ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : month.status === "current" ? (
                      <Clock className="h-4 w-4 text-info shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <h3 className="font-semibold text-sm text-foreground">
                      Mês {month.month_number} — {month.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {month.items.map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-muted-foreground/50 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {month.highlights.map((h, i) => (
                      <li key={`h${i}`} className="text-xs font-medium text-success flex gap-2">
                        <span className="mt-1">●</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Original mock-based roadmap as fallback
function MockRoadmap() {
  const monthLabels = [
    { num: 1, label: "Quick Win" }, { num: 2, label: "Quick Win" },
    { num: 3, label: "Coleta" }, { num: 4, label: "Análise" },
    { num: 5, label: "Análise" }, { num: 6, label: "Prioriz." },
    { num: 7, label: "Preparo" }, { num: 8, label: "Orquestr." },
    { num: 9, label: "Piloto" }, { num: 10, label: "Validação" },
    { num: 11, label: "Expansão" }, { num: 12, label: "Go-Live" },
  ];

  function getMonthColorMock(month: number) {
    if (month <= 2) return "bg-success text-success-foreground";
    if (month <= 8) return "bg-primary text-primary-foreground";
    return "bg-warning text-warning-foreground";
  }

  function getMonthStatus(month: number) {
    if (month < mockCurrentMonth) return "done";
    if (month === mockCurrentMonth) return "current";
    return "future";
  }

  const phaseColorsBorder = { green: "border-success/30", blue: "border-primary/30", amber: "border-warning/30" };
  const phaseBadge = { green: "bg-success/10 text-success", blue: "bg-primary/10 text-primary", amber: "bg-warning/10 text-warning" };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[hsl(228,55%,12%)] to-[hsl(225,95%,30%)] rounded-xl p-8 text-primary-foreground">
        <h1 className="text-2xl font-bold">Roadmap <span className="text-accent">Dante Decision Engine</span>™</h1>
        <p className="text-lg font-medium mt-1 text-primary-foreground/80">12 Meses de Implementação</p>
        <div className="flex gap-8 mt-4 text-sm text-primary-foreground/70">
          <div><span className="font-semibold text-primary-foreground/90">Cliente:</span> Cesgranio — Centro de Seleção e Promoção dos Docentes</div>
          <div><span className="font-semibold text-primary-foreground/90">Data:</span> Março 2025 · Confidencial</div>
        </div>
      </div>

      <div className="flex gap-1">
        {monthLabels.map(m => {
          const status = getMonthStatus(m.num);
          return (
            <div key={m.num} className={`flex-1 rounded-md py-2 px-1 text-center transition-all ${getMonthColorMock(m.num)} ${status === "future" ? "opacity-40" : ""} ${status === "current" ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}>
              <div className="text-xs font-bold">M{m.num}</div>
              <div className="text-[10px] leading-tight mt-0.5">{m.label}</div>
            </div>
          );
        })}
      </div>

      {mockPhases.map(phase => {
        const phaseMonths = phase.milestones.map(m => m.month);
        const isActive = phaseMonths.some(m => m <= mockCurrentMonth);
        const isComplete = phaseMonths.every(m => m < mockCurrentMonth);
        return (
          <div key={phase.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${phaseBadge[phase.color]}`}>{phase.id}</div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{phase.name}</h2>
                <p className="text-sm text-muted-foreground">{phase.months}</p>
              </div>
              {isComplete && <CheckCircle2 className="h-5 w-5 text-success ml-auto" />}
              {isActive && !isComplete && <Clock className="h-5 w-5 text-info ml-auto" />}
            </div>
            <p className="text-sm italic text-muted-foreground pl-12">{phase.description}</p>
            <div className="grid gap-4 pl-12" style={{ gridTemplateColumns: `repeat(${phase.milestones.length}, minmax(0, 1fr))` }}>
              {phase.milestones.map(milestone => {
                const status = getMonthStatus(milestone.month);
                return (
                  <div key={milestone.month} className={`rounded-lg border-2 ${phaseColorsBorder[phase.color]} bg-card p-5 ${status === "future" ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2 mb-3">
                      {status === "done" ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : status === "current" ? <Clock className="h-4 w-4 text-info shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <h3 className="font-semibold text-sm text-foreground">Mês {milestone.month} — {milestone.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {milestone.items.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-muted-foreground/50 mt-1">•</span><span>{item}</span></li>
                      ))}
                      {milestone.highlights?.map((h, i) => (
                        <li key={`h${i}`} className="text-xs font-medium text-success flex gap-2"><span className="mt-1">●</span><span>{h}</span></li>
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
