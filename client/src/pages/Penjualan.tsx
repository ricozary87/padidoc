import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Search, DollarSign, Printer } from "lucide-react";
import { insertPenjualanSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateInvoicePdf, generateInvoiceNumber } from "@/lib/generatePdf";

export default function Penjualan() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: penjualan, isLoading } = useQuery({
    queryKey: ["/api/penjualan"],
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const form = useForm({
    resolver: zodResolver(insertPenjualanSchema),
    defaultValues: {
      customerId: "",
      tanggal: new Date().toISOString().split('T')[0],
      jenisBeras: "",
      jenisBarang: "beras", // UPDATE INI UNTUK MULTI PRODUK
      jumlah: "",
      hargaPerKg: "",
      totalHarga: "",
      status: "completed",
      metodePembayaran: "cash",
      catatan: "",
    },
  });

  // PRIORITAS AUDIT - FIXED: Auto-kalkulasi total harga
  const watchJumlah = form.watch("jumlah");
  const watchHargaPerKg = form.watch("hargaPerKg");
  
  useEffect(() => {
    const jumlah = parseFloat(watchJumlah) || 0;
    const hargaPerKg = parseFloat(watchHargaPerKg) || 0;
    const totalHarga = jumlah * hargaPerKg;
    
    if (jumlah > 0 && hargaPerKg > 0) {
      form.setValue("totalHarga", totalHarga.toString());
    }
  }, [watchJumlah, watchHargaPerKg, form.setValue]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/penjualan", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penjualan"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Penjualan berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menambahkan penjualan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/penjualan/${editingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penjualan"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Penjualan berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui penjualan",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/penjualan/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penjualan"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Penjualan berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menghapus penjualan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      customerId: parseInt(data.customerId),
      tanggal: new Date(data.tanggal),
      jenisBeras: data.jenisBeras,
      jenisBarang: data.jenisBarang, // UPDATE INI UNTUK MULTI PRODUK
      jumlah: data.jumlah,
      hargaPerKg: data.hargaPerKg,
      totalHarga: data.totalHarga,
      status: data.status,
      catatan: data.catatan || undefined,
    };

    if (editingId) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      customerId: item.customerId?.toString() || "",
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
      jenisBeras: item.jenisBeras,
      jenisBarang: item.jenisBarang || "beras", // UPDATE INI UNTUK MULTI PRODUK
      jumlah: item.jumlah,
      hargaPerKg: item.hargaPerKg,
      totalHarga: item.totalHarga,
      status: item.status,
      catatan: item.catatan || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus penjualan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = (sale: any) => {
    const customer = customers?.find((c: any) => c.id === sale.customerId);
    
    const invoiceData = {
      type: "penjualan" as const,
      invoiceNumber: generateInvoiceNumber("penjualan"),
      date: sale.tanggal,
      customerName: customer?.nama || "Customer",
      customerAddress: customer?.alamat,
      customerPhone: customer?.telepon,
      items: [{
        description: `${sale.jenisBarang === "beras" ? "Beras" : sale.jenisBarang.charAt(0).toUpperCase() + sale.jenisBarang.slice(1)} ${sale.jenisBeras || ""}`.trim(),
        quantity: sale.jumlah,
        unit: "kg",
        price: sale.hargaPerKg,
        total: sale.totalHarga,
      }],
      subtotal: sale.totalHarga,
      total: sale.totalHarga,
      notes: sale.catatan,
      paymentMethod: sale.metodePembayaran === "cash" ? "Tunai" : "Transfer",
    };

    generateInvoicePdf(settings, invoiceData);
    
    toast({
      title: "Berhasil",
      description: "Nota penjualan berhasil diunduh",
    });
  };

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

  const filteredPenjualan = penjualan?.filter((item: any) =>
    item.jenisBeras.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-accent flex-shrink-0" />
              <div>
                <h2 className="text-xl md:text-2xl font-inter font-bold text-gray-900">Penjualan</h2>
                <p className="text-xs md:text-sm text-gray-500">Kelola penjualan beras kepada pelanggan</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Penjualan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Penjualan" : "Tambah Penjualan Baru"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pelanggan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih pelanggan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {customers?.map((customer: any) => (
                                  <SelectItem key={customer.id} value={customer.id.toString()}>
                                    {customer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tanggal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jenisBarang"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Barang</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis barang" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beras">Beras</SelectItem>
                                <SelectItem value="gabah">Gabah</SelectItem>
                                <SelectItem value="katul">Katul</SelectItem>
                                <SelectItem value="menir">Menir</SelectItem>
                                <SelectItem value="sekam">Sekam</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jenisBeras"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama/Detail Item</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Beras Premium" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="jumlah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hargaPerKg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Harga per Kg</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="totalHarga"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Harga</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="completed">Selesai</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Dibatalkan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metodePembayaran"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metode Pembayaran</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cash">Tunai</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="catatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catatan</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Catatan tambahan..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingId ? "Perbarui" : "Simpan"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6 overflow-y-auto">
          {/* Add padding on mobile for hamburger button */}
          <div className="lg:hidden h-12"></div>
          
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="p-3 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base md:text-lg font-inter font-semibold text-gray-900">
                  Daftar Penjualan
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari penjualan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Tanggal</TableHead>
                      <TableHead className="text-xs md:text-sm">Jenis Barang</TableHead>
                      <TableHead className="text-xs md:text-sm">Nama/Detail</TableHead>
                      <TableHead className="text-xs md:text-sm">Jumlah</TableHead>
                      <TableHead className="text-xs md:text-sm">Harga/Kg</TableHead>
                      <TableHead className="text-xs md:text-sm">Total Harga</TableHead>
                      <TableHead className="text-xs md:text-sm">Status</TableHead>
                      <TableHead className="text-xs md:text-sm">Metode Bayar</TableHead>
                      <TableHead className="text-xs md:text-sm">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-sm">Loading...</TableCell>
                      </TableRow>
                    ) : filteredPenjualan?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-sm">Belum ada data penjualan</TableCell>
                      </TableRow>
                    ) : (
                      filteredPenjualan?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs md:text-sm">{formatDate(item.tanggal)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {item.jenisBarang || 'beras'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">{item.jenisBeras}</TableCell>
                          <TableCell className="text-xs md:text-sm">{item.jumlah} kg</TableCell>
                          <TableCell className="text-xs md:text-sm">{formatCurrency(item.hargaPerKg)}</TableCell>
                          <TableCell className="text-xs md:text-sm">{formatCurrency(item.totalHarga)}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.metodePembayaran === "cash" ? "Tunai" : "Transfer"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePrint(item)}
                                title="Cetak Nota"
                                className="p-1 md:p-2"
                              >
                                <Printer className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item)}
                                className="p-1 md:p-2"
                              >
                                <Edit className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(item.id)}
                                className="p-1 md:p-2"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
