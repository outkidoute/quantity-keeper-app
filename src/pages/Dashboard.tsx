
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Package, AlertTriangle, ShoppingCart, DollarSign } from 'lucide-react';
import { DashboardStats, Product } from '@/types';
import { fetchDashboardStats, fetchProducts } from '@/services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, productsData] = await Promise.all([
          fetchDashboardStats(),
          fetchProducts()
        ]);
        
        setStats(statsData);
        setProducts(productsData);
        
        // Get low stock products
        const lowStock = productsData.filter(p => p.quantity > 0 && p.quantity <= 3);
        setLowStockProducts(lowStock);
        
        // Get top value products
        const topByValue = [...productsData]
          .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
          .slice(0, 5)
          .map(p => ({
            name: p.name,
            value: p.price * p.quantity
          }));
          
        setTopProducts(topByValue);
        
        // Aggregate by category
        const categoryMap = new Map();
        productsData.forEach(product => {
          if (product.category) {
            const categoryName = product.category.name;
            if (categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, {
                count: categoryMap.get(categoryName).count + 1,
                value: categoryMap.get(categoryName).value + (product.price * product.quantity)
              });
            } else {
              categoryMap.set(categoryName, {
                count: 1,
                value: product.price * product.quantity
              });
            }
          }
        });
        
        const categoryArray = Array.from(categoryMap).map(([name, data]) => ({
          name,
          count: data.count,
          value: data.value
        }));
        
        setCategoryData(categoryArray);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Products</p>
            <h3 className="text-2xl font-bold">{stats?.total_products}</h3>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
            <h3 className="text-2xl font-bold">{stats?.out_of_stock_count}</h3>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <ShoppingCart className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
            <h3 className="text-2xl font-bold">{stats?.low_stock_count}</h3>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Value</p>
            <h3 className="text-2xl font-bold">{formatCurrency(stats?.product_value || 0)}</h3>
          </div>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Value */}
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Top Products by Value</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Products by Category */}
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Inventory by Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Low Stock Products */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4">Low Stock Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">SKU</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">{product.sku}</td>
                    <td className="py-2 px-4">{product.category?.name}</td>
                    <td className="py-2 px-4">
                      <span className="bg-yellow-100 text-yellow-700 text-xs py-1 px-2 rounded-full font-medium">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="py-2 px-4">{formatCurrency(product.price)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">
                    No low stock products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
