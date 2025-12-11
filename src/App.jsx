import { useState } from 'react';
import Login from './Login';
import ChatWhatsApp from './ChatWhatsapp';
import './index.css';

function App() {
  // Estado de autenticación
  const [user, setUser] = useState(null);

  // Función para manejar login
  const handleLogin = (userData) => {
    setUser(userData);
    // Guardar token en localStorage
    localStorage.setItem('token', userData.token);
  };

  // Función para manejar logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Si no hay usuario logueado, mostrar Login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Si hay usuario logueado, mostrar Chat
  return <ChatWhatsApp user={user} onLogout={handleLogout} />;
}

export default App;