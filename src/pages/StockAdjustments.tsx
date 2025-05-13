
import { useState, useEffect } from 'react';
import {
  fetchStockAdjustments,
  fetchProducts,
  createStockAdjustment
} from '@/services/api';
import { StockAdjustment, StockAdjustmentFormData, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const StockAdjustmentsPage = () => {
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<StockAdjustmentFormData>({
    product_id: 0,
    quantity: 0,
    type: 'addition',
    reason: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [adjustmentsData, productsData] = await Promise.all([
          fetchStockAdjustments(),
          fetchProducts()
        ]);
        setStockAdjustments(adjustmentsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load stock adjustments data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdjustments = stockAdjustments.filter((adjustment) => {
    const productName = adjustment.product?.name.toLowerCase() || '';
    const adjustmentReason = adjustment.reason.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      productName.includes(searchLower) ||
      adjustmentReason.includes(searchLower)
    );
  });

  const openAdjustmentForm = () => {
    setFormData({
      product_id: 0,
      quantity: 0,
      type: 'addition',
      reason: '',
    });
    setIsFormOpen(true);
  };

  const closeAdjustmentForm = () => {
    setIsFormOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(0, parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'product_id' ? parseInt(value, 10) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.product_id) {
      toast.error('Please select a product');
      return false;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than zero');
      return false;
    }
    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for the adjustment');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const newAdjustment = await createStockAdjustment(formData);
      
      // Refresh the stock adjustments list
      const adjustmentsData = await fetchStockAdjustments();
      setStockAdjustments(adjustmentsData);
      
      // Refresh the products list to show updated stock levels
      const productsData = await fetchProducts();
      setProducts(productsData);
      
      toast.success('Stock adjustment created successfully');
      closeAdjustmentForm();
    } catch (error: any) {
      console.error('Error creating stock adjustment:', error);
      toast.error(error.message || 'Failed to create stock adjustment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Stock Adjustments</h1>
          <p className="text-muted-foreground">Track and manage inventory changes</p>
        </div>
        <Button onClick={openAdjustmentForm} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Adjustment
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search adjustments..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAdjustments.length > 0 ? (
            filteredAdjustments.map((adjustment) => (
              <Card key={adjustment.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      adjustment.type === 'addition' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {adjustment.type === 'addition' 
                        ? <ArrowUpCircle className="h-5 w-5" /> 
                        : <ArrowDownCircle className="h-5 w-5" />
                      }
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {adjustment.product?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {adjustment.reason}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(adjustment.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      adjustment.type === 'addition' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {adjustment.type === 'addition' ? '+' : '-'}{adjustment.quantity}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      SKU: {adjustment.product?.sku}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No adjustments match your search' : 'No stock adjustments found'}
            </div>
          )}
        </div>
      )}

      {/* Stock Adjustment Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Stock Adjustment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select 
                  value={formData.product_id ? formData.product_id.toString() : undefined}
                  onValueChange={(value) => handleSelectChange('product_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} (Current: {product.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Adjustment Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="addition" id="addition" />
                    <Label htmlFor="addition" className="flex items-center space-x-1">
                      <ArrowUpCircle className="h-4 w-4 text-green-600" />
                      <span>Add Stock</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="subtraction" id="subtraction" />
                    <Label htmlFor="subtraction" className="flex items-center space-x-1">
                      <ArrowDownCircle className="h-4 w-4 text-red-600" />
                      <span>Remove Stock</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Enter reason for adjustment"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2 justify-end">
              <Button variant="outline" type="button" onClick={closeAdjustmentForm}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Adjustment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockAdjustmentsPage;
