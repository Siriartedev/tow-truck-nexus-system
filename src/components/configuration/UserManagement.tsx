
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Eye,
  UserCheck,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'operator' | 'viewer' | 'client';
  active: boolean;
  last_login?: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@tmsgruas.cl',
      role: 'administrator',
      active: true,
      last_login: '2024-01-15 10:30'
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@tmsgruas.cl',
      role: 'operator',
      active: true,
      last_login: '2024-01-14 16:45'
    },
    {
      id: '3',
      name: 'Carlos Silva',
      email: 'carlos@cliente.cl',
      role: 'client',
      active: true
    },
    {
      id: '4',
      name: 'Ana López',
      email: 'ana@tmsgruas.cl',
      role: 'viewer',
      active: false
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as User['role'],
    active: true
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const roleLabels = {
    administrator: 'Administrador',
    operator: 'Operador',
    viewer: 'Visualizador',
    client: 'Cliente'
  };

  const roleIcons = {
    administrator: Shield,
    operator: UserCheck,
    viewer: Eye,
    client: Building
  };

  const roleColors = {
    administrator: 'text-red-500',
    operator: 'text-blue-500',
    viewer: 'text-green-500',
    client: 'text-purple-500'
  };

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser
    };
    
    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', role: 'viewer', active: true });
    setIsDialogOpen(false);
    
    toast({
      title: "Usuario creado",
      description: `El usuario ${user.name} ha sido creado correctamente.`,
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido modificado.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h3>
          <p className="text-muted-foreground">
            Administra usuarios y sus permisos en el sistema
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-green hover:bg-gradient-green-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nombre Completo</Label>
                <Input
                  id="user-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del usuario"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@ejemplo.cl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-role">Rol</Label>
                <select
                  id="user-role"
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="viewer">Visualizador</option>
                  <option value="operator">Operador</option>
                  <option value="client">Cliente</option>
                  <option value="administrator">Administrador</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newUser.active}
                  onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, active: checked }))}
                />
                <Label>Usuario Activo</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser}>
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>Usuarios del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <RoleIcon className={`h-4 w-4 ${roleColors[user.role]}`} />
                        <span>{roleLabels[user.role]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm">
                          {user.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.last_login || 'Nunca'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span>Permisos por Rol</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span className="font-medium">Administrador</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Acceso completo al sistema</li>
                <li>• Gestión de usuarios</li>
                <li>• Configuración del sistema</li>
                <li>• Todos los reportes</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Operador</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gestión de servicios</li>
                <li>• Administrar grúas</li>
                <li>• Ver reportes operativos</li>
                <li>• Acceso al calendario</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="font-medium">Visualizador</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Solo lectura</li>
                <li>• Ver servicios</li>
                <li>• Reportes básicos</li>
                <li>• No puede modificar datos</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Cliente</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Portal de cliente</li>
                <li>• Ver sus servicios</li>
                <li>• Solicitar servicios</li>
                <li>• Historial personal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
