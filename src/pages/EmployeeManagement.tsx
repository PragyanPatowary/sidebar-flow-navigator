
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

type EmployeeRole = 'admin' | 'sub-admin' | 'employee' | 'engineer' | 'salesperson';

interface EmployeeData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  joiningDate: string;
  status: 'active' | 'inactive';
  department: string;
}

const initialEmployees: EmployeeData[] = [
  {
    id: 1,
    name: "Amit Sharma",
    email: "amit.sharma@dritu.com",
    phone: "9876543210",
    role: "admin",
    joiningDate: "2023-04-10",
    status: "active",
    department: "Management",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@dritu.com",
    phone: "8765432109",
    role: "employee",
    joiningDate: "2023-05-15",
    status: "active",
    department: "Sales",
  },
];

const STORAGE_KEY = "dritu-enterprise-employees";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isViewEmployeeOpen, setIsViewEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeData | null>(null);
  const [newEmployee, setNewEmployee] = useState<Omit<EmployeeData, "id">>({
    name: "",
    email: "",
    phone: "",
    role: "employee",
    joiningDate: new Date().toISOString().split('T')[0],
    status: "active",
    department: "",
  });

  // Load employees from localStorage on component mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem(STORAGE_KEY);
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      // If no employees in localStorage, use initial employees and save them
      setEmployees(initialEmployees);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
    }
  }, []);

  // Update localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.department) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...employees.map(employee => employee.id)) + 1;
    
    const employeeToAdd = { 
      ...newEmployee, 
      id,
    };
    
    const updatedEmployees = [...employees, employeeToAdd];
    setEmployees(updatedEmployees);
    setIsAddEmployeeOpen(false);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      role: "employee",
      joiningDate: new Date().toISOString().split('T')[0],
      status: "active",
      department: "",
    });
    toast.success("Employee added successfully");
  };

  const handleUpdateEmployee = () => {
    if (!currentEmployee) return;
    
    const updatedEmployees = employees.map(employee => 
      employee.id === currentEmployee.id ? currentEmployee : employee
    );
    
    setEmployees(updatedEmployees);
    setIsEditEmployeeOpen(false);
    toast.success("Employee updated successfully");
  };

  const handleDeleteEmployee = () => {
    if (!currentEmployee) return;
    
    const updatedEmployees = employees.filter(employee => employee.id !== currentEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteDialogOpen(false);
    toast.success("Employee deleted successfully");
  };

  const openViewEmployee = (employee: EmployeeData) => {
    setCurrentEmployee(employee);
    setIsViewEmployeeOpen(true);
  };

  const openEditEmployee = (employee: EmployeeData) => {
    setCurrentEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  const openDeleteDialog = (employee: EmployeeData) => {
    setCurrentEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  // Function to get role label
  const getRoleLabel = (role: EmployeeRole) => {
    const roleLabels = {
      'admin': 'Admin',
      'sub-admin': 'Sub-Admin',
      'employee': 'Employee',
      'engineer': 'Engineer',
      'salesperson': 'Salesperson',
    };
    return roleLabels[role];
  };

  // Function to get role badge style
  const getRoleBadgeClass = (role: EmployeeRole) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'sub-admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      case 'engineer':
        return 'bg-green-100 text-green-800';
      case 'salesperson':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <p className="text-gray-500">
          Manage your employees. Add, edit, view or remove employees from your system.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Employee Master</h2>
          <Button className="flex items-center gap-2" onClick={() => setIsAddEmployeeOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="font-medium">{employee.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(employee.role)}`}>
                      {getRoleLabel(employee.role)}
                    </div>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
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
                        <DropdownMenuItem onClick={() => openViewEmployee(employee)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditEmployee(employee)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(employee)} 
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

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input 
                id="name" 
                value={newEmployee.name} 
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email" 
                type="email"
                value={newEmployee.email} 
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input 
                id="phone" 
                value={newEmployee.phone} 
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role*</Label>
              <Select 
                value={newEmployee.role} 
                onValueChange={(value: EmployeeRole) => setNewEmployee({...newEmployee, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sub-admin">Sub-Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department*</Label>
              <Input 
                id="department" 
                value={newEmployee.department} 
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joiningDate">Joining Date*</Label>
              <Input 
                id="joiningDate" 
                type="date" 
                value={newEmployee.joiningDate} 
                onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status*</Label>
              <Select 
                value={newEmployee.status} 
                onValueChange={(value: 'active' | 'inactive') => setNewEmployee({...newEmployee, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={isViewEmployeeOpen} onOpenChange={setIsViewEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View employee information.
            </DialogDescription>
          </DialogHeader>
          {currentEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Name:</span>
                <span>{currentEmployee.name}</span>
                
                <span className="font-medium">Role:</span>
                <span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(currentEmployee.role)}`}>
                    {getRoleLabel(currentEmployee.role)}
                  </span>
                </span>
                
                <span className="font-medium">Email:</span>
                <span>{currentEmployee.email}</span>
                
                <span className="font-medium">Phone:</span>
                <span>{currentEmployee.phone}</span>
                
                <span className="font-medium">Department:</span>
                <span>{currentEmployee.department}</span>
                
                <span className="font-medium">Joining Date:</span>
                <span>{new Date(currentEmployee.joiningDate).toLocaleDateString()}</span>
                
                <span className="font-medium">Status:</span>
                <span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    currentEmployee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentEmployee.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewEmployeeOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information.
            </DialogDescription>
          </DialogHeader>
          {currentEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentEmployee.name} 
                  onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentEmployee.email} 
                  onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  value={currentEmployee.phone} 
                  onChange={(e) => setCurrentEmployee({...currentEmployee, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={currentEmployee.role} 
                  onValueChange={(value: EmployeeRole) => setCurrentEmployee({...currentEmployee, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sub-admin">Sub-Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="salesperson">Salesperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input 
                  id="edit-department" 
                  value={currentEmployee.department} 
                  onChange={(e) => setCurrentEmployee({...currentEmployee, department: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-joiningDate">Joining Date</Label>
                <Input 
                  id="edit-joiningDate" 
                  type="date" 
                  value={currentEmployee.joiningDate} 
                  onChange={(e) => setCurrentEmployee({...currentEmployee, joiningDate: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={currentEmployee.status} 
                  onValueChange={(value: 'active' | 'inactive') => setCurrentEmployee({...currentEmployee, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateEmployee}>Update Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentEmployee && (
            <div className="py-4">
              <p>You are about to delete employee <span className="font-medium">{currentEmployee.name}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
