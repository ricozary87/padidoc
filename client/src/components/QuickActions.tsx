import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play, FileText, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

const quickActions = [
  {
    title: "Pembelian Baru",
    icon: <Plus className="h-5 w-5 text-white" />,
    bgColor: "bg-primary",
    hoverColor: "hover:bg-blue-100",
    href: "/pembelian",
  },
  {
    title: "Mulai Produksi",
    icon: <Play className="h-5 w-5 text-white" />,
    bgColor: "bg-secondary",
    hoverColor: "hover:bg-green-100",
    href: "/produksi",
  },
  {
    title: "Buat Penjualan",
    icon: <FileText className="h-5 w-5 text-white" />,
    bgColor: "bg-accent",
    hoverColor: "hover:bg-yellow-100",
    href: "/penjualan",
  },
  {
    title: "Lihat Laporan",
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    bgColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-100",
    href: "/laporan",
  },
];

export default function QuickActions() {
  const [, setLocation] = useLocation();

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-inter font-semibold text-gray-900">
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className={`p-4 ${action.hoverColor} transition-colors group h-auto flex-col space-y-3`}
              onClick={() => setLocation(action.href)}
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform`}>
                {action.icon}
              </div>
              <p className="text-sm font-medium text-gray-900">{action.title}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
