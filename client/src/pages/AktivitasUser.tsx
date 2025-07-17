import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Search, Calendar, User, Shield, Eye, Filter, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  } | null;
}

export default function AktivitasUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");

  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const getActionBadge = (action: string) => {
    const actionMap: { [key: string]: { label: string; color: string } } = {
      login: { label: "Login", color: "bg-green-100 text-green-800 border-green-200" },
      logout: { label: "Logout", color: "bg-gray-100 text-gray-800 border-gray-200" },
      create: { label: "Buat", color: "bg-blue-100 text-blue-800 border-blue-200" },
      update: { label: "Edit", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      delete: { label: "Hapus", color: "bg-red-100 text-red-800 border-red-200" },
      update_role: { label: "Ubah Role", color: "bg-purple-100 text-purple-800 border-purple-200" },
      update_status: { label: "Ubah Status", color: "bg-orange-100 text-orange-800 border-orange-200" },
    };

    const config = actionMap[action] || { label: action, color: "bg-gray-100 text-gray-800 border-gray-200" };
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getResourceIcon = (resource: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      auth: Shield,
      user: User,
      pembelian: Activity,
      produksi: Activity,
      penjualan: Activity,
      pengeluaran: Activity,
      stok: Activity,
    };

    const Icon = iconMap[resource] || Activity;
    return <Icon className="w-4 h-4 mr-1" />;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = 
      log.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesUser = filterUser === "all" || log.userId.toString() === filterUser;

    return matchesSearch && matchesAction && matchesUser;
  }) || [];

  // Get unique users and actions for filters
  const uniqueUsers = Array.from(new Set(logs?.map(log => log.user).filter(Boolean))).filter(Boolean);
  const uniqueActions = Array.from(new Set(logs?.map(log => log.action)));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Aktivitas Pengguna</h1>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Auto-refresh setiap 30 detik</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle>Log Aktivitas</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari aktivitas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter Aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Aksi</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua User</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {logs?.length === 0 ? "Belum ada aktivitas" : "Tidak ada aktivitas yang cocok dengan filter"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => {
                      const dateTime = formatDateTime(log.createdAt);
                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {log.user?.role === "admin" ? (
                                <Shield className="w-4 h-4 text-red-600" />
                              ) : (
                                <User className="w-4 h-4 text-green-600" />
                              )}
                              <div>
                                <div className="font-medium">{log.user?.username || "Unknown"}</div>
                                <div className="text-sm text-gray-500">{log.user?.email || "N/A"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getResourceIcon(log.resource)}
                              <span className="capitalize">{log.resource}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={log.details || "N/A"}>
                              {log.details || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>{dateTime.date}</TableCell>
                          <TableCell>{dateTime.time}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500 font-mono">
                              {log.ipAddress || "N/A"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Aktivitas</p>
                  <p className="text-2xl font-bold text-gray-900">{logs?.length || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">User Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueUsers.length}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktivitas Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs?.filter(log => {
                      const today = new Date().toDateString();
                      const logDate = new Date(log.createdAt).toDateString();
                      return today === logDate;
                    }).length || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}