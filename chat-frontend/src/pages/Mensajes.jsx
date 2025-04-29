// src/pages/Mensajes.jsx
import { useState } from 'react';
import axios from 'axios';

const Mensajes = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');

  const enviarMensaje = async (e) => {
    e.preventDefault();
    setRespuesta('');
    setError('');

    try {
      const response = await axios.post('https://tu-api.execute-api.us-east-1.amazonaws.com/dev/message', {
        from,
        to,
        content,
      });

      if (response.status === 200) {
        setRespuesta('Mensaje enviado correctamente');
        setFrom('');
        setTo('');
        setContent('');
      }
    } catch (err) {
      setError('Error al enviar mensaje: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Enviar Mensaje</h2>
      <form onSubmit={enviarMensaje} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="De (userId)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Para (contactId)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <textarea
          placeholder="Mensaje"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {respuesta && <p style={{ color: 'green' }}>{respuesta}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Mensajes;
