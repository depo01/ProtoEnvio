
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  multiplier: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceType | null;
  onSave: (serviceData: Omit<ServiceType, 'id'>) => void;
}

const initialForm = {
  name: "",
  description: "",
  basePrice: "",
  multiplier: "",
};

const ServiceModal = ({ isOpen, onClose, service, onSave }: Props) => {
  const [form, setForm] = useState(initialForm);
  const { toast } = useToast();

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        description: service.description,
        basePrice: service.basePrice.toString(),
        multiplier: service.multiplier.toString(),
      });
    } else {
      setForm(initialForm);
    }
  }, [service, isOpen]);

  const handleSave = () => {
    // Validaciones
    if (!form.name || !form.description || !form.basePrice || !form.multiplier) {
      toast({
        title: "Campos requeridos",
        description: "Completa todos los campos del servicio.",
        variant: "destructive",
      });
      return;
    }

    const basePrice = Number(form.basePrice);
    const multiplier = Number(form.multiplier);

    if (isNaN(basePrice) || basePrice <= 0) {
      toast({
        title: "Precio inválido",
        description: "El precio debe ser un número mayor a cero.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(multiplier) || multiplier <= 0) {
      toast({
        title: "Multiplicador inválido",
        description: "El multiplicador debe ser un número mayor a cero.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name: form.name,
      description: form.description,
      basePrice,
      multiplier,
    });

    handleClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Servicio" : "Nuevo Servicio"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Servicio</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre del servicio"
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción del servicio"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basePrice">Precio Base</Label>
              <Input
                id="basePrice"
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                placeholder="12000"
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="multiplier">Multiplicador</Label>
              <Input
                id="multiplier"
                type="number"
                value={form.multiplier}
                onChange={(e) => setForm({ ...form, multiplier: e.target.value })}
                placeholder="1.0"
                step="0.01"
                min={0.1}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {service ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
