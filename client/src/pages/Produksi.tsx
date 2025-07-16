import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Search, Settings } from "lucide-react";
import { insertProduksiSchema } from "@shared/schema";
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

export default function Produksi() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: produksi, isLoading } = useQuery({
    queryKey: ["/api/produksi"],
  });

  const { data: pengeringan } = useQuery({
    queryKey: ["/api/pengeringan"],
  });

  const form = useForm({
    resolver: zodResolver(insertProduksiSchema),
    defaultValues: {
      pengeringanId: "",
      tanggal: new Date().toISOString().split('T')[0],
      jenisBerasProduced: "",
      jumlahGabahInput: "",
      jumlahBerasOutput: "",
      jumlahDedak: "",
      jumlahMenir: "",
      rendemen: "",
      status: "completed",
      catatan: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/produksi", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/produksi"] });
      toast({
        title: "Sukses",
        description: "Produksi berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menambahkan produksi",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/produksi/${editingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/produksi"] });
      toast({
        title: "Sukses",
        description: "Produksi berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui produksi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      pengeringanId: parseInt(data.pengeringanId),
      tanggal: new Date(data.tanggal),
      jenisBerasProduced: data.jenisBerasProduced,
      jumlahGabahInput: data.jumlahGabahInput || undefined,
      jumlahBerasOutput: data.jumlahBerasOutput || undefined,
      jumlahDedak: data.jumlahDedak || undefined,
      jumlahMenir: data.jumlahMenir || undefined,
      rendemen: data.rendemen || undefined,
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
      pengeringanId: item.pengeringanId?.toString() || "",
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
      jenisBerasProduced: item.jenisBerasProduced,
      jumlahGabahInput: item.jumlahGabahInput || "",
      jumlahBerasOutput: item.jumlahBerasOutput || "",
      jumlahDedak: item.jumlahDedak || "",
      jumlahMenir: item.jumlahMenir || "",
      rendemen: item.rendemen || "",
      status: item.status,
      catatan: item.catatan || "",
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
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

  const filteredProduksi = produksi?.filter((item: any) =>
    item.jenisBerasProduced.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-secondary" />
              <div>
                <h2 className="text-2xl font-inter font-bold text-gray-900">Produksi</h2>
                <p className="text-sm text-gray-500">Kelola proses produksi beras</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produksi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Produksi" : "Tambah Produksi Baru"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pengeringanId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pengeringan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih pengeringan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pengeringan?.map((item: any) => (
                                  <SelectItem key={item.id} value={item.id.toString()}>
                                    Batch #{item.id} - {item.jumlahAkhir || item.jumlahAwal} kg
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
                            <FormLabel>Tanggal Produksi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="jenisBerasProduced"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Beras Diproduksi</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis beras" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beras Premium">Beras Premium</SelectItem>
                              <SelectItem value="Beras Medium">Beras Medium</SelectItem>
                              <SelectItem value="Beras Pecah">Beras Pecah</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jumlahGabahInput"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Gabah Input (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jumlahBerasOutput"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Beras Output (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="jumlahDedak"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Dedak (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jumlahMenir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Menir (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rendemen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rendemen (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
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
                              <SelectItem value="completed">Selesai</SelectItem>
                              <SelectItem value="in_progress">Dalam Proses</SelectItem>
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
                <CardTitle>Daftar Produksi</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari produksi..."
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
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jenis Beras</TableHead>
                    <TableHead>Input Gabah</TableHead>
                    <TableHead>Output Beras</TableHead>
                    <TableHead>Dedak</TableHead>
                    <TableHead>Menir</TableHead>
                    <TableHead>Rendemen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredProduksi?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Belum ada data produksi</TableCell>
                    </TableRow>
                  ) : (
                    filteredProduksi?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.tanggal)}</TableCell>
                        <TableCell>{item.jenisBerasProduced}</TableCell>
                        <TableCell>{item.jumlahGabahInput || "-"} kg</TableCell>
                        <TableCell>{item.jumlahBerasOutput || "-"} kg</TableCell>
                        <TableCell>{item.jumlahDedak || "-"} kg</TableCell>
                        <TableCell>{item.jumlahMenir || "-"} kg</TableCell>
                        <TableCell>{item.rendemen || "-"}%</TableCell>
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
