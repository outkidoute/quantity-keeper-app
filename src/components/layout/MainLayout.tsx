
import React, { useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Tags,
  Truck, 
  ArrowUpDown, 
  BarChart3, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <Link 
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
      onClick={closeSidebar}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">StockManager</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="hidden md:inline text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar pt-16 shadow-lg transform transition-transform md:translate-x-0 md:static md:z-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-4 space-y-1">
            <NavItem 
              to="/" 
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard" 
            />
            <NavItem 
              to="/products" 
              icon={<Package className="h-5 w-5" />}
              label="Products" 
            />
            <NavItem 
              to="/categories" 
              icon={<Tags className="h-5 w-5" />}
              label="Categories" 
            />
            <NavItem 
              to="/suppliers" 
              icon={<Truck className="h-5 w-5" />}
              label="Suppliers" 
            />
            <NavItem 
              to="/stock-adjustments" 
              icon={<ArrowUpDown className="h-5 w-5" />}
              label="Stock Adjustments" 
            />
            <NavItem 
              to="/reports" 
              icon={<BarChart3 className="h-5 w-5" />}
              label="Reports" 
            />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
