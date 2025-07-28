import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Package, MapPin, Phone, Mail, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Entrega Rápida",
      description: "Recogida y entrega en tiempo récord. Servicio express disponible.",
      icon: Truck,
    },
    {
      title: "Cobertura Nacional",
      description: "Llegamos a cada rincón de República Dominicana, sin importar dónde estés.",
      icon: MapPin,
    },
    {
      title: "Seguridad Garantizada",
      description: "Paquetes asegurados y protegidos en cada etapa del envío.",
      icon: CheckCircle,
    },
  ];

  const stats = [
    { label: "Clientes Satisfechos", value: "5,000+" },
    { label: "Envíos Mensuales", value: "10,000+" },
    { label: "Provincias Cubiertas", value: "32" },
    { label: "Años de Experiencia", value: "10+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mensajería RD
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pricing">
                <Button variant="ghost">Ver Precios</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Mensajería Rápida y
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Confiable en RD
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Servicio de mensajería profesional en toda República Dominicana. 
              Envíos seguros desde Santo Domingo hasta las provincias más remotas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Solicitar Recogida
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ver Tarifas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 transform -rotate-12">
            <Card className="w-48 p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold">Entrega Express</p>
                  <p className="text-sm text-gray-600">2-4 horas</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="absolute top-32 right-10 transform rotate-12">
            <Card className="w-48 p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold">Cobertura Nacional</p>
                  <p className="text-sm text-gray-600">32 provincias</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Elegirnos?</h2>
            <p className="text-lg text-gray-600">Somos líderes en mensajería en República Dominicana</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-gradient-to-b from-white to-gray-50">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Listo para enviar tu paquete?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a miles de dominicanos que confían en nuestro servicio de mensajería.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Consultar Precios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">Mensajería RD</span>
              </div>
              <p className="text-gray-400">
                Conectando República Dominicana con entregas rápidas y seguras.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Entrega Express</li>
                <li>Envío Nacional</li>
                <li>Paquetes Frágiles</li>
                <li>Documentos Legales</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Cobertura</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Santo Domingo</li>
                <li>Santiago</li>
                <li>La Romana</li>
                <li>Puerto Plata</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (809) 555-0123
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@mensajeria-rd.com
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Santo Domingo, RD
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mensajería RD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "Entrega Rápida",
    description: "Recogida y entrega en tiempo récord. Servicio express disponible.",
    icon: Truck,
  },
  {
    title: "Cobertura Nacional",
    description: "Llegamos a cada rincón de República Dominicana, sin importar dónde estés.",
    icon: MapPin,
  },
  {
    title: "Seguridad Garantizada",
    description: "Paquetes asegurados y protegidos en cada etapa del envío.",
    icon: CheckCircle,
  },
];

const stats = [
  { label: "Clientes Satisfechos", value: "5,000+" },
  { label: "Envíos Mensuales", value: "10,000+" },
  { label: "Provincias Cubiertas", value: "32" },
  { label: "Años de Experiencia", value: "10+" },
];

export default Index;
