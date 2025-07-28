
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminServiceManager from "./AdminServiceManager";
import AdminOperativeUserManager from "./AdminOperativeUserManager";
import AdminClientManager from "./AdminClientManager";
import AdminRequestManager from "./AdminRequestManager";
import AdminDashboardStats from "./AdminDashboardStats";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalRequests: number;
  registrationDate: string;
}

interface PickupRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  origin: string;
  destination: string;
  packageType: string;
  weight: string;
  description: string;
  date: string;
  status: "pendiente" | "confirmado" | "en-transito" | "entregado" | "cancelado";
  price: number;
}

interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  multiplier: number;
}

interface OperativeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  username: string;
  mustSetPassword: boolean;
  role: "operative";
  password: string;
}

interface ClientPricing {
  clientId: string;
  serviceId: string;
  customPrice: number;
}

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [operativeUsers, setOperativeUsers] = useState<OperativeUser[]>([]);
  const [clientPricing, setClientPricing] = useState<ClientPricing[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
      return;
    }

    // Load demo data for República Dominicana
    const demoClients: Client[] = [
      {
        id: "CLI-001",
        name: "Carlos Martínez García",
        email: "carlos@empresa.do",
        phone: "+1 809 555 1234",
        totalRequests: 15,
        registrationDate: "2024-01-10",
      },
      {
        id: "CLI-002",
        name: "Ana Rodríguez Peña",
        email: "ana@comercio.do",
        phone: "+1 829 555 5678",
        totalRequests: 8,
        registrationDate: "2024-01-15",
      },
      {
        id: "CLI-003",
        name: "José Luis Fernández",
        email: "jose@logistica.do",
        phone: "+1 849 555 9012",
        totalRequests: 22,
        registrationDate: "2024-02-01",
      },
    ];

    const demoRequests: PickupRequest[] = [
      {
        id: "REQ-001",
        clientName: "Carlos Martínez García",
        clientEmail: "carlos@empresa.do",
        origin: "Av. Winston Churchill #25, Piantini, Santo Domingo",
        destination: "Centro Comercial Bella Vista Mall, Santiago",
        packageType: "Documentos",
        weight: "0.5 kg",
        description: "Documentos legales importantes para notaría",
        date: "2024-06-14", // Ayer
        status: "pendiente",
        price: 450,
      },
      {
        id: "REQ-002",
        clientName: "Ana Rodríguez Peña",
        clientEmail: "ana@comercio.do",
        origin: "Zona Colonial, Santo Domingo",
        destination: "Plaza Central, Santiago de los Caballeros",
        packageType: "Paquete pequeño",
        weight: "2 kg",
        description: "Productos electrónicos importados",
        date: "2024-06-15", // Hoy
        status: "en-transito",
        price: 750,
      },
      {
        id: "REQ-003",
        clientName: "José Luis Fernández",
        clientEmail: "jose@logistica.do",
        origin: "Av. Abraham Lincoln, Piantini",
        destination: "Blue Mall, Santo Domingo Este",
        packageType: "Frágil",
        weight: "1.5 kg",
        description: "Artesanías dominicanas en cerámica",
        date: "2024-06-14", // Ayer
        status: "pendiente",
        price: 920,
      },
      {
        id: "REQ-004",
        clientName: "Carlos Martínez García",
        clientEmail: "carlos@empresa.do",
        origin: "Centro Financiero, Santo Domingo",
        destination: "Universidad PUCMM, Santiago",
        packageType: "Documentos",
        weight: "0.3 kg",
        description: "Certificados académicos universitarios",
        date: "2024-06-13",
        status: "entregado",
        price: 400,
      },
    ];

    const demoServiceTypes: ServiceType[] = [
      {
        id: "SRV-001",
        name: "Documentos",
        basePrice: 400, // RD$400
        description: "Envío de documentos y papelería dentro de RD",
        multiplier: 1.0,
      },
      {
        id: "SRV-002",
        name: "Paquete pequeño",
        basePrice: 600, // RD$600
        description: "Paquetes hasta 5kg dentro del territorio nacional",
        multiplier: 1.2,
      },
      {
        id: "SRV-003",
        name: "Frágil",
        basePrice: 900, // RD$900
        description: "Paquetes que requieren manejo especial y cuidadoso",
        multiplier: 1.8,
      },
      {
        id: "SRV-004",
        name: "Express",
        basePrice: 1200, // RD$1200
        description: "Entrega el mismo día en Santo Domingo",
        multiplier: 2.5,
      },
    ];

    setClients(demoClients);
    setRequests(demoRequests);
    setServiceTypes(demoServiceTypes);

    // Load operative users from localStorage or use demo
    const storedOperativeUsers = localStorage.getItem("operativeUsers");
    if (storedOperativeUsers) {
      try {
        setOperativeUsers(JSON.parse(storedOperativeUsers));
      } catch {
        setOperativeUsers([]);
      }
    } else {
      // Demo operative users for República Dominicana
      const demoOperativeUsers: OperativeUser[] = [
        {
          id: "OP-001",
          name: "Miguel Santos Jiménez",
          email: "miguel@operador.do",
          phone: "+1 809 555 7891",
          createdAt: "2024-02-01",
          username: "miguel.operador",
          mustSetPassword: true,
          role: "operative",
          password: "temp123456",
        },
        {
          id: "OP-002",
          name: "Sofía Peña Martínez",
          email: "sofia@operador.do",
          phone: "+1 829 555 9871",
          createdAt: "2024-03-10",
          username: "sofia.operador",
          mustSetPassword: true,
          role: "operative",
          password: "temp789012",
        },
      ];
      setOperativeUsers(demoOperativeUsers);
      localStorage.setItem("operativeUsers", JSON.stringify(demoOperativeUsers));
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("operativeUsers", JSON.stringify(operativeUsers));
  }, [operativeUsers]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("operativeId");
    navigate("/");
  };

  const updateRequestStatus = (requestId: string, newStatus: PickupRequest["status"]) => {
    setRequests(requests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
    toast({
      title: "Estado actualizado",
      description: "El estado de la solicitud ha sido actualizado exitosamente.",
    });
  };

  const getStatusBadge = (status: PickupRequest["status"]) => {
    const statusConfig = {
      pendiente: { color: "bg-yellow-100 text-yellow-800", text: "Pendiente" },
      confirmado: { color: "bg-blue-100 text-blue-800", text: "Confirmado" },
      "en-transito": { color: "bg-purple-100 text-purple-800", text: "En Tránsito" },
      entregado: { color: "bg-green-100 text-green-800", text: "Entregado" },
      cancelado: { color: "bg-red-100 text-red-800", text: "Cancelado" },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleUpdateClientPricing = (clientId: string, pricing: { serviceId: string; customPrice: number }[]) => {
    // Remove existing pricing for this client
    const filteredPricing = clientPricing.filter(p => p.clientId !== clientId);
    
    // Add new pricing
    const newPricing = pricing.map(p => ({
      clientId,
      serviceId: p.serviceId,
      customPrice: p.customPrice
    }));
    
    setClientPricing([...filteredPricing, ...newPricing]);
  };

  // Calculations for AdminDashboardStats
  const clientCount = clients.length;
  const requestCount = requests.length;
  const totalRevenue = requests
    .filter(r => r.status === "entregado")
    .reduce((sum, r) => sum + r.price, 0);
  const pendingRequests = requests.filter(r => r.status === "pendiente").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Panel de Administración</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Administrador: {localStorage.getItem("userEmail")}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboardStats
          clientCount={clientCount}
          requestCount={requestCount}
          totalRevenue={totalRevenue}
          pendingRequests={pendingRequests}
        />

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="operatives">Usuarios Operativos</TabsTrigger>
          </TabsList>
          <TabsContent value="requests">
            <AdminRequestManager
              requests={requests}
              onStatusChange={updateRequestStatus}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          <TabsContent value="clients">
            <AdminClientManager 
              clients={clients} 
              services={serviceTypes}
              clientPricing={clientPricing}
              onUpdateClientPricing={handleUpdateClientPricing}
            />
          </TabsContent>
          <TabsContent value="services">
            <AdminServiceManager
              services={serviceTypes}
              setServices={setServiceTypes}
            />
          </TabsContent>
          <TabsContent value="operatives">
            <AdminOperativeUserManager
              operativeUsers={operativeUsers}
              setOperativeUsers={setOperativeUsers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
