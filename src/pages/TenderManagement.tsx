
import React from "react";
import TendersList from "@/components/tender/TendersList";
import TenderApplication from "@/components/tender/TenderApplication";
import EMDManagement from "@/components/tender/EMDManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const TenderManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tender Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Tender
        </Button>
      </div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Tenders List</TabsTrigger>
          <TabsTrigger value="apply">Apply for Tender</TabsTrigger>
          <TabsTrigger value="emd">EMD Management</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <TendersList />
        </TabsContent>
        <TabsContent value="apply" className="mt-6">
          <TenderApplication />
        </TabsContent>
        <TabsContent value="emd" className="mt-6">
          <EMDManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenderManagement;
