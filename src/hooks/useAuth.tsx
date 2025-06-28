
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'operator';
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role?: 'admin' | 'client' | 'operator') => Promise<{ error: any }>;
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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Obteniendo perfil para usuario:', userId);
      
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('❌ Error obteniendo perfil:', error);
        
        // Si no hay perfil, intentar crearlo desde los metadatos del usuario
        if (error.code === 'PGRST116') {
          console.log('🔧 Perfil no encontrado, intentando crear...');
          
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const userMetadata = userData.user.user_metadata || {};
            const defaultRole = userMetadata.role || 'client';
            const defaultName = userMetadata.name || userData.user.email?.split('@')[0] || 'Usuario';
            
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: userId,
                email: userData.user.email || '',
                name: defaultName,
                role: defaultRole,
                active: true
              })
              .select()
              .single();
            
            if (createError) {
              console.error('❌ Error creando perfil:', createError);
              return null;
            }
            
            console.log('✅ Perfil creado:', newProfile);
            return newProfile;
          }
        }
        
        return null;
      }

      console.log('✅ Perfil encontrado:', profileData);
      return profileData;
    } catch (err) {
      console.error('❌ Error en fetchUserProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    console.log('🔄 Configurando listener de autenticación...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Estado de auth cambió:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Verificando sesión inicial:', session?.user?.email);
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        fetchUserProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('🔄 Limpiando subscription de auth');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, role: 'admin' | 'client' | 'operator' = 'client') => {
    try {
      setLoading(true);
      console.log('📝 Registrando usuario:', email, 'con rol:', role);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: email.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.error('❌ Error de registro:', error);
        toast.error(`Error: ${error.message}`);
        return { error };
      }

      if (data.user) {
        console.log('✅ Registro exitoso:', data.user.email);
        toast.success('¡Usuario registrado correctamente!');
        return { error: null };
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Error en signUp:', err);
      toast.error('Error de conexión durante el registro');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Iniciando sesión:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Error de inicio de sesión:', error);
        toast.error(`Error: ${error.message}`);
        return { error };
      }

      if (data.user) {
        console.log('✅ Inicio de sesión exitoso:', data.user.email);
        toast.success('¡Sesión iniciada correctamente!');
        return { error: null };
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Error en signIn:', err);
      toast.error('Error de conexión');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      
      // Limpiar estado primero
      setUser(null);
      setProfile(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error al cerrar sesión:', error);
        toast.error('Error al cerrar sesión');
      } else {
        console.log('✅ Sesión cerrada correctamente');
        toast.success('Sesión cerrada');
      }
    } catch (err) {
      console.error('❌ Error en signOut:', err);
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
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
