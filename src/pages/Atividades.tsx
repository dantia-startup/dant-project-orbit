import { kanbanColumns, kanbanTasks, type KanbanTask } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertTriangle, ChevronRight } from "lucide-react";

const priorityStyles = {
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  média: "bg-warning/10 text-warning border-warning/20",
  baixa: "bg-muted text-muted-foreground border-border",
};

const columnAccent: Record<string, string> = {
  backlog: "border-t-muted-foreground/30",
  priorizada: "border-t-primary",
  em_andamento: "border-t-info",
  bloqueada: "border-t-destructive",
  aguardando_validacao: "border-t-warning",
  concluida: "border-t-success",
};

function TaskCard({ task }: { task: KanbanTask }) {
  return (
    <div className="bg-card rounded-lg border p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-foreground leading-snug">{task.title}</h4>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
      </div>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </span>
          )}
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${priorityStyles[task.priority]}`}>
            {task.priority === "alta" && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Atividades() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Atividades</h1>
        <p className="text-sm text-muted-foreground">Kanban do projeto Dante Decision Engine™</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((col) => {
          const tasks = kanbanTasks[col.id];
          return (
            <div key={col.id} className="flex-shrink-0 w-72">
              <div className={`rounded-lg border border-t-4 ${columnAccent[col.id]} bg-muted/30 p-3 min-h-[calc(100vh-220px)]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
