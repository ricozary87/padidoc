import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { 
  PublicRoute, 
  PrivateRoute, 
  AdminRoute, 
  OperatorRoute 
} from "@/components/RouteGuard";
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
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import EditProfile from "@/pages/EditProfile";
import Layout from "@/components/Layout";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      <Route path="/forgot-password">
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </Route>
      <Route path="/reset-password">
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      </Route>

      {/* Protected routes with Layout */}
      <Route path="/">
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      </Route>
      <Route path="/dashboard">
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      </Route>

      {/* Operator routes (accessible by both operator and admin) */}
      <Route path="/pembelian">
        <OperatorRoute>
          <Layout>
            <PembelianGabah />
          </Layout>
        </OperatorRoute>
      </Route>
      <Route path="/pengeringan">
        <OperatorRoute>
          <Layout>
            <Pengeringan />
          </Layout>
        </OperatorRoute>
      </Route>
      <Route path="/produksi">
        <OperatorRoute>
          <Layout>
            <Produksi />
          </Layout>
        </OperatorRoute>
      </Route>
      <Route path="/penjualan">
        <OperatorRoute>
          <Layout>
            <Penjualan />
          </Layout>
        </OperatorRoute>
      </Route>
      <Route path="/pengeluaran">
        <OperatorRoute>
          <Layout>
            <Pengeluaran />
          </Layout>
        </OperatorRoute>
      </Route>
      <Route path="/stok">
        <OperatorRoute>
          <Layout>
            <Stok />
          </Layout>
        </OperatorRoute>
      </Route>

      {/* Admin-only routes */}
      <Route path="/laporan">
        <AdminRoute>
          <Layout>
            <Laporan />
          </Layout>
        </AdminRoute>
      </Route>
      <Route path="/settings">
        <AdminRoute>
          <Layout>
            <Settings />
          </Layout>
        </AdminRoute>
      </Route>

      {/* User profile route */}
      <Route path="/edit-profile">
        <PrivateRoute>
          <Layout>
            <EditProfile />
          </Layout>
        </PrivateRoute>
      </Route>

      {/* Fallback route */}
      <Route>
        <PrivateRoute>
          <Layout>
            <NotFound />
          </Layout>
        </PrivateRoute>
      </Route>
    </Switch>
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
