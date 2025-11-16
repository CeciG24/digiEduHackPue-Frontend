import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, rol: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Initialize demo user if no users exist
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const demoUsers = [
        {
          id: '1',
          email: 'demo@test.com',
          password: 'demo123',
          name: 'Demo User',
        },
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Llamar al backend para login
    const data = await loginUser({ email, contraseña: password });
    // data.token contiene el JWT
    localStorage.setItem('token', data.token);
    // Decodificar el token para obtener info del usuario (opcional)
    // Aquí solo guardamos el email, puedes guardar más si lo necesitas
    setUser({ id: '', email, name: '' });
    localStorage.setItem('user', JSON.stringify({ id: '', email, name: '' }));
  };

  const register = async (email: string, password: string, name: string, rol: string) => {
    // Llamar al backend para registrar usuario
    const data = await registerUser({ nombre: name, email, contraseña: password, rol });
    // Puedes guardar el usuario en el estado si el backend lo retorna
    // Aquí solo guardamos el email y nombre por ejemplo
    setUser({ id: '', email, name });
    localStorage.setItem('user', JSON.stringify({ id: '', email, name }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
