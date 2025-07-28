import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OperativeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  username: string;
  mustSetPassword: boolean;
  role: "operative";
  password: string;
}

interface Props {
  operativeUsers: OperativeUser[];
  setOperativeUsers: (users: OperativeUser[]) => void;
}

const initialOperative = {
  name: "",
  email: "",
  phone: "",
  username: "",
};

function generatePassword(length: number = 8) {
  // Simple random password for demo only!
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

const AdminOperativeUserManager = ({ operativeUsers, setOperativeUsers }: Props) => {
  const [showCreateOperative, setShowCreateOperative] = useState(false);
  const [newOperative, setNewOperative] = useState(initialOperative);
  const { toast } = useToast();
  const [lastCreated, setLastCreated] = useState<{name: string, password: string} | null>(null);

  const handleCreateOperative = () => {
    const { name, email, phone, username } = newOperative;
    if (!name || !email || !phone || !username) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos para crear el usuario operativo.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Ingrese un correo electrónico válido.",
        variant: "destructive",
      });
      return;
    }
    const phoneRegex = /^\+?[\d\s\-]{7,}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Teléfono inválido",
        description: "Ingrese un número de teléfono válido.",
        variant: "destructive",
      });
      return;
    }
    const existsEmail = operativeUsers.some((op) => op.email === email);
    const existsUsername = operativeUsers.some((op) => op.username === username);
    if (existsEmail) {
      toast({
        title: "Correo ya registrado",
        description: "Ya existe un usuario operativo con ese correo.",
        variant: "destructive",
      });
      return;
    }
    if (existsUsername) {
      toast({
        title: "Usuario ya registrado",
        description: "Ya existe un usuario operativo con ese nombre de usuario.",
        variant: "destructive",
      });
      return;
    }
    const newId = `OP-${(operativeUsers.length + 1).toString().padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];
    const password = generatePassword(10);

    setOperativeUsers([
      ...operativeUsers,
      {
        id: newId,
        name,
        email,
        phone,
        username,
        createdAt: today,
        mustSetPassword: true,
        role: "operative",
        password,
      },
    ]);
    setLastCreated({ name, password });
    toast({
      title: "Usuario operativo creado",
      description: `El usuario ${name} fue agregado exitosamente.`,
    });
    setNewOperative(initialOperative);
    setShowCreateOperative(false);
  };

  const handleDeleteOperative = (id: string) => {
    const user = operativeUsers.find((op) => op.id === id);
    setOperativeUsers(operativeUsers.filter((op) => op.id !== id));
    toast({
      title: "Usuario eliminado",
      description: user ? `El usuario ${user.name} fue eliminado.` : "El usuario fue eliminado.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usuarios Operativos</CardTitle>
        <Button onClick={() => setShowCreateOperative(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario Operativo
        </Button>
      </CardHeader>
      <CardContent>
        {/* Mostrar contraseña generada tras creación */}
        {lastCreated && (
          <div className="bg-blue-50 border border-blue-200 p-4 mb-4 rounded">
            <p className="font-semibold text-blue-900">
              Usuario "{lastCreated.name}" creado. Contraseña temporal:
              <span className="font-mono text-lg select-all ml-2">{lastCreated.password}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Por seguridad, anote esta contraseña y entréguesela solo al usuario. No volverá a mostrarse.
            </p>
            <Button size="sm" className="mt-2" onClick={() => setLastCreated(null)}>
              Ocultar
            </Button>
          </div>
        )}
        {showCreateOperative && (
          <div className="mb-4 border p-4 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="opname">Nombre</Label>
                <Input
                  id="opname"
                  value={newOperative.name}
                  onChange={e => setNewOperative({ ...newOperative, name: e.target.value })}
                  required
                  placeholder="Nombre completo"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="opemail">Correo</Label>
                <Input
                  id="opemail"
                  type="email"
                  value={newOperative.email}
                  onChange={e => setNewOperative({ ...newOperative, email: e.target.value })}
                  required
                  placeholder="correo@operador.com"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="opphone">Teléfono</Label>
                <Input
                  id="opphone"
                  value={newOperative.phone}
                  onChange={e => setNewOperative({ ...newOperative, phone: e.target.value })}
                  required
                  placeholder="+57 300 000 0000"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="opusername">Usuario (login)</Label>
                <Input
                  id="opusername"
                  value={newOperative.username}
                  onChange={e => setNewOperative({ ...newOperative, username: e.target.value })}
                  required
                  placeholder="usuario.ope"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setShowCreateOperative(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateOperative}>
                Guardar
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              El usuario operativo deberá crear su contraseña la primera vez que inicie sesión.
            </div>
          </div>
        )}
        {/* Listado de usuarios operativos */}
        <div className="space-y-4">
          {operativeUsers.length === 0 && (
            <div className="text-gray-500 text-center mt-8">
              No hay usuarios operativos registrados.
            </div>
          )}
          {operativeUsers.map(user => (
            <div key={user.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phone}</p>
                <p className="text-sm text-gray-500">Registrado: {user.createdAt}</p>
                <p className="text-xs text-yellow-500 mt-1">
                  {user.mustSetPassword ? "Debe establecer su contraseña" : ""}
                </p>
                <p className="text-xs mt-1 text-blue-700">
                  Rol: {user.role}
                </p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteOperative(user.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOperativeUserManager;
