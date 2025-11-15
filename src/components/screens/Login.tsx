import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle } from 'lucide-react';

interface LoginProps {
  onNavigate?: (screen: string) => void;
  onSwitchToRegister?: () => void;
}

export const Login = ({ onNavigate, onSwitchToRegister }: LoginProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      if (onNavigate) {
        onNavigate('welcome');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/90 border-cyan-500/30 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-cyan-400">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-slate-400">
            Accede a tu cuenta de EduHack
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
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/90 px-2 text-slate-400">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onSwitchToRegister}
              className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/30"
            >
              Crear Cuenta
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">📧 Prueba con:</p>
            <p className="text-xs text-cyan-300">Email: <code>demo@test.com</code></p>
            <p className="text-xs text-cyan-300">Contraseña: <code>demo123</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
