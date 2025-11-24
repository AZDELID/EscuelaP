import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SupportDashboard } from './components/SupportDashboard';
import { Toaster } from './components/ui/sonner';
import { projectId } from './utils/supabase/info';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Try to get stored session from localStorage
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user_data');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Verificar que el token no esté expirado (más de 24 horas)
          const decoded = JSON.parse(atob(storedToken));
          const tokenAge = Date.now() - decoded.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas
          
          if (tokenAge < maxAge) {
            setAccessToken(storedToken);
            setUser(userData);
          } else {
            // Token expirado
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
          }
        } catch (e) {
          // Token inválido
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleAuthSuccess = (token: string, userData: any) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setAccessToken(null);
    setUser(null);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!accessToken || !user) {
    return (
      <>
        <AuthForm onSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'support':
        return <SupportDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
      case 'teacher':
        return <TeacherDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
      case 'student':
        return <StudentDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
      default:
        return <StudentDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <Toaster />
    </>
  );
}
