import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Roadmap from "@/pages/Roadmap";
import Atividades from "@/pages/Atividades";
import Reunioes from "@/pages/Reunioes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/projeto/roadmap" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/projeto/roadmap" element={<Roadmap />} />
            <Route path="/projeto/atividades" element={<Atividades />} />
            <Route path="/projeto/reunioes" element={<Reunioes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
