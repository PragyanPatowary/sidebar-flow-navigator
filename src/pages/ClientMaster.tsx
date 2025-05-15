
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  id: number;
  institution: string;
  department: string;
  drProfile: "PhD Holder" | "Doctor" | "Teacher" | "Professor";
  jobRole: "Decision Maker" | "User" | "Influencer" | "Director";
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

const drProfileOptions = ["PhD Holder", "Doctor", "Teacher", "Professor"] as const;
const jobRoleOptions = ["Decision Maker", "User", "Influencer", "Director"] as const;

const initialClients: ClientData[] = [
  {
    id: 1,
    institution: "City Hospital",
    department: "Radiology",
    drProfile: "Doctor",
    jobRole: "Decision Maker",
    name: "Dr. Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@cityhospital.com",
    message: "Interested in advanced imaging equipment",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    institution: "National University",
    department: "Physics",
    drProfile: "Professor",
    jobRole: "Influencer",
    name: "Prof. Anjali Verma",
    phone: "8765432109",
    email: "a.verma@nationaluniv.edu",
    message: "Looking for laboratory equipment for research",
    createdAt: new Date().toISOString(),
  },
];

// Sample institution and department data (in a real app, this might come from an API)
const institutions = [
  "City Hospital",
  "National University",
  "Regional Medical Center",
  "Tech Institute",
  "Research Foundation"
];

const departmentsByInstitution: Record<string, string[]> = {
  "City Hospital": ["Radiology", "Cardiology", "Neurology", "Oncology", "Pediatrics"],
  "National University": ["Physics", "Chemistry", "Biology", "Computer Science", "Engineering"],
  "Regional Medical Center": ["Emergency", "Surgery", "Internal Medicine", "Psychiatry", "Orthopedics"],
  "Tech Institute": ["IT Department", "Electronics", "Biotechnology", "Robotics"],
  "Research Foundation": ["Clinical Research", "Data Science", "Pharmaceutical Research", "Genetics"]
};

const STORAGE_KEY = "dritu-enterprise-clients";

const ClientMaster = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);
  
  const [newClient, setNewClient] = useState<Omit<ClientData, "id" | "createdAt">>({
    institution: "",
    department: "",
    drProfile: "Doctor",
    jobRole: "Decision Maker",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  // Load clients from localStorage on component mount
  useEffect(() => {
    const storedClients = localStorage.getItem(STORAGE_KEY);
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      // If no clients in localStorage, use initial clients and save them
      setClients(initialClients);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClients));
    }
  }, []);

  // Update localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  // Update available departments when institution changes (for new client)
  useEffect(() => {
    if (newClient.institution && departmentsByInstitution[newClient.institution]) {
      setAvailableDepartments(departmentsByInstitution[newClient.institution]);
      if (!departmentsByInstitution[newClient.institution].includes(newClient.department)) {
        setNewClient(prev => ({ ...prev, department: "" }));
      }
    } else {
      setAvailableDepartments([]);
    }
  }, [newClient.institution]);

  // Update available departments when institution changes (for current client)
  useEffect(() => {
    if (currentClient?.institution && departmentsByInstitution[currentClient.institution]) {
      setAvailableDepartments(departmentsByInstitution[currentClient.institution]);
    }
  }, [currentClient?.institution]);

  const handleAddClient = () => {
    if (!newClient.name || !newClient.institution || !newClient.department || !newClient.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const id = Math.max(0, ...clients.map(client => client.id)) + 1;
    
    const clientToAdd = { 
      ...newClient, 
      id,
      createdAt: new Date().toISOString(),
    };
    
    const updatedClients = [...clients, clientToAdd];
    setClients(updatedClients);
    setIsAddClientOpen(false);
    setNewClient({
      institution: "",
      department: "",
      drProfile: "Doctor",
      jobRole: "Decision Maker",
      name: "",
      phone: "",
      email: "",
      message: "",
    });
    toast({
      title: "Success",
      description: "Client added successfully",
    });
  };

  const handleUpdateClient = () => {
    if (!currentClient) return;
    
    const updatedClients = clients.map(client => 
      client.id === currentClient.id ? currentClient : client
    );
    
    setClients(updatedClients);
    setIsEditClientOpen(false);
    toast({
      title: "Success",
      description: "Client updated successfully",
    });
  };

  const handleDeleteClient = () => {
    if (!currentClient) return;
    
    const updatedClients = clients.filter(client => client.id !== currentClient.id);
    setClients(updatedClients);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Client deleted successfully",
    });
  };

  const openViewClient = (client: ClientData) => {
    setCurrentClient(client);
    setIsViewClientOpen(true);
  };

  const openEditClient = (client: ClientData) => {
    setCurrentClient(client);
    setAvailableDepartments(departmentsByInstitution[client.institution] || []);
    setIsEditClientOpen(true);
  };

  const openDeleteDialog = (client: ClientData) => {
    setCurrentClient(client);
    setIsDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-gray-500">
          Add and manage your clients. Track client information for quotations and follow-ups.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Client Master</h2>
          <Button className="flex items-center gap-2" onClick={() => setIsAddClientOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No clients found. Add a client to get started.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.email}</div>
                    </TableCell>
                    <TableCell>{client.institution}</TableCell>
                    <TableCell>{client.department}</TableCell>
                    <TableCell>{client.drProfile}</TableCell>
                    <TableCell>
                      <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        client.jobRole === 'Decision Maker' 
                          ? 'bg-purple-100 text-purple-800' 
                          : client.jobRole === 'Director'
                          ? 'bg-red-100 text-red-800'
                          : client.jobRole === 'Influencer'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {client.jobRole}
                      </div>
                    </TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="institution">Institution*</Label>
              <Select
                value={newClient.institution}
                onValueChange={(value) => setNewClient({...newClient, institution: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((institution) => (
                    <SelectItem key={institution} value={institution}>{institution}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department*</Label>
              <Select
                value={newClient.department}
                onValueChange={(value) => setNewClient({...newClient, department: value})}
                disabled={!newClient.institution}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!newClient.institution ? "Select institution first" : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((department) => (
                    <SelectItem key={department} value={department}>{department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="drProfile">Dr Profile*</Label>
              <Select
                value={newClient.drProfile}
                onValueChange={(value: typeof drProfileOptions[number]) => 
                  setNewClient({...newClient, drProfile: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  {drProfileOptions.map((profile) => (
                    <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jobRole">Job Role*</Label>
              <Select
                value={newClient.jobRole}
                onValueChange={(value: typeof jobRoleOptions[number]) => 
                  setNewClient({...newClient, jobRole: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>
                <SelectContent>
                  {jobRoleOptions.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Client Name*</Label>
              <Input 
                id="name" 
                value={newClient.name} 
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input 
                id="phone" 
                value={newClient.phone} 
                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newClient.email} 
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message / Notes</Label>
              <Textarea 
                id="message" 
                value={newClient.message} 
                onChange={(e) => setNewClient({...newClient, message: e.target.value})}
                placeholder="Add any additional notes or details about this client"
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
        <DialogContent className="max-w-md">
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
                <span>{currentClient.drProfile}</span>
                
                <span className="font-medium">Job Role:</span>
                <span>{currentClient.jobRole}</span>
                
                <span className="font-medium">Phone:</span>
                <span>{currentClient.phone}</span>
                
                <span className="font-medium">Email:</span>
                <span>{currentClient.email || '-'}</span>
                
                <span className="font-medium">Added On:</span>
                <span>{formatDate(currentClient.createdAt)}</span>
              </div>
              
              {currentClient.message && (
                <div>
                  <h4 className="font-medium mb-1">Notes:</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{currentClient.message}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewClientOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information.
            </DialogDescription>
          </DialogHeader>
          {currentClient && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-institution">Institution</Label>
                <Select
                  value={currentClient.institution}
                  onValueChange={(value) => setCurrentClient({...currentClient, institution: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution} value={institution}>{institution}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={currentClient.department}
                  onValueChange={(value) => setCurrentClient({...currentClient, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((department) => (
                      <SelectItem key={department} value={department}>{department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-drProfile">Dr Profile</Label>
                <Select
                  value={currentClient.drProfile}
                  onValueChange={(value: typeof drProfileOptions[number]) => 
                    setCurrentClient({...currentClient, drProfile: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {drProfileOptions.map((profile) => (
                      <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-jobRole">Job Role</Label>
                <Select
                  value={currentClient.jobRole}
                  onValueChange={(value: typeof jobRoleOptions[number]) => 
                    setCurrentClient({...currentClient, jobRole: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job role" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoleOptions.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Client Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentClient.name} 
                  onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentClient.phone} 
                  onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentClient.email} 
                  onChange={(e) => setCurrentClient({...currentClient, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-message">Message / Notes</Label>
                <Textarea 
                  id="edit-message" 
                  value={currentClient.message} 
                  onChange={(e) => setCurrentClient({...currentClient, message: e.target.value})}
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
