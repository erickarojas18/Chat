import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Historial = ({ userId, contactId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://tu-api.execute-api.us-east-1.amazonaws.com/dev/history`,
          {
            params: {
              userId,
              contactId,
              limit: 50
            }
          }
        );
        setMessages(response.data.data.messages);
      } catch (err) {
        console.error('Error al cargar el historial:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, contactId]);

  if (loading) return <p>Cargando mensajes...</p>;

  return (
    <div>
      <h2>Chat con {contactId}</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.from === userId ? 'Tú' : 'Ellx'}:</strong> {msg.content}
            <div style={{ fontSize: '0.8em', color: '#666' }}>{new Date(msg.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;  // Asegúrate de que el componente se llama Historial
