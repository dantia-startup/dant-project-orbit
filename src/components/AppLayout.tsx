import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/projeto/roadmap": "Roadmap",
  "/projeto/atividades": "Atividades",
  "/projeto/reunioes": "Reuniões",
  "/administrador": "Administrador",
};

export function AppLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Projeto";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-4">
              <span className="text-sm font-medium text-foreground">{pageTitle}</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}