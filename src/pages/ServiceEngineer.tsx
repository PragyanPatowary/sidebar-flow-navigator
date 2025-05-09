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

interface ServiceData {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  phone: string;
  designation: string;
}

const initialService: ServiceData[] = [
  {
    id: 1,
    name: "Collins James",
    email: "collins@serviceteam.com",
    status: "Active",
    phone: "6002691095",
    designation: "Trainee Service Engineer",
  },
  {
    id: 2,
    name: "Philip Roberts",
    email: "philip@serviceteam.com",
    status: "Active",
    phone: "+65 9308 4744",
    designation: "Junior Service Engineer",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@serviceteam.com",
    status: "Inactive",
    phone: "+62-896-5554-32",
    designation: "Field Service Engineer",
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "chen@serviceteam.com",
    status: "Active",
    phone: "+62-838-5558-34",
    designation: "Support Service Engineer",
  },
  {
    id: 5,
    name: "Amanda Floyd",
    email: "amanda@serviceteam.com",
    status: "Inactive",
    phone: "+1-555-8701-158",
    designation: "Field Service Engineer",
  },
  {
    id: 6,
    name: "Cody Fisher",
    email: "fisher@serviceteam.com",
    status: "Inactive",
    phone: "+61480013910",
    designation: "Field Service Engineer",
  },
  {
    id: 7,
    name: "Theresa Webb",
    email: "theresa@serviceteam.com",
    status: "Active",
    phone: "+91 9163337392",
    designation: "Field Service Engineer",
  },
];

const ServiceEngineer = () => {
  const [service, setService] = useState<ServiceData[]>(initialService);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isViewServiceOpen, setIsViewServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceData | null>(null);
  const [newService, setNewService] = useState<Omit<ServiceData, "id">>({
    name: "",
    email: "",
    status: "Active",
    phone: "",
    designation: "Field Service Engineer",
  });

  const handleAddService = () => {
    if (!newService.name || !newService.email || !newService.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...service.map(services => services.id)) + 1;
    const ServiceToAdd = { ...newService, id };
    setService([...service, ServiceToAdd]);
    setIsAddServiceOpen(false);
    setNewService({
      name: "",
      email: "",
      status: "Active",
      phone: "",
      designation: "Field Service Engineer",
    });
    toast.success("Service Engineer added successfully");
  };

  const handleUpdateService = () => {
    if (!currentService) return;
    
    setService(service.map(services => 
      services.id === currentService.id ? currentService : services
    ));
    setIsEditServiceOpen(false);
    toast.success("Services representative updated successfully");
  };

  const handleDeleteService = () => {
    if (!currentService) return;
    
    setService(service.filter(services => services.id !== currentService.id));
    setIsDeleteDialogOpen(false);
    toast.success("Services representative deleted successfully");
  };

  const openViewService = (services: ServiceData) => {
    setCurrentService(services);
    setIsViewServiceOpen(true);
  };

  const openEditService = (services: ServiceData) => {
    setCurrentService(services);
    setIsEditServiceOpen(true);
  };

  const openDeleteDialog = (services: ServiceData) => {
    setCurrentService(services);
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
          <Button className="flex items-center gap-2" onClick={() => setIsAddServiceOpen(true)}>
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
              {service.map((services) => (
                <TableRow key={services.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {services.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{services.name}</div>
                        <div className="text-sm text-gray-500">{services.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        services.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {services.status}
                    </span>
                  </TableCell>
                  <TableCell>{services.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        services.designation === "Field Service Engineer"
                          ? "bg-blue-100 text-blue-800"
                          : services.designation === "Junior Service Engineer"
                          ? "bg-purple-100 text-purple-800"
                          : services.designation === "Trainee Service Engineer"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {services.designation}
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
                        <DropdownMenuItem onClick={() => openViewService(services)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditService(services)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(services)} 
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

      {/* Add Services Rep Dialog */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service Engineer</DialogTitle>
            <DialogDescription>
              Add a new team member to your service organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newService.name} 
                onChange={(e) => setNewService({...newService, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newService.email} 
                onChange={(e) => setNewService({...newService, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newService.phone} 
                onChange={(e) => setNewService({...newService, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="designation">Designation</Label>
              <Select 
                value={newService.designation} 
                onValueChange={(value) => setNewService({...newService, designation: value})}
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
                value={newService.status} 
                onValueChange={(value: "Active" | "Inactive") => setNewService({...newService, status: value})}
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
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddService}>Add Representative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Services Rep Dialog */}
      <Dialog open={isViewServiceOpen} onOpenChange={setIsViewServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Services Representative Profile</DialogTitle>
            <DialogDescription>
              Representative details and information.
            </DialogDescription>
          </DialogHeader>
          {currentService && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-semibold">
                  {currentService.name.charAt(0)}
                </div>
              </div>
              
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Name:</span>
                <span>{currentService.name}</span>
                
                <span className="font-medium">Email:</span>
                <span>{currentService.email}</span>
                
                <span className="font-medium">Phone:</span>
                <span>{currentService.phone}</span>
                
                <span className="font-medium">Territory:</span>
                <span>{currentService.designation}</span>
                
                <span className="font-medium">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentService.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {currentService.status}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewServiceOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Services Rep Dialog */}
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Services Representative</DialogTitle>
            <DialogDescription>
              Update representative information.
            </DialogDescription>
          </DialogHeader>
          {currentService && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentService.name} 
                  onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={currentService.email} 
                  onChange={(e) => setCurrentService({...currentService, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentService.phone} 
                  onChange={(e) => setCurrentService({...currentService, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-designation">Designation</Label>
                <Select 
                  value={currentService.designation} 
                  onValueChange={(value) => setCurrentService({...currentService, designation: value})}
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
                  value={currentService.status} 
                  onValueChange={(value: "Active" | "Inactive") => setCurrentService({...currentService, status: value})}
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
            <Button variant="outline" onClick={() => setIsEditServiceOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateService}>Update Representative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Services Representative</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this representative? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentService && (
            <div className="py-4">
              <p>You are about to delete Services representative <span className="font-medium">{currentService.name}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteService}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceEngineer;