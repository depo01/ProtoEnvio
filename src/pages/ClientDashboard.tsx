import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PackageData } from "@/components/PackageItem";
import { PickupRequest } from "@/types/conduce";
import ClientHeader from "@/components/ClientHeader";
import ClientStats from "@/components/ClientStats";
import ClientProfile from "@/components/ClientProfile";
import NewRequestForm from "@/components/NewRequestForm";
import RequestsList from "@/components/RequestsList";

const ClientDashboard = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "client") {
      navigate("/login");
      return;
    }

    // Load user profile
    const profile = {
      name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
      phone: localStorage.getItem("userPhone") || "",
      address: localStorage.getItem("userAddress") || "",
    };
    setUserProfile(profile);

    // Load existing requests (demo data updated for Dominican Republic)
    const demoRequests: PickupRequest[] = [
      {
        id: "REQ-001",
        origin: profile.address || "Av. Winston Churchill #25, Piantini, Santo Domingo",
        destination: "Centro Comercial Plaza Central, Santiago de los Caballeros",
        packages: [
          {
            id: "1",
            packageType: "Documentos",
            weight: "0.5",
            description: "Documentos legales para notaría en Santiago",
          },
        ],
        date: "2024-06-10",
        status: "delivered",
        totalPrice: 450,
      },
      {
        id: "REQ-002",
        origin: profile.address || "Av. Abraham Lincoln, Piantini",
        destination: "Blue Mall, Santo Domingo Este",
        packages: [
          {
            id: "1",
            packageType: "Paquete pequeño",
            weight: "2",
            description: "Productos electrónicos importados desde Miami",
          },
          {
            id: "2",
            packageType: "Frágil",
            weight: "1.5",
            description: "Artesanías dominicanas en cerámica de La Vega",
          },
        ],
        date: "2024-06-12",
        status: "in-transit",
        totalPrice: 850,
      },
      {
        id: "REQ-003",
        origin: profile.address || "Zona Colonial, Santo Domingo",
        destination: "Universidad PUCMM, Santiago",
        packages: [
          {
            id: "1",
            packageType: "Express",
            weight: "0.8",
            description: "Certificados académicos urgentes",
          },
        ],
        date: "2024-06-14",
        status: "pending",
        totalPrice: 1200,
      },
    ];
    setRequests(demoRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    navigate("/");
  };

  const handleSubmitRequest = (requestData: any) => {
    const request: PickupRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      origin: requestData.origin,
      destination: requestData.destination,
      packages: requestData.packages,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      totalPrice: requestData.totalPrice,
    };

    setRequests([...requests, request]);
    setShowNewRequest(false);

    toast({
      title: "¡Solicitud creada!",
      description: `Tu solicitud con ${requestData.packages.length} paquete(s) ha sido registrada exitosamente.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader userName={userProfile.name} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientStats requests={requests} />
        <ClientProfile userProfile={userProfile} />

        {/* New Request Button */}
        <div className="mb-6">
          <Button onClick={() => setShowNewRequest(true)} size="lg" className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Solicitud de Recogida
          </Button>
        </div>

        {/* New Request Form */}
        {showNewRequest && (
          <NewRequestForm
            onSubmit={handleSubmitRequest}
            onCancel={() => setShowNewRequest(false)}
          />
        )}

        <RequestsList 
          requests={requests} 
          clientName={userProfile.name}
          clientEmail={userProfile.email}
        />
      </div>
    </div>
  );
};

export default ClientDashboard;
