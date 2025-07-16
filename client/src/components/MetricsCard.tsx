import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  iconBgColor?: string;
  colorBg?: string;
  colorText?: string;
  onClick?: () => void;
}

export default function MetricsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  iconBgColor = "bg-blue-100",
  colorBg = "bg-blue-100",
  colorText = "text-blue-800",
  onClick
}: MetricsCardProps) {
  return (
    <Card 
      className={`shadow-md hover:shadow-lg hover:scale-105 transition duration-200 ease-in-out rounded-lg p-2 md:p-4 ${colorBg} ${colorText} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-1 md:p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium opacity-80 truncate">{title}</p>
            <p className="text-lg md:text-2xl font-bold font-mono">{value}</p>
          </div>
          <div className={`w-10 h-10 md:w-12 md:h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-2 md:mt-4 flex items-center">
            <span className={`text-xs md:text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
            <span className="text-xs md:text-sm opacity-70 ml-1 md:ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
