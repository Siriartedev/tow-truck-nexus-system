
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, LogIn, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const demoAccounts = [
  { 
    email: 'admin@demo.com', 
    password: 'admin123', 
    role: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema'
  },
  { 
    email: 'cliente@demo.com', 
    password: 'cliente123', 
    role: 'client',
    name: 'Cliente',
    description: 'Portal de solicitudes y servicios'
  },
  { 
    email: 'operador@demo.com', 
    password: 'operador123', 
    role: 'operator',
    name: 'Operador',
    description: 'Gestión de servicios de grúa'
  }
];

export default function Auth() {
  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estados para Registro
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'admin' | 'client' | 'operator'>('client');
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && profile) {
      console.log('👤 Usuario logueado, redirigiendo...', profile.role);
      if (profile.role === 'admin') {
        navigate('/');
      } else if (profile.role === 'client') {
        navigate('/portal-client');
      } else if (profile.role === 'operator') {
        navigate('/portal-operator');
      }
    }
  }, [user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Ingresa email y contraseña');
      return;
    }
    
    setLoading(true);
    console.log('🔐 Intentando login con:', loginEmail);
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      console.error('❌ Error de login:', error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword) {
      toast.error('Completa todos los campos');
      return;
    }
    
    setLoading(true);
    console.log('📝 Intentando registro con:', signupEmail, 'rol:', signupRole);
    
    const { error } = await signUp(signupEmail, signupPassword, signupRole);
    
    if (error) {
      console.error('❌ Error de registro:', error);
      toast.error('Error al registrar usuario. Intenta con otro email.');
    } else {
      toast.success('Usuario registrado exitosamente');
      setActiveTab('login');
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    console.log('🎭 Login demo con:', demoEmail);
    
    const { error } = await signIn(demoEmail, demoPassword);
    
    if (error) {
      console.error('❌ Error en demo login:', error);
      toast.error('Error al acceder con cuenta demo');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-medium p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-dark">TMS Grúas</h1>
          <p className="text-green-dark/70 text-lg">Sistema de Gestión de Transporte</p>
          <div className="flex items-center justify-center mt-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Sistema completamente funcional
          </div>
        </div>

        {/* Tabs para Login/Registro */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Iniciar Sesión</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Registrarse</span>
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Iniciar Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                      placeholder="Tu contraseña"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Crear Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={loading}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={loading}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Tipo de Usuario</Label>
                    <Select value={signupRole} onValueChange={(value) => setSignupRole(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="operator">Operador</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cuentas Demo */}
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-center text-lg flex items-center justify-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <span>Acceso Rápido - Cuentas Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleDemoLogin(account.email, account.password)}
                disabled={loading}
              >
                <div className="flex items-center space-x-3 w-full">
                  <LogIn className="h-5 w-5 text-green-medium flex-shrink-0" />
                  <div className="text-left flex-grow">
                    <div className="font-semibold text-base">{account.name}</div>
                    <div className="text-sm text-muted-foreground">{account.description}</div>
                    <div className="text-xs text-blue-600 font-mono">
                      {account.email}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold mb-2 text-blue-800">💡 Credenciales para Testing:</p>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Admin:</strong> admin@demo.com / admin123</p>
                <p><strong>Cliente:</strong> cliente@demo.com / cliente123</p>
                <p><strong>Operador:</strong> operador@demo.com / operador123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
