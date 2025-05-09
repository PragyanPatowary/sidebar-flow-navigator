import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2, Eye, MoreVertical, Plus } from "lucide-react";
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
  email: string;
  status: "Active" | "Inactive";
  phone: string;
  designation: string;
}

const initialSales: SalesData[] = [
  {
    id: 1,
    name: "Collins James",
    email: "collins@salesteam.com",
    status: "Active",
    phone: "6002691095",
    designation: "Trainee Service Engineer",
  },
  {
    id: 2,
    name: "Philip Roberts",
    email: "philip@salesteam.com",
    status: "Active",
    phone: "+65 9308 4744",
    designation: "Junior Service Engineer",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@salesteam.com",
    status: "Inactive",
    phone: "+62-896-5554-32",
    designation: "Field Service Engineer",
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "chen@salesteam.com",
    status: "Active",
    phone: "+62-838-5558-34",
    designation: "Support Service Engineer",
  },
  {
    id: 5,
    name: "Amanda Floyd",
    email: "amanda@salesteam.com",
    status: "Inactive",
    phone: "+1-555-8701-158",
    designation: "Field Service Engineer",
  },
  {
    id: 6,
    name: "Cody Fisher",
    email: "fisher@salesteam.com",
    // salesValue: "₹38,200",
    status: "Inactive",
    phone: "+61480013910",
    designation: "Field Service Engineer",
  },
  {
    id: 7,
    name: "Theresa Webb",
    email: "theresa@salesteam.com",
    status: "Active",
    phone: "+91 9163337392",
    designation: "Field Service Engineer",
  },
];

const ServiceEngineer = () => {
  const [sales, setSales] = useState<SalesData[]>(initialSales);
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isViewSaleOpen, setIsViewSaleOpen] = useState(false);
  const [isEditSaleOpen, setIsEditSaleOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<SalesData | null>(null);
  const [newSale, setNewSale] = useState<Omit<SalesData, "id">>({
    name: "",
    email: "",
    status: "Active",
    phone: "",
    designation: "Field Service Engineer",
  });

  const handleAddSale = () => {
    if (!newSale.name || !newSale.email || !newSale.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...sales.map(sale => sale.id)) + 1;
    const saleToAdd = { ...newSale, id };
    setSales([...sales, saleToAdd]);
    setIsAddSaleOpen(false);
    setNewSale({
      name: "",
      email: "",
      status: "Active",
      phone: "",
      designation: "Field Service Engineer",
    });
    toast.success("Sales representative added successfully");
  };

  const handleUpdateSale = () => {
    if (!currentSale) return;
    
    setSales(sales.map(sale => 
      sale.id === currentSale.id ? currentSale : sale
    ));
    setIsEditSaleOpen(false);
    toast.success("Sales representative updated successfully");
  };

  const handleDeleteSale = () => {
    if (!currentSale) return;
    
    setSales(sales.filter(sale => sale.id !== currentSale.id));
    setIsDeleteDialogOpen(false);
    toast.success("Sales representative deleted successfully");
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

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Service Engineer</h1>
        <p className="text-gray-500">
          Manage your service engineer team members . Add, edit, view or remove service engineer.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Service Engineers</h2>
          <Button className="flex items-center gap-2" onClick={() => setIsAddSaleOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Service Er
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead>Service Engineers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {sale.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{sale.name}</div>
                        <div className="text-sm text-gray-500">{sale.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sale.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </TableCell>
                  <TableCell>{sale.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sale.designation === "Field Service Engineer"
                          ? "bg-blue-100 text-blue-800"
                          : sale.designation === "Junior Service Engineer"
                          ? "bg-purple-100 text-purple-800"
                          : sale.designation === "Trainee Service Engineer"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {sale.designation}
                    </span>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => openViewSale(sale)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Sales Rep Dialog */}
      <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sales Representative</DialogTitle>
            <DialogDescription>
              Add a new team member to your sales organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newSale.name} 
                onChange={(e) => setNewSale({...newSale, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newSale.email} 
                onChange={(e) => setNewSale({...newSale, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newSale.phone} 
                onChange={(e) => setNewSale({...newSale, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="designation">Designation</Label>
              <Select 
                value={newSale.designation} 
                onValueChange={(value) => setNewSale({...newSale, designation: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trainee Service Engineer">Trainee Service Engineer</SelectItem>
                  <SelectItem value="Field Service Engineer">Field Service Engineer</SelectItem>
                  <SelectItem value="Junior Service Engineer">Junior Service Engineer</SelectItem>
                  <SelectItem value="Support Service Engineer">Support Service Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newSale.status} 
                onValueChange={(value: "Active" | "Inactive") => setNewSale({...newSale, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSale}>Add Representative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Sales Rep Dialog */}
      <Dialog open={isViewSaleOpen} onOpenChange={setIsViewSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sales Representative Profile</DialogTitle>
            <DialogDescription>
              Representative details and information.
            </DialogDescription>
          </DialogHeader>
          {currentSale && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-semibold">
                  {currentSale.name.charAt(0)}
                </div>
              </div>
              
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Name:</span>
                <span>{currentSale.name}</span>
                
                <span className="font-medium">Email:</span>
                <span>{currentSale.email}</span>
                
                <span className="font-medium">Phone:</span>
                <span>{currentSale.phone}</span>
                
                <span className="font-medium">Territory:</span>
                <span>{currentSale.designation}</span>
                
                <span className="font-medium">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentSale.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {currentSale.status}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewSaleOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sales Rep Dialog */}
      <Dialog open={isEditSaleOpen} onOpenChange={setIsEditSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sales Representative</DialogTitle>
            <DialogDescription>
              Update representative information.
            </DialogDescription>
          </DialogHeader>
          {currentSale && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentSale.name} 
                  onChange={(e) => setCurrentSale({...currentSale, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={currentSale.email} 
                  onChange={(e) => setCurrentSale({...currentSale, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentSale.phone} 
                  onChange={(e) => setCurrentSale({...currentSale, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-designation">Designation</Label>
                <Select 
                  value={currentSale.designation} 
                  onValueChange={(value) => setCurrentSale({...currentSale, designation: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="Trainee Service Engineer">Trainee Service Engineer</SelectItem>
                  <SelectItem value="Field Service Engineer">Field Service Engineer</SelectItem>
                  <SelectItem value="Junior Service Engineer">Junior Service Engineer</SelectItem>
                  <SelectItem value="Support Service Engineer">Support Service Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={currentSale.status} 
                  onValueChange={(value: "Active" | "Inactive") => setCurrentSale({...currentSale, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSaleOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSale}>Update Representative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sales Representative</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this representative? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentSale && (
            <div className="py-4">
              <p>You are about to delete sales representative <span className="font-medium">{currentSale.name}</span>.</p>
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

export default ServiceEngineer;