import React, { useState } from "react";
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SalesData {
  id: number;
  name: string;
  stage: string;
  value: string;
  status: "paid" | "pending" | "cancelled";
  date: string;
}

const initialSales: SalesData[] = [
  {
    id: 1,
    name: "Collins",
    stage: "Quality to Buy",
    value: "₹25000",
    status: "paid",
    date: "12 Jun 2025"
  },
  {
    id: 2,
    name: "Philip",
    stage: "Proposal Made",
    value: "₹45000",
    status: "pending",
    date: "1 Aug 2025"
  },
  {
    id: 3,
    name: "Solvent",
    stage: "Contact Made",
    value: "₹5000",
    status: "cancelled",
    date: "17 Dec 2025"
  },
  {
    id: 4,
    name: "Revadu",
    stage: "Presentation",
    value: "₹35000",
    status: "paid",
    date: "13 May 2025"
  },
  {
    id: 5,
    name: "Solvent",
    stage: "Proposal Made",
    value: "₹35000",
    status: "pending",
    date: "12 Sept 2025"
  },
  {
    id: 6,
    name: "Slovensky",
    stage: "Quality to Buy",
    value: "₹35000",
    status: "paid",
    date: "13 May 2025"
  },
  {
    id: 7,
    name: "Alvadu",
    stage: "Presentation",
    value: "₹35000",
    status: "paid",
    date: "23 Nov 2025"
  },
  {
    id: 8,
    name: "Limnca",
    stage: "Presentation",
    value: "₹35000",
    status: "cancelled",
    date: "13 May 2025"
  },
  {
    id: 9,
    name: "Prehydrate",
    stage: "Presentation",
    value: "₹35000",
    status: "paid",
    date: "13 May 2025"
  },
  {
    id: 10,
    name: "Androne",
    stage: "Presentation",
    value: "₹35000",
    status: "pending",
    date: "16 July 2025"
  },

  
];

const SalesManagement = () => {
  const [sales, setSales] = useState<SalesData[]>(initialSales);
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isViewSaleOpen, setIsViewSaleOpen] = useState(false);
  const [isEditSaleOpen, setIsEditSaleOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<SalesData | null>(null);
  const [newSale, setNewSale] = useState<Omit<SalesData, "id">>({
    name: "",
    stage: "Quality to Buy",
    value: "",
    status: "pending",
    date: "",
  });

  const columnHelper = createColumnHelper<SalesData>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Deal Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('stage', {
      header: 'Stage',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('value', {
      header: 'Deal Value',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue() === "paid"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'Closed Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => {
        const sale = sales.find(s => s.id === info.getValue());
        return sale ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openViewSale(sale)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditSale(sale)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => openDeleteDialog(sale)} 
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    }),
  ];

  const handleAddSale = () => {
    if (!newSale.name || !newSale.value || !newSale.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...sales.map(sale => sale.id)) + 1;
    const saleToAdd = { ...newSale, id };
    setSales([...sales, saleToAdd]);
    setIsAddSaleOpen(false);
    setNewSale({
      name: "",
      stage: "Quality to Buy",
      value: "",
      status: "pending",
      date: "",
    });
    toast.success("Sale added successfully");
  };

  const handleUpdateSale = () => {
    if (!currentSale) return;
    
    setSales(sales.map(sale => 
      sale.id === currentSale.id ? currentSale : sale
    ));
    setIsEditSaleOpen(false);
    toast.success("Sale updated successfully");
  };

  const handleDeleteSale = () => {
    if (!currentSale) return;
    
    setSales(sales.filter(sale => sale.id !== currentSale.id));
    setIsDeleteDialogOpen(false);
    toast.success("Sale deleted successfully");
  };

  const openViewSale = (sale: SalesData) => {
    setCurrentSale(sale);
    setIsViewSaleOpen(true);
  };

  const openEditSale = (sale: SalesData) => {
    setCurrentSale(sale);
    setIsEditSaleOpen(true);
  };

  const openDeleteDialog = (sale: SalesData) => {
    setCurrentSale(sale);
    setIsDeleteDialogOpen(true);
  };

  const table = useReactTable({
    data: sales,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <p className="text-gray-500">
          Manage your sales pipeline and track deal progress. Add, edit, view or remove sales opportunities.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Sales Opportunities</h2>
          <Button className="flex items-center gap-2" onClick={() => setIsAddSaleOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Sale
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                  headerGroup.headers.map(header => (
                    header.id !== "id" && (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  ))
                ))}
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  {row.getVisibleCells().map(cell => (
                    cell.column.id !== "id" && (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openViewSale(row.original)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditSale(row.original)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(row.original)} 
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Sale Dialog */}
      <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sale</DialogTitle>
            <DialogDescription>
              Add a new sales opportunity to your pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Deal Name</Label>
              <Input 
                id="name" 
                value={newSale.name} 
                onChange={(e) => setNewSale({...newSale, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stage">Stage</Label>
              <Select 
                value={newSale.stage} 
                onValueChange={(value) => setNewSale({...newSale, stage: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quality to Buy">Quality to Buy</SelectItem>
                  <SelectItem value="Proposal Made">Proposal Made</SelectItem>
                  <SelectItem value="Contact Made">Contact Made</SelectItem>
                  <SelectItem value="Presentation">Presentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Deal Value</Label>
              <Input 
                id="value" 
                value={newSale.value} 
                onChange={(e) => setNewSale({...newSale, value: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newSale.status} 
                onValueChange={(value: "paid" | "pending" | "cancelled") => setNewSale({...newSale, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Closed Date</Label>
              <Input 
                id="date" 
                value={newSale.date} 
                onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                placeholder="DD MMM YYYY"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSale}>Add Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Sale Dialog */}
      <Dialog open={isViewSaleOpen} onOpenChange={setIsViewSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>
              Detailed information about this sale.
            </DialogDescription>
          </DialogHeader>
          {currentSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Deal Name:</span>
                <span>{currentSale.name}</span>
                
                <span className="font-medium">Stage:</span>
                <span>{currentSale.stage}</span>
                
                <span className="font-medium">Deal Value:</span>
                <span>{currentSale.value}</span>
                
                <span className="font-medium">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentSale.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : currentSale.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {currentSale.status}
                </span>
                
                <span className="font-medium">Closed Date:</span>
                <span>{currentSale.date}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewSaleOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog open={isEditSaleOpen} onOpenChange={setIsEditSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>
              Update sale information.
            </DialogDescription>
          </DialogHeader>
          {currentSale && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Deal Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentSale.name} 
                  onChange={(e) => setCurrentSale({...currentSale, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stage">Stage</Label>
                <Select 
                  value={currentSale.stage} 
                  onValueChange={(value) => setCurrentSale({...currentSale, stage: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality to Buy">Quality to Buy</SelectItem>
                    <SelectItem value="Proposal Made">Proposal Made</SelectItem>
                    <SelectItem value="Contact Made">Contact Made</SelectItem>
                    <SelectItem value="Presentation">Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-value">Deal Value</Label>
                <Input 
                  id="edit-value" 
                  value={currentSale.value} 
                  onChange={(e) => setCurrentSale({...currentSale, value: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={currentSale.status} 
                  onValueChange={(value: "paid" | "pending" | "cancelled") => setCurrentSale({...currentSale, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Closed Date</Label>
                <Input 
                  id="edit-date" 
                  value={currentSale.date} 
                  onChange={(e) => setCurrentSale({...currentSale, date: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSaleOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSale}>Update Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sale</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sale? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentSale && (
            <div className="py-4">
              <p>You are about to delete sale <span className="font-medium">{currentSale.name}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSale}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesManagement;