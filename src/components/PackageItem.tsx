
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export interface PackageData {
  id: string;
  packageType: string;
  weight: string;
  description: string;
}

interface PackageItemProps {
  package: PackageData;
  onUpdate: (id: string, field: keyof PackageData, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const PackageItem = ({ package: pkg, onUpdate, onRemove, canRemove }: PackageItemProps) => {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onRemove(pkg.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor={`packageType-${pkg.id}`}>Tipo de Paquete</Label>
            <Select 
              value={pkg.packageType} 
              onValueChange={(value) => onUpdate(pkg.id, "packageType", value)}
            >
              <SelectTrigger id={`packageType-${pkg.id}`}>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Documentos">Documentos</SelectItem>
                <SelectItem value="Paquete pequeño">Paquete pequeño</SelectItem>
                <SelectItem value="Paquete mediano">Paquete mediano</SelectItem>
                <SelectItem value="Paquete grande">Paquete grande</SelectItem>
                <SelectItem value="Frágil">Frágil</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`weight-${pkg.id}`}>Peso Aproximado (kg)</Label>
            <Input
              id={`weight-${pkg.id}`}
              type="number"
              step="0.1"
              placeholder="Ej: 2.5"
              value={pkg.weight}
              onChange={(e) => onUpdate(pkg.id, "weight", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`description-${pkg.id}`}>Descripción del Paquete</Label>
          <Textarea
            id={`description-${pkg.id}`}
            placeholder="Describe brevemente el contenido del paquete..."
            value={pkg.description}
            onChange={(e) => onUpdate(pkg.id, "description", e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageItem;
