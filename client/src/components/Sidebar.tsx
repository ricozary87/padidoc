import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChartLine, 
  ShoppingCart, 
  Sun, 
  Settings, 
  DollarSign, 
  Receipt, 
  Package, 
  BarChart3, 
  Sprout,
  User,
  LogOut,
  Menu,
  X,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine, color: "text-gray-600" },
  { name: "Pembelian Gabah", href: "/pembelian", icon: ShoppingCart, color: "text-blue-600" },
  { name: "Pengeringan", href: "/pengeringan", icon: Sun, color: "text-orange-600" },
  { name: "Produksi", href: "/produksi", icon: Settings, color: "text-green-600" },
  { name: "Penjualan", href: "/penjualan", icon: DollarSign, color: "text-yellow-500" },
  { name: "Pengeluaran", href: "/pengeluaran", icon: Receipt, color: "text-red-600" },
  { name: "Stok", href: "/stok", icon: Package, color: "text-purple-600" },
  { name: "Laporan", href: "/laporan", icon: BarChart3, color: "text-indigo-600" },
  { name: "Pengaturan", href: "/settings", icon: Settings, color: "text-gray-600" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout, isAdmin } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (item.href === "/laporan" || item.href === "/settings") {
      return isAdmin;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative w-64 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col z-40 transition-transform duration-300",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0"
      )}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-inter font-bold text-gray-900">PadiDoc</h1>
              <p className="text-xs lg:text-sm text-gray-500">Manajemen Penggilingan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  onClick={() => isMobile && setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 lg:px-4 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base cursor-pointer",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className={cn("h-4 w-4 lg:h-5 lg:w-5", isActive ? "text-white" : item.color)} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:px-4 lg:py-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isAdmin ? "bg-red-500" : "bg-blue-500"
            )}>
              {isAdmin ? (
                <Shield className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || "Loading..."}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === "admin" ? "Administrator" : "Operator"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/edit-profile">
                <button 
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Profile"
                >
                  <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
                </button>
              </Link>
              <button 
                onClick={logout}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
