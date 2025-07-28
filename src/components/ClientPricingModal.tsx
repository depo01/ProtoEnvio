
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
}

interface ClientPricing {
  clientId: string;
  serviceId: string;
  customPrice: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  client: { id: string; name: string; email: string } | null;
  services: ServiceType[];
  clientPricing: ClientPricing[];
  onSave: (clientId: string, pricing: { serviceId: string; customPrice: number }[]) => void;
}

const ClientPricingModal = ({ isOpen, onClose, client, services, clientPricing, onSave }: Props) => {
  const [customPrices, setCustomPrices] = useState<{ [serviceId: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (client && isOpen) {
      const clientSpecificPricing = clientPricing.filter(p => p.clientId === client.id);
      const priceMap: { [serviceId: string]: string } = {};
      
      services.forEach(service => {
        const customPrice = clientSpecificPricing.find(p => p.serviceId === service.id);
        priceMap[service.id] = customPrice ? customPrice.customPrice.toString() : '';
      });
      
      setCustomPrices(priceMap);
    }
  }, [client, isOpen, clientPricing, services]);

  const handleSave = () => {
    if (!client) return;

    const pricingData = Object.entries(customPrices)
      .filter(([_, price]) => price.trim() !== '')
      .map(([serviceId, price]) => ({
        serviceId,
        customPrice: parseFloat(price)
      }))
      .filter(item => !isNaN(item.customPrice) && item.customPrice > 0);

    onSave(client.id, pricingData);
    toast({
      title: "Tarifas actualizadas",
      description: `Se actualizaron las tarifas personalizadas para ${client.name}`,
    });
    onClose();
  };

  const handlePriceChange = (serviceId: string, value: string) => {
    setCustomPrices(prev => ({
      ...prev,
      [serviceId]: value
    }));
  };

  const clearPrice = (serviceId: string) => {
    setCustomPrices(prev => ({
      ...prev,
      [serviceId]: ''
    }));
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tarifas Especiales por Contrato - {client.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Cómo funciona?</p>
                <p>Configure precios especiales para este cliente. Si no configura un precio especial, se usará la tarifa estándar.</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6">
            {services.map(service => {
              const currentCustomPrice = customPrices[service.id] || '';
              const hasCustomPrice = currentCustomPrice.trim() !== '';
              const numericCustomPrice = parseFloat(currentCustomPrice);
              const isValidPrice = !isNaN(numericCustomPrice) && numericCustomPrice > 0;
              
              return (
                <Card key={service.id} className={hasCustomPrice && isValidPrice ? "border-green-200 bg-green-50" : hasCustomPrice ? "border-red-200 bg-red-50" : ""}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        {service.name}
                        {hasCustomPrice && isValidPrice && (
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Precio especial activo
                          </span>
                        )}
                      </span>
                      {hasCustomPrice && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearPrice(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-700 font-medium">Tarifa Estándar</Label>
                        <div className="mt-1 p-3 bg-gray-100 border rounded-md">
                          <span className="text-lg font-bold text-gray-800">
                            RD${service.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Esta es la tarifa normal que pagan todos los clientes</p>
                      </div>
                      
                      <div>
                        <Label className="text-gray-700 font-medium">Tarifa Especial por Contrato</Label>
                        <div className="mt-1 relative">
                          <Input
                            type="number"
                            placeholder={`Ej: ${(service.basePrice * 0.9).toFixed(0)}`}
                            value={currentCustomPrice}
                            onChange={(e) => handlePriceChange(service.id, e.target.value)}
                            className={`text-lg ${hasCustomPrice && isValidPrice ? "border-green-400 bg-white" : hasCustomPrice ? "border-red-400" : ""}`}
                          />
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">RD$</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {hasCustomPrice ? 
                            (isValidPrice ? 
                              `Descuento: RD$${(service.basePrice - numericCustomPrice).toLocaleString()} (${(((service.basePrice - numericCustomPrice) / service.basePrice) * 100).toFixed(1)}%)` :
                              "Ingrese un precio válido mayor a 0"
                            ) :
                            "Deje vacío para usar tarifa estándar"
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Guardar Tarifas Especiales
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientPricingModal;
