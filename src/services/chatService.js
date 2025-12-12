import api from './api';

export const chatService = {
  /**
   * Enviar mensaje al chatbot
   * @param {string} message - Mensaje del usuario
   * @param {string|null} chatSessionId - ID de sesión del chat (opcional)
   * @returns {Promise} Respuesta del chatbot
   */
  sendMessage: async (message, chatSessionId = null) => {
    try {
      const response = await api.post('/chat/', {
        message,
        chat_session_id: chatSessionId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Error al enviar mensaje' };
    }
  },
};