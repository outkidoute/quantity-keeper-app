
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// App Pages
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Suppliers from "@/pages/Suppliers";
import StockAdjustments from "@/pages/StockAdjustments";
import Reports from "@/pages/Reports";
import Orders from "@/pages/Orders";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/stock-adjustments" element={<StockAdjustments />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/reports" element={<Reports />} />
                </Route>
              </Route>

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
