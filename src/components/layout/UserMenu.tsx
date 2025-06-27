
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, Shield, Building, Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
  const { user, profile, signOut, isAdmin, isClient, isOperator } = useAuth();

  if (!user || !profile) return null;

  const getRoleIcon = () => {
    if (isAdmin) return <Shield className="h-4 w-4" />;
    if (isClient) return <Building className="h-4 w-4" />;
    if (isOperator) return <Truck className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getRoleColor = () => {
    if (isAdmin) return 'bg-red-100 text-red-800';
    if (isClient) return 'bg-blue-100 text-blue-800';
    if (isOperator) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrador';
    if (isClient) return 'Cliente';
    if (isOperator) return 'Operador';
    return 'Usuario';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-green-medium text-white">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">{profile.name}</p>
              <Badge variant="secondary" className={`text-xs ${getRoleColor()}`}>
                <span className="flex items-center space-x-1">
                  {getRoleIcon()}
                  <span>{getRoleLabel()}</span>
                </span>
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
            {profile.company_name && (
              <p className="text-xs leading-none text-muted-foreground">
                {profile.company_name}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
