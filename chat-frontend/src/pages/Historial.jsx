import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Historial.css'; // Asegúrate de tener este archivo CSS

const Historial = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const companyId = payload.companyId;

        // Historial de mensajes enviados por el usuario
        const historyUrl = `https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/history?userId=${userId}`;
        const historyRes = await axios.get(historyUrl);
        const parsedHistory = historyRes.data;

        if (!parsedHistory.success) throw new Error('Error al obtener historial');

        setMessages(parsedHistory.data.messages);

        // Lista de usuarios para mostrar nombres
        const usersRes = await axios.get(
          'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/lista',
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { companyId },
          }
        );

        const usersMap = {};
        for (const user of usersRes.data) {
          usersMap[user._id] = { name: user.name, email: user.email };
        }

        setUsuarios(usersMap);
      } catch (err) {
        console.error('Error al cargar historial o usuarios:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistoryAndUsers();
    }
  }, [userId]);

  if (loading) return <p className="historial-loading">Cargando mensajes...</p>;
  if (!messages.length) return <p className="historial-empty">No hay mensajes en el historial.</p>;

  return (
    <div className="historial-container">
      <h2 className="historial-title">Historial de mensajes enviados</h2>
      <div className="chat-history">
        {messages.map((msg, index) => {
          const destinatario = usuarios[msg.to];
          const nombre = destinatario ? destinatario.name : msg.to;
          const email = destinatario ? destinatario.email : '';

          return (
            <div key={index} className="message-bubble sent">
              <div className="message-header">
                <span className="from-label">TÚ</span> 
                <span className="arrow">→</span> 
                <span className="to-label">{nombre}</span>
                <span className="email-label">({email})</span>
              </div>
              <div className="message-content">{msg.content}</div>
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Historial;
