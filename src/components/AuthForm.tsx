import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import imgRectangle1 from "figma:asset/e3d5eaa1fada5ef720e2b6964fe4142c602824b0.png";
import imgImage1 from "figma:asset/b56e7596d60732bd89b65afcd72165601147f3b3.png";
import { authUsers } from '../utils/mockDatabase';

interface AuthFormProps {
  onSuccess: (accessToken: string, user: any) => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      const account = authUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (!account) {
        setError('El correo electrónico no está registrado.');
        setIsLoading(false);
        return;
      }
      
      if (password !== account.password) {
        setError('La contraseña es incorrecta.');
        setIsLoading(false);
        return;
      }
      
      const user = {
        id: account.id,
        email: normalizedEmail,
        name: account.name,
        role: account.role
      };
      
      const token = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        timestamp: Date.now()
      }));
      
      onSuccess(token, user);
    } catch (err) {
      setError('Error inesperado. Por favor intente nuevamente.');
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img 
          alt="Fondo escolar" 
          className="w-full h-full object-cover" 
          src={imgRectangle1} 
        />
      </div>

      {/* Card central */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-[27px] shadow-[0px_4px_250px_50px_rgba(140,3,14,0.89),0px_16px_32px_-4px_rgba(12,12,13,0.1)] border border-[#f5ba3c] w-full max-w-[538px] px-8 py-12">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-[125px] h-[125px]">
              <img 
                alt="Logo Ejemplo de Vida" 
                className="w-full h-full object-cover rounded-full" 
                src={imgImage1} 
              />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-[30px] font-semibold text-[#8c030e] text-center mb-2">
            Plataforma Escolar
          </h1>
          <p className="text-[20px] font-extralight text-black text-center mb-12">
            Gestión de Calificaciones
          </p>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[20px] font-medium text-black">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@escuela.com"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[47px] rounded-[15px] bg-[#fdf8f8] border-[#8c030e] shadow-[0px_4px_10px_5px_rgba(0,0,0,0.25)] text-base"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-[20px] font-medium text-black">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[47px] rounded-[15px] bg-[#fdf8f8] border-[#8c030e] shadow-[0px_4px_4px_4px_rgba(0,0,0,0.25)] text-base"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-[#8c030e] text-sm bg-red-50 p-3 rounded-lg border border-[#8c030e]">
                {error}
              </div>
            )}

            {/* Botón */}
            <Button 
              type="submit" 
              className="w-full h-[57px] rounded-[15px] bg-[#0433bf] hover:bg-[#032a9e] text-white text-[20px] font-medium shadow-[0px_4px_5px_5px_rgba(0,0,0,0.2)] [text-shadow:0px_4px_10px_rgba(0,0,0,1)]" 
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Iniciar Sessión'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-[30px] font-black text-[#8c030e] text-center mt-8 [text-shadow:#af787c_0px_4px_4px]">
            EJEMPLO DE VIDA
          </p>
        </div>
      </div>
    </div>
  );
}
