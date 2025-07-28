
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";

function getOperativeUsersFromStorage() {
  try {
    const item = localStorage.getItem("operativeUsers");
    if (item) return JSON.parse(item);
  } catch {}
  return [];
}

function setOperativeUsersToStorage(users: any[]) {
  localStorage.setItem("operativeUsers", JSON.stringify(users));
}

const OperativeFirstLogin = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // El id operativo se guarda al login
  const operativeId = localStorage.getItem("operativeId");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operativeId) return;

    if (!password || password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "Debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    if (password !== password2) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      let operativeUsers = getOperativeUsersFromStorage();
      operativeUsers = operativeUsers.map((user: any) =>
        user.id === operativeId
          ? { ...user, password, mustSetPassword: false }
          : user
      );
      setOperativeUsersToStorage(operativeUsers);
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente. Ya puedes usar tu nueva contraseña.",
      });
      setIsLoading(false);
      navigate("/admin"); // En un sistema real sería dashboard operativo
    }, 1200);
  };

  if (!operativeId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Card>
          <CardHeader>
            <CardTitle>Error de Acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No se pudo validar tu acceso de primer login.</p>
            <p className="text-sm text-gray-600 mt-2">
              Por favor contacta al administrador del sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Truck className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold">LogiExpress RD</span>
          </div>
          <CardTitle>
            Establecer Nueva Contraseña
          </CardTitle>
          <p className="text-sm text-gray-600">
            Por seguridad, debes cambiar tu contraseña temporal
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              value={password}
              required
              minLength={6}
              onChange={e => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={password2}
              required
              minLength={6}
              onChange={e => setPassword2(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar y Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperativeFirstLogin;
