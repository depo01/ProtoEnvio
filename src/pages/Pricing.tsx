
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package, Clock, Shield, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const pricingTiers = [
    {
      type: "Documentos",
      basePrice: 150,
      description: "Cartas, documentos legales, facturas",
      features: ["Hasta 0.5 kg", "Entrega mismo día", "Seguimiento en tiempo real"],
      multiplier: 1,
    },
    {
      type: "Paquete pequeño",
      basePrice: 200,
      description: "Productos pequeños, regalos",
      features: ["Hasta 2 kg", "Entrega 24-48 horas", "Seguro incluido"],
      multiplier: 1.2,
    },
    {
      type: "Paquete mediano",
      basePrice: 350,
      description: "Productos medianos, equipos",
      features: ["Hasta 10 kg", "Entrega 24-72 horas", "Manejo especial"],
      multiplier: 1.5,
    },
    {
      type: "Paquete grande",
      basePrice: 500,
      description: "Productos voluminosos",
      features: ["Hasta 25 kg", "Entrega coordinada", "Seguro premium"],
      multiplier: 2,
    },
    {
      type: "Frágil",
      basePrice: 300,
      description: "Productos delicados, cristalería",
      features: ["Manejo especializado", "Empaque reforzado", "Seguro completo"],
      multiplier: 1.8,
    },
    {
      type: "Urgente",
      basePrice: 400,
      description: "Entrega express inmediata",
      features: ["Entrega en 2-4 horas", "Prioridad máxima", "Mensajero dedicado"],
      multiplier: 2.2,
    },
  ];

  const zones = [
    {
      name: "Distrito Nacional",
      areas: ["Zona Colonial", "Polígono Central", "Naco", "Piantini", "Bella Vista"],
      multiplier: 1,
    },
    {
      name: "Santo Domingo Este",
      areas: ["Boca Chica", "Los Mina", "Villa Mella", "Capotillo"],
      multiplier: 1.2,
    },
    {
      name: "Santo Domingo Norte",
      areas: ["Villa Altagracia", "Pedro Brand", "La Victoria"],
      multiplier: 1.3,
    },
    {
      name: "Santo Domingo Oeste",
      areas: ["Los Alcarrizos", "Pantoja", "Haina"],
      multiplier: 1.4,
    },
    {
      name: "Santiago",
      areas: ["Santiago Centro", "Gurabo", "Villa González"],
      multiplier: 1.8,
    },
    {
      name: "Otras Provincias",
      areas: ["La Romana", "Puerto Plata", "San Cristóbal", "Baní"],
      multiplier: 2.5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Precios de Envío</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">Inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifas de Mensajería en República Dominicana
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Precios transparentes para todos los tipos de envío. Cobertura en todo el territorio nacional.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <Card key={tier.type} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{tier.type}</CardTitle>
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  RD${tier.basePrice}
                  <span className="text-sm font-normal text-gray-600 ml-1">desde</span>
                </p>
                <p className="text-gray-600">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Zone Pricing */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Tarifas por Zona de Cobertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <div key={zone.name} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{zone.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Multiplicador: {zone.multiplier}x
                  </p>
                  <div className="space-y-1">
                    {zone.areas.map((area, index) => (
                      <p key={index} className="text-sm text-gray-700">• {area}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> El precio final se calcula multiplicando la tarifa base por el tipo de paquete 
                y el multiplicador de zona. Peso adicional se cobra RD$20 por cada kg extra.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Servicios Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Entrega Programada</h4>
                  <p className="text-sm text-gray-600">RD$50 adicionales</p>
                  <p className="text-xs text-gray-500">Coordina hora específica de entrega</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Seguro Adicional</h4>
                  <p className="text-sm text-gray-600">2% del valor declarado</p>
                  <p className="text-xs text-gray-500">Cobertura hasta RD$50,000</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Empaque Especial</h4>
                  <p className="text-sm text-gray-600">RD$75 - RD$150</p>
                  <p className="text-xs text-gray-500">Para productos frágiles o de alto valor</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Recogida Inmediata</h4>
                  <p className="text-sm text-gray-600">RD$100 adicionales</p>
                  <p className="text-xs text-gray-500">Recogida en menos de 2 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>¿Necesitas una Cotización Personalizada?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Para envíos especiales, volúmenes altos o servicios corporativos, contáctanos para obtener 
              una cotización personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm">+1 (809) 555-0123</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm">ventas@mensajeria-rd.com</span>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/register">
                <Button size="lg">
                  Crear Cuenta y Solicitar Servicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
