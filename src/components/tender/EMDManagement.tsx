
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample EMD data
const initialEmdRecords = [
  {
    id: 1,
    tenderReference: "TNR-2025-001",
    tenderTitle: "Supply of Industrial Equipment",
    clientName: "Government Industries Ltd",
    emdAmount: 25000,
    submittedDate: "2025-05-10",
    returnExpectedDate: "2025-07-15",
    status: "Pending Return",
  },
  {
    id: 2,
    tenderReference: "TNR-2025-002",
    tenderTitle: "Installation of Manufacturing Units",
    clientName: "City Municipal Corporation",
    emdAmount: 35000,
    submittedDate: "2025-05-01",
    returnExpectedDate: "2025-06-30",
    status: "Returned",
  },
  {
    id: 3,
    tenderReference: "TNR-2025-003",
    tenderTitle: "Annual Maintenance Contract",
    clientName: "Regional Power Corporation",
    emdAmount: 15000,
    submittedDate: "2025-05-05",
    returnExpectedDate: "2025-08-20",
    status: "Forfeited",
  },
];

const EMDManagement = () => {
  const { toast } = useToast();
  const [emdRecords] = useState(initialEmdRecords);
  const [searchTerm] = useState("");

  // Filter emd records based on search term
  const filteredRecords = emdRecords.filter(
    (record) =>
      record.tenderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Returned":
        return "outline";
      case "Forfeited":
        return "destructive";
      case "Pending Return":
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>EMD Management</CardTitle>
          <CardDescription>
            Track and manage Earnest Money Deposits for tender applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchEmd">Search EMD Records</Label>
              <Input
                id="searchEmd"
                placeholder="Search by tender reference, title or client..."
                value={searchTerm}
                readOnly
              />
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Expected Return</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.tenderReference}</TableCell>
                        <TableCell>{record.tenderTitle}</TableCell>
                        <TableCell>{record.clientName}</TableCell>
                        <TableCell>₹{record.emdAmount.toLocaleString()}</TableCell>
                        <TableCell>{record.submittedDate}</TableCell>
                        <TableCell>{record.returnExpectedDate}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No EMD records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMDManagement;
