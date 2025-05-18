
import React from "react";
import TenderApplication from "@/components/tender/TenderApplication";

const ApplyTenders = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Apply for Tenders</h1>
        <p className="text-muted-foreground">
          Fill out the form to apply for new tenders
        </p>
      </div>
      <TenderApplication />
    </div>
  );
};

export default ApplyTenders;
