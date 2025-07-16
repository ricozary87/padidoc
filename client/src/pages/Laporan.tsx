import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Laporan() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState("monthly");

  const { data: pembelian } = useQuery({
    queryKey: ["/api/pembelian"],
  });

  const { data: produksi } = useQuery({
    queryKey: ["/api/produksi"],
  });

  const { data: penjualan } = useQuery({
    queryKey: ["/api/penjualan"],
  });

  const { data: pengeluaran } = useQuery({
    queryKey: ["/api/pengeluaran"],
  });

  const { data: stok } = useQuery({
    queryKey: ["/api/stok"],
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const calculateTotals = (data: any[], field: string) => {
    return data?.reduce((total, item) => total + Number(item[field] || 0), 0) || 0;
  };

  const filterByDateRange = (data: any[]) => {
    if (!data) return [];
    return data.filter(item => {
      const itemDate = new Date(item.tanggal || item.createdAt);
      return itemDate >= new Date(dateRange.start) && itemDate <= new Date(dateRange.end);
    });
  };

  const filteredPembelian = filterByDateRange(pembelian || []);
  const filteredProduksi = filterByDateRange(produksi || []);
  const filteredPenjualan = filterByDateRange(penjualan || []);
  const filteredPengeluaran = filterByDateRange(pengeluaran || []);

  const totalPembelian = calculateTotals(filteredPembelian, 'totalHarga');
  const totalPenjualan = calculateTotals(filteredPenjualan, 'totalHarga');
  const totalPengeluaran = calculateTotals(filteredPengeluaran, 'jumlah');
  const totalProfit = totalPenjualan - totalPembelian - totalPengeluaran;

  const totalGabahBeli = calculateTotals(filteredPembelian, 'jumlah');
  const totalBerasProduksi = calculateTotals(filteredProduksi, 'jumlahBerasOutput');
  const totalBerasJual = calculateTotals(filteredPenjualan, 'jumlah');

  const averageRendemen = filteredProduksi.length > 0 
    ? filteredProduksi.reduce((sum, item) => sum + Number(item.rendemen || 0), 0) / filteredProduksi.length
    : 0;

  const exportToCSV = (data: any[], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-2xl font-inter font-bold text-gray-900">Laporan</h2>
                <p className="text-sm text-gray-500">Analisis dan laporan keuangan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="start-date">Dari:</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="end-date">Sampai:</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                  className="w-40"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Pembelian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPembelian)}</div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">{totalGabahBeli.toLocaleString()} kg gabah</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Penjualan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPenjualan)}</div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">{totalBerasJual.toLocaleString()} kg beras</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPengeluaran)}</div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-gray-600">Operasional</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Keuntungan Bersih</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalProfit)}
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant={totalProfit >= 0 ? "default" : "destructive"}>
                    {totalProfit >= 0 ? "Profit" : "Loss"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pembelian">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="pembelian">Pembelian</TabsTrigger>
                  <TabsTrigger value="produksi">Produksi</TabsTrigger>
                  <TabsTrigger value="penjualan">Penjualan</TabsTrigger>
                  <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                  <TabsTrigger value="stok">Stok</TabsTrigger>
                </TabsList>

                <TabsContent value="pembelian" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Laporan Pembelian</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => exportToCSV(filteredPembelian, 'laporan-pembelian')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jenis Gabah</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Harga/Kg</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPembelian.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.tanggal)}</TableCell>
                          <TableCell>{item.jenisGabah}</TableCell>
                          <TableCell>{item.jumlah} kg</TableCell>
                          <TableCell>{formatCurrency(item.hargaPerKg)}</TableCell>
                          <TableCell>{formatCurrency(item.totalHarga)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="produksi" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Laporan Produksi</h3>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        Rata-rata Rendemen: {averageRendemen.toFixed(1)}%
                      </Badge>
                      <Button 
                        variant="outline" 
                        onClick={() => exportToCSV(filteredProduksi, 'laporan-produksi')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jenis Beras</TableHead>
                        <TableHead>Input Gabah</TableHead>
                        <TableHead>Output Beras</TableHead>
                        <TableHead>Rendemen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProduksi.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.tanggal)}</TableCell>
                          <TableCell>{item.jenisBerasProduced}</TableCell>
                          <TableCell>{item.jumlahGabahInput || "-"} kg</TableCell>
                          <TableCell>{item.jumlahBerasOutput || "-"} kg</TableCell>
                          <TableCell>{item.rendemen || "-"}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="penjualan" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Laporan Penjualan</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => exportToCSV(filteredPenjualan, 'laporan-penjualan')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jenis Beras</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Harga/Kg</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPenjualan.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.tanggal)}</TableCell>
                          <TableCell>{item.jenisBeras}</TableCell>
                          <TableCell>{item.jumlah} kg</TableCell>
                          <TableCell>{formatCurrency(item.hargaPerKg)}</TableCell>
                          <TableCell>{formatCurrency(item.totalHarga)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="pengeluaran" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Laporan Pengeluaran</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => exportToCSV(filteredPengeluaran, 'laporan-pengeluaran')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPengeluaran.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.tanggal)}</TableCell>
                          <TableCell>{item.kategori}</TableCell>
                          <TableCell>{item.deskripsi}</TableCell>
                          <TableCell>{formatCurrency(item.jumlah)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="stok" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Laporan Stok</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => exportToCSV(stok || [], 'laporan-stok')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis Item</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead>Harga Rata-rata</TableHead>
                        <TableHead>Nilai Stok</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stok?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.jenisItem}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.satuan}</TableCell>
                          <TableCell>{formatCurrency(item.hargaRataRata || 0)}</TableCell>
                          <TableCell>{formatCurrency((item.jumlah || 0) * (item.hargaRataRata || 0))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
