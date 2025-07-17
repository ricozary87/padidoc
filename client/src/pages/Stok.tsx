import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from "lucide-react";
import { insertStokSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Stok() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: stok, isLoading } = useQuery({
    queryKey: ["/api/stok"],
  });

  const form = useForm({
    resolver: zodResolver(insertStokSchema),
    defaultValues: {
      jenisItem: "",
      jumlah: "",
      satuan: "",
      hargaRataRata: "",
      batasMinimum: "",
      lokasi: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/stok", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stok"] });
      toast({
        title: "Sukses",
        description: "Stok berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menambahkan stok",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/stok/${editingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stok"] });
      toast({
        title: "Sukses",
        description: "Stok berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui stok",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/stok/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stok"] });
      toast({
        title: "Sukses",
        description: "Stok berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menghapus stok",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      jenisItem: data.jenisItem,
      jumlah: data.jumlah,
      satuan: data.satuan,
      hargaRataRata: data.hargaRataRata || undefined,
      batasMinimum: data.batasMinimum || undefined,
      lokasi: data.lokasi || undefined,
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
      jenisItem: item.jenisItem,
      jumlah: item.jumlah,
      satuan: item.satuan,
      hargaRataRata: item.hargaRataRata || "",
      batasMinimum: item.batasMinimum || "",
      lokasi: item.lokasi || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus stok ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (amount: string | number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (!minimum) return { status: "normal", color: "bg-green-100 text-green-800" };
    
    if (current <= minimum) {
      return { status: "kritis", color: "bg-red-100 text-red-800" };
    } else if (current <= minimum * 1.5) {
      return { status: "rendah", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "aman", color: "bg-green-100 text-green-800" };
    }
  };

  const filteredStok = stok?.filter((item: any) =>
    item.jenisItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = stok?.filter((item: any) => {
    const { status } = getStockStatus(Number(item.jumlah), Number(item.batasMinimum));
    return status === "kritis" || status === "rendah";
  });

  return (
    <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-2xl font-inter font-bold text-gray-900">Stok</h2>
                <p className="text-sm text-gray-500">Kelola inventori dan stok barang</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Stok
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Stok" : "Tambah Stok Baru"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jenisItem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Item</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis item" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Beras Premium">Beras Premium</SelectItem>
                                <SelectItem value="Beras Medium">Beras Medium</SelectItem>
                                <SelectItem value="Beras Pecah">Beras Pecah</SelectItem>
                                <SelectItem value="Dedak">Dedak</SelectItem>
                                <SelectItem value="Menir">Menir</SelectItem>
                                <SelectItem value="Gabah">Gabah</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="satuan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Satuan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih satuan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="ton">Ton</SelectItem>
                                <SelectItem value="karung">Karung</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jumlah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="batasMinimum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batas Minimum</FormLabel>
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
                        name="hargaRataRata"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Harga Rata-rata</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lokasi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokasi</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Gudang A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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

        <main className="flex-1 p-6 space-y-6">
          {/* Low Stock Alert */}
          {lowStockItems && lowStockItems.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Terdapat {lowStockItems.length} item dengan stok rendah atau kritis yang memerlukan perhatian.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Stok</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari stok..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Item</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Harga Rata-rata</TableHead>
                    <TableHead>Batas Minimum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredStok?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Belum ada data stok</TableCell>
                    </TableRow>
                  ) : (
                    filteredStok?.map((item: any) => {
                      const { status, color } = getStockStatus(Number(item.jumlah), Number(item.batasMinimum));
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.jenisItem}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.satuan}</TableCell>
                          <TableCell>{formatCurrency(item.hargaRataRata)}</TableCell>
                          <TableCell>{item.batasMinimum || "-"}</TableCell>
                          <TableCell>
                            <Badge className={color}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.lokasi || "-"}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
