
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ConduceActionsProps {
  onPrint: () => void;
  onDownload: () => void;
}

const ConduceActions = ({ onPrint, onDownload }: ConduceActionsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button onClick={onPrint} variant="outline">
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
      <Button onClick={onDownload}>
        <Download className="h-4 w-4 mr-2" />
        Descargar
      </Button>
    </div>
  );
};

export default ConduceActions;
