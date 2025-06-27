
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, LogIn, UserPlus, ArrowLeft, Building, User as UserIcon, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const demoAccounts = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    name: 'Administrador Demo',
    description: 'Acceso completo al sistema'
  },
  {
    email: 'cliente@demo.com', 
    password: 'cliente123',
    role: 'client',
    name: 'Cliente Demo',
    description: 'Portal de cliente'
  },
  {
    email: 'operador@demo.com',
    password: 'operador123', 
    role: 'operator',
    name: 'Operador Demo',
    description: 'Portal de operador'
  }
];

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

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    const { error } = await signIn(demoEmail, demoPassword);
    if (error) {
      // Si el usuario no existe, lo creamos
      const demoAccount = demoAccounts.find(acc => acc.email === demoEmail);
      if (demoAccount) {
        const { error: signUpError } = await signUp(demoEmail, demoPassword, {
          name: demoAccount.name,
          role: demoAccount.role
        });
        if (!signUpError) {
          toast.success(`Usuario ${demoAccount.name} creado. Ahora puedes iniciar sesión.`);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demo Accounts */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Cuentas Demo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Haz clic para probar el sistema con diferentes roles:
                </p>
                {demoAccounts.map((account) => (
                  <div key={account.email} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.description}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        account.role === 'admin' ? 'bg-red-500' :
                        account.role === 'client' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDemoLogin(account.email, account.password)}
                      disabled={loading}
                    >
                      Acceder como {account.role === 'admin' ? 'Admin' : 
                                  account.role === 'client' ? 'Cliente' : 'Operador'}
                    </Button>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {account.email} / {account.password}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Login/Register Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Acceso Manual</CardTitle>
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

                {/* Instructions */}
                <div className="mt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-2">¿Cómo usar el sistema?</p>
                        <div className="space-y-2 text-blue-700">
                          <p><strong>Opción 1:</strong> Usa las cuentas demo de la izquierda para acceso inmediato</p>
                          <p><strong>Opción 2:</strong> Regístrate manualmente con tu propio email</p>
                          <p><strong>Nota:</strong> Los nuevos usuarios se registran como clientes por defecto</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
