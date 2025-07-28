
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, DollarSign, Search, Users } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ClientPricingModal from "@/components/ClientPricingModal";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalRequests: number;
  registrationDate: string;
}

interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
}

interface ClientPricing {
  clientId: string;
  serviceId: string;
  customPrice: number;
}

interface Props {
  clients: Client[];
  services: ServiceType[];
  clientPricing: ClientPricing[];
  onUpdateClientPricing: (clientId: string, pricing: { serviceId: string; customPrice: number }[]) => void;
}

const AdminClientManager = ({ clients, services, clientPricing, onUpdateClientPricing }: Props) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleOpenPricing = (client: Client) => {
    setSelectedClient(client);
    setIsPricingModalOpen(true);
  };

  const handleClosePricingModal = () => {
    setIsPricingModalOpen(false);
    setSelectedClient(null);
  };

  const getClientCustomPriceCount = (clientId: string) => {
    return clientPricing.filter(p => p.clientId === clientId).length;
  };

  // Filtrar clientes
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  // Calcular paginación
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestión de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={resetSearch}>
              Limpiar
            </Button>
          </div>

          {/* Información de resultados */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Mostrando {paginatedClients.length} de {filteredClients.length} clientes
            </p>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Total: {clients.length} clientes
            </Badge>
          </div>

          {/* Lista de clientes */}
          <div className="space-y-4">
            {paginatedClients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No se encontraron clientes que coincidan con la búsqueda." : "No hay clientes registrados."}
              </div>
            ) : (
              paginatedClients.map((client) => {
                const customPriceCount = getClientCustomPriceCount(client.id);
                
                return (
                  <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <p className="text-gray-600">{client.email}</p>
                        <p className="text-gray-600">{client.phone}</p>
                        <p className="text-sm text-gray-500">Registrado: {client.registrationDate}</p>
                        {customPriceCount > 0 && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            {customPriceCount} precio{customPriceCount !== 1 ? 's' : ''} personalizado{customPriceCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {client.totalRequests} solicitudes
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenPricing(client)}
                            className={customPriceCount > 0 ? "border-blue-500 text-blue-600" : ""}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Tarifas
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
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

      <ClientPricingModal
        isOpen={isPricingModalOpen}
        onClose={handleClosePricingModal}
        client={selectedClient}
        services={services}
        clientPricing={clientPricing}
        onSave={onUpdateClientPricing}
      />
    </>
  );
};

export default AdminClientManager;
