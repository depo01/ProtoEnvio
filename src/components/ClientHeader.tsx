
import { Button } from "@/components/ui/button";
import { Truck, User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientHeaderProps {
  userName: string;
  onLogout: () => void;
}

const ClientHeader = ({ userName, onLogout }: ClientHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">Panel de Cliente</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">{userName}</span>
            </div>
            <Link to="/profile">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Mi Perfil
              </Button>
            </Link>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
