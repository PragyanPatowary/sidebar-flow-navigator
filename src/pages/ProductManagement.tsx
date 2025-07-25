
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

interface ProductData {
  id: number;
  name: string;
  make: string;
  model: string;
  specification: string;
  hsnCode: string;
  price: number;
  gst: number;
  gstRate: number;
  totalPrice: number;
}

const initialProducts: ProductData[] = [
  {
    id: 1,
    name: "Laptop",
    make: "Dell",
    model: "XPS 13",
    specification: "i7, 16GB RAM, 512GB SSD",
    hsnCode: "8471300",
    price: 85000,
    gst: 15300,
    gstRate: 18,
    totalPrice: 100300,
  },
  {
    id: 2,
    name: "Smartphone",
    make: "Apple",
    model: "iPhone 15",
    specification: "256GB, Blue",
    hsnCode: "8517120",
    price: 90000,
    gst: 16200,
    gstRate: 18,
    totalPrice: 106200,
  },
];

const STORAGE_KEY = "dritu-enterprise-products";

const ProductManagement = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<ProductData, "id" | "gst" | "totalPrice" | "gstRate">>({
    name: "",
    make: "",
    model: "",
    specification: "",
    hsnCode: "",
    price: 0,
  });
  const [gstRate, setGstRate] = useState(18);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ProductData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Load products from localStorage on component mount
  useEffect(() => {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // If no products in localStorage, use initial products and save them
      setProducts(initialProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    }
  }, []);

  // Update localStorage whenever products change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Calculate GST and total price based on product price and GST rate
  const calculatePrices = (price: number, rate: number) => {
    const gstAmount = (price * rate) / 100;
    const totalPrice = price + gstAmount;
    return { gst: gstAmount, totalPrice };
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0;
    const rate = currentProduct ? currentProduct.gstRate : gstRate;
    
    if (currentProduct) {
      const { gst, totalPrice } = calculatePrices(price, rate);
      setCurrentProduct({
        ...currentProduct,
        price,
        gst,
        totalPrice,
      });
    } else {
      setNewProduct({
        ...newProduct,
        price,
      });
    }
  };

  const handleGstRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    
    if (currentProduct) {
      const { gst, totalPrice } = calculatePrices(currentProduct.price, rate);
      setCurrentProduct({
        ...currentProduct,
        gstRate: rate,
        gst,
        totalPrice,
      });
    } else {
      setGstRate(rate);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.make || !newProduct.model || !newProduct.hsnCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = Math.max(0, ...products.map(product => product.id)) + 1;
    const { gst, totalPrice } = calculatePrices(newProduct.price, gstRate);
    
    const productToAdd = { 
      ...newProduct, 
      id,
      gst,
      gstRate,
      totalPrice
    };
    
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    setIsAddProductOpen(false);
    setNewProduct({
      name: "",
      make: "",
      model: "",
      specification: "",
      hsnCode: "",
      price: 0,
    });
    setGstRate(18);
    toast.success("Product added successfully");
  };

  const handleUpdateProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.map(product => 
      product.id === currentProduct.id ? currentProduct : product
    );
    
    setProducts(updatedProducts);
    setIsEditProductOpen(false);
    toast.success("Product updated successfully");
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.filter(product => product.id !== currentProduct.id);
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    toast.success("Product deleted successfully");
  };

  const openViewProduct = (product: ProductData) => {
    setCurrentProduct(product);
    setIsViewProductOpen(true);
  };

  const openEditProduct = (product: ProductData) => {
    setCurrentProduct(product);
    setIsEditProductOpen(true);
  };

  const openDeleteDialog = (product: ProductData) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSort = (field: keyof ProductData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof ProductData) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />;
  };

  // Format price to Indian Rupees format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Filter and sort products based on search term and sort settings
  const filteredProducts = products
    .filter(product => 
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsnCode.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === "asc" 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      return 0;
    });

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <p className="text-gray-500">
          Manage your products inventory. Add, edit, view or remove products from your catalog.
        </p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Product Catalog</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]" 
              />
            </div>
            <Button className="flex items-center gap-2" onClick={() => setIsAddProductOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Product
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
                    Product Name {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('make')} className="cursor-pointer">
                  <div className="flex items-center">
                    Make {getSortIcon('make')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('model')} className="cursor-pointer">
                  <div className="flex items-center">
                    Model {getSortIcon('model')}
                  </div>
                </TableHead>
                <TableHead>HSN Code</TableHead>
                <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
                  <div className="flex items-center">
                    Price {getSortIcon('price')}
                  </div>
                </TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                  </TableCell>
                  <TableCell>{product.make}</TableCell>
                  <TableCell>{product.model}</TableCell>
                  <TableCell>{product.hsnCode}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{formatPrice(product.gst)} ({product.gstRate}%)</TableCell>
                  <TableCell>{formatPrice(product.totalPrice)}</TableCell>
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
                        <DropdownMenuItem onClick={() => openViewProduct(product)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditProduct(product)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(product)} 
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

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name*</Label>
              <Input 
                id="name" 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="make">Make*</Label>
              <Input 
                id="make" 
                value={newProduct.make} 
                onChange={(e) => setNewProduct({...newProduct, make: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model*</Label>
              <Input 
                id="model" 
                value={newProduct.model} 
                onChange={(e) => setNewProduct({...newProduct, model: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specification">Specifications</Label>
              <Textarea 
                id="specification" 
                value={newProduct.specification} 
                onChange={(e) => setNewProduct({...newProduct, specification: e.target.value})}
                className="min-h-[100px] resize-y"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hsnCode">HSN Code*</Label>
              <Input 
                id="hsnCode" 
                value={newProduct.hsnCode} 
                onChange={(e) => setNewProduct({...newProduct, hsnCode: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)*</Label>
              <Input 
                id="price" 
                type="number" 
                value={newProduct.price || ''} 
                onChange={handlePriceChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstRate">GST Rate (%)*</Label>
              <Input 
                id="gstRate" 
                type="number" 
                value={gstRate || ''} 
                onChange={handleGstRateChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>GST Amount</Label>
                <div className="mt-2 text-sm font-medium">
                  {formatPrice(calculatePrices(newProduct.price, gstRate).gst)}
                </div>
              </div>
              <div>
                <Label>Total Price</Label>
                <div className="mt-2 text-sm font-medium">
                  {formatPrice(calculatePrices(newProduct.price, gstRate).totalPrice)}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View product information.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium">Product:</span>
                <span>{currentProduct.name}</span>
                
                <span className="font-medium">Make:</span>
                <span>{currentProduct.make}</span>
                
                <span className="font-medium">Model:</span>
                <span>{currentProduct.model}</span>
                
                <span className="font-medium">Specifications:</span>
                <div className="whitespace-pre-wrap break-words">{currentProduct.specification}</div>
                
                <span className="font-medium">HSN Code:</span>
                <span>{currentProduct.hsnCode}</span>
                
                <span className="font-medium">Price:</span>
                <span>{formatPrice(currentProduct.price)}</span>
                
                <span className="font-medium">GST Rate:</span>
                <span>{currentProduct.gstRate}%</span>
                
                <span className="font-medium">GST Amount:</span>
                <span>{formatPrice(currentProduct.gst)}</span>
                
                <span className="font-medium">Total Price:</span>
                <span>{formatPrice(currentProduct.totalPrice)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewProductOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentProduct.name} 
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-make">Make</Label>
                <Input 
                  id="edit-make" 
                  value={currentProduct.make} 
                  onChange={(e) => setCurrentProduct({...currentProduct, make: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input 
                  id="edit-model" 
                  value={currentProduct.model} 
                  onChange={(e) => setCurrentProduct({...currentProduct, model: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specification">Specifications</Label>
                <Textarea 
                  id="edit-specification" 
                  value={currentProduct.specification} 
                  onChange={(e) => setCurrentProduct({...currentProduct, specification: e.target.value})}
                  className="min-h-[100px] resize-y"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-hsnCode">HSN Code</Label>
                <Input 
                  id="edit-hsnCode" 
                  value={currentProduct.hsnCode} 
                  onChange={(e) => setCurrentProduct({...currentProduct, hsnCode: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  value={currentProduct.price || ''} 
                  onChange={handlePriceChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gstRate">GST Rate (%)</Label>
                <Input 
                  id="edit-gstRate" 
                  type="number" 
                  value={currentProduct.gstRate || ''} 
                  onChange={handleGstRateChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GST Amount</Label>
                  <div className="mt-2 text-sm font-medium">
                    {formatPrice(currentProduct.gst)}
                  </div>
                </div>
                <div>
                  <Label>Total Price</Label>
                  <div className="mt-2 text-sm font-medium">
                    {formatPrice(currentProduct.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="py-4">
              <p>You are about to delete product <span className="font-medium">{currentProduct.name}</span>.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
