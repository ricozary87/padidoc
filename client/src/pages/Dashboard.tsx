import { useQuery } from "@tanstack/react-query";
import { Bell, ShoppingCart, Settings, DollarSign, Package, BarChart3 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MetricsCard from "@/components/MetricsCard";
import RecentActivities from "@/components/RecentActivities";
import QuickActions from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-inter font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500">Selamat datang kembali, pantau aktivitas penggilingan Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatDate()}</p>
                <p className="text-xs text-gray-500">Hari ini</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Pembelian Hari Ini"
              value={`${formatNumber(metrics?.todayPurchases || 0)} kg`}
              icon={<ShoppingCart className="h-5 w-5 text-primary" />}
              iconBgColor="bg-blue-100"
              trend={{
                value: "12.5%",
                isPositive: true,
                label: "dari kemarin"
              }}
            />
            <MetricsCard
              title="Produksi Hari Ini"
              value={`${formatNumber(metrics?.todayProduction || 0)} kg`}
              icon={<Settings className="h-5 w-5 text-secondary" />}
              iconBgColor="bg-green-100"
              trend={{
                value: "8.3%",
                isPositive: true,
                label: "dari kemarin"
              }}
            />
            <MetricsCard
              title="Penjualan Hari Ini"
              value={`${formatNumber(metrics?.todaySales || 0)} kg`}
              icon={<DollarSign className="h-5 w-5 text-accent" />}
              iconBgColor="bg-yellow-100"
              trend={{
                value: "2.1%",
                isPositive: false,
                label: "dari kemarin"
              }}
            />
            <MetricsCard
              title="Stok Beras"
              value={`${formatNumber(metrics?.stockRice || 0)} kg`}
              icon={<Package className="h-5 w-5 text-purple-600" />}
              iconBgColor="bg-purple-100"
              trend={{
                value: "Aman",
                isPositive: true,
                label: "Status:"
              }}
            />
          </div>

          {/* UPDATE INI UNTUK MULTI PRODUK - Stock untuk jenis barang lainnya */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Stok Gabah"
              value={`${formatNumber(metrics?.stockGabah || 0)} kg`}
              icon={<Package className="h-5 w-5 text-orange-600" />}
              iconBgColor="bg-orange-100"
            />
            <MetricsCard
              title="Stok Katul"
              value={`${formatNumber(metrics?.stockKatul || 0)} kg`}
              icon={<Package className="h-5 w-5 text-amber-600" />}
              iconBgColor="bg-amber-100"
            />
            <MetricsCard
              title="Stok Menir"
              value={`${formatNumber(metrics?.stockMenir || 0)} kg`}
              icon={<Package className="h-5 w-5 text-indigo-600" />}
              iconBgColor="bg-indigo-100"
            />
            <MetricsCard
              title="Stok Sekam"
              value={`${formatNumber(metrics?.stockSekam || 0)} kg`}
              icon={<Package className="h-5 w-5 text-gray-600" />}
              iconBgColor="bg-gray-100"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-inter font-semibold text-gray-900">
                    Trend Produksi Mingguan
                  </CardTitle>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Hari Terakhir</SelectItem>
                      <SelectItem value="30">30 Hari Terakhir</SelectItem>
                      <SelectItem value="90">90 Hari Terakhir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Grafik Trend Produksi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-inter font-semibold text-gray-900">
                    Efisiensi Rendemen
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Target: 65%</span>
                    <span className="text-sm font-medium text-green-600">67.8%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beras Premium</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={72} className="w-32" />
                      <span className="text-sm font-mono text-gray-900">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beras Medium</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-32" />
                      <span className="text-sm font-mono text-gray-900">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beras Pecah</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={58} className="w-32" />
                      <span className="text-sm font-mono text-gray-900">58%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities and Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivities transactions={metrics?.recentTransactions || []} />
            </div>

            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-inter font-semibold text-gray-900">
                  Jadwal Pengeringan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-gray-900">Batch #12345</p>
                  <p className="text-xs text-gray-500">Mulai: 08:00 WIB</p>
                  <p className="text-xs text-blue-600">Sedang Berjalan</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm font-medium text-gray-900">Batch #12346</p>
                  <p className="text-xs text-gray-500">Mulai: 14:00 WIB</p>
                  <p className="text-xs text-yellow-600">Menunggu</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm font-medium text-gray-900">Batch #12344</p>
                  <p className="text-xs text-gray-500">Selesai: 06:00 WIB</p>
                  <p className="text-xs text-green-600">Selesai</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}
