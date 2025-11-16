// src/api/auth.ts


const API_URL = 'https://digieduhackpue-backend.onrender.com'; // Cambia esto según tu backend
export async function loginUser({ email, contraseña }: { email: string; contraseña: string; }) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contraseña }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al iniciar sesión');
  }

  return response.json();
}

export async function registerUser({ nombre, email, contraseña, rol }: { nombre: string; email: string; contraseña: string; rol: string; }) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, contraseña, rol }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al registrar usuario');
  }

  return response.json();
}
