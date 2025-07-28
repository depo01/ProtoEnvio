
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface UserProfile {
  address: string;
  phone: string;
}

interface ClientProfileProps {
  userProfile: UserProfile;
}

const ClientProfile = ({ userProfile }: ClientProfileProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Mi Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Dirección de Recogida Registrada:</p>
            <p className="font-medium">{userProfile.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Contacto:</p>
            <p className="font-medium">{userProfile.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfile;
