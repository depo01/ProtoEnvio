
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

interface PickupRequest {
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";
}

interface ClientStatsProps {
  requests: PickupRequest[];
}

const ClientStats = ({ requests }: ClientStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === "pending").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Tránsito</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === "in-transit").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Entregados</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === "delivered").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientStats;
