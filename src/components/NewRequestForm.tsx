
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Package, MapPin, Calculator } from "lucide-react";
import { calculatePrice } from "@/utils/pricingUtils";
import { GradientBackground } from "@/components/enhanced/GradientBackground";

interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  multiplier: number;
}

interface ClientPricing {
  clientId: string;
  serviceId: string;
  customPrice: number;
}

interface Package {
  id: string;
  type: string;
  weight: number;
  description: string;
}

interface Props {
  onSubmit: (requestData: any) => void;
  onCancel: () => void;
}

const NewRequestForm = ({ onSubmit, onCancel }: Props) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [packages, setPackages] = useState<Package[]>([
    { id: "1", type: "", weight: 1, description: "" }
  ]);
  const [selectedZone, setSelectedZone] = useState("");

  const services: ServiceType[] = [
    { id: "SRV-001", name: "Documentos", basePrice: 400, multiplier: 1.0 },
    { id: "SRV-002", name: "Paquete pequeño", basePrice: 600, multiplier: 1.2 },
    { id: "SRV-003", name: "Frágil", basePrice: 900, multiplier: 1.8 },
  ];

  const zones = [
    { name: "Santo Domingo Centro", multiplier: 1.0 },
    { name: "Santo Domingo Norte", multiplier: 1.2 },
    { name: "Santiago", multiplier: 1.5 },
    { name: "La Romana", multiplier: 1.8 },
  ];

  const clientPricing: ClientPricing[] = [];
  const clientId = localStorage.getItem("userEmail") || "";

  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      type: "",
      weight: 1,
      description: ""
    };
    setPackages([...packages, newPackage]);
  };

  const removePackage = (id: string) => {
    if (packages.length > 1) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  const updatePackage = (id: string, field: keyof Package, value: any) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ));
  };

  const calculateTotalPrice = () => {
    const zone = zones.find(z => z.name === selectedZone);
    if (!zone) return 0;

    return packages.reduce((total, pkg) => {
      if (!pkg.type) return total;
      const price = calculatePrice(
        pkg.type,
        zone.multiplier,
        pkg.weight,
        services,
        clientId,
        clientPricing
      );
      return total + price;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalPrice = calculateTotalPrice();
    
    const requestData = {
      origin,
      destination,
      packages,
      zone: selectedZone,
      totalPrice,
      date: new Date().toISOString().split('T')[0],
      status: "pending" as const
    };
    
    onSubmit(requestData);
  };

  const isFormValid = origin && destination && selectedZone && 
    packages.every(pkg => pkg.type && pkg.description);

  return (
    <div className="relative">
      <GradientBackground />
      <Card className="relative bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Package className="h-6 w-6" />
            Nueva Solicitud de Recogida
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Direcciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Punto de Recogida
                </Label>
                <Input
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ingrese la dirección de recogida"
                  className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-red-600" />
                  Destino
                </Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ingrese la dirección de entrega"
                  className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Zona */}
            <div className="space-y-2">
              <Label htmlFor="zone" className="text-sm font-semibold">Zona de Entrega</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="h-12 bg-white border-gray-200">
                  <SelectValue placeholder="Seleccionar zona de entrega" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.name} value={zone.name}>
                      <div className="flex justify-between items-center w-full">
                        <span>{zone.name}</span>
                        <span className="text-sm text-gray-500 ml-2">x{zone.multiplier}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Paquetes */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Paquetes
                </Label>
                <Button type="button" onClick={addPackage} variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Paquete
                </Button>
              </div>
              
              {packages.map((pkg, index) => (
                <Card key={pkg.id} className="border-gray-200 bg-gray-50/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        Paquete {index + 1}
                      </h4>
                      {packages.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePackage(pkg.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Tipo de Paquete</Label>
                        <Select 
                          value={pkg.type} 
                          onValueChange={(value) => updatePackage(pkg.id, 'type', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{service.name}</span>
                                  <span className="text-sm text-green-600 font-medium ml-2">
                                    RD${service.basePrice.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Peso (kg)</Label>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={pkg.weight}
                          onChange={(e) => updatePackage(pkg.id, 'weight', parseFloat(e.target.value))}
                          className="bg-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Descripción</Label>
                        <Input
                          value={pkg.description}
                          onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                          placeholder="Descripción del paquete"
                          className="bg-white"
                        />
                      </div>
                    </div>
                    
                    {pkg.type && selectedZone && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Precio estimado: 
                            <span className="text-lg font-bold ml-2">
                              RD${calculatePrice(
                                pkg.type,
                                zones.find(z => z.name === selectedZone)?.multiplier || 1,
                                pkg.weight,
                                services,
                                clientId,
                                clientPricing
                              ).toLocaleString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total */}
            {selectedZone && (
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <Calculator className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-semibold text-green-800">
                        Total Estimado:
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-green-600">
                      RD${calculateTotalPrice().toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={!isFormValid} 
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
              >
                Enviar Solicitud
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="px-8 h-12 border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequestForm;
