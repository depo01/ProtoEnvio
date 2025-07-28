
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { ConduceGeneratorProps } from "@/types/conduce";
import ConduceContent from "@/components/ConduceContent";
import ConduceActions from "@/components/ConduceActions";
import { generateConduceNumber, handlePrint, handleDownload } from "@/utils/conduceUtils";

const ConduceGenerator = ({ request, clientName, clientEmail }: ConduceGeneratorProps) => {
  const [showConduce, setShowConduce] = useState(false);

  const conduceNumber = generateConduceNumber(request.id);
  const currentDate = new Date().toLocaleDateString("es-DO");

  const onPrint = () => {
    handlePrint();
  };

  const onDownload = () => {
    handleDownload(conduceNumber);
  };

  return (
    <Dialog open={showConduce} onOpenChange={setShowConduce}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Generar Conducé
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conducé de Entrega</DialogTitle>
        </DialogHeader>
        
        <ConduceContent 
          request={request}
          clientName={clientName}
          clientEmail={clientEmail}
          conduceNumber={conduceNumber}
          currentDate={currentDate}
        />

        <ConduceActions 
          onPrint={onPrint}
          onDownload={onDownload}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConduceGenerator;
