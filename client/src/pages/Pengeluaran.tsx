import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Search, Receipt } from "lucide-react";
import { insertPengeluaranSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Pengeluaran() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: pengeluaran, isLoading } = useQuery({
    queryKey: ["/api/pengeluaran"],
  });

  const form = useForm({
    resolver: zodResolver(insertPengeluaranSchema),
    defaultValues: {
      tanggal: new Date().toISOString().split('T')[0],
      kategori: "",
      deskripsi: "",
      jumlah: "",
      catatan: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/pengeluaran", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pengeluaran"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Pengeluaran berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menambahkan pengeluaran",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/pengeluaran/${editingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pengeluaran"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Pengeluaran berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui pengeluaran",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pengeluaran/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pengeluaran"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sukses",
        description: "Pengeluaran berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menghapus pengeluaran",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      tanggal: new Date(data.tanggal),
      kategori: data.kategori,
      deskripsi: data.deskripsi,
      jumlah: data.jumlah,
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
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      jumlah: item.jumlah,
      catatan: item.catatan || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      deleteMutation.mutate(id);
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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'operasional':
        return 'bg-blue-100 text-blue-800';
      case 'perawatan':
        return 'bg-yellow-100 text-yellow-800';
      case 'bahan bakar':
        return 'bg-red-100 text-red-800';
      case 'gaji':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPengeluaran = pengeluaran?.filter((item: any) =>
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Receipt className="h-5 w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl md:text-2xl font-inter font-bold text-gray-900">Pengeluaran</h2>
                <p className="text-xs md:text-sm text-gray-500">Kelola pengeluaran operasional</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pengeluaran
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Pengeluaran" : "Tambah Pengeluaran Baru"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                      <FormField
                        control={form.control}
                        name="kategori"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kategori</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Operasional">Operasional</SelectItem>
                                <SelectItem value="Perawatan">Perawatan</SelectItem>
                                <SelectItem value="Bahan Bakar">Bahan Bakar</SelectItem>
                                <SelectItem value="Gaji">Gaji</SelectItem>
                                <SelectItem value="Utilitas">Utilitas</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="deskripsi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Input placeholder="Deskripsi pengeluaran..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  Daftar Pengeluaran
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari pengeluaran..."
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
                      <TableHead className="text-xs md:text-sm">Kategori</TableHead>
                      <TableHead className="text-xs md:text-sm">Deskripsi</TableHead>
                      <TableHead className="text-xs md:text-sm">Jumlah</TableHead>
                      <TableHead className="text-xs md:text-sm">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm">Loading...</TableCell>
                      </TableRow>
                    ) : filteredPengeluaran?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm">Belum ada data pengeluaran</TableCell>
                      </TableRow>
                    ) : (
                      filteredPengeluaran?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs md:text-sm">{formatDate(item.tanggal)}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getCategoryColor(item.kategori)}`}>
                              {item.kategori}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">{item.deskripsi}</TableCell>
                          <TableCell className="text-xs md:text-sm">{formatCurrency(item.jumlah)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
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
