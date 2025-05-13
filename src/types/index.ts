
// User types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category_id: number;
  supplier_id: number;
  category?: Category;
  supplier?: Supplier;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category_id: number;
  supplier_id: number;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

// Supplier types
export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Stock adjustment types
export interface StockAdjustment {
  id: number;
  product_id: number;
  quantity: number;
  type: 'addition' | 'subtraction';
  reason: string;
  product?: Product;
  created_at: string;
  updated_at: string;
}

export interface StockAdjustmentFormData {
  product_id: number;
  quantity: number;
  type: 'addition' | 'subtraction';
  reason: string;
}

// Dashboard stats types
export interface DashboardStats {
  total_products: number;
  out_of_stock_count: number;
  low_stock_count: number;
  product_value: number;
}
