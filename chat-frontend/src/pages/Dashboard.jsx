import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Dashboard.css';
import Mensajes from './Mensajes'; // Asegúrate de tener este componente

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token disponible.');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const companyId = payload.companyId;

        const response = await axios.get(
          'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/lista',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { companyId },
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

  const handleUserClick = (user) => {
    setUsuarioSeleccionado(user);
  };

  return (
    <div className="dashboard-page">
      <div className="chat-layout">
        <aside className="usuarios-panel">
          <h2>Usuarios</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {usuarios.length > 0 ? (
            <ul className="usuarios-lista">
              {usuarios.map((user) => (
                <li
                  key={user._id}
                  className="usuario-item"
                  onClick={() => handleUserClick(user)}
                >
                  <strong>{user.name}</strong><br />
                  <span>{user.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p>No se encontraron usuarios.</p>
          )}
        </aside>
  
        <section className="chat-panel">
          {usuarioSeleccionado ? (
            <Mensajes usuario={usuarioSeleccionado} />
          ) : (
            <p className="mensaje-bienvenida">Selecciona un usuario para comenzar a chatear</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
