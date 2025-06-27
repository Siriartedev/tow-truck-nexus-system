
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'client' | 'operator';
  active: boolean;
  rut?: string;
  address?: string;
  company_name?: string;
  pin?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isClient: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with better error handling
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Error fetching profile:', error);
                toast.error('Error al cargar el perfil del usuario');
              } else if (!profileData) {
                console.warn('No profile found for user:', session.user.email);
                toast.error('No se encontró el perfil del usuario. Contacta al administrador.');
                // Optionally sign out user without profile
                await supabase.auth.signOut();
              } else {
                console.log('Profile loaded:', profileData);
                setProfile(profileData);
              }
            } catch (err) {
              console.error('Profile fetch error:', err);
              toast.error('Error de conexión al cargar el perfil');
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        if (error.message === 'Invalid login credentials') {
          toast.error('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else {
          toast.error('Error al iniciar sesión: ' + error.message);
        }
      } else {
        toast.success('Sesión iniciada correctamente');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      toast.error('Error de conexión');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any = {}) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast.error('Error al registrarse: ' + error.message);
      } else {
        toast.success('Usuario registrado correctamente. Revisa tu email para confirmar.');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up error:', err);
      toast.error('Error de conexión');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Sesión cerrada');
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Error al cerrar sesión');
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin',
    isClient: profile?.role === 'client',
    isOperator: profile?.role === 'operator',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
