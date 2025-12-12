import api from './api';

export const authService = {
  /**
   * Login de usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Datos del usuario con token
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/users/login_user', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Error al iniciar sesión' };
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @param {string} fullname - Nombre completo
   * @returns {Promise} Datos del usuario creado
   */
  register: async (username, password, fullname) => {
    try {
      const response = await api.post('/users/', {
        username,
        password,
        fullname,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Error al registrar usuario' };
    }
  },

  /**
   * Logout de usuario
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('token');
    } catch (error) {
      // Incluso si falla, eliminamos el token localmente
      localStorage.removeItem('token');
      throw error.response?.data || { detail: 'Error al cerrar sesión' };
    }
  },
};