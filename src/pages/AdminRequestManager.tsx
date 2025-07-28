

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Search, Filter } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import RequestExporter from "@/components/RequestExporter";

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

interface Props {
  requests: PickupRequest[];
  onStatusChange: (requestId: string, newStatus: PickupRequest["status"]) => void;
  getStatusBadge: (status: PickupRequest["status"]) => React.ReactNode;
}

const AdminRequestManager = ({ requests, onStatusChange, getStatusBadge }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar solicitudes
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Solicitudes</CardTitle>
        <RequestExporter requests={requests} />
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID, cliente, email, origen o destino..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="en-transito">En Tránsito</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              Limpiar
            </Button>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {paginatedRequests.length} de {filteredRequests.length} solicitudes
            {statusFilter !== "todos" && (
              <Badge variant="outline" className="ml-2">
                {statusFilter === "pendiente" ? "Pendiente" : 
                 statusFilter === "confirmado" ? "Confirmado" :
                 statusFilter === "en-transito" ? "En Tránsito" :
                 statusFilter === "entregado" ? "Entregado" : "Cancelado"}
              </Badge>
            )}
          </p>
        </div>

        {/* Lista de solicitudes */}
        <div className="space-y-4">
          {paginatedRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron solicitudes que coincidan con los filtros.
            </div>
          ) : (
            paginatedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{request.id}</h3>
                    <p className="text-gray-600">{request.clientName} - {request.clientEmail}</p>
                    <p className="text-sm text-gray-500">{request.date}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request.status)}
                    <p className="text-lg font-bold text-green-600 mt-1">
                      RD${request.price.toLocaleString('es-DO')}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Tipo:</p>
                    <p>{request.packageType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Peso:</p>
                    <p>{request.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Descripción:</p>
                    <p>{request.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Select value={request.status} onValueChange={(value: PickupRequest["status"]) => onStatusChange(request.id, value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="en-transito">En Tránsito</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRequestManager;
