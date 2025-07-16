import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Settings, DollarSign, TrendingDown, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  value: number;
  date: string;
}

interface RecentActivitiesProps {
  transactions: Transaction[];
}

export default function RecentActivities({ transactions }: RecentActivitiesProps) {
  // Auto-refresh transaction data every 30 seconds
  const { data: allTransactions, isLoading } = useQuery({
    queryKey: ["/api/dashboard/transactions"],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'pembelian':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'produksi':
        return <Settings className="h-4 w-4 text-green-600" />;
      case 'penjualan':
        return <DollarSign className="h-4 w-4 text-yellow-600" />;
      case 'pengeluaran':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'pembelian':
        return 'bg-blue-100';
      case 'produksi':
        return 'bg-green-100';
      case 'penjualan':
        return 'bg-yellow-100';
      case 'pengeluaran':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Baru saja';
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else {
      return `${Math.floor(diffInHours / 24)} hari yang lalu`;
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-inter font-semibold text-gray-900 flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-600" />
            <span>Riwayat Transaksi</span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            Lihat Semua
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (allTransactions || transactions)?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada transaksi</p>
        ) : (
          (allTransactions || transactions)?.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 ${getIconBgColor(transaction.type)} rounded-full flex items-center justify-center`}>
                {getIcon(transaction.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-gray-900">{transaction.amount} kg</p>
                <p className="text-xs text-gray-500">{formatCurrency(transaction.value)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
