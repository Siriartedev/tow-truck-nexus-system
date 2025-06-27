
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const demoAccounts = [
  { email: 'admin@demo.com', password: 'admin123', role: 'admin', name: 'Admin Demo' },
  { email: 'cliente@demo.com', password: 'cliente123', role: 'client', name: 'Cliente Demo' },
  { email: 'operador@demo.com', password: 'operador123', role: 'operator', name: 'Operador Demo' }
];

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && profile) {
      console.log('User logged in, redirecting...', profile.role);
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
    if (!email || !password) {
      toast.error('Ingresa email y contraseña');
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      // Si falla el login, intentar crear el usuario
      const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password);
      if (demoAccount) {
        console.log('Creating demo account:', demoAccount.email);
        const { error: signUpError } = await signUp(email, password, {
          name: demoAccount.name,
          role: demoAccount.role
        });
        
        if (!signUpError) {
          toast.success('Usuario creado. Iniciando sesión...');
          // Intentar login nuevamente
          setTimeout(async () => {
            await signIn(email, password);
          }, 1000);
        }
      } else {
        toast.error('Credenciales incorrectas');
      }
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    setLoading(true);
    const { error } = await signIn(demoEmail, demoPassword);
    
    if (error) {
      const demoAccount = demoAccounts.find(acc => acc.email === demoEmail);
      if (demoAccount) {
        console.log('Creating demo account:', demoAccount.email);
        const { error: signUpError } = await signUp(demoEmail, demoPassword, {
          name: demoAccount.name,
          role: demoAccount.role
        });
        
        if (!signUpError) {
          toast.success('Usuario demo creado');
          setTimeout(async () => {
            await signIn(demoEmail, demoPassword);
          }, 1000);
        }
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-medium p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-dark">TMS Grúas</h1>
        </div>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-sm">Cuentas Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => handleDemoLogin(account.email, account.password)}
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {account.name} ({account.role})
              </Button>
            ))}
            <div className="text-xs text-muted-foreground mt-2">
              <p>admin@demo.com / admin123</p>
              <p>cliente@demo.com / cliente123</p>
              <p>operador@demo.com / operador123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
