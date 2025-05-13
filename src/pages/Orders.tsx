
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Trash2, Edit, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Order } from '@/types';

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real app, this would fetch from the API
  const fetchOrders = async () => {
    // For now, let's simulate an API call with mock data
    return new Promise<Order[]>(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            order_number: 'ORD-001',
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            status: 'completed',
            total_amount: 245.50,
            order_items: [
              {
                id: 1,
                order_id: 1,
                product_id: 1,
                quantity: 2,
                unit_price: 49.99,
                product: {
                  id: 1,
                  name: 'Smartphone',
                  sku: 'SM001',
                  quantity: 10,
                  price: 49.99,
                  category_id: 1,
                  supplier_id: 1,
                  created_at: '2023-06-15T10:00:00',
                  updated_at: '2023-06-15T10:00:00',
                }
              },
              {
                id: 2,
                order_id: 1,
                product_id: 2,
                quantity: 3,
                unit_price: 48.50,
                product: {
                  id: 2,
                  name: 'Wireless Earbuds',
                  sku: 'WE002',
                  quantity: 15,
                  price: 48.50,
                  category_id: 1,
                  supplier_id: 1,
                  created_at: '2023-06-15T10:00:00',
                  updated_at: '2023-06-15T10:00:00',
                }
              }
            ],
            created_at: '2023-06-15T10:00:00',
            updated_at: '2023-06-15T10:00:00',
          },
          {
            id: 2,
            order_number: 'ORD-002',
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            status: 'processing',
            total_amount: 129.99,
            order_items: [
              {
                id: 3,
                order_id: 2,
                product_id: 3,
                quantity: 1,
                unit_price: 129.99,
                product: {
                  id: 3,
                  name: 'Bluetooth Speaker',
                  sku: 'BS003',
                  quantity: 8,
                  price: 129.99,
                  category_id: 1,
                  supplier_id: 2,
                  created_at: '2023-06-15T10:00:00',
                  updated_at: '2023-06-15T10:00:00',
                }
              }
            ],
            created_at: '2023-06-17T14:30:00',
            updated_at: '2023-06-17T14:30:00',
          },
          {
            id: 3,
            order_number: 'ORD-003',
            customer_name: 'Robert Johnson',
            customer_email: 'robert@example.com',
            status: 'pending',
            total_amount: 350.00,
            order_items: [
              {
                id: 4,
                order_id: 3,
                product_id: 4,
                quantity: 1,
                unit_price: 350.00,
                product: {
                  id: 4,
                  name: 'Smart Watch',
                  sku: 'SW004',
                  quantity: 5,
                  price: 350.00,
                  category_id: 1,
                  supplier_id: 2,
                  created_at: '2023-06-15T10:00:00',
                  updated_at: '2023-06-15T10:00:00',
                }
              }
            ],
            created_at: '2023-06-20T09:15:00',
            updated_at: '2023-06-20T09:15:00',
          }
        ]);
      }, 500);
    });
  };

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (orderId: number) => {
    // In a real app, this would make an API call to delete the order
    toast.success(`Order #${orderId} deleted successfully`);
  };

  const handleViewDetails = (orderId: number) => {
    // In a real app, this would navigate to the order details page
    console.log(`Viewing details for order ${orderId}`);
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            View and manage all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(order.id)}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>
                            <div>
                              <div>{order.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{order.order_items.length}</span>
                            </div>
                          </TableCell>
                          <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(order.id);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(order.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
