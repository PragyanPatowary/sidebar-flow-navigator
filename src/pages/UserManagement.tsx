
import React from "react";
import { Button } from "@/components/ui/button";
import { User, MoreVertical } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  location: string;
  phone: string;
  group: "Design" | "Marketing" | "Development";
  avatar?: string;
}

const users: UserData[] = [
  {
    id: 1,
    name: "Rahul",
    email: "abc@gmail.com",
    status: "Active",
    location: "Hyderabad",
    phone: "6002691095",
    group: "Design",
  },
  {
    id: 2,
    name: "Tom Cooper",
    email: "cooper@gmail.com",
    status: "Active",
    location: "United States",
    phone: "+65 9308 4744",
    group: "Design",
  },
  {
    id: 3,
    name: "Kristin Watson",
    email: "watson@gmail.com",
    status: "Inactive",
    location: "Germany",
    phone: "+62-896-5554-32",
    group: "Marketing",
  },
  {
    id: 4,
    name: "Annette Black",
    email: "a.black@gmail.com",
    status: "Active",
    location: "United States",
    phone: "+62-838-5558-34",
    group: "Design",
  },
  {
    id: 5,
    name: "Floyd Miles",
    email: "miles@gmail.com",
    status: "Inactive",
    location: "United States",
    phone: "+1-555-8701-158",
    group: "Development",
  },
  {
    id: 6,
    name: "Cody Fisher",
    email: "fisher@gmail.com",
    status: "Inactive",
    location: "United States",
    phone: "+61480013910",
    group: "Design",
  },
  {
    id: 7,
    name: "Theresa Web",
    email: "theresa@gmail.com",
    status: "Active",
    location: "France",
    phone: "+91 9163337392",
    group: "Development",
  },
];

const UserManagement = () => {
  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-500">
          Manage your team members and their access. Add, edit, view or remove users from your team.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Button className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Location</th>
                <th className="p-4 font-semibold text-gray-600">Phone</th>
                <th className="p-4 font-semibold text-gray-600">Group</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.location}</td>
                  <td className="p-4 text-gray-600">{user.phone}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.group === "Design"
                          ? "bg-blue-100 text-blue-800"
                          : user.group === "Marketing"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.group}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
