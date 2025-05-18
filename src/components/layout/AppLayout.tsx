
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle query parameters for tabs in the Tender Management page
  React.useEffect(() => {
    if (location.pathname === "/tenders" && location.search) {
      const params = new URLSearchParams(location.search);
      const tab = params.get("tab");
      
      // Pass the tab information to the TenderManagement component
      // This will be handled by the component to select the appropriate tab
      if (tab) {
        // The tab change is handled by the component itself
        // No navigation needed here as we're already on the right URL
      }
    }
  }, [location, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
