import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { PackageData } from "@/components/PackageItem";
import { PickupRequest } from "@/types/conduce";
import ConduceGenerator from "@/components/ConduceGenerator";

interface RequestsListProps {
  requests: PickupRequest[];
  clientName: string;
  clientEmail: string;
}

const RequestsList = ({ requests, clientName, clientEmail }: RequestsListProps) => {
  const getStatusBadge = (status: PickupRequest["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pendiente" },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, text: "Confirmado" },
      "in-transit": { color: "bg-purple-100 text-purple-800", icon: Truck, text: "En tránsito" },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Entregado" },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Cancelado" },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Solicitudes de Recogida</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tienes solicitudes de recogida aún.</p>
            <p className="text-gray-400">¡Crea tu primera solicitud!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{request.id}</h3>
                    <p className="text-gray-600">{request.date}</p>
                    <p className="text-sm text-blue-600">{request.packages.length} paquete(s)</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request.status)}
                    <p className="text-lg font-bold text-green-600 mt-1">
                      RD${request.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Origen:</p>
                    <p className="font-medium">{request.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destino:</p>
                    <p className="font-medium">{request.destination}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Paquetes:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {request.packages.map((pkg, index) => (
                      <div key={pkg.id} className="bg-gray-50 p-2 rounded text-sm">
                        <p className="font-medium">#{index + 1} - {pkg.packageType}</p>
                        <p className="text-gray-600">{pkg.weight} kg</p>
                        <p className="text-gray-600 truncate">{pkg.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Botón para generar conducé */}
                <div className="flex justify-end">
                  <ConduceGenerator 
                    request={request} 
                    clientName={clientName}
                    clientEmail={clientEmail}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsList;
