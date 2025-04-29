// src/pages/ListaUsuarios.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Login.css'; // Reutilizando el mismo estilo

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token disponible.');
          return;
        }

        // Decodificamos el token para obtener el companyId
        const payload = JSON.parse(atob(token.split('.')[1]));
        const companyId = payload.companyId;

        const response = await axios.get(
          `https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/users?companyId=${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUsuarios(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener la lista de usuarios.');
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Lista de Usuarios</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {usuarios.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {usuarios.map((user) => (
            <li
              key={user._id}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}
            >
              <strong>{user.name}</strong> — {user.email}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No se encontraron usuarios.</p>
      )}
    </div>
  );
};

export default ListaUsuarios;
