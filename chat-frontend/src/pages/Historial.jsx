import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Historial = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/history'
        );
    
        // 👇 parsear el body manualmente
        const parsedBody = JSON.parse(response.data.body);
    
        if (parsedBody.success) {
          setMessages(parsedBody.data.messages);
        } else {
          console.error('Respuesta inválida:', parsedBody);
        }
      } catch (err) {
        console.error('Error al cargar el historial:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Cargando mensajes...</p>;

  return (
    <div>
      <h2>Historial completo de mensajes</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.from}</strong> → <strong>{msg.to}</strong>: {msg.content}
            <div style={{ fontSize: '0.8em', color: '#666' }}>
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;
