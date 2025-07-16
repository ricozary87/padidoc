import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Settings, DollarSign } from "lucide-react";

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
  const getIcon = (type: string) => {
    switch (type) {
      case 'pembelian':
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case 'produksi':
        return <Settings className="h-4 w-4 text-secondary" />;
      case 'penjualan':
        return <DollarSign className="h-4 w-4 text-accent" />;
      default:
        return <ShoppingCart className="h-4 w-4 text-primary" />;
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
          <CardTitle className="text-lg font-inter font-semibold text-gray-900">
            Transaksi Terbaru
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            Lihat Semua
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada transaksi</p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
