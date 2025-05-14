
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, MoreVertical } from "lucide-react";
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

interface CompanyData {
  id: number;
  name: string;
  type: "client" | "manufacturer";
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
}

const initialCompanies: CompanyData[] = [
  {
    id: 1,
    name: "ABC Technologies",
    type: "client",
    contactPerson: "John Doe",
    email: "john@abctech.com",
    phone: "9876543210",
    address: "123 Tech Park, Mumbai",
    gstNumber: "27AADCB2230M1Z3",
  },
  {
    id: 2,
    name: "XYZ Manufacturing",
    type: "manufacturer",
    contactPerson: "Jane Smith",
    email: "jane@xyzmanufacturing.com",
    phone: "8765432109",
    address: "456 Industrial Area, Delhi",
    gstNumber: "07AAACX2258Q1ZP",
  },
];

const STORAGE_KEY = "dritu-enterprise-companies";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isViewCompanyOpen, setIsViewCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [newCompany, setNewCompany] = useState<Omit<CompanyData, "id">>({
    name: "",
    type: "client",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: ""
  });

  // Load companies from localStorage on component mount
  useEffect(() => {
    const storedCompanies = localStorage.getItem(STORAGE_KEY);
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    } else {
      // If no companies in localStorage, use initial companies and save them
      setCompanies(initialCompanies);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCompanies));
    }
  }, []);

  // Update localStorage whenever companies change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.contactPerson || !newCompany.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...companies.map(company => company.id)) + 1;
    
    const companyToAdd = { 
      ...newCompany, 
      id,
    };
    
    const updatedCompanies = [...companies, companyToAdd];
    setCompanies(updatedCompanies);
    setIsAddCompanyOpen(false);
    setNewCompany({
      name: "",
      type: "client",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: ""
    });
    toast.success("Company added successfully");
  };

  const handleUpdateCompany = () => {
    if (!currentCompany) return;
    
    const updatedCompanies = companies.map(company => 
      company.id === currentCompany.id ? currentCompany : company
    );
    
    setCompanies(updatedCompanies);
    setIsEditCompanyOpen(false);
    toast.success("Company updated successfully");
  };

  const handleDeleteCompany = () => {
    if (!currentCompany) return;
    
    const updatedCompanies = companies.filter(company => company.id !== currentCompany.id);
    setCompanies(updatedCompanies);
    setIsDeleteDialogOpen(false);
    toast.success("Company deleted successfully");
  };

  const openViewCompany = (company: CompanyData) => {
    setCurrentCompany(company);
    setIsViewCompanyOpen(true);
  };

  const openEditCompany = (company: CompanyData) => {
    setCurrentCompany(company);
    setIsEditCompanyOpen(true);
  };

  const openDeleteDialog = (company: CompanyData) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Company Management</h1>
        <p className="text-gray-500">
          Manage your client and manufacturer companies. Add, edit, view or remove companies from your database.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Company Master</h2>
          <Button className="flex items-center gap-2" onClick={() => setIsAddCompanyOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="font-medium">{company.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      company.type === 'client' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {company.type === 'client' ? 'Client' : 'Manufacturer'}
                    </div>
                  </TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.gstNumber}</TableCell>
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
                        <DropdownMenuItem onClick={() => openViewCompany(company)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditCompany(company)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(company)} 
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

      {/* Add Company Dialog */}
      <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Add a new company to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name*</Label>
              <Input 
                id="name" 
                value={newCompany.name} 
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Company Type*</Label>
              <Select 
                value={newCompany.type} 
                onValueChange={(value: "client" | "manufacturer") => setNewCompany({...newCompany, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client (Receives Quotations)</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer (Provides Products)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Contact Person*</Label>
              <Input 
                id="contactPerson" 
                value={newCompany.contactPerson} 
                onChange={(e) => setNewCompany({...newCompany, contactPerson: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input 
                id="phone" 
                value={newCompany.phone} 
                onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newCompany.email} 
                onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={newCompany.address} 
                onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input 
                id="gstNumber" 
                value={newCompany.gstNumber} 
                onChange={(e) => setNewCompany({...newCompany, gstNumber: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCompanyOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCompany}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Company Dialog */}
      <Dialog open={isViewCompanyOpen} onOpenChange={setIsViewCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
            <DialogDescription>
              View company information.
            </DialogDescription>
          </DialogHeader>
          {currentCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Company:</span>
                <span>{currentCompany.name}</span>
                
                <span className="font-medium">Type:</span>
                <span>{currentCompany.type === 'client' ? 'Client (Receives Quotations)' : 'Manufacturer (Provides Products)'}</span>
                
                <span className="font-medium">Contact Person:</span>
                <span>{currentCompany.contactPerson}</span>
                
                <span className="font-medium">Phone:</span>
                <span>{currentCompany.phone}</span>
                
                <span className="font-medium">Email:</span>
                <span>{currentCompany.email || '-'}</span>
                
                <span className="font-medium">Address:</span>
                <span>{currentCompany.address || '-'}</span>
                
                <span className="font-medium">GST Number:</span>
                <span>{currentCompany.gstNumber || '-'}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewCompanyOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update company information.
            </DialogDescription>
          </DialogHeader>
          {currentCompany && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Company Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentCompany.name} 
                  onChange={(e) => setCurrentCompany({...currentCompany, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Company Type</Label>
                <Select 
                  value={currentCompany.type} 
                  onValueChange={(value: "client" | "manufacturer") => setCurrentCompany({...currentCompany, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client (Receives Quotations)</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer (Provides Products)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input 
                  id="edit-contactPerson" 
                  value={currentCompany.contactPerson} 
                  onChange={(e) => setCurrentCompany({...currentCompany, contactPerson: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentCompany.phone} 
                  onChange={(e) => setCurrentCompany({...currentCompany, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentCompany.email} 
                  onChange={(e) => setCurrentCompany({...currentCompany, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input 
                  id="edit-address" 
                  value={currentCompany.address} 
                  onChange={(e) => setCurrentCompany({...currentCompany, address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gstNumber">GST Number</Label>
                <Input 
                  id="edit-gstNumber" 
                  value={currentCompany.gstNumber} 
                  onChange={(e) => setCurrentCompany({...currentCompany, gstNumber: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCompanyOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCompany}>Update Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentCompany && (
            <div className="py-4">
              <p>You are about to delete company <span className="font-medium">{currentCompany.name}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
