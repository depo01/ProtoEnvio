
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calendar, Filter, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";

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
}

const RequestExporter = ({ requests }: Props) => {
  const { toast } = useToast();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    return "2024-06-14";
  });

  const getExportableRequests = (targetDate: string) => {
    console.log('Filtering requests for date:', targetDate);
    console.log('Total requests:', requests.length);
    console.log('Requests with status:', requests.map(r => ({ id: r.id, status: r.status, date: r.date })));
    
    const filtered = requests.filter(req => {
      const statusMatch = req.status === "pendiente";
      const dateMatch = req.date === targetDate;
      console.log(`Request ${req.id}: status=${req.status}, statusMatch=${statusMatch}, date=${req.date}, dateMatch=${dateMatch}`);
      return statusMatch && dateMatch;
    });
    
    console.log('Filtered requests:', filtered.length);
    return filtered;
  };

  const exportableRequests = getExportableRequests(selectedDate);

  const getStatusText = (status: string) => {
    const statusMap = {
      "pendiente": "Pendiente",
      "confirmado": "Confirmado",
      "en-transito": "En Tránsito",
      "entregado": "Entregado",
      "cancelado": "Cancelado"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const exportToCSV = (customDate?: string) => {
    const dateToUse = customDate || selectedDate;
    const requestsToExport = getExportableRequests(dateToUse);
    
    if (requestsToExport.length === 0) {
      toast({
        title: "No hay solicitudes para exportar",
        description: `No hay solicitudes pendientes para la fecha ${dateToUse}.`,
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "ID Solicitud",
      "Cliente",
      "Email Cliente",
      "Origen",
      "Destino",
      "Tipo Paquete",
      "Peso",
      "Descripción",
      "Fecha",
      "Estado",
      "Precio (RD$)"
    ];

    const csvContent = [
      headers.join(","),
      ...requestsToExport.map(req => [
        req.id,
        `"${req.clientName}"`,
        req.clientEmail,
        `"${req.origin}"`,
        `"${req.destination}"`,
        `"${req.packageType}"`,
        req.weight,
        `"${req.description}"`,
        req.date,
        `"${getStatusText(req.status)}"`,
        `RD$${req.price.toLocaleString('es-DO')}`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `solicitudes_rutas_${dateToUse}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV exportado exitosamente",
      description: `Se exportaron ${requestsToExport.length} solicitudes pendientes para rutas del ${dateToUse}.`,
    });
  };

  const exportToExcel = (customDate?: string) => {
    const dateToUse = customDate || selectedDate;
    const requestsToExport = getExportableRequests(dateToUse);
    
    if (requestsToExport.length === 0) {
      toast({
        title: "No hay solicitudes para exportar",
        description: `No hay solicitudes pendientes para la fecha ${dateToUse}.`,
        variant: "destructive",
      });
      return;
    }

    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>ID Solicitud</th>
            <th>Cliente</th>
            <th>Email Cliente</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Tipo Paquete</th>
            <th>Peso</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Precio (RD$)</th>
          </tr>
        </thead>
        <tbody>
          ${requestsToExport.map(req => `
            <tr>
              <td>${req.id}</td>
              <td>${req.clientName}</td>
              <td>${req.clientEmail}</td>
              <td>${req.origin}</td>
              <td>${req.destination}</td>
              <td>${req.packageType}</td>
              <td>${req.weight}</td>
              <td>${req.description}</td>
              <td>${req.date}</td>
              <td>${getStatusText(req.status)}</td>
              <td>RD$${req.price.toLocaleString('es-DO')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `solicitudes_rutas_${dateToUse}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Excel exportado exitosamente",
      description: `Se exportaron ${requestsToExport.length} solicitudes pendientes para rutas del ${dateToUse}.`,
    });
  };

  const handleQuickExport = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToExcel();
    }
  };

  const handleCustomDateExport = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      exportToCSV(selectedDate);
    } else {
      exportToExcel(selectedDate);
    }
    setIsDateModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <Download className="h-4 w-4" />
            Exportar para Rutas 
            <StatusBadge status="pendiente" className="text-xs px-2 py-0.5" />
            <span className="text-xs text-gray-600">
              {exportableRequests.length} pendientes
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 mb-2">
            Exportación Rápida (2024-06-14)
          </div>
          <DropdownMenuItem onClick={() => handleQuickExport('csv')} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50">
            <FileText className="h-4 w-4 text-green-600" />
            <div>
              <p className="font-medium">CSV - 2024-06-14</p>
              <p className="text-xs text-gray-500">Formato de hoja de cálculo</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('excel')} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50">
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium">Excel - 2024-06-14</p>
              <p className="text-xs text-gray-500">Archivo de Microsoft Excel</p>
            </div>
          </DropdownMenuItem>
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-t border-gray-100 my-2">
            Fecha Personalizada
          </div>
          <DropdownMenuItem onClick={() => setIsDateModalOpen(true)} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50">
            <Calendar className="h-4 w-4 text-purple-600" />
            <div>
              <p className="font-medium">Seleccionar Fecha</p>
              <p className="text-xs text-gray-500">Exportar por fecha específica</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Filter className="h-5 w-5 text-blue-600" />
              Exportar Solicitudes por Fecha
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card className="border-blue-100 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-blue-800 font-medium">
                    Solo se exportarán las solicitudes <strong>Pendientes</strong> de la fecha seleccionada.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="export-date" className="text-sm font-medium">Fecha de las solicitudes</Label>
              <Input
                id="export-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Solicitudes pendientes para <strong>{selectedDate}</strong>:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-bold text-green-600 text-lg">
                      {getExportableRequests(selectedDate).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleCustomDateExport('csv')}
                disabled={getExportableRequests(selectedDate).length === 0}
                className="flex items-center gap-2"
                variant="outline"
              >
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button 
                onClick={() => handleCustomDateExport('excel')}
                disabled={getExportableRequests(selectedDate).length === 0}
                className="flex items-center gap-2"
                variant="outline"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
            </div>

            <Button variant="ghost" onClick={() => setIsDateModalOpen(false)} className="w-full">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestExporter;
