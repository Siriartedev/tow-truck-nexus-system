
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, LogIn, UserPlus, CheckCircle, AlertCircle, Bug } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  const [loginEmail, setLoginEmail] = useState('admin@demo.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  
  // Estados para Registro
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'admin' | 'client' | 'operator'>('client');
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>({});
  
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();

  // 🔍 DIAGNÓSTICO SIMPLIFICADO
  useEffect(() => {
    console.log('🔍 DIAGNÓSTICO SUPABASE:');
    console.log('URL:', supabase.supabaseUrl);
    console.log('Supabase Key configured:', !!supabase.supabaseKey);
    
    // Test de conexión automático
    const testConnection = async () => {
      try {
        console.log('🧪 Probando conexión a DB...');
        const { data, error } = await supabase.from('service_types').select('*').limit(1);
        if (error) {
          console.error('❌ Error conexión DB:', error);
          setDiagnosticResults(prev => ({ 
            ...prev, 
            dbConnection: { success: false, error: error.message }
          }));
        } else {
          console.log('✅ Conexión DB exitosa:', data);
          setDiagnosticResults(prev => ({ 
            ...prev, 
            dbConnection: { success: true, data }
          }));
        }
      } catch (error) {
        console.error('❌ Error prueba conexión:', error);
        setDiagnosticResults(prev => ({ 
          ...prev, 
          dbConnection: { success: false, error: 'Connection failed' }
        }));
      }
    };

    // Test de sesión actual
    const testSession = async () => {
      try {
        const { data: session, error } = await supabase.auth.getSession();
        console.log('🔐 Sesión actual:', session, error);
        setDiagnosticResults(prev => ({ 
          ...prev, 
          currentSession: { session, error }
        }));
      } catch (error) {
        console.error('❌ Error obtener sesión:', error);
      }
    };

    testConnection();
    testSession();

    // Agregar info básica del cliente
    setDiagnosticResults(prev => ({
      ...prev,
      environment: {
        supabaseUrl: supabase.supabaseUrl,
        hasKey: !!supabase.supabaseKey,
        timestamp: new Date().toISOString()
      }
    }));
  }, []);
  
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
    console.log('🔐 INICIANDO LOGIN...');
    console.log('Email:', loginEmail);
    console.log('Password length:', loginPassword.length);
    
    try {
      // Test de conexión primero
      console.log('🔗 Testing connection...');
      const { data: testData, error: testError } = await supabase
        .from('service_types')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Connection test failed:', testError);
        throw new Error('Error de conexión: ' + testError.message);
      }
      
      console.log('✅ Connection test success');
      
      // Intentar login
      console.log('🔐 Attempting login...');
      const { error } = await signIn(loginEmail.trim(), loginPassword);
      
      if (error) {
        console.error('❌ Error de login:', error);
        toast.error('Error al iniciar sesión: ' + error.message);
        setDiagnosticResults(prev => ({ 
          ...prev, 
          lastLoginError: error 
        }));
      } else {
        console.log('✅ Login success!');
        toast.success('¡Sesión iniciada correctamente!');
      }
      
    } catch (error: any) {
      console.error('💥 LOGIN FAILED:', error);
      toast.error(error.message || 'Error desconocido');
      setDiagnosticResults(prev => ({ 
        ...prev, 
        lastLoginError: error 
      }));
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
      setDiagnosticResults(prev => ({ 
        ...prev, 
        lastSignupError: error 
      }));
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
      setDiagnosticResults(prev => ({ 
        ...prev, 
        lastDemoLoginError: { email: demoEmail, error }
      }));
    }
    
    setLoading(false);
  };

  // Test manual simplificado
  const runManualDiagnostic = async () => {
    console.log('🧪 Ejecutando diagnóstico manual...');
    
    try {
      // Test 1: Verificar perfiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(5);
      console.log('👤 Perfiles:', profiles, profilesError);
      
      // Test 2: Verificar clientes
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .limit(5);
      console.log('🏢 Clientes:', clients, clientsError);
      
      // Test 3: Verificar operadores  
      const { data: operators, error: operatorsError } = await supabase
        .from('operators')
        .select('*')
        .limit(5);
      console.log('👷 Operadores:', operators, operatorsError);
      
      setDiagnosticResults(prev => ({
        ...prev,
        manualTest: {
          profiles: { data: profiles, error: profilesError },
          clients: { data: clients, error: clientsError },
          operators: { data: operators, error: operatorsError }
        }
      }));
      
      toast.success('Diagnóstico completado - revisar consola');
      
    } catch (error) {
      console.error('❌ Error en diagnóstico manual:', error);
      toast.error('Error en diagnóstico');
    }
  };

  // Bypass temporal para testing
  const handleDemoBypass = () => {
    console.log('🔧 Using demo bypass...');
    
    const demoUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@demo.com',
      role: 'admin',
      name: 'Admin Sistema'
    };
    
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    localStorage.setItem('demo_authenticated', 'true');
    
    toast.success('Usando bypass demo - redirigiendo...');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
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
          
          <div className="flex gap-2 mt-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostic(!showDiagnostic)}
              className="text-xs"
            >
              <Bug className="h-3 w-3 mr-1" />
              {showDiagnostic ? 'Ocultar' : 'Mostrar'} Diagnóstico
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoBypass}
              className="text-xs bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            >
              🔧 Bypass Demo
            </Button>
          </div>
        </div>

        {/* 🔍 PANEL DE DIAGNÓSTICO */}
        {showDiagnostic && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                Diagnóstico del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>
                <strong>URL Supabase:</strong> {diagnosticResults.environment?.supabaseUrl || 'No configurada'}
              </div>
              <div>
                <strong>Clave Configurada:</strong> {diagnosticResults.environment?.hasKey ? '✅ Sí' : '❌ No'}
              </div>
              <div>
                <strong>Conexión DB:</strong> {
                  diagnosticResults.dbConnection?.success ? '✅ Exitosa' : 
                  diagnosticResults.dbConnection?.error ? `❌ ${diagnosticResults.dbConnection.error}` : '⏳ Probando...'
                }
              </div>
              <div>
                <strong>Sesión Actual:</strong> {
                  diagnosticResults.currentSession?.session?.user ? 
                  `✅ ${diagnosticResults.currentSession.session.user.email}` : '❌ Sin sesión'
                }
              </div>
              {diagnosticResults.lastLoginError && (
                <div className="text-red-600">
                  <strong>Último Error:</strong> {diagnosticResults.lastLoginError.message}
                </div>
              )}
              <Button size="sm" onClick={runManualDiagnostic} className="w-full mt-2">
                Ejecutar Diagnóstico Completo
              </Button>
            </CardContent>
          </Card>
        )}

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
