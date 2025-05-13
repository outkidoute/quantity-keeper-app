
import { 
  Product, ProductFormData, 
  Category, CategoryFormData, 
  Supplier, SupplierFormData,
  StockAdjustment, StockAdjustmentFormData,
  DashboardStats
} from '@/types';

// Demo data
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    sku: 'DELL-XPS-13',
    quantity: 15,
    price: 1299.99,
    category_id: 1,
    supplier_id: 1,
    created_at: '2023-05-15T10:30:00',
    updated_at: '2023-05-15T10:30:00'
  },
  {
    id: 2,
    name: 'iPhone 14 Pro',
    sku: 'APPLE-IP14-PRO',
    quantity: 8,
    price: 999.99,
    category_id: 2,
    supplier_id: 2,
    created_at: '2023-05-16T09:15:00',
    updated_at: '2023-05-16T09:15:00'
  },
  {
    id: 3,
    name: 'Logitech MX Master 3',
    sku: 'LOG-MX-M3',
    quantity: 3,
    price: 99.99,
    category_id: 3,
    supplier_id: 3,
    created_at: '2023-05-17T14:45:00',
    updated_at: '2023-05-17T14:45:00'
  },
  {
    id: 4,
    name: 'Samsung 32" Monitor',
    sku: 'SAM-MON-32',
    quantity: 0,
    price: 349.99,
    category_id: 4,
    supplier_id: 4,
    created_at: '2023-05-18T11:20:00',
    updated_at: '2023-05-18T11:20:00'
  },
  {
    id: 5,
    name: 'Keychron K2 Keyboard',
    sku: 'KEY-K2-MEC',
    quantity: 2,
    price: 89.99,
    category_id: 3,
    supplier_id: 3,
    created_at: '2023-05-19T16:30:00',
    updated_at: '2023-05-19T16:30:00'
  }
];

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Laptops',
    description: 'Portable computers for work and play',
    created_at: '2023-05-01T08:00:00',
    updated_at: '2023-05-01T08:00:00'
  },
  {
    id: 2,
    name: 'Smartphones',
    description: 'Mobile phones with advanced features',
    created_at: '2023-05-01T08:15:00',
    updated_at: '2023-05-01T08:15:00'
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Computer and device accessories',
    created_at: '2023-05-01T08:30:00',
    updated_at: '2023-05-01T08:30:00'
  },
  {
    id: 4,
    name: 'Monitors',
    description: 'Display screens for computers',
    created_at: '2023-05-01T08:45:00',
    updated_at: '2023-05-01T08:45:00'
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Dell Technologies',
    email: 'supply@dell.com',
    phone: '1-800-624-9897',
    address: '1 Dell Way, Round Rock, TX 78682',
    created_at: '2023-05-01T09:00:00',
    updated_at: '2023-05-01T09:00:00'
  },
  {
    id: 2,
    name: 'Apple Inc.',
    email: 'supply@apple.com',
    phone: '1-800-275-2273',
    address: 'One Apple Park Way, Cupertino, CA 95014',
    created_at: '2023-05-01T09:15:00',
    updated_at: '2023-05-01T09:15:00'
  },
  {
    id: 3,
    name: 'Logitech International',
    email: 'supply@logitech.com',
    phone: '1-510-795-8500',
    address: '7700 Gateway Blvd, Newark, CA 94560',
    created_at: '2023-05-01T09:30:00',
    updated_at: '2023-05-01T09:30:00'
  },
  {
    id: 4,
    name: 'Samsung Electronics',
    email: 'supply@samsung.com',
    phone: '1-800-726-7864',
    address: '85 Challenger Rd, Ridgefield Park, NJ 07660',
    created_at: '2023-05-01T09:45:00',
    updated_at: '2023-05-01T09:45:00'
  }
];

const mockStockAdjustments: StockAdjustment[] = [
  {
    id: 1,
    product_id: 1,
    quantity: 5,
    type: 'addition',
    reason: 'New shipment received',
    created_at: '2023-05-20T10:15:00',
    updated_at: '2023-05-20T10:15:00'
  },
  {
    id: 2,
    product_id: 2,
    quantity: 2,
    type: 'subtraction',
    reason: 'Damaged in storage',
    created_at: '2023-05-21T11:30:00',
    updated_at: '2023-05-21T11:30:00'
  },
  {
    id: 3,
    product_id: 3,
    quantity: 10,
    type: 'addition',
    reason: 'Initial inventory',
    created_at: '2023-05-22T09:45:00',
    updated_at: '2023-05-22T09:45:00'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Products API
export const fetchProducts = async (): Promise<Product[]> => {
  await delay(500);
  return [...mockProducts].map(product => ({
    ...product,
    category: mockCategories.find(c => c.id === product.category_id),
    supplier: mockSuppliers.find(s => s.id === product.supplier_id)
  }));
};

export const fetchProduct = async (id: number): Promise<Product> => {
  await delay(300);
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return {
    ...product,
    category: mockCategories.find(c => c.id === product.category_id),
    supplier: mockSuppliers.find(s => s.id === product.supplier_id)
  };
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  await delay(700);
  const newProduct: Product = {
    id: mockProducts.length + 1,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: number, data: ProductFormData): Promise<Product> => {
  await delay(600);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const updatedProduct = {
    ...mockProducts[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  mockProducts[index] = updatedProduct;
  return updatedProduct;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  mockProducts.splice(index, 1);
};

// Categories API
export const fetchCategories = async (): Promise<Category[]> => {
  await delay(300);
  return [...mockCategories];
};

export const fetchCategory = async (id: number): Promise<Category> => {
  await delay(200);
  const category = mockCategories.find(c => c.id === id);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const createCategory = async (data: CategoryFormData): Promise<Category> => {
  await delay(500);
  const newCategory: Category = {
    id: mockCategories.length + 1,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockCategories.push(newCategory);
  return newCategory;
};

export const updateCategory = async (id: number, data: CategoryFormData): Promise<Category> => {
  await delay(400);
  const index = mockCategories.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  const updatedCategory = {
    ...mockCategories[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  mockCategories[index] = updatedCategory;
  return updatedCategory;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await delay(400);
  const index = mockCategories.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  mockCategories.splice(index, 1);
};

// Suppliers API
export const fetchSuppliers = async (): Promise<Supplier[]> => {
  await delay(300);
  return [...mockSuppliers];
};

export const fetchSupplier = async (id: number): Promise<Supplier> => {
  await delay(200);
  const supplier = mockSuppliers.find(s => s.id === id);
  if (!supplier) {
    throw new Error('Supplier not found');
  }
  return supplier;
};

export const createSupplier = async (data: SupplierFormData): Promise<Supplier> => {
  await delay(500);
  const newSupplier: Supplier = {
    id: mockSuppliers.length + 1,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockSuppliers.push(newSupplier);
  return newSupplier;
};

export const updateSupplier = async (id: number, data: SupplierFormData): Promise<Supplier> => {
  await delay(400);
  const index = mockSuppliers.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Supplier not found');
  }
  const updatedSupplier = {
    ...mockSuppliers[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  mockSuppliers[index] = updatedSupplier;
  return updatedSupplier;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await delay(400);
  const index = mockSuppliers.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Supplier not found');
  }
  mockSuppliers.splice(index, 1);
};

// Stock Adjustments API
export const fetchStockAdjustments = async (): Promise<StockAdjustment[]> => {
  await delay(400);
  return [...mockStockAdjustments].map(adjustment => ({
    ...adjustment,
    product: mockProducts.find(p => p.id === adjustment.product_id)
  }));
};

export const createStockAdjustment = async (data: StockAdjustmentFormData): Promise<StockAdjustment> => {
  await delay(600);
  
  // Find the product
  const productIndex = mockProducts.findIndex(p => p.id === data.product_id);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  // Update the product quantity
  const product = mockProducts[productIndex];
  const newQuantity = data.type === 'addition' 
    ? product.quantity + data.quantity 
    : product.quantity - data.quantity;
  
  if (newQuantity < 0) {
    throw new Error('Cannot reduce stock below zero');
  }
  
  mockProducts[productIndex] = {
    ...product,
    quantity: newQuantity,
    updated_at: new Date().toISOString()
  };
  
  // Create the adjustment record
  const newAdjustment: StockAdjustment = {
    id: mockStockAdjustments.length + 1,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockStockAdjustments.push(newAdjustment);
  return newAdjustment;
};

// Dashboard stats API
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await delay(500);
  
  const total_products = mockProducts.length;
  const out_of_stock_count = mockProducts.filter(p => p.quantity === 0).length;
  const low_stock_count = mockProducts.filter(p => p.quantity > 0 && p.quantity <= 3).length;
  const product_value = mockProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  
  return {
    total_products,
    out_of_stock_count,
    low_stock_count,
    product_value
  };
};

// For searching across products
export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  
  return mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.sku.toLowerCase().includes(lowerQuery)
    )
    .map(product => ({
      ...product,
      category: mockCategories.find(c => c.id === product.category_id),
      supplier: mockSuppliers.find(s => s.id === product.supplier_id)
    }));
};
