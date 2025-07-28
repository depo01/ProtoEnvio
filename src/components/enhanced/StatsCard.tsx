
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "blue" | "green" | "yellow" | "purple" | "red";
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = "blue",
  className 
}: StatsCardProps) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    red: "bg-red-500"
  };

  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {trend && (
              <div className="flex items-center text-sm">
                <span className={cn(
                  "font-medium",
                  trend.value >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}%
                </span>
                <span className="text-gray-500 ml-1">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full text-white",
            colorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
