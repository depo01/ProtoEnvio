
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, DollarSign, TrendingUp } from "lucide-react";

interface Props {
  clientCount: number;
  requestCount: number;
  totalRevenue: number;
  pendingRequests: number;
}

const AdminDashboardStats = ({
  clientCount,
  requestCount,
  totalRevenue,
  pendingRequests,
}: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-900">{clientCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Solicitudes Totales</p>
            <p className="text-2xl font-bold text-gray-900">{requestCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminDashboardStats;
