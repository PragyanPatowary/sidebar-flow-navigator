
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TenderApplication = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    reference: "",
    title: "",
    client: "",
    description: "",
    submissionDate: "",
    tenderFee: "",
    emdAmount: "",
    securityDeposit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.client || !formData.submissionDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form data
    toast({
      title: "Tender Application Submitted",
      description: `Application for ${formData.title} has been submitted successfully.`,
    });
    
    // Reset form
    setFormData({
      reference: "",
      title: "",
      client: "",
      description: "",
      submissionDate: "",
      tenderFee: "",
      emdAmount: "",
      securityDeposit: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for New Tender</CardTitle>
        <CardDescription>Fill in the details to apply for a new tender</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                name="reference"
                placeholder="TNR-2025-XXX"
                value={formData.reference}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Tender Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter tender title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client/Organization *</Label>
              <Input
                id="client"
                name="client"
                placeholder="Enter client name"
                value={formData.client}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="submissionDate">Submission Date *</Label>
              <div className="flex">
                <Input
                  id="submissionDate"
                  name="submissionDate"
                  type="date"
                  value={formData.submissionDate}
                  onChange={handleChange}
                  required
                />
                <Button type="button" variant="outline" className="ml-2">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tenderFee">Tender Fee (₹)</Label>
              <Input
                id="tenderFee"
                name="tenderFee"
                type="number"
                placeholder="0.00"
                value={formData.tenderFee}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emdAmount">EMD Amount (₹)</Label>
              <Input
                id="emdAmount"
                name="emdAmount"
                type="number"
                placeholder="0.00"
                value={formData.emdAmount}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Tender Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter tender details, requirements, and scope of work"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TenderApplication;
