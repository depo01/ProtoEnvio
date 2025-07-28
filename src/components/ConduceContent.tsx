
import { Badge } from "@/components/ui/badge";
import { PickupRequest } from "@/types/conduce";

interface ConduceContentProps {
  request: PickupRequest;
  clientName: string;
  clientEmail: string;
  conduceNumber: string;
  currentDate: string;
}

const ConduceContent = ({ 
  request, 
  clientName, 
  clientEmail, 
  conduceNumber, 
  currentDate 
}: ConduceContentProps) => {
  return (
    <div id="conduce-content" className="space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-600">CONDUCÉ DE ENTREGA</h1>
        <p className="text-lg font-semibold">Sistema de Recogida y Entrega</p>
        <p className="text-sm text-gray-600">Santo Domingo, República Dominicana</p>
      </div>

      {/* Conduce Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Información del Conducé</h3>
          <p><strong>No. Conducé:</strong> {conduceNumber}</p>
          <p><strong>Fecha de Emisión:</strong> {currentDate}</p>
          <p><strong>No. Solicitud:</strong> {request.id}</p>
          <p><strong>Fecha de Servicio:</strong> {new Date(request.date).toLocaleDateString("es-DO")}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Estado del Servicio</h3>
          <Badge className={
            request.status === "delivered" ? "bg-green-100 text-green-800" :
            request.status === "in-transit" ? "bg-blue-100 text-blue-800" :
            request.status === "confirmed" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          }>
            {request.status === "delivered" ? "Entregado" :
             request.status === "in-transit" ? "En Tránsito" :
             request.status === "confirmed" ? "Confirmado" :
             request.status === "pending" ? "Pendiente" : "Cancelado"}
          </Badge>
        </div>
      </div>

      {/* Client Info */}
      <div>
        <h3 className="font-semibold mb-2">Información del Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Nombre:</strong> {clientName}</p>
          <p><strong>Email:</strong> {clientEmail}</p>
        </div>
      </div>

      {/* Delivery Info */}
      <div>
        <h3 className="font-semibold mb-2">Información de Entrega</h3>
        <div className="space-y-2">
          <div>
            <p className="font-medium">Origen:</p>
            <p className="text-sm text-gray-700 ml-4">{request.origin}</p>
          </div>
          <div>
            <p className="font-medium">Destino:</p>
            <p className="text-sm text-gray-700 ml-4">{request.destination}</p>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div>
        <h3 className="font-semibold mb-2">Detalle de Paquetes ({request.packages.length})</h3>
        <div className="space-y-2">
          {request.packages.map((pkg, index) => (
            <div key={pkg.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Paquete #{index + 1}</p>
                  <p className="text-sm">Tipo: {pkg.packageType}</p>
                </div>
                <div>
                  <p className="text-sm">Peso: {pkg.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm">Descripción:</p>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Total del Servicio:</h3>
          <p className="text-xl font-bold text-green-600">RD${request.totalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-8"></div>
          <p className="text-sm font-medium">Firma del Cliente</p>
          <p className="text-xs text-gray-600">{clientName}</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-8"></div>
          <p className="text-sm font-medium">Firma del Operativo</p>
          <p className="text-xs text-gray-600">Representante de Entrega</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-6 border-t pt-4">
        <p>Este documento es válido como comprobante de servicio de recogida y entrega.</p>
        <p>Para consultas: info@sistemaentrega.com | Tel: (809) 555-0123</p>
      </div>
    </div>
  );
};

export default ConduceContent;
