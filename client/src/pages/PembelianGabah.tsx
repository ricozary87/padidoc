import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Search, Printer } from "lucide-react";
import { insertPembelianSchema, insertSupplierSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateInvoicePdf, generateInvoiceNumber } from "@/lib/generatePdf";

type FormData = {
  supplierId: string;
  tanggal: string;
  jenisGabah: string;
  jenisBarang: string; // UPDATE INI UNTUK MULTI PRODUK
  jumlah: string;
  hargaPerKg: string;
  totalHarga: string;
  kadarAir: string;
  kualitas: string;
  status: string;
  metodePembayaran: string;
  catatan: string;
};

export default function PembelianGabah() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: pembelian, isLoading } = useQuery({
    queryKey: ["/api/pembelian"],
  });

  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(insertPembelianSchema.extend({
      supplierId: insertPembelianSchema.shape.supplierId.transform(val => val ? parseInt(val.toString()) : undefined),
      tanggal: insertPembelianSchema.shape.tanggal.transform(val => new Date(val)),
      jumlah: insertPembelianSchema.shape.jumlah.transform(val => val.toString()),
      hargaPerKg: insertPembelianSchema.shape.hargaPerKg.transform(val => val.toString()),
      totalHarga: insertPembelianSchema.shape.totalHarga.transform(val => val.toString()),
      kadarAir: insertPembelianSchema.shape.kadarAir.transform(val => val ? val.toString() : undefined),
    })),
    defaultValues: {
      supplierId: "",
      tanggal: new Date().toISOString().split('T')[0],
      jenisGabah: "",
      jenisBarang: "gabah", // UPDATE INI UNTUK MULTI PRODUK
      jumlah: "",
      hargaPerKg: "",
      totalHarga: "",
      kadarAir: "",
      kualitas: "",
      status: "pending",
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
      const response = await apiRequest("POST", "/api/pembelian", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pembelian"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Pembelian berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menambahkan pembelian",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/pembelian/${editingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pembelian"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Pembelian berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui pembelian",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pembelian/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pembelian"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Pembelian berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menghapus pembelian",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const formattedData = {
      supplierId: parseInt(data.supplierId),
      tanggal: new Date(data.tanggal),
      jenisGabah: data.jenisGabah,
      jenisBarang: data.jenisBarang, // UPDATE INI UNTUK MULTI PRODUK
      jumlah: data.jumlah,
      hargaPerKg: data.hargaPerKg,
      totalHarga: data.totalHarga,
      kadarAir: data.kadarAir || undefined,
      kualitas: data.kualitas || undefined,
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
      supplierId: item.supplierId?.toString() || "",
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
      jenisGabah: item.jenisGabah,
      jenisBarang: item.jenisBarang || "gabah", // UPDATE INI UNTUK MULTI PRODUK
      jumlah: item.jumlah,
      hargaPerKg: item.hargaPerKg,
      totalHarga: item.totalHarga,
      kadarAir: item.kadarAir || "",
      kualitas: item.kualitas || "",
      status: item.status,
      catatan: item.catatan || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pembelian ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredPembelian = pembelian?.filter((item: any) =>
    item.jenisGabah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handlePrint = (purchase: any) => {
    const supplier = suppliers?.find((s: any) => s.id === purchase.supplierId);
    
    const invoiceData = {
      type: "pembelian" as const,
      invoiceNumber: generateInvoiceNumber("pembelian"),
      date: purchase.tanggal,
      customerName: supplier?.nama || "Supplier",
      customerAddress: supplier?.alamat,
      customerPhone: supplier?.telepon,
      items: [{
        description: `${purchase.jenisBarang === "gabah" ? "Gabah" : purchase.jenisBarang.charAt(0).toUpperCase() + purchase.jenisBarang.slice(1)} ${purchase.jenisGabah || ""}`.trim(),
        quantity: purchase.jumlah,
        unit: "kg",
        price: purchase.hargaPerKg,
        total: purchase.totalHarga,
      }],
      subtotal: purchase.totalHarga,
      total: purchase.totalHarga,
      notes: purchase.catatan,
      paymentMethod: purchase.metodePembayaran === "cash" ? "Tunai" : "Transfer",
    };

    generateInvoicePdf(settings, invoiceData);
    
    toast({
      title: "Berhasil",
      description: "Nota pembelian berhasil diunduh",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-2xl font-inter font-bold text-gray-900">Pembelian Gabah</h2>
              <p className="text-xs md:text-sm text-gray-500">Kelola pembelian gabah dari supplier</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pembelian
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-base md:text-lg">
                    {editingId ? "Edit Pembelian" : "Tambah Pembelian Baru"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih supplier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {suppliers?.map((supplier: any) => (
                                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                    {supplier.name}
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
                        name="jenisGabah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis/Nama Item</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Gabah Kering" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                <SelectItem value="gabah">Gabah</SelectItem>
                                <SelectItem value="beras">Beras</SelectItem>
                                <SelectItem value="katul">Katul</SelectItem>
                                <SelectItem value="menir">Menir</SelectItem>
                                <SelectItem value="sekam">Sekam</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="jumlah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
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
                              <Input type="number" placeholder="0" {...field} />
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
                              <Input type="number" placeholder="0" {...field} readOnly className="bg-gray-50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="kadarAir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kadar Air (%)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kualitas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kualitas</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Premium" {...field} />
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
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  Daftar Pembelian
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari pembelian..."
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
                    ) : filteredPembelian?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-sm">Belum ada data pembelian</TableCell>
                      </TableRow>
                    ) : (
                      filteredPembelian?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs md:text-sm">{formatDate(item.tanggal)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {item.jenisBarang || 'gabah'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">{item.jenisGabah}</TableCell>
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
    </div>
  );
}
