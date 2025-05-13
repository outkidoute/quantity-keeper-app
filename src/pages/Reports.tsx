
import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, fetchSuppliers } from '@/services/api';
import { Product, Category, Supplier } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertTriangle,
  BarChart3,
  Package,
  Tags,
  Truck,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData, suppliersData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSuppliers(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error loading report data:', error);
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const outOfStockProducts = products.filter((product) => product.quantity === 0);
  const lowStockProducts = products.filter((product) => product.quantity > 0 && product.quantity <= 3);
  const inStockProducts = products.filter((product) => product.quantity > 3);

  const totalInventoryValue = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  // Data for inventory status chart
  const inventoryStatusData = [
    { name: 'In Stock', value: inStockProducts.length, color: '#22c55e' },
    { name: 'Low Stock', value: lowStockProducts.length, color: '#f59e0b' },
    { name: 'Out of Stock', value: outOfStockProducts.length, color: '#ef4444' },
  ];

  // Data for category distribution
  const categoryData = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category_id === category.id);
    const productCount = categoryProducts.length;
    const categoryValue = categoryProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    
    return {
      name: category.name,
      productCount,
      value: categoryValue,
      color: getRandomColor(category.id),
    };
  });

  // Data for supplier distribution
  const supplierData = suppliers.map((supplier) => {
    const supplierProducts = products.filter((product) => product.supplier_id === supplier.id);
    const productCount = supplierProducts.length;
    const supplierValue = supplierProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    
    return {
      name: supplier.name,
      productCount,
      value: supplierValue,
      color: getRandomColor(supplier.id + 10), // Offset to get different colors
    };
  });

  // Data for top products by value
  const productValueData = [...products]
    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    .slice(0, 8)
    .map((product) => ({
      name: product.name,
      value: product.price * product.quantity,
      color: getRandomColor(product.id + 20), // Offset to get different colors
    }));

  function getRandomColor(seed: number) {
    const colors = [
      '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', // blues
      '#14b8a6', '#5eead4', '#2dd4bf', '#0d9488', // teals
      '#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', // purples
      '#ec4899', '#f472b6', '#f9a8d4', '#db2777', // pinks
    ];
    return colors[seed % colors.length];
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleExportCSV = (reportType: string) => {
    let data: any[] = [];
    let filename = '';

    switch (reportType) {
      case 'inventory':
        data = products.map(p => ({
          'Product Name': p.name,
          'SKU': p.sku,
          'Quantity': p.quantity,
          'Price': p.price,
          'Value': p.price * p.quantity,
          'Category': categories.find(c => c.id === p.category_id)?.name || 'Unknown',
          'Supplier': suppliers.find(s => s.id === p.supplier_id)?.name || 'Unknown',
          'Status': p.quantity === 0 ? 'Out of Stock' : p.quantity <= 3 ? 'Low Stock' : 'In Stock'
        }));
        filename = 'inventory_report.csv';
        break;
      case 'categories':
        data = categoryData.map(c => ({
          'Category': c.name,
          'Product Count': c.productCount,
          'Total Value': c.value
        }));
        filename = 'category_report.csv';
        break;
      case 'suppliers':
        data = supplierData.map(s => ({
          'Supplier': s.name,
          'Product Count': s.productCount,
          'Total Value': s.value
        }));
        filename = 'supplier_report.csv';
        break;
    }

    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, filename);
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape quotes and format values
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">View and export inventory reports</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Suppliers</span>
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Inventory Status Report</h2>
                <Button variant="outline" onClick={() => handleExportCSV('inventory')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              {/* Inventory Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-500">{lowStockProducts.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Inventory Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={inventoryStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {inventoryStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Products']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Products by Value */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Value</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productValueData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="value" name="Value">
                          {productValueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Category Report</h2>
                <Button variant="outline" onClick={() => handleExportCSV('categories')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              {/* Category Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Product Distribution */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Product Distribution by Category</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="productCount"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Products']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Category Value Distribution */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Value Distribution by Category</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Category Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Category</th>
                          <th className="py-2 px-4 text-left">Products</th>
                          <th className="py-2 px-4 text-left">Avg. Price</th>
                          <th className="py-2 px-4 text-left">Total Quantity</th>
                          <th className="py-2 px-4 text-left">Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryData.map((category, index) => {
                          const categoryProducts = products.filter(p => p.category_id === categories.find(c => c.name === category.name)?.id);
                          const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
                          const avgPrice = categoryProducts.length > 0 
                            ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length
                            : 0;
                            
                          return (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-4">{category.name}</td>
                              <td className="py-2 px-4">{category.productCount}</td>
                              <td className="py-2 px-4">{formatCurrency(avgPrice)}</td>
                              <td className="py-2 px-4">{totalQuantity}</td>
                              <td className="py-2 px-4">{formatCurrency(category.value)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Suppliers Tab */}
            <TabsContent value="suppliers" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Supplier Report</h2>
                <Button variant="outline" onClick={() => handleExportCSV('suppliers')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              {/* Supplier Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supplier Product Distribution */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Product Distribution by Supplier</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={supplierData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="productCount"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {supplierData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Products']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Supplier Value Distribution */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Value Distribution by Supplier</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={supplierData.sort((a, b) => b.value - a.value)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end"
                            height={70}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tickFormatter={(value) => formatCurrency(value).split('.')[0]} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="value" name="Value">
                            {supplierData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Supplier Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Supplier</th>
                          <th className="py-2 px-4 text-left">Products</th>
                          <th className="py-2 px-4 text-left">Inventory Value</th>
                          <th className="py-2 px-4 text-left">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((supplier) => {
                          const supplierProducts = products.filter(p => p.supplier_id === supplier.id);
                          const totalValue = supplierProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
                            
                          return (
                            <tr key={supplier.id} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-4">{supplier.name}</td>
                              <td className="py-2 px-4">{supplierProducts.length}</td>
                              <td className="py-2 px-4">{formatCurrency(totalValue)}</td>
                              <td className="py-2 px-4">
                                {supplier.email && (
                                  <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                                    {supplier.email}
                                  </a>
                                )}
                                {!supplier.email && <span className="text-muted-foreground">No contact info</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ReportsPage;
