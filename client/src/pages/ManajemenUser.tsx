import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, Edit, UserX, Shield, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ManajemenUser() {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      await apiRequest(`/api/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsRoleDialogOpen(false);
      setEditingUserId(null);
      toast({
        title: "Berhasil",
        description: "Role user berhasil diubah",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal mengubah role user",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      await apiRequest(`/api/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive }),
      });
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Berhasil",
        description: `User berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal mengubah status user",
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = (user: any) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleSubmitRoleChange = () => {
    if (editingUserId && selectedRole) {
      updateRoleMutation.mutate({ userId: editingUserId, role: selectedRole });
    }
  };

  const handleToggleStatus = (userId: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <User className="w-3 h-3 mr-1" />
        Operator
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aktif</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Nonaktif</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          </div>
          <div className="text-sm text-gray-500">
            Total: {users?.length || 0} pengguna
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead>Terakhir Update</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Belum ada pengguna terdaftar
                    </TableCell>
                  </TableRow>
                ) : (
                  users?.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog 
                            open={isRoleDialogOpen && editingUserId === user.id} 
                            onOpenChange={setIsRoleDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRoleChange(user)}
                                className="flex items-center space-x-1"
                              >
                                <Edit className="h-3 w-3" />
                                <span>Edit Role</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Role Pengguna</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Mengubah role untuk: <strong>{user.username}</strong>
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Role Baru</label>
                                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="operator">Operator</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsRoleDialogOpen(false)}
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    onClick={handleSubmitRoleChange}
                                    disabled={updateRoleMutation.isPending}
                                  >
                                    Simpan Perubahan
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`flex items-center space-x-1 ${
                                  user.isActive 
                                    ? "text-red-600 hover:text-red-700" 
                                    : "text-green-600 hover:text-green-700"
                                }`}
                              >
                                <UserX className="h-3 w-3" />
                                <span>{user.isActive ? "Nonaktifkan" : "Aktifkan"}</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {user.isActive ? "Nonaktifkan" : "Aktifkan"} Pengguna
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin {user.isActive ? "menonaktifkan" : "mengaktifkan"} pengguna "{user.username}"?
                                  {user.isActive && " Pengguna yang dinonaktifkan tidak dapat login ke sistem."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleToggleStatus(user.id, user.isActive)}
                                  className={user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                                >
                                  {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
  );
}