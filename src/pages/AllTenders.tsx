
import React from "react";
import TendersList from "@/components/tender/TendersList";

const AllTenders = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">All Tenders</h1>
        <p className="text-muted-foreground">
          View and manage all tenders
        </p>
      </div>
      <TendersList />
    </div>
  );
};

export default AllTenders;
