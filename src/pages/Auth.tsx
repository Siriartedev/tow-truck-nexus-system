import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, LogIn, UserPlus, ArrowLeft, Building, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'operator'>('client');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  // Redireccionar automáticamente según el rol después del login
  useEffect(() => {
    if (user && profile) {
      console.log('Redirecting user with role:', profile.role);
      if (profile.role === 'admin') {
        navigate('/');
      } else if (profile.role === 'client') {
        navigate('/portal-client');
      } else if (profile.role === 'operator') {
        navigate('/portal-operator');
      }
    }
  }, [user, profile, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setLoading(true);
    const { error } = await signUp(email, password, {
      name,
      role
    });
    setLoading(false);
  };

  // Quick login functions for demo accounts
  const quickLogin = async (demoEmail: string, demoPassword: string) => {
    console.log('Quick login attempt for:', demoEmail);
    setLoading(true);
    
    // Clear current form data
    setEmail('');
    setPassword('');
    
    const { error } = await signIn(demoEmail, demoPassword);
    
    if (error) {
      console.error('Quick login failed for', demoEmail, ':', error);
      toast.error(`Error al acceder como ${demoEmail}: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-medium p-3 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-dark">TMS Grúas</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestión de Transportes</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Acceso al Sistema</CardTitle>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Registrarse</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-green hover:bg-gradient-green-hover"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
                
                {/* Accesos Rápidos para Demo */}
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-3">Acceso Rápido - Cuentas Demo</p>
                    <p className="text-xs text-gray-500 mb-4">Haz clic en cualquier opción para acceder directamente</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => quickLogin('admin@gruas.com', 'admin123')}
                      disabled={loading}
                      className="w-full justify-start hover:bg-green-50"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">Administrador</span>
                      <span className="text-xs text-muted-foreground">→ Panel Admin</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => quickLogin('cliente@empresa.com', 'cliente123')}
                      disabled={loading}
                      className="w-full justify-start hover:bg-blue-50"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">Cliente Demo</span>
                      <span className="text-xs text-muted-foreground">→ Portal Cliente</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => quickLogin('operador@gruas.com', 'operador123')}
                      disabled={loading}
                      className="w-full justify-start hover:bg-orange-50"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">Operador Demo</span>
                      <span className="text-xs text-muted-foreground">→ Portal Operador</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre Completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Tipo de Usuario</Label>
                    <Select value={role} onValueChange={(value: 'client' | 'operator') => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="operator">Operador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-green hover:bg-gradient-green-hover"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
