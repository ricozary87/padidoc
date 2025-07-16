import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Search, Sun } from "lucide-react";
import { insertPengeringanSchema } from "@shared/schema";
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

export default function Pengeringan() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: pengeringan, isLoading } = useQuery({
    queryKey: ["/api/pengeringan"],
  });

  const { data: pembelian } = useQuery({
    queryKey: ["/api/pembelian"],
  });

  const form = useForm({
    resolver: zodResolver(insertPengeringanSchema),
    defaultValues: {
      pembelianId: "",
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: "",
      kadarAirAwal: "",
      kadarAirAkhir: "",
      jumlahAwal: "",
      jumlahAkhir: "",
      status: "ongoing",
      catatan: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/pengeringan", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pengeringan"] });
      toast({
        title: "Sukses",
        description: "Pengeringan berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menambahkan pengeringan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/pengeringan/${editingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pengeringan"] });
      toast({
        title: "Sukses",
        description: "Pengeringan berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui pengeringan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      pembelianId: parseInt(data.pembelianId),
      tanggalMulai: new Date(data.tanggalMulai),
      tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : undefined,
      kadarAirAwal: data.kadarAirAwal || undefined,
      kadarAirAkhir: data.kadarAirAkhir || undefined,
      jumlahAwal: data.jumlahAwal || undefined,
      jumlahAkhir: data.jumlahAkhir || undefined,
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
      pembelianId: item.pembelianId?.toString() || "",
      tanggalMulai: new Date(item.tanggalMulai).toISOString().split('T')[0],
      tanggalSelesai: item.tanggalSelesai ? new Date(item.tanggalSelesai).toISOString().split('T')[0] : "",
      kadarAirAwal: item.kadarAirAwal || "",
      kadarAirAkhir: item.kadarAirAkhir || "",
      jumlahAwal: item.jumlahAwal || "",
      jumlahAkhir: item.jumlahAkhir || "",
      status: item.status,
      catatan: item.catatan || "",
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const filteredPengeringan = pengeringan?.filter((item: any) =>
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="h-6 w-6 text-yellow-600" />
              <div>
                <h2 className="text-2xl font-inter font-bold text-gray-900">Pengeringan Gabah</h2>
                <p className="text-sm text-gray-500">Kelola proses pengeringan gabah</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pengeringan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Pengeringan" : "Tambah Pengeringan Baru"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pembelianId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pembelian Gabah</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih pembelian gabah" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pembelian?.map((item: any) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                  {item.jenisGabah} - {item.jumlah} kg
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tanggalMulai"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal Mulai</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tanggalSelesai"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal Selesai</FormLabel>
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
                        name="kadarAirAwal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kadar Air Awal (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kadarAirAkhir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kadar Air Akhir (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jumlahAwal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Awal (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jumlahAkhir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Akhir (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                              <SelectItem value="ongoing">Sedang Berjalan</SelectItem>
                              <SelectItem value="completed">Selesai</SelectItem>
                              <SelectItem value="cancelled">Dibatalkan</SelectItem>
                            </SelectContent>
                          </Select>
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

        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Pengeringan</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari pengeringan..."
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
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead>Tanggal Selesai</TableHead>
                    <TableHead>Kadar Air Awal</TableHead>
                    <TableHead>Kadar Air Akhir</TableHead>
                    <TableHead>Jumlah Awal</TableHead>
                    <TableHead>Jumlah Akhir</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredPengeringan?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Belum ada data pengeringan</TableCell>
                    </TableRow>
                  ) : (
                    filteredPengeringan?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.tanggalMulai)}</TableCell>
                        <TableCell>{item.tanggalSelesai ? formatDate(item.tanggalSelesai) : "-"}</TableCell>
                        <TableCell>{item.kadarAirAwal || "-"}%</TableCell>
                        <TableCell>{item.kadarAirAkhir || "-"}%</TableCell>
                        <TableCell>{item.jumlahAwal || "-"} kg</TableCell>
                        <TableCell>{item.jumlahAkhir || "-"} kg</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
