import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import PembelianGabah from "@/pages/PembelianGabah";
import Pengeringan from "@/pages/Pengeringan";
import Produksi from "@/pages/Produksi";
import Penjualan from "@/pages/Penjualan";
import Pengeluaran from "@/pages/Pengeluaran";
import Stok from "@/pages/Stok";
import Laporan from "@/pages/Laporan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/pembelian" component={PembelianGabah} />
      <Route path="/pengeringan" component={Pengeringan} />
      <Route path="/produksi" component={Produksi} />
      <Route path="/penjualan" component={Penjualan} />
      <Route path="/pengeluaran" component={Pengeluaran} />
      <Route path="/stok" component={Stok} />
      <Route path="/laporan" component={Laporan} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
