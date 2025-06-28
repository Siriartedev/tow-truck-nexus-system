
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-medium mx-auto mb-4"></div>
          <p className="text-green-dark">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay perfil, ir a auth
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Redirigir según el rol
  if (profile.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (profile.role === 'client') {
    return <Navigate to="/portal-client" replace />;
  } else if (profile.role === 'operator') {
    return <Navigate to="/portal-operator" replace />;
  }

  // Fallback a auth si no hay rol válido
  return <Navigate to="/auth" replace />;
};

export default Index;
