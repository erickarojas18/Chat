import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Dashboard.css';
import Mensajes from './Mensajes'; 
import Historial from './Historial';

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false); 

  const userId = localStorage.getItem('userId'); // Recuperamos el userId desde el localStorage

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
    setMostrarHistorial(false); // Ocultamos el historial al seleccionar un nuevo usuario
  };

  const handleHistorialClick = () => {
    setMostrarHistorial(true); // Mostramos el historial
  };

  return (
    <div className="dashboard-page">
      <div className="chat-layout">
        <aside className="usuarios-panel">
          <h2>Usuarios</h2>
          <button className="historial-btn" onClick={handleHistorialClick}>
            Historial
          </button>
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
          {mostrarHistorial ? (
            <Historial userId={userId} />
          ) : (
            usuarioSeleccionado && <Mensajes usuario={usuarioSeleccionado} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
