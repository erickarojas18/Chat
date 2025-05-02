import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';
import '../Css/Mensajes.css';

const Mensajes = ({ usuario }) => {
  const [content, setContent] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const from = localStorage.getItem('userId');
  const to = usuario._id;

  const chatBodyRef = useRef(null);
  const pickerRef = useRef(null);

  // Cerrar picker si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setMostrarPicker(false);
      }
    };

    if (mostrarPicker) {
      document.addEventListener('mousedown', manejarClickFuera);
    }

    return () => {
      document.removeEventListener('mousedown', manejarClickFuera);
    };
  }, [mostrarPicker]);

  // Cargar mensajes desde la API
  const cargarMensajes = async () => {
    try {
      const response = await axios.get(
        'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/messages',
        { params: { from, to } }
      );
      if (response.status === 200) {
        const mensajesOrdenados = response.data.messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMensajes(mensajesOrdenados);
      }
    } catch (err) {
      setError('Error al cargar mensajes: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    if (from && to) {
      cargarMensajes();
    }
  }, [to]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    setRespuesta('');
    setError('');

    if (!content.trim()) {
      setError('No puedes enviar un mensaje vacío');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await axios.post(
        'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/messages',
        { from, to, content }
      );

      if (response.status === 200) {
        setRespuesta('Mensaje enviado');
        setContent('');
        await cargarMensajes();
        setTimeout(() => setRespuesta(''), 3000);
      }
    } catch (err) {
      setError('Error al enviar mensaje: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatHora = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const agregarEmoji = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="mensajes-container">
      <div className="chat-header">
        <h3>Conversación con {usuario.name}</h3>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {mensajes.length > 0 ? (
          [...mensajes].reverse().map((msg, index) => (
            <div
              key={index}
              className={`mensaje ${msg.from === from ? 'mensaje-propio' : 'mensaje-ajeno'}`}
            >
              <p>{msg.content}</p>
              <span className="hora-mensaje">{formatHora(msg.timestamp)}</span>
            </div>
          ))
        ) : (
          <p className="mensaje-info">No hay mensajes aún</p>
        )}
      </div>

      <form className="chat-input-area" onSubmit={enviarMensaje}>
        <div className="input-con-emojis">
          <textarea
            placeholder="Escribe tu mensaje..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setMostrarPicker(!mostrarPicker)}
            className="emoji-button"
          >
            <FaSmile />
          </button>
          {mostrarPicker && (
            <div className="emoji-picker" ref={pickerRef}>
              <EmojiPicker onEmojiClick={agregarEmoji} />
            </div>
          )}
        </div>
        <button type="submit">Enviar</button>
      </form>

      {respuesta && <p className="respuesta">{respuesta}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Mensajes;
