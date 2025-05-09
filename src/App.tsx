
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import SalesTable from "./pages/SalesManagement";
import ServiceEngineer from "./pages/ServiceEngineer";
import ServiceEngineerManagement from "./pages/ServiceEngineer";


const queryClient = new QueryClient();

const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          <Route path="/users" element={
            <AppLayout>
              <UserManagement />
            </AppLayout>
          } />
          <Route path="/sales" element={
            <AppLayout>
              <SalesTable/>
            </AppLayout>
          } />
          <Route path="/service" element={
            <AppLayout>
              <ServiceEngineerManagement />
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

);

export default App;
