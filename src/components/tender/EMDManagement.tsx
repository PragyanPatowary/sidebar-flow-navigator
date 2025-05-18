
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, X } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Sample EMD data
const initialEmdData = [
  {
    id: 1,
    tenderReference: "TNR-2025-001",
    tenderTitle: "Supply of Industrial Equipment",
    client: "Government Industries Ltd",
    amount: 25000,
    paymentDate: "2025-05-10",
    status: "Pending",
    returnDate: null,
    remarks: "Awaiting tender outcome",
  },
  {
    id: 2,
    tenderReference: "TNR-2025-002",
    tenderTitle: "Installation of Manufacturing Units",
    client: "City Municipal Corporation",
    amount: 35000,
    paymentDate: "2025-06-15",
    status: "Returned",
    returnDate: "2025-08-20",
    remarks: "Tender won, EMD returned",
  },
  {
    id: 3,
    tenderReference: "TNR-2025-003",
    tenderTitle: "Annual Maintenance Contract",
    client: "Regional Power Corporation",
    amount: 15000,
    paymentDate: "2025-06-01",
    status: "Forfeited",
    returnDate: null,
    remarks: "Tender lost, EMD forfeited",
  }
];

const EMDManagement = () => {
  const { toast } = useToast();
  const [emdData, setEmdData] = useState(initialEmdData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedEmd, setSelectedEmd] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    returnDate: "",
    remarks: "",
  });

  const columns = [
    {
      header: "Tender Reference",
      accessorKey: "tenderReference",
    },
    {
      header: "Tender Title",
      accessorKey: "tenderTitle",
    },
    {
      header: "Client",
      accessorKey: "client",
    },
    {
      header: "Amount (₹)",
      accessorKey: "amount",
      cell: ({ row }) => row.original.amount.toLocaleString(),
    },
    {
      header: "Payment Date",
      accessorKey: "paymentDate",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={
            status === "Returned" ? "success" :
            status === "Forfeited" ? "destructive" :
            "outline"
          }>
            {status}
          </Badge>
        );
      }
    },
    {
      header: "Return Date",
      accessorKey: "returnDate",
      cell: ({ row }) => row.original.returnDate || "-",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenUpdateDialog(row.original)}
        >
          Update Status
        </Button>
      ),
    },
  ];

  const handleOpenUpdateDialog = (emd) => {
    setSelectedEmd(emd);
    setUpdateData({
      status: emd.status,
      returnDate: emd.returnDate || "",
      remarks: emd.remarks || "",
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setUpdateData((prev) => ({ ...prev, status: value }));
  };

  const handleUpdateSubmit = () => {
    // Update the EMD status
    const updatedEmdData = emdData.map((emd) =>
      emd.id === selectedEmd.id
        ? { ...emd, ...updateData }
        : emd
    );
    
    setEmdData(updatedEmdData);
    
    toast({
      title: "EMD Status Updated",
      description: `EMD for ${selectedEmd.tenderReference} has been updated.`,
    });
    
    setIsUpdateDialogOpen(false);
  };

  // Filter EMD data based on search term
  const filteredEmdData = emdData.filter(
    emd =>
      emd.tenderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emd.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emd.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <Input
            placeholder="Search EMD records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button>
            Add New EMD
          </Button>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredEmdData}
          searchPlaceholder="Filter EMD records..."
        />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>EMD Summary</CardTitle>
            <CardDescription>Overview of EMD amounts and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total EMD Amount</p>
                <p className="text-2xl font-bold">
                  ₹{emdData.reduce((sum, emd) => sum + emd.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Pending Returns</p>
                <p className="text-2xl font-bold">
                  {emdData.filter(emd => emd.status === "Pending").length}
                </p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Forfeited Amount</p>
                <p className="text-2xl font-bold">
                  ₹{emdData
                    .filter(emd => emd.status === "Forfeited")
                    .reduce((sum, emd) => sum + emd.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update EMD Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update EMD Status</DialogTitle>
            <DialogDescription>
              Update the status and return details for the EMD.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmd && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Tender Reference</p>
                  <p className="text-sm">{selectedEmd.tenderReference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Client</p>
                  <p className="text-sm">{selectedEmd.client}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">EMD Amount</p>
                  <p className="text-sm">₹{selectedEmd.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Payment Date</p>
                  <p className="text-sm">{selectedEmd.paymentDate}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={updateData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                    <SelectItem value="Forfeited">Forfeited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {updateData.status === "Returned" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Return Date</label>
                  <div className="flex">
                    <Input
                      name="returnDate"
                      type="date"
                      value={updateData.returnDate}
                      onChange={handleUpdateChange}
                    />
                    <Button type="button" variant="outline" className="ml-2">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks</label>
                <textarea
                  className="w-full min-h-[80px] p-2 border rounded-md"
                  name="remarks"
                  value={updateData.remarks}
                  onChange={handleUpdateChange}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EMDManagement;
