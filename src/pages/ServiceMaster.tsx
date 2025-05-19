
import React from "react";
import { ServicesList } from "@/components/service/ServicesList";
import { ServiceForm } from "@/components/service/ServiceForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServiceMaster = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Service Master</h1>
      </div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Services List</TabsTrigger>
          <TabsTrigger value="add">Add New Service</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <ServicesList />
        </TabsContent>
        <TabsContent value="add" className="mt-6">
          <ServiceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceMaster;
