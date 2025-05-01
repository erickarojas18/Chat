import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../Css/Mensajes.css';

const Mensajes = ({ usuario }) => {
  const [content, setContent] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');

  const from = localStorage.getItem('userId');
  const to = usuario._id;

  // Ref para el contenedor de mensajes para hacer scroll automáticamente
  const chatBodyRef = useRef(null);

  // Función para cargar los mensajes entre los dos usuarios
  const cargarMensajes = async () => {
    try {
      const response = await axios.get(
        'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/messages',
        {
          params: { from, to },
        }
      );
      if (response.status === 200) {
        // Ordenar los mensajes por fecha de creación (de más antiguos a más recientes)
        const mensajesOrdenados = response.data.messages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMensajes(mensajesOrdenados);
      }
    } catch (err) {
      setError('Error al cargar mensajes: ' + (err.response?.data?.message || err.message));
    }
  };

  // Cargar mensajes al iniciar el componente o cuando cambie el usuario
  useEffect(() => {
    if (from && to) {
      cargarMensajes();
    }
  }, [to]);

  // Scroll automático hacia el último mensaje cuando los mensajes cambian
  useEffect(() => {
    if (chatBodyRef.current) {
      // Hacemos scroll hacia el final cada vez que cambien los mensajes
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    setRespuesta('');
    setError('');

    try {
      const response = await axios.post(
        'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/messages',
        { from, to, content }
      );

      if (response.status === 200) {
        setRespuesta('Mensaje enviado');
        setContent('');
        await cargarMensajes(); // Recargar mensajes después de enviar uno nuevo
      }
    } catch (err) {
      setError('Error al enviar mensaje: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="mensajes-container">
      <div className="chat-header">
        <h3>Conversación con {usuario.name}</h3>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {mensajes.length > 0 ? (
          // Invertir el orden de los mensajes para que el más reciente aparezca al final
          [...mensajes].reverse().map((msg, index) => (
            <div
              key={index}
              className={`mensaje ${msg.from === from ? 'mensaje-propio' : 'mensaje-ajeno'}`}
            >
              <p>{msg.content}</p>
              <span className="hora">{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          ))
        ) : (
          <p className="mensaje-info">No hay mensajes aún</p>
        )}
      </div>

      <form className="chat-input-area" onSubmit={enviarMensaje}>
        <textarea
          placeholder="Escribe tu mensaje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>

      {respuesta && <p className="respuesta">{respuesta}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Mensajes;
