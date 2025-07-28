
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ServiceModal from "@/components/ServiceModal";

interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  multiplier: number;
}

interface Props {
  services: ServiceType[];
  setServices: (services: ServiceType[]) => void;
}

const AdminServiceManager = ({ services, setServices }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const { toast } = useToast();

  const handleSave = (serviceData: Omit<ServiceType, 'id'>) => {
    if (editingService) {
      // Editar servicio existente
      setServices(
        services.map(s =>
          s.id === editingService.id
            ? { ...s, ...serviceData }
            : s
        )
      );
      toast({ 
        title: "Servicio actualizado", 
        description: "El servicio se editó correctamente." 
      });
    } else {
      // Evitar nombres repetidos
      if (services.some(s => s.name.toLowerCase() === serviceData.name.toLowerCase())) {
        toast({
          title: "Nombre duplicado",
          description: "Ya existe un servicio con ese nombre.",
          variant: "destructive",
        });
        return;
      }

      // Crear nuevo servicio
      setServices([
        ...services,
        {
          id: `SRV-${(services.length + 1).toString().padStart(3, "0")}`,
          ...serviceData,
        },
      ]);
      toast({ 
        title: "Servicio creado", 
        description: "El nuevo servicio fue registrado." 
      });
    }
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast({ 
      title: "Servicio eliminado", 
      description: "El servicio fue eliminado.", 
      variant: "destructive" 
    });
  };

  const handleEdit = (service: ServiceType) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleNewService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Servicios</CardTitle>
          <Button onClick={handleNewService}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-sm text-gray-500">Multiplicador: {service.multiplier}x</p>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0 items-center">
                  <span className="text-lg font-bold text-green-600">
                    ${service.basePrice.toLocaleString()}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700" 
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={editingService}
        onSave={handleSave}
      />
    </>
  );
};

export default AdminServiceManager;
