import React, { useState } from 'react';
import axios from 'axios';
import '../Css/Login.css'; // Puedes usar tus estilos existentes

const Busqueda = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMensajes([]);

    try {
      const response = await axios.get('https://TU_API.execute-api.us-east-1.amazonaws.com/dev/busqueda', {
        params: { from, to },
        withCredentials: true
      });

      setMensajes(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al buscar mensajes.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Búsqueda de mensajes</h2>
      <form onSubmit={handleBuscar} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Remitente (from)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="Destinatario (to)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {mensajes.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          {mensajes.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <strong>{msg.from} → {msg.to}</strong>
              <p>{msg.content}</p>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>{new Date(msg.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Busqueda;
