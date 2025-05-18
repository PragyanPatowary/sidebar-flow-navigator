
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Check, 
  FileText, 
  Plus, 
  X 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/common/DataTable";

// Sample tender data
const initialTenders = [
  {
    id: 1,
    reference: "TNR-2025-001",
    title: "Supply of Industrial Equipment",
    client: "Government Industries Ltd",
    submissionDate: "2025-06-15",
    status: "Pending",
    feeAmount: 5000,
    emdAmount: 25000,
    securityDeposit: 50000,
    securityReturnDate: "2026-01-15",
  },
  {
    id: 2,
    reference: "TNR-2025-002",
    title: "Installation of Manufacturing Units",
    client: "City Municipal Corporation",
    submissionDate: "2025-07-22",
    status: "Won",
    feeAmount: 7500,
    emdAmount: 35000,
    securityDeposit: 70000,
    securityReturnDate: "2026-02-20",
  },
  {
    id: 3,
    reference: "TNR-2025-003",
    title: "Annual Maintenance Contract",
    client: "Regional Power Corporation",
    submissionDate: "2025-06-30",
    status: "Lost",
    feeAmount: 3000,
    emdAmount: 15000,
    securityDeposit: 0,
    securityReturnDate: null,
  }
];

const TendersList = () => {
  const { toast } = useToast();
  const [tenders, setTenders] = useState(initialTenders);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      header: "Reference",
      accessorKey: "reference",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Client",
      accessorKey: "client",
    },
    {
      header: "Submission Date",
      accessorKey: "submissionDate",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className={`flex items-center gap-2 ${
            status === "Won" ? "text-green-600" : 
            status === "Lost" ? "text-red-600" : 
            "text-yellow-600"
          }`}>
            {status === "Won" ? <Check size={16} /> : 
             status === "Lost" ? <X size={16} /> : null}
            <span>{status}</span>
          </div>
        );
      }
    },
    {
      header: "Tender Fee",
      accessorKey: "feeAmount",
      cell: ({ row }) => `₹${row.original.feeAmount.toLocaleString()}`
    },
    {
      header: "EMD Amount",
      accessorKey: "emdAmount",
      cell: ({ row }) => `₹${row.original.emdAmount.toLocaleString()}`
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FileText className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(row.original)}>
              Update Status
            </DropdownMenuItem>
            {row.original.status === "Won" && (
              <DropdownMenuItem onClick={() => handleManageDeposits(row.original)}>
                Manage Deposits
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleViewDetails = (tender) => {
    toast({
      title: "Tender Details",
      description: `Viewing details for ${tender.reference}`,
    });
  };

  const handleUpdateStatus = (tender) => {
    toast({
      title: "Update Status",
      description: `Update status for ${tender.reference}`,
    });
  };

  const handleManageDeposits = (tender) => {
    toast({
      title: "Manage Deposits",
      description: `Managing deposits for ${tender.reference}`,
    });
  };

  // Filter tenders based on search term
  const filteredTenders = tenders.filter(
    tender =>
      tender.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search tenders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Tender
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredTenders}
        searchPlaceholder="Filter tenders..."
      />
    </div>
  );
};

export default TendersList;
