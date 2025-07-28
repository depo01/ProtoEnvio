
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Mail, Lock, User, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// SIMULACIÓN: importar usuarios operativos mock desde localStorage, si existen
function getOperativeUsersFromStorage() {
  try {
    const item = localStorage.getItem("operativeUsers");
    if (item) return JSON.parse(item);
  } catch {}
  return [];
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("client");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (loginType === "client") {
        // DEMO CLIENTE para República Dominicana
        if (email === "cliente@ejemplo.do" && password === "cliente123") {
          localStorage.setItem("userRole", "client");
          localStorage.setItem("userEmail", email);
          toast({
            title: "¡Bienvenido Cliente!",
            description: "Has iniciado sesión correctamente en LogiExpress RD.",
          });
          setIsLoading(false);
          navigate("/dashboard");
          return;
        }
      } else {
        // DEMO ADMIN para República Dominicana
        if (email === "admin@logiexpress.do" && password === "admin123") {
          localStorage.setItem("userRole", "admin");
          localStorage.setItem("userEmail", email);
          toast({
            title: "¡Bienvenido Administrador!",
            description: "Has iniciado sesión correctamente en LogiExpress RD.",
          });
          setIsLoading(false);
          navigate("/admin");
          return;
        }

        // USUARIOS OPERATIVOS
        const operativeUsers = getOperativeUsersFromStorage();
        const found = operativeUsers.find((u: any) => u.email === email || u.username === email);
        if (found && found.password === password) {
          localStorage.setItem("userRole", found.role);
          localStorage.setItem("userEmail", found.email);
          localStorage.setItem("operativeId", found.id);
          toast({
            title: "¡Bienvenido Operativo!",
            description: found.mustSetPassword
              ? "Debes cambiar tu contraseña al ingresar por primera vez."
              : "Has iniciado sesión correctamente.",
          });
          setIsLoading(false);

          if (found.mustSetPassword) {
            navigate("/operative-first-login");
          } else {
            // Dashboard operativo (para demo, redirigimos a admin)
            navigate("/admin");
          }
          return;
        }
      }

      const errorMessage = loginType === "client" 
        ? "Credenciales incorrectas. Prueba: cliente@ejemplo.do/cliente123"
        : "Credenciales incorrectas. Prueba: admin@logiexpress.do/admin123";

      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleTabChange = (value: string) => {
    setLoginType(value);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Truck className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold">LogiExpress RD</span>
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <p className="text-sm text-gray-600">Servicio de mensajería en República Dominicana</p>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuario del Sistema
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="client" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.do"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión como Cliente"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="system" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-system">Correo Electrónico / Usuario</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email-system"
                      type="text"
                      placeholder="admin@logiexpress.do o usuario"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-system">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password-system"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión al Sistema"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Credenciales de demo para RD:</p>
            {loginType === "client" ? (
              <p className="text-xs">Cliente: cliente@ejemplo.do / cliente123</p>
            ) : (
              <>
                <p className="text-xs">Admin: admin@logiexpress.do / admin123</p>
                <p className="text-xs mt-2">
                  <b>Usuarios operativos:</b> Pueden usar su email o nombre de usuario para acceder.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
