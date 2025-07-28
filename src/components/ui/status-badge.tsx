
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pendiente" | "confirmado" | "en-transito" | "entregado" | "cancelado";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    pendiente: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      text: "Pendiente" 
    },
    confirmado: { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      text: "Confirmado" 
    },
    "en-transito": { 
      color: "bg-purple-100 text-purple-800 border-purple-200", 
      text: "En Tránsito" 
    },
    entregado: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      text: "Entregado" 
    },
    cancelado: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      text: "Cancelado" 
    },
  };

  const config = statusConfig[status];
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        config.color,
        className
      )}
    >
      {config.text}
    </Badge>
  );
};
