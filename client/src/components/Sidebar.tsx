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
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Pembelian Gabah", href: "/pembelian", icon: ShoppingCart },
  { name: "Pengeringan", href: "/pengeringan", icon: Sun },
  { name: "Produksi", href: "/produksi", icon: Settings },
  { name: "Penjualan", href: "/penjualan", icon: DollarSign },
  { name: "Pengeluaran", href: "/pengeluaran", icon: Receipt },
  { name: "Stok", href: "/stok", icon: Package },
  { name: "Laporan", href: "/laporan", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-inter font-bold text-gray-900">PadiDoc</h1>
            <p className="text-sm text-gray-500">Manajemen Penggilingan</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
