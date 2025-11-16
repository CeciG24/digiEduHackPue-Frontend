import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterProps {
  onNavigate?: (screen: string) => void;
  onSwitchToLogin?: () => void;
}

export const Register = ({ onNavigate, onSwitchToLogin }: RegisterProps) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'alumno', // valor por defecto
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (!formData.rol) {
      setError('Selecciona un rol');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.name, formData.rol);
      if (onNavigate) {
        onNavigate('welcome');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/90 border-cyan-500/30 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-cyan-400">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-slate-400">
            Únete a EduHack y comienza tu viaje de aprendizaje
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
              <Input
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Contraseña</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Confirmar Contraseña</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white rounded px-3 py-2 w-full"
              >
                <option value="alumno">Alumno</option>
                <option value="maestro">Maestro</option>
                
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/90 px-2 text-slate-400">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onSwitchToLogin}
              className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/30"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Password requirements */}
          <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">✓ Requisitos:</p>
            <div className="space-y-1">
              <div className={`text-xs flex items-center gap-2 ${formData.password.length >= 6 ? 'text-green-400' : 'text-slate-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Al menos 6 caracteres
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
