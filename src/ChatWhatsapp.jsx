import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, LogOut } from 'lucide-react';
import { chatService } from './services/chatService';
import { authService } from './services/authService';

function ChatWhatsApp({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatSessionId, setChatSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Enviar mensaje al backend
      const response = await chatService.sendMessage(inputMessage, chatSessionId);
      
      // Guardar el chat_session_id si es nuevo
      if (!chatSessionId && response.chat_session_id) {
        setChatSessionId(response.chat_session_id);
      }

      // Agregar respuesta del bot
      const botMessage = {
        id: Date.now() + 1,
        text: response.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mostrar mensaje de error
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar logout local aunque falle el backend
      onLogout();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex h-full w-full bg-[#111b21] shadow-2xl">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-[30%] xl:w-[25%] flex-col border-r border-[#2a3942] bg-[#111b21]">
          {/* Header del sidebar */}
          <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center text-white font-medium">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span className="text-white font-medium block">
                  {user?.username || 'Usuario'}
                </span>
                <span className="text-[#667781] text-xs">en línea</span>
              </div>
            </div>
            <div className="flex gap-4 text-[#aebac1]">
              <button 
                onClick={handleLogout}
                className="cursor-pointer hover:text-white transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
              <MoreVertical size={20} className="cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Búsqueda */}
          <div className="bg-[#111b21] px-3 py-2">
            <div className="bg-[#202c33] rounded-lg px-3 py-2 flex items-center gap-3">
              <Search size={18} className="text-[#aebac1]" />
              <input
                type="text"
                placeholder="Buscar o iniciar un nuevo chat"
                className="bg-transparent text-[#e9edef] text-sm outline-none flex-1 placeholder-[#667781]"
              />
            </div>
          </div>

          {/* Lista de chats */}
          <div className="flex-1 overflow-y-auto">
            <div className="bg-[#202c33] hover:bg-[#2a3942] cursor-pointer border-l-4 border-[#25d366]">
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center text-white font-medium flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[#e9edef] font-medium">Asistente Hotel</h3>
                      <span className="text-[#667781] text-xs">
                        {formatTime(messages[messages.length - 1]?.timestamp || new Date())}
                      </span>
                    </div>
                    <p className="text-[#667781] text-sm truncate">
                      {messages[messages.length - 1]?.text || "Inicia una conversación"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Área de chat principal */}
        <div className="flex-1 flex flex-col">
          {/* Header del chat */}
          <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white text-xl flex-shrink-0">
                🤖
              </div>
              <div>
                <h2 className="text-[#e9edef] font-medium">Asistente Hotel</h2>
                <p className="text-[#667781] text-xs">
                  {isTyping ? 'escribiendo...' : 'en línea'}
                </p>
              </div>
            </div>
            <div className="flex gap-5 text-[#aebac1]">
              <Video size={22} className="cursor-pointer hover:text-white hidden sm:block" />
              <Phone size={22} className="cursor-pointer hover:text-white hidden sm:block" />
              <Search size={22} className="cursor-pointer hover:text-white" />
              <MoreVertical size={22} className="cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Área de mensajes */}
          <div 
            className="flex-1 overflow-y-auto px-4 py-4 bg-[#0b141a]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            <div className="max-w-4xl mx-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] md:max-w-[65%] rounded-lg px-3 py-2 shadow-md ${
                      message.sender === 'user'
                        ? 'bg-[#005c4b] text-white'
                        : message.isError
                        ? 'bg-red-900/50 text-red-200'
                        : 'bg-[#202c33] text-[#e9edef]'
                    }`}
                  >
                    <p className="text-sm sm:text-base break-words whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] sm:text-xs text-[#667781]">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === 'user' && !message.isError && (
                        <svg width="16" height="11" viewBox="0 0 16 11" className="text-[#53bdeb]">
                          <path
                            d="M11.071.653a.5.5 0 0 1 .708 0l3.889 3.889a.5.5 0 1 1-.708.707L11.424 1.71 6.778 6.357a.5.5 0 1 1-.708-.707L11.071.653zm-5.778 0a.5.5 0 0 1 .708 0l3.889 3.889a.5.5 0 0 1-.708.707L5.646 1.71 1 6.357a.5.5 0 1 1-.708-.707L5.293.653z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#202c33] rounded-lg px-4 py-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input de mensaje */}
          <div className="bg-[#202c33] px-3 py-2 sm:px-4 sm:py-3">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="text-[#aebac1] hover:text-white p-2 rounded-full hover:bg-[#2a3942] transition-colors"
              >
                <Smile size={24} />
              </button>
              <button
                type="button"
                className="text-[#aebac1] hover:text-white p-2 rounded-full hover:bg-[#2a3942] transition-colors hidden sm:block"
              >
                <Paperclip size={24} />
              </button>
              <div className="flex-1 bg-[#2a3942] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe un mensaje"
                  disabled={isTyping}
                  className="w-full bg-transparent text-[#e9edef] text-sm sm:text-base outline-none placeholder-[#667781] disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className={`p-2 sm:p-2.5 rounded-full transition-all ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-[#00a884] hover:bg-[#06cf9c] text-white'
                    : 'bg-[#2a3942] text-[#667781] cursor-not-allowed'
                }`}
              >
                <Send size={20} className="sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWhatsApp;