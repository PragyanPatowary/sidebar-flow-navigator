
import React, { useState } from "react";
import { 
  Edit, 
  Trash2, 
  FileText 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";

// Sample service data
const initialServices = [
  {
    id: 1,
    name: "Annual Maintenance Contract",
    shortName: "AMC",
    category: "Hardware",
    warrantyApplicable: "No",
    billingType: "Chargeable",
    linkedProducts: ["Servers", "Desktops"]
  },
  {
    id: 2,
    name: "System Repair",
    shortName: "REP",
    category: "Hardware",
    warrantyApplicable: "Conditional",
    billingType: "Chargeable",
    linkedProducts: ["Laptops", "Printers"]
  },
  {
    id: 3,
    name: "Software Installation",
    shortName: "SFTINST",
    category: "Software",
    warrantyApplicable: "Yes",
    billingType: "Free",
    linkedProducts: ["Operating Systems", "Office Suite"]
  },
  {
    id: 4,
    name: "Part Replacement",
    shortName: "PART",
    category: "Consumable",
    warrantyApplicable: "Yes",
    billingType: "Under Warranty",
    linkedProducts: ["Printer Cartridges", "Keyboard"]
  },
];

export const ServicesList = () => {
  const { toast } = useToast();
  const [services] = useState(initialServices);

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Short Name",
      accessorKey: "shortName",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-100">
          {row.original.category}
        </Badge>
      )
    },
    {
      header: "Warranty Applicable",
      accessorKey: "warrantyApplicable",
      cell: ({ row }) => {
        const warranty = row.original.warrantyApplicable;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            warranty === "Yes" ? "bg-green-100 text-green-800" : 
            warranty === "No" ? "bg-red-100 text-red-800" : 
            "bg-yellow-100 text-yellow-800"
          }`}>
            {warranty}
          </span>
        );
      }
    },
    {
      header: "Billing Type",
      accessorKey: "billingType",
      cell: ({ row }) => {
        const billing = row.original.billingType;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            billing === "Free" ? "bg-blue-100 text-blue-800" : 
            billing === "Chargeable" ? "bg-purple-100 text-purple-800" : 
            billing === "Consumable" ? "bg-orange-100 text-orange-800" : 
            "bg-green-100 text-green-800"
          }`}>
            {billing}
          </span>
        );
      }
    },
    {
      header: "Linked Products",
      accessorKey: "linkedProducts",
      cell: ({ row }) => {
        const products = row.original.linkedProducts;
        return (
          <div className="flex flex-wrap gap-1">
            {products.map((product, index) => (
              <Badge key={index} variant="outline" className="bg-slate-50">
                {product}
              </Badge>
            ))}
          </div>
        );
      }
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
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleEdit = (service) => {
    toast({
      title: "Edit Service",
      description: `Editing ${service.name}`,
    });
  };

  const handleDelete = (service) => {
    toast({
      title: "Delete Service",
      description: `Request to delete ${service.name}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={services}
        searchPlaceholder="Search services..."
      />
    </div>
  );
};
