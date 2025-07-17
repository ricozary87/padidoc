import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import PembelianGabah from "@/pages/PembelianGabah";
import Pengeringan from "@/pages/Pengeringan";
import Produksi from "@/pages/Produksi";
import Penjualan from "@/pages/Penjualan";
import Pengeluaran from "@/pages/Pengeluaran";
import Stok from "@/pages/Stok";
import Laporan from "@/pages/Laporan";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Card className="mt-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">403 - Akses Ditolak</h2>
                <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Switch>
            <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
            <Route path="/pembelian" component={() => <ProtectedRoute component={PembelianGabah} />} />
            <Route path="/pengeringan" component={() => <ProtectedRoute component={Pengeringan} />} />
            <Route path="/produksi" component={() => <ProtectedRoute component={Produksi} />} />
            <Route path="/penjualan" component={() => <ProtectedRoute component={Penjualan} />} />
            <Route path="/pengeluaran" component={() => <ProtectedRoute component={Pengeluaran} />} />
            <Route path="/stok" component={() => <ProtectedRoute component={Stok} />} />
            <Route path="/laporan" component={() => <AdminRoute component={Laporan} />} />
            <Route path="/settings" component={() => <AdminRoute component={Settings} />} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
