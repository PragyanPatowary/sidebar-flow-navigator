
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Printer, MoreVertical, FileText, Download } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

// Types
interface ProductItem {
  id: number;
  name: string;
  make: string;
  model: string;
  specification: string;
  hsnCode: string;
  price: number;
  quantity: number;
  gst: number;
  totalPrice: number;
}

interface QuotationData {
  id: number;
  referenceId: string;
  date: string;
  validUntil: string;
  clientId: number;
  clientName: string;
  clientCompany: string;
  products: ProductItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  termsConditions: {
    validity: string;
    deliveryTime: string;
    warranty: string;
    paymentTerms: string;
  };
  status: "draft" | "sent" | "accepted" | "rejected";
}

interface ClientOption {
  id: number;
  name: string;
  institution: string;
  department: string;
}

interface ProductOption {
  id: number;
  name: string;
  make: string;
  model: string;
  specification: string;
  hsnCode: string;
  price: number;
  gst: number;
  totalPrice: number;
}

// Initial data
const initialQuotations: QuotationData[] = [
  {
    id: 1,
    referenceId: "QT-2025-001",
    date: "2025-05-15",
    validUntil: "2025-06-15",
    clientId: 1,
    clientName: "Dr. Rahul Sharma",
    clientCompany: "City Hospital",
    products: [
      {
        id: 1,
        name: "Laptop",
        make: "Dell",
        model: "XPS 13",
        specification: "i7, 16GB RAM, 512GB SSD",
        hsnCode: "8471300",
        price: 85000,
        quantity: 2,
        gst: 15300 * 2,
        totalPrice: 100300 * 2,
      },
    ],
    subtotal: 85000 * 2,
    gstTotal: 15300 * 2,
    grandTotal: 100300 * 2,
    termsConditions: {
      validity: "30 days from the date of quotation",
      deliveryTime: "2-3 weeks after order confirmation",
      warranty: "1 year standard warranty",
      paymentTerms: "100% advance payment",
    },
    status: "sent",
  },
];

// Default terms and conditions
const defaultTermsConditions = {
  validity: "30 days from the date of quotation",
  deliveryTime: "2-3 weeks after order confirmation",
  warranty: "1 year standard warranty",
  paymentTerms: "100% advance payment",
};

const STORAGE_KEY = "dritu-enterprise-quotations";
const CLIENTS_STORAGE_KEY = "dritu-enterprise-clients";
const PRODUCTS_STORAGE_KEY = "dritu-enterprise-products";

const QuotationMaster = () => {
  const { toast } = useToast();
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);
  const [isViewQuotationOpen, setIsViewQuotationOpen] = useState(false);
  const [isEditQuotationOpen, setIsEditQuotationOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  
  const [currentQuotation, setCurrentQuotation] = useState<QuotationData | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);

  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const form = useForm({
    defaultValues: {
      clientId: "",
      products: [{ productId: "", quantity: 1 }],
      termsConditions: {
        validity: defaultTermsConditions.validity,
        deliveryTime: defaultTermsConditions.deliveryTime,
        warranty: defaultTermsConditions.warranty,
        paymentTerms: defaultTermsConditions.paymentTerms,
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load quotations
    const storedQuotations = localStorage.getItem(STORAGE_KEY);
    if (storedQuotations) {
      setQuotations(JSON.parse(storedQuotations));
    } else {
      // If no quotations in localStorage, use initial quotations and save them
      setQuotations(initialQuotations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialQuotations));
    }

    // Load clients
    const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (storedClients) {
      const parsedClients = JSON.parse(storedClients);
      setClients(parsedClients.map((client: any) => ({
        id: client.id,
        name: client.name,
        institution: client.institution,
        department: client.department
      })));
    }

    // Load products
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Update localStorage whenever quotations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
  }, [quotations]);

  // Generate a new reference ID based on the current year and quotation count
  const generateReferenceId = () => {
    const year = new Date().getFullYear();
    const count = quotations.length + 1;
    return `QT-${year}-${count.toString().padStart(3, '0')}`;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Calculate quotation future validity date (30 days from now)
  const calculateValidUntil = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return formatDate(date);
  };

  // Calculate totals based on selected products and quantities
  const calculateTotals = (productItems: ProductItem[]) => {
    const subtotal = productItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstTotal = productItems.reduce((sum, item) => sum + (item.gst * item.quantity), 0);
    const grandTotal = productItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    
    return { subtotal, gstTotal, grandTotal };
  };

  const handleProductSelect = (productId: string, index: number, quantity: number) => {
    const product = products.find(p => p.id.toString() === productId);
    if (!product) return;
    
    const updatedProducts = [...selectedProducts];
    
    updatedProducts[index] = {
      ...product,
      quantity,
      gst: product.gst * quantity,
      totalPrice: product.totalPrice * quantity
    };
    
    setSelectedProducts(updatedProducts);
  };
  
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];
    
    if (product) {
      const basePrice = product.price / product.quantity;
      const baseGst = (product.gst / product.quantity);
      const baseTotalPrice = (product.totalPrice / product.quantity);
      
      updatedProducts[index] = {
        ...product,
        quantity,
        price: basePrice * quantity,
        gst: baseGst * quantity,
        totalPrice: baseTotalPrice * quantity
      };
      
      setSelectedProducts(updatedProducts);
    }
  };

  const handleAddProduct = () => {
    append({ productId: "", quantity: 1 });
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
    
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const onSubmitQuotation = (data: any) => {
    // Validate required fields
    if (!data.clientId || selectedProducts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a client and at least one product",
        variant: "destructive",
      });
      return;
    }
    
    const selectedClient = clients.find(client => client.id.toString() === data.clientId);
    if (!selectedClient) {
      toast({
        title: "Client Error",
        description: "Selected client not found",
        variant: "destructive",
      });
      return;
    }
    
    const { subtotal, gstTotal, grandTotal } = calculateTotals(selectedProducts);
    
    const newQuotation: QuotationData = {
      id: Math.max(0, ...quotations.map(quotation => quotation.id)) + 1,
      referenceId: generateReferenceId(),
      date: formatDate(new Date()),
      validUntil: calculateValidUntil(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientCompany: selectedClient.institution,
      products: selectedProducts,
      subtotal,
      gstTotal,
      grandTotal,
      termsConditions: {
        validity: data.termsConditions.validity,
        deliveryTime: data.termsConditions.deliveryTime,
        warranty: data.termsConditions.warranty,
        paymentTerms: data.termsConditions.paymentTerms,
      },
      status: "draft"
    };
    
    setQuotations([...quotations, newQuotation]);
    setIsAddQuotationOpen(false);
    
    // Reset form and selected products
    form.reset();
    setSelectedProducts([]);
    
    toast({
      title: "Success",
      description: "Quotation created successfully",
    });
  };

  const handleUpdateQuotation = () => {
    if (!currentQuotation) return;
    
    const updatedQuotations = quotations.map(quotation => 
      quotation.id === currentQuotation.id ? currentQuotation : quotation
    );
    
    setQuotations(updatedQuotations);
    setIsEditQuotationOpen(false);
    
    toast({
      title: "Success",
      description: "Quotation updated successfully",
    });
  };

  const handleDeleteQuotation = () => {
    if (!currentQuotation) return;
    
    const updatedQuotations = quotations.filter(quotation => quotation.id !== currentQuotation.id);
    setQuotations(updatedQuotations);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Quotation deleted successfully",
    });
  };

  const openViewQuotation = (quotation: QuotationData) => {
    setCurrentQuotation(quotation);
    setIsViewQuotationOpen(true);
  };

  const openEditQuotation = (quotation: QuotationData) => {
    setCurrentQuotation(quotation);
    setIsEditQuotationOpen(true);
  };

  const openDeleteDialog = (quotation: QuotationData) => {
    setCurrentQuotation(quotation);
    setIsDeleteDialogOpen(true);
  };

  const openPrintPreview = (quotation: QuotationData) => {
    setCurrentQuotation(quotation);
    setIsPrintPreviewOpen(true);
  };

  const handlePrint = () => {
    if (printFrameRef.current && printFrameRef.current.contentWindow) {
      printFrameRef.current.contentWindow.print();
    }
  };

  // Format currency to Indian Rupees format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Quotation Management</h1>
        <p className="text-gray-500">
          Create, manage, and print quotations for your clients.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Quotation Master</h2>
          <Button className="flex items-center gap-2" onClick={() => setIsAddQuotationOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Quotation
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No quotations found. Create a quotation to get started.
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell>
                      <div className="font-medium">{quotation.referenceId}</div>
                    </TableCell>
                    <TableCell>{formatDisplayDate(quotation.date)}</TableCell>
                    <TableCell>{quotation.clientName}</TableCell>
                    <TableCell>{quotation.clientCompany}</TableCell>
                    <TableCell>{formatCurrency(quotation.grandTotal)}</TableCell>
                    <TableCell>{formatDisplayDate(quotation.validUntil)}</TableCell>
                    <TableCell>
                      <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(quotation.status)}`}>
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
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
                          <DropdownMenuItem onClick={() => openViewQuotation(quotation)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPrintPreview(quotation)} className="cursor-pointer">
                            <Printer className="mr-2 h-4 w-4" />
                            <span>Print Preview</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditQuotation(quotation)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(quotation)} 
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

      {/* Add Quotation Dialog */}
      <Dialog open={isAddQuotationOpen} onOpenChange={setIsAddQuotationOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Quotation</DialogTitle>
            <DialogDescription>
              Generate a new quotation for your client.
            </DialogDescription>
          </DialogHeader>
          
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmitQuotation)} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name} - {client.institution}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border p-4 rounded-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Products</h3>
                    <Button type="button" size="sm" onClick={handleAddProduct} className="h-8">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </Button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b pb-4">
                      <div className="md:col-span-6">
                        <FormField
                          control={form.control}
                          name={`products.${index}.productId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleProductSelect(value, index, form.getValues(`products.${index}.quantity`));
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                      {product.name} - {product.model}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`products.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    const qty = parseInt(e.target.value) || 1;
                                    field.onChange(qty);
                                    handleQuantityChange(index, qty);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-3 text-sm">
                        {selectedProducts[index] && (
                          <div className="space-y-1">
                            <p><span className="font-medium">Unit Price:</span> {formatCurrency(selectedProducts[index].price / selectedProducts[index].quantity)}</p>
                            <p><span className="font-medium">Total:</span> {formatCurrency(selectedProducts[index].totalPrice)}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProduct(index)}
                          disabled={fields.length === 1}
                          className="h-10 w-10 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {selectedProducts.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(calculateTotals(selectedProducts).subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>GST:</span>
                        <span className="font-medium">{formatCurrency(calculateTotals(selectedProducts).gstTotal)}</span>
                      </div>
                      <div className="flex justify-between text-base mt-2">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">{formatCurrency(calculateTotals(selectedProducts).grandTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Terms & Conditions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="termsConditions.validity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Validity</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="termsConditions.deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Time</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="termsConditions.warranty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="termsConditions.paymentTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Terms</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddQuotationOpen(false)}>Cancel</Button>
                <Button type="submit">Create Quotation</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* View Quotation Dialog */}
      <Dialog open={isViewQuotationOpen} onOpenChange={setIsViewQuotationOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
            <DialogDescription>
              View quotation information.
            </DialogDescription>
          </DialogHeader>
          
          {currentQuotation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quotation Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Reference:</span> {currentQuotation.referenceId}</p>
                    <p><span className="font-medium">Date:</span> {formatDisplayDate(currentQuotation.date)}</p>
                    <p><span className="font-medium">Valid Until:</span> {formatDisplayDate(currentQuotation.validUntil)}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(currentQuotation.status)}`}>
                        {currentQuotation.status.charAt(0).toUpperCase() + currentQuotation.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {currentQuotation.clientName}</p>
                    <p><span className="font-medium">Company:</span> {currentQuotation.clientCompany}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Products</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Specification</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">GST</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentQuotation.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.make} {product.model}</div>
                          </TableCell>
                          <TableCell>{product.specification}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.price / product.quantity)}</TableCell>
                          <TableCell className="text-right">{product.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.gst)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>Subtotal</TableCell>
                        <TableCell className="text-right">{formatCurrency(currentQuotation.gstTotal)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(currentQuotation.subtotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>GST Total</TableCell>
                        <TableCell colSpan={2} className="text-right">{formatCurrency(currentQuotation.gstTotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>Grand Total</TableCell>
                        <TableCell colSpan={2} className="text-right font-bold">{formatCurrency(currentQuotation.grandTotal)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Terms & Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <p className="text-xs font-medium mb-1">Validity</p>
                    <p className="text-sm">{currentQuotation.termsConditions.validity}</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-xs font-medium mb-1">Delivery Time</p>
                    <p className="text-sm">{currentQuotation.termsConditions.deliveryTime}</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-xs font-medium mb-1">Warranty</p>
                    <p className="text-sm">{currentQuotation.termsConditions.warranty}</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-xs font-medium mb-1">Payment Terms</p>
                    <p className="text-sm">{currentQuotation.termsConditions.paymentTerms}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={() => openPrintPreview(currentQuotation!)}
            >
              <Printer className="h-4 w-4" />
              Print Preview
            </Button>
            <Button onClick={() => setIsViewQuotationOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
            <DialogDescription>
              Preview and print the quotation.
            </DialogDescription>
          </DialogHeader>
          
          {currentQuotation && (
            <div className="relative">
              <div className="bg-white border rounded-md overflow-hidden h-[60vh]">
                <iframe
                  ref={printFrameRef}
                  title="print-preview"
                  className="w-full h-full"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>Quotation ${currentQuotation.referenceId}</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; }
                        .quotation-info { margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                        th { background-color: #f5f5f5; }
                        .text-right { text-align: right; }
                        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
                        .terms { margin-top: 20px; }
                        .terms h3 { margin-bottom: 10px; }
                        .page-break { page-break-before: always; }
                        @media print {
                          body { padding: 0; margin: 20px; }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div class="logo">DRITU ENTERPRISE</div>
                        <div>
                          <h2>QUOTATION</h2>
                          <p><strong>Ref:</strong> ${currentQuotation.referenceId}</p>
                          <p><strong>Date:</strong> ${formatDisplayDate(currentQuotation.date)}</p>
                        </div>
                      </div>
                      
                      <div class="quotation-info">
                        <p><strong>To:</strong><br/>
                        ${currentQuotation.clientName}<br/>
                        ${currentQuotation.clientCompany}</p>
                        
                        <p><strong>Valid Until:</strong> ${formatDisplayDate(currentQuotation.validUntil)}</p>
                      </div>
                      
                      <table>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Description</th>
                            <th class="text-right">Price (₹)</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">GST (₹)</th>
                            <th class="text-right">Total (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${currentQuotation.products.map(product => `
                            <tr>
                              <td>
                                <strong>${product.name}</strong><br/>
                                <small>${product.make} ${product.model}</small>
                              </td>
                              <td>${product.specification}</td>
                              <td class="text-right">${new Intl.NumberFormat('en-IN').format(product.price / product.quantity)}</td>
                              <td class="text-right">${product.quantity}</td>
                              <td class="text-right">${new Intl.NumberFormat('en-IN').format(product.gst)}</td>
                              <td class="text-right">${new Intl.NumberFormat('en-IN').format(product.totalPrice)}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="4"></td>
                            <td class="text-right"><strong>Subtotal:</strong></td>
                            <td class="text-right">${new Intl.NumberFormat('en-IN').format(currentQuotation.subtotal)}</td>
                          </tr>
                          <tr>
                            <td colspan="4"></td>
                            <td class="text-right"><strong>GST:</strong></td>
                            <td class="text-right">${new Intl.NumberFormat('en-IN').format(currentQuotation.gstTotal)}</td>
                          </tr>
                          <tr>
                            <td colspan="4"></td>
                            <td class="text-right"><strong>Grand Total:</strong></td>
                            <td class="text-right"><strong>${new Intl.NumberFormat('en-IN').format(currentQuotation.grandTotal)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                      
                      <div class="page-break"></div>
                      
                      <div class="terms">
                        <h3>Terms & Conditions</h3>
                        <p><strong>1. Validity:</strong> ${currentQuotation.termsConditions.validity}</p>
                        <p><strong>2. Delivery Time:</strong> ${currentQuotation.termsConditions.deliveryTime}</p>
                        <p><strong>3. Warranty:</strong> ${currentQuotation.termsConditions.warranty}</p>
                        <p><strong>4. Payment Terms:</strong> ${currentQuotation.termsConditions.paymentTerms}</p>
                        <p><strong>5. Taxes:</strong> All prices are inclusive of applicable GST.</p>
                        <p><strong>6. Installation:</strong> Installation charges are included in the price unless specified otherwise.</p>
                        <p><strong>7. Shipping:</strong> Shipping charges are extra and will be charged as per actuals.</p>
                        <p><strong>8. Cancellation:</strong> Orders once placed cannot be cancelled without proper written consent from Dritu Enterprise.</p>
                      </div>
                      
                      <div class="footer">
                        <p>Thank you for your business!</p>
                        <p><strong>DRITU ENTERPRISE</strong><br/>
                        123 Business Park, Mumbai - 400001<br/>
                        Phone: +91 9876543210<br/>
                        Email: info@dritu.com</p>
                      </div>
                    </body>
                    </html>
                  `}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPrintPreviewOpen(false)}>Close</Button>
            <Button className="flex items-center gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quotation Dialog */}
      <Dialog open={isEditQuotationOpen} onOpenChange={setIsEditQuotationOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Quotation Status</DialogTitle>
            <DialogDescription>
              Update the quotation status and terms.
            </DialogDescription>
          </DialogHeader>
          {currentQuotation && (
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Quotation Status</Label>
                <Select
                  value={currentQuotation.status}
                  onValueChange={(value: "draft" | "sent" | "accepted" | "rejected") => 
                    setCurrentQuotation({...currentQuotation, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-4">
                <h3 className="text-sm font-medium">Terms & Conditions</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="validity">Validity</Label>
                  <Input 
                    id="validity"
                    value={currentQuotation.termsConditions.validity}
                    onChange={(e) => setCurrentQuotation({
                      ...currentQuotation,
                      termsConditions: {
                        ...currentQuotation.termsConditions,
                        validity: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="deliveryTime">Delivery Time</Label>
                  <Input 
                    id="deliveryTime"
                    value={currentQuotation.termsConditions.deliveryTime}
                    onChange={(e) => setCurrentQuotation({
                      ...currentQuotation,
                      termsConditions: {
                        ...currentQuotation.termsConditions,
                        deliveryTime: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input 
                    id="warranty"
                    value={currentQuotation.termsConditions.warranty}
                    onChange={(e) => setCurrentQuotation({
                      ...currentQuotation,
                      termsConditions: {
                        ...currentQuotation.termsConditions,
                        warranty: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Input 
                    id="paymentTerms"
                    value={currentQuotation.termsConditions.paymentTerms}
                    onChange={(e) => setCurrentQuotation({
                      ...currentQuotation,
                      termsConditions: {
                        ...currentQuotation.termsConditions,
                        paymentTerms: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditQuotationOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateQuotation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quotation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quotation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentQuotation && (
            <div className="py-4">
              <p>You are about to delete quotation <span className="font-medium">{currentQuotation.referenceId}</span> for client <span className="font-medium">{currentQuotation.clientName}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteQuotation}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationMaster;
