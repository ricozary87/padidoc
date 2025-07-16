import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CardStatProps {
  title: string;
  value: string;
  icon: ReactNode;
  colorBg?: string;
  colorText?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  subtext?: string;
}

export default function CardStat({ 
  title, 
  value, 
  icon, 
  colorBg = "bg-blue-100",
  colorText = "text-blue-800",
  trend,
  subtext
}: CardStatProps) {
  return (
    <Card className={`shadow-md hover:shadow-lg hover:scale-105 transition duration-200 ease-in-out rounded-lg p-4 ${colorBg} ${colorText}`}>
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold font-mono">{value}</p>
            {subtext && <p className="text-xs opacity-70 mt-1">{subtext}</p>}
          </div>
          <div className="flex items-center justify-center">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
            <span className="text-sm opacity-70 ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}