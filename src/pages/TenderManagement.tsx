
import React, { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TendersList from "@/components/tender/TendersList";

import TenderApplication from "@/components/tender/TenderApplication";

import EMDManagement from "@/components/tender/EMDManagement";

const TenderManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabFromQuery = new URLSearchParams(location.search).get("tab");
  const [activeTab, setActiveTab] = React.useState(tabFromQuery || "tenders");

  function handleTabChange(value: string): void {
    setActiveTab(value);
    const params = new URLSearchParams(location.search);
    params.set("tab", value);
    navigate({ search: params.toString() }, { replace: true });
  }

  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromQuery]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tender Management</h1>
        <p className="text-muted-foreground">
          Apply for tenders and track deposits, fees, and status
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="tenders">Tenders List</TabsTrigger>
          <TabsTrigger value="apply">Apply for Tenders</TabsTrigger>
          <TabsTrigger value="emd">EMD Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenders" className="space-y-4">
          <TendersList />
        </TabsContent>
        
        <TabsContent value="apply" className="space-y-4">
          <TenderApplication />
        </TabsContent>
        
        <TabsContent value="emd" className="space-y-4">
          <EMDManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenderManagement;

