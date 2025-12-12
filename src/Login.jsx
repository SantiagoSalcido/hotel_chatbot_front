import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { authService } from './services/authService';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (isRegisterMode && !fullname) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Registrar usuario
        await authService.register(username, password, fullname);
        // Después de registrar, hacer login automáticamente
        const loginData = await authService.login(username, password);
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', loginData.session_token);
        onLogin({
          userId: loginData.user_id,
          username: loginData.username,
          token: loginData.session_token,
        });
      } else {
        // Login
        const data = await authService.login(username, password);
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.session_token);
        onLogin({
          userId: data.user_id,
          username: data.username,
          token: data.session_token,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.detail || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00a884] rounded-full mb-4">
            <MessageCircle size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            {isRegisterMode ? 'Crear Cuenta' : 'Chatbot Demo'}
          </h1>
          <p className="text-gray-400">
            {isRegisterMode 
              ? 'Regístrate para comenzar a chatear' 
              : 'Inicia sesión para continuar'}
          </p>
        </div>

        {/* Formulario de login/registro */}
        <div className="bg-[#202c33] rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario123"
                className="w-full px-4 py-3 bg-[#2a3942] text-white rounded-lg outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Fullname (solo en modo registro) */}
            {isRegisterMode && (
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 bg-[#2a3942] text-white rounded-lg outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500 transition"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#2a3942] text-white rounded-lg outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500 transition"
                disabled={isLoading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#00a884] hover:bg-[#06cf9c] text-white'
              }`}
            >
              {isLoading 
                ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...') 
                : (isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión')}
            </button>
          </form>

          {/* Toggle entre login y registro */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
              }}
              className="text-[#00a884] hover:text-[#06cf9c] text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              {isRegisterMode 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;