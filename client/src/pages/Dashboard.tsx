import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, ShoppingCart, Settings, DollarSign, Package, BarChart3, Calculator, Plus, CheckCircle, XCircle, Scale, TrendingUp, TrendingDown, Wallet, ExternalLink } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MetricsCard from "@/components/MetricsCard";
import RecentActivities from "@/components/RecentActivities";
import QuickActions from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateWeeklyCashFlow, generateDailyCashFlowData, formatCurrency, formatNumber } from "@/lib/cashFlowCalculator";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: penjualanData } = useQuery({
    queryKey: ["/api/penjualan"],
  });

  const { data: pembelianData } = useQuery({
    queryKey: ["/api/pembelian"],
  });

  const { data: pengeluaranData } = useQuery({
    queryKey: ["/api/pengeluaran"],
  });

  // Fetch transaction data for cash flow calculations
  const { data: penjualan } = useQuery({
    queryKey: ["/api/penjualan"],
  });
  
  const { data: pembelian } = useQuery({
    queryKey: ["/api/pembelian"],
  });
  
  const { data: pengeluaran } = useQuery({
    queryKey: ["/api/pengeluaran"],
  });

  // Fetch production data for weekly trends
  const { data: produksi } = useQuery({
    queryKey: ["/api/produksi"],
  });

  // Simulation state
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [simulationData, setSimulationData] = useState({
    beratGabah: "",
    hargaBeliGabah: "",
    hargaJualBeras: "",
    hargaJualKatul: "",
    hargaJualMenir: "",
    rendemenBeras: "55",
    rendemenKatul: "20",
    rendemenSekam: "15"
  });
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Calculate cash flow data
  const cashFlow = calculateWeeklyCashFlow(penjualan || [], pembelian || [], pengeluaran || []);
  const chartData = generateDailyCashFlowData(penjualan || [], pembelian || [], pengeluaran || []);

  // Calculate weekly production trends
  const calculateWeeklyProduction = (productionData: any[]) => {
    if (!productionData || productionData.length === 0) return [];
    
    const weeklyData = productionData.reduce((acc: any, item: any) => {
      const date = new Date(item.tanggal);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!acc[weekKey]) {
        acc[weekKey] = {
          week: weekKey,
          totalGabah: 0,
          totalBeras: 0,
          totalKatul: 0,
          totalMenir: 0,
          totalSekam: 0,
          count: 0
        };
      }
      
      acc[weekKey].totalGabah += parseFloat(item.jumlahGabahInput || 0);
      acc[weekKey].totalBeras += parseFloat(item.jumlahBerasOutput || 0);
      acc[weekKey].totalKatul += parseFloat(item.jumlahKatul || 0);
      acc[weekKey].totalMenir += parseFloat(item.jumlahMenir || 0);
      acc[weekKey].totalSekam += parseFloat(item.jumlahSekam || 0);
      acc[weekKey].count += 1;
      
      return acc;
    }, {});
    
    return Object.values(weeklyData)
      .sort((a: any, b: any) => new Date(a.week).getTime() - new Date(b.week).getTime())
      .slice(-4); // Last 4 weeks
  };

  const weeklyProductionData = calculateWeeklyProduction(produksi || []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(num);
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

  const calculateSimulation = () => {
    const beratGabah = parseFloat(simulationData.beratGabah);
    const hargaBeliGabah = parseFloat(simulationData.hargaBeliGabah);
    const hargaJualBeras = parseFloat(simulationData.hargaJualBeras);
    const hargaJualKatul = parseFloat(simulationData.hargaJualKatul);
    const hargaJualMenir = parseFloat(simulationData.hargaJualMenir) || 0;
    const rendemenBeras = parseFloat(simulationData.rendemenBeras);
    const rendemenKatul = parseFloat(simulationData.rendemenKatul);
    const rendemenSekam = parseFloat(simulationData.rendemenSekam);

    // Calculate production results
    const beratBeras = beratGabah * (rendemenBeras / 100);
    const beratKatul = beratGabah * (rendemenKatul / 100);
    const beratMenir = beratGabah * (rendemenSekam / 100);
    const beratSekam = beratGabah * (rendemenSekam / 100);

    // Calculate costs and revenue
    const biayaGabah = beratGabah * hargaBeliGabah;
    const pemasukan = (beratBeras * hargaJualBeras) + (beratKatul * hargaJualKatul) + (beratMenir * hargaJualMenir);
    const keuntungan = pemasukan - biayaGabah;

    // Determine status
    let status = "BEP";
    let statusColor = "text-yellow-600";
    let statusIcon = Scale;
    
    if (keuntungan > 0) {
      status = "Untung";
      statusColor = "text-green-600";
      statusIcon = CheckCircle;
    } else if (keuntungan < 0) {
      status = "Rugi";
      statusColor = "text-red-600";
      statusIcon = XCircle;
    }

    setSimulationResult({
      beratBeras,
      beratKatul,
      beratMenir,
      beratSekam,
      biayaGabah,
      pemasukan,
      keuntungan,
      status,
      statusColor,
      statusIcon
    });
  };

  const resetSimulation = () => {
    setSimulationData({
      beratGabah: "",
      hargaBeliGabah: "",
      hargaJualBeras: "",
      hargaJualKatul: "",
      hargaJualMenir: "",
      rendemenBeras: "55",
      rendemenKatul: "20",
      rendemenSekam: "15"
    });
    setSimulationResult(null);
  };

  // Removed duplicate cashFlow definition

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
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h2 className="text-lg md:text-2xl font-inter font-bold text-gray-900">Dashboard</h2>
              <p className="text-xs md:text-sm text-gray-500 truncate">Selamat datang kembali, pantau aktivitas penggilingan Anda</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <Bell className="h-4 w-4 md:h-5 md:w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-medium text-gray-900">{formatDate()}</p>
                <p className="text-xs text-gray-500">Hari ini</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 space-y-3 md:space-y-4 overflow-y-auto lg:pl-0">
          {/* Add padding on mobile for hamburger button */}
          <div className="lg:hidden h-12"></div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricsCard
              title="Pembelian Hari Ini"
              value={`${formatNumber(metrics?.todayPurchases || 0)} kg`}
              icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
              iconBgColor="bg-blue-100"
              colorBg="bg-blue-100"
              colorText="text-blue-800"
              trend={{
                value: "12.5%",
                isPositive: true,
                label: "dari kemarin"
              }}
              onClick={() => setLocation("/pembelian")}
            />
            <MetricsCard
              title="Produksi Hari Ini"
              value={`${formatNumber(metrics?.todayProduction || 0)} kg`}
              icon={<Settings className="h-5 w-5 text-green-600" />}
              iconBgColor="bg-green-100"
              colorBg="bg-green-100"
              colorText="text-green-800"
              trend={{
                value: "8.3%",
                isPositive: true,
                label: "dari kemarin"
              }}
              onClick={() => setLocation("/produksi")}
            />
            <MetricsCard
              title="Penjualan Hari Ini"
              value={`${formatNumber(metrics?.todaySales || 0)} kg`}
              icon={<DollarSign className="h-5 w-5 text-yellow-600" />}
              iconBgColor="bg-yellow-100"
              colorBg="bg-yellow-100"
              colorText="text-yellow-800"
              trend={{
                value: "2.1%",
                isPositive: false,
                label: "dari kemarin"
              }}
              onClick={() => setLocation("/penjualan")}
            />
            <MetricsCard
              title="Stok Beras"
              value={`${formatNumber(metrics?.stockRice || 0)} kg`}
              icon={<Package className="h-5 w-5 text-purple-600" />}
              iconBgColor="bg-purple-100"
              colorBg="bg-purple-100"
              colorText="text-purple-800"
              trend={{
                value: "Aman",
                isPositive: true,
                label: "Status:"
              }}
              onClick={() => setLocation("/stok")}
            />
          </div>

          {/* UPDATE INI UNTUK MULTI PRODUK - Stock untuk jenis barang lainnya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricsCard
              title="Stok Gabah"
              value={`${formatNumber(metrics?.stockGabah || 0)} kg`}
              icon={<Package className="h-5 w-5 text-orange-600" />}
              iconBgColor="bg-orange-100"
              colorBg="bg-orange-100"
              colorText="text-orange-800"
              onClick={() => setLocation("/stok")}
            />
            <MetricsCard
              title="Stok Katul"
              value={`${formatNumber(metrics?.stockKatul || 0)} kg`}
              icon={<Package className="h-5 w-5 text-yellow-600" />}
              iconBgColor="bg-yellow-200"
              colorBg="bg-yellow-200"
              colorText="text-yellow-900"
              onClick={() => setLocation("/stok")}
            />
            <MetricsCard
              title="Stok Menir"
              value={`${formatNumber(metrics?.stockMenir || 0)} kg`}
              icon={<Package className="h-5 w-5 text-red-600" />}
              iconBgColor="bg-red-100"
              colorBg="bg-red-100"
              colorText="text-red-800"
              onClick={() => setLocation("/stok")}
            />
            <MetricsCard
              title="Stok Sekam"
              value={`${formatNumber(metrics?.stockSekam || 0)} kg`}
              icon={<Package className="h-5 w-5 text-gray-600" />}
              iconBgColor="bg-gray-100"
              colorBg="bg-gray-100"
              colorText="text-gray-700"
              onClick={() => setLocation("/stok")}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm md:text-lg font-inter font-semibold text-gray-900">
                    Trend Produksi Mingguan
                  </CardTitle>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-full sm:w-40">
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
              <CardContent className="p-3 md:p-6">
                <div className="h-48 md:h-64 flex items-center justify-center bg-slate-100 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 md:h-12 md:w-12 text-gray-400 opacity-30 mx-auto mb-2" />
                    <p className="text-sm md:text-base text-gray-500">Data belum tersedia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm md:text-lg font-inter font-semibold text-gray-900">
                    Efisiensi Rendemen
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs md:text-sm text-gray-500">Target: 65%</span>
                    <span className="text-xs md:text-sm font-medium text-green-600">67.8%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beras Premium</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <span className="text-sm font-mono text-gray-900">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beras Medium</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm font-mono text-gray-900">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beras Pecah</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" style={{width: '58%'}}></div>
                      </div>
                      <span className="text-sm font-mono text-gray-900">58%</span>
                    </div>
                  </div>
                </div>
                
                {/* Simulation Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Dialog open={isSimulationOpen} onOpenChange={setIsSimulationOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 py-3 px-4 text-base font-semibold transition-colors shadow-md hover:shadow-lg"
                        onClick={() => resetSimulation()}
                      >
                        <Plus className="h-5 w-5" />
                        <span>Simulasi Rendemen</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Calculator className="h-5 w-5 text-green-600" />
                          <span>Simulasi Rendemen Gabah</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Input Form */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="beratGabah">Berat Gabah (kg)</Label>
                            <Input
                              id="beratGabah"
                              type="number"
                              placeholder="100"
                              value={simulationData.beratGabah}
                              onChange={(e) => setSimulationData({...simulationData, beratGabah: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hargaBeliGabah">Harga Beli Gabah (/kg)</Label>
                            <Input
                              id="hargaBeliGabah"
                              type="number"
                              placeholder="5000"
                              value={simulationData.hargaBeliGabah}
                              onChange={(e) => setSimulationData({...simulationData, hargaBeliGabah: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hargaJualBeras">Harga Jual Beras (/kg)</Label>
                            <Input
                              id="hargaJualBeras"
                              type="number"
                              placeholder="12000"
                              value={simulationData.hargaJualBeras}
                              onChange={(e) => setSimulationData({...simulationData, hargaJualBeras: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hargaJualKatul">Harga Jual Katul (/kg)</Label>
                            <Input
                              id="hargaJualKatul"
                              type="number"
                              placeholder="3000"
                              value={simulationData.hargaJualKatul}
                              onChange={(e) => setSimulationData({...simulationData, hargaJualKatul: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hargaJualMenir">Harga Jual Menir (/kg) - Opsional</Label>
                            <Input
                              id="hargaJualMenir"
                              type="number"
                              placeholder="8000"
                              value={simulationData.hargaJualMenir}
                              onChange={(e) => setSimulationData({...simulationData, hargaJualMenir: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        {/* Yield Percentages */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Persentase Rendemen</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="rendemenBeras">Beras (%)</Label>
                              <Input
                                id="rendemenBeras"
                                type="number"
                                value={simulationData.rendemenBeras}
                                onChange={(e) => setSimulationData({...simulationData, rendemenBeras: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="rendemenKatul">Katul (%)</Label>
                              <Input
                                id="rendemenKatul"
                                type="number"
                                value={simulationData.rendemenKatul}
                                onChange={(e) => setSimulationData({...simulationData, rendemenKatul: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="rendemenSekam">Sekam (%)</Label>
                              <Input
                                id="rendemenSekam"
                                type="number"
                                value={simulationData.rendemenSekam}
                                onChange={(e) => setSimulationData({...simulationData, rendemenSekam: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Calculate Button */}
                        <Button 
                          onClick={calculateSimulation}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={!simulationData.beratGabah || !simulationData.hargaBeliGabah || !simulationData.hargaJualBeras || !simulationData.hargaJualKatul}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Hitung Simulasi
                        </Button>
                        
                        {/* Results */}
                        {simulationResult && (
                          <div className="space-y-4 border-t pt-4">
                            <h4 className="font-medium text-gray-900">Hasil Simulasi</h4>
                            
                            {/* Production Results */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Hasil Produksi</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Beras:</span>
                                    <span className="font-mono">{formatNumber(simulationResult.beratBeras)} kg</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Katul:</span>
                                    <span className="font-mono">{formatNumber(simulationResult.beratKatul)} kg</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Menir:</span>
                                    <span className="font-mono">{formatNumber(simulationResult.beratMenir)} kg</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Sekam:</span>
                                    <span className="font-mono">{formatNumber(simulationResult.beratSekam)} kg</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Analisis Keuangan</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Biaya Gabah:</span>
                                    <span className="font-mono text-red-600">{formatCurrency(simulationResult.biayaGabah)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Potensi Pemasukan:</span>
                                    <span className="font-mono text-green-600">{formatCurrency(simulationResult.pemasukan)}</span>
                                  </div>
                                  <div className="flex justify-between border-t pt-1">
                                    <span className="font-medium">Keuntungan/Rugi:</span>
                                    <span className={`font-mono font-bold ${simulationResult.keuntungan >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {formatCurrency(simulationResult.keuntungan)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status */}
                            <div className={`p-4 rounded-lg border-2 ${
                              simulationResult.status === 'Untung' ? 'bg-green-50 border-green-200' :
                              simulationResult.status === 'Rugi' ? 'bg-red-50 border-red-200' :
                              'bg-yellow-50 border-yellow-200'
                            }`}>
                              <div className="flex items-center space-x-2">
                                <simulationResult.statusIcon className={`h-5 w-5 ${simulationResult.statusColor}`} />
                                <span className={`font-bold ${simulationResult.statusColor}`}>
                                  Kesimpulan: {simulationResult.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Arus Kas Mingguan dan Tren Produksi Mingguan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-inter font-semibold text-gray-900">
                  Arus Kas Mingguan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weekly Overview */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500">Modal Awal</p>
                    <p className="text-sm font-semibold text-blue-600">{formatCurrency(cashFlow.modalAwal)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Pemasukan</p>
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(cashFlow.pemasukan)}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-500">Pengeluaran</p>
                    <p className="text-sm font-semibold text-red-600">{formatCurrency(cashFlow.pengeluaran)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Saldo Akhir</p>
                    <p className={`text-sm font-semibold ${cashFlow.saldoAkhir >= cashFlow.modalAwal ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cashFlow.saldoAkhir)}
                    </p>
                  </div>
                </div>

                {/* Status Indikator */}
                <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-gray-50">
                  <span className="text-lg">
                    {cashFlow.status === 'profit' ? '🟢' : cashFlow.status === 'loss' ? '🔴' : '⚖️'}
                  </span>
                  <span className={`font-medium ${
                    cashFlow.status === 'profit' ? 'text-green-600' : 
                    cashFlow.status === 'loss' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {cashFlow.status === 'profit' ? 'Profit' : 
                     cashFlow.status === 'loss' ? 'Loss' : 'Break-even'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {cashFlow.status === 'profit' ? 
                      `+${formatCurrency(cashFlow.saldoAkhir - cashFlow.modalAwal)}` : 
                      cashFlow.status === 'loss' ? 
                      `${formatCurrency(cashFlow.saldoAkhir - cashFlow.modalAwal)}` : 
                      'Tidak ada untung rugi'}
                  </span>
                </div>

                {/* Chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          formatCurrency(value), 
                          name === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pemasukan" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pengeluaran" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Detail Button */}
                <div className="pt-3 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center space-x-2 text-sm hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    onClick={() => window.location.href = '/laporan'}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Lihat Detail Arus Kas</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-inter font-semibold text-gray-900">
                  Tren Produksi Mingguan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyProductionData.length > 0 ? (
                  <>
                    {/* Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyProductionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis 
                            dataKey="week"
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                            fontSize={12}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            labelFormatter={(value) => {
                              const date = new Date(value);
                              return `Minggu: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                            }}
                            formatter={(value, name) => [
                              `${formatNumber(value)} kg`,
                              name === 'totalBeras' ? 'Beras' :
                              name === 'totalGabah' ? 'Gabah' :
                              name === 'totalKatul' ? 'Katul' :
                              name === 'totalMenir' ? 'Menir' : 'Sekam'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="totalBeras" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ fill: '#10b981', strokeWidth: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="totalGabah" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Beras:</span>
                          <span className="font-mono text-green-600">
                            {formatNumber(weeklyProductionData.reduce((sum: number, week: any) => sum + week.totalBeras, 0))} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Gabah:</span>
                          <span className="font-mono text-amber-600">
                            {formatNumber(weeklyProductionData.reduce((sum: number, week: any) => sum + week.totalGabah, 0))} kg
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Katul:</span>
                          <span className="font-mono text-blue-600">
                            {formatNumber(weeklyProductionData.reduce((sum: number, week: any) => sum + week.totalKatul, 0))} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rata-rata Rendemen:</span>
                          <span className="font-mono text-purple-600">
                            {weeklyProductionData.length > 0 ? 
                              ((weeklyProductionData.reduce((sum: number, week: any) => sum + week.totalBeras, 0) / 
                                weeklyProductionData.reduce((sum: number, week: any) => sum + week.totalGabah, 0)) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Link to production page */}
                    <div className="pt-3 border-t border-gray-200">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center space-x-2 text-sm hover:bg-green-50 hover:border-green-500 transition-colors"
                        onClick={() => setLocation('/produksi')}
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Lihat Detail Produksi</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Belum ada data produksi mingguan</p>
                    <p className="text-xs mt-1">Mulai produksi untuk melihat tren</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="mt-4">
            <RecentActivities transactions={metrics?.recentTransactions || []} />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}
