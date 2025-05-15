
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, MoreVertical, Search, SortAsc, SortDesc } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientData {
  id: number;
  institution: string;
  department: string;
  profile: string;
  role: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

// Define constants for drop downs
const PROFILES = ["PhD Holder", "Doctor", "Teacher", "Professor"];
const ROLES = ["Decision Maker", "User", "Influencer", "Director"];

const STORAGE_KEY = "dritu-enterprise-clients";

const ClientMaster = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);
  const [newClient, setNewClient] = useState<Omit<ClientData, "id">>({
    institution: "",
    department: "",
    profile: PROFILES[0],
    role: ROLES[0],
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ClientData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Load clients from localStorage on component mount
  useEffect(() => {
    const storedClients = localStorage.getItem(STORAGE_KEY);
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      // Initialize with empty array if no clients exist
      setClients([]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }, []);

  // Update localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = () => {
    if (!newClient.name || !newClient.institution || !newClient.department || !newClient.email || !newClient.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...clients.map(client => client.id), 0) + 1;
    
    const clientToAdd = { 
      ...newClient, 
      id
    };
    
    const updatedClients = [...clients, clientToAdd];
    setClients(updatedClients);
    setIsAddClientOpen(false);
    setNewClient({
      institution: "",
      department: "",
      profile: PROFILES[0],
      role: ROLES[0],
      name: "",
      phone: "",
      email: "",
      notes: "",
    });
    toast.success("Client added successfully");
  };

  const handleUpdateClient = () => {
    if (!currentClient) return;
    
    const updatedClients = clients.map(client => 
      client.id === currentClient.id ? currentClient : client
    );
    
    setClients(updatedClients);
    setIsEditClientOpen(false);
    toast.success("Client updated successfully");
  };

  const handleDeleteClient = () => {
    if (!currentClient) return;
    
    const updatedClients = clients.filter(client => client.id !== currentClient.id);
    setClients(updatedClients);
    setIsDeleteDialogOpen(false);
    toast.success("Client deleted successfully");
  };

  const openViewClient = (client: ClientData) => {
    setCurrentClient(client);
    setIsViewClientOpen(true);
  };

  const openEditClient = (client: ClientData) => {
    setCurrentClient(client);
    setIsEditClientOpen(true);
  };

  const openDeleteDialog = (client: ClientData) => {
    setCurrentClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleSort = (field: keyof ClientData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof ClientData) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />;
  };

  // Filter and sort clients based on search term and sort settings
  const filteredClients = clients
    .filter(client => 
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === "asc" 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Client Master</h1>
        <p className="text-gray-500">
          Manage your client database. Add, edit, view or remove client records.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Client Database</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search clients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]" 
              />
            </div>
            <Button className="flex items-center gap-2" onClick={() => setIsAddClientOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No.</TableHead>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                  <div className="flex items-center">
                    Name {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('institution')} className="cursor-pointer">
                  <div className="flex items-center">
                    Institution {getSortIcon('institution')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('department')} className="cursor-pointer">
                  <div className="flex items-center">
                    Department {getSortIcon('department')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('profile')} className="cursor-pointer">
                  <div className="flex items-center">
                    Profile {getSortIcon('profile')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('role')} className="cursor-pointer">
                  <div className="flex items-center">
                    Role {getSortIcon('role')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                  <div className="flex items-center">
                    Email {getSortIcon('email')}
                  </div>
                </TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No clients found. Add your first client using the button above.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client, index) => (
                  <TableRow key={client.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                    </TableCell>
                    <TableCell>{client.institution}</TableCell>
                    <TableCell>{client.department}</TableCell>
                    <TableCell>{client.profile}</TableCell>
                    <TableCell>{client.role}</TableCell>
                    <TableCell>{client.email}</TableCell>
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
                          <DropdownMenuItem onClick={() => openViewClient(client)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditClient(client)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(client)} 
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="institution">Institution*</Label>
                <Input 
                  id="institution" 
                  value={newClient.institution} 
                  onChange={(e) => setNewClient({...newClient, institution: e.target.value})}
                  placeholder="Client's institution"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department*</Label>
                <Input 
                  id="department" 
                  value={newClient.department} 
                  onChange={(e) => setNewClient({...newClient, department: e.target.value})}
                  placeholder="Client's department"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="profile">Dr Profile*</Label>
                <Select 
                  value={newClient.profile}
                  onValueChange={(value) => setNewClient({...newClient, profile: value})}
                >
                  <SelectTrigger id="profile">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILES.map(profile => (
                      <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Job Role*</Label>
                <Select 
                  value={newClient.role}
                  onValueChange={(value) => setNewClient({...newClient, role: value})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Client Name*</Label>
              <Input 
                id="name" 
                value={newClient.name} 
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                placeholder="Full name of the client"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input 
                  id="phone" 
                  value={newClient.phone} 
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="Contact number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newClient.email} 
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                value={newClient.notes} 
                onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                placeholder="Any additional information or notes about the client"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>Cancel</Button>
            <Button onClick={handleAddClient}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Client Dialog */}
      <Dialog open={isViewClientOpen} onOpenChange={setIsViewClientOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              View client information.
            </DialogDescription>
          </DialogHeader>
          {currentClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Name:</span>
                <span>{currentClient.name}</span>
                
                <span className="font-medium">Institution:</span>
                <span>{currentClient.institution}</span>
                
                <span className="font-medium">Department:</span>
                <span>{currentClient.department}</span>
                
                <span className="font-medium">Profile:</span>
                <span>{currentClient.profile}</span>
                
                <span className="font-medium">Role:</span>
                <span>{currentClient.role}</span>
                
                <span className="font-medium">Phone:</span>
                <span>{currentClient.phone}</span>
                
                <span className="font-medium">Email:</span>
                <span>{currentClient.email}</span>
                
                <span className="font-medium">Notes:</span>
                <div className="whitespace-pre-wrap break-words">{currentClient.notes}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewClientOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information.
            </DialogDescription>
          </DialogHeader>
          {currentClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-institution">Institution</Label>
                  <Input 
                    id="edit-institution" 
                    value={currentClient.institution} 
                    onChange={(e) => setCurrentClient({...currentClient, institution: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input 
                    id="edit-department" 
                    value={currentClient.department} 
                    onChange={(e) => setCurrentClient({...currentClient, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-profile">Dr Profile</Label>
                  <Select 
                    value={currentClient.profile}
                    onValueChange={(value) => setCurrentClient({...currentClient, profile: value})}
                  >
                    <SelectTrigger id="edit-profile">
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFILES.map(profile => (
                        <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Job Role</Label>
                  <Select 
                    value={currentClient.role}
                    onValueChange={(value) => setCurrentClient({...currentClient, role: value})}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Client Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentClient.name} 
                  onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input 
                    id="edit-phone" 
                    value={currentClient.phone} 
                    onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    value={currentClient.email} 
                    onChange={(e) => setCurrentClient({...currentClient, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Additional Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={currentClient.notes} 
                  onChange={(e) => setCurrentClient({...currentClient, notes: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateClient}>Update Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentClient && (
            <div className="py-4">
              <p>You are about to delete client <span className="font-medium">{currentClient.name}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteClient}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientMaster;
