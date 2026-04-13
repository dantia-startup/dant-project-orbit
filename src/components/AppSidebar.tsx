import { Map, ListChecks, Video, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import dantiaLogo from "@/assets/dantia-logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const projectItems = [
  { title: "Roadmap", url: "/projeto/roadmap", icon: Map },
  { title: "Atividades", url: "/projeto/atividades", icon: ListChecks },
  { title: "Reuniões", url: "/projeto/reunioes", icon: Video },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isProjectActive = projectItems.some((i) => location.pathname.startsWith(i.url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 pb-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={dantiaLogo} alt="Dant.IA" className="h-7 w-auto brightness-0 invert" />
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <Collapsible defaultOpen={isProjectActive} className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sidebar-muted-foreground text-xs uppercase tracking-wider font-semibold hover:text-sidebar-foreground transition-colors px-3 py-2">
                {!collapsed && <span>Projeto</span>}
                {!collapsed && <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projectItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
