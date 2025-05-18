
import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";

import Index from "./pages/Index";

import ProductManagement from "./pages/ProductManagement";

import CompanyManagement from "./pages/CompanyManagement";

import EmployeeManagement from "./pages/EmployeeManagement";

import ClientMaster from "./pages/ClientMaster";

import Quotation from "./pages/Quotation";

import NotFound from "./pages/NotFound";

import TenderManagement from "./pages/TenderManagement";

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
          <Route path="/products" element={
            <AppLayout>
              <ProductManagement />
            </AppLayout>
          } />
          <Route path="/companies" element={
            <AppLayout>
              <CompanyManagement />
            </AppLayout>
          } />
          <Route path="/employees" element={
            <AppLayout>
              <EmployeeManagement />
            </AppLayout>
          } />
          <Route path="/clients" element={
            <AppLayout>
              <ClientMaster />
            </AppLayout>
          } />
          <Route path="/quotations" element={
            <AppLayout>
              <Quotation />
            </AppLayout>
          } />
          <Route path="/tenders" element={
            <AppLayout>
              <TenderManagement />
            </AppLayout>
          } />
          
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
