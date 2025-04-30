import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../Css/Login.css'; 
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirección

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

        const response = await axios.get('https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/lista', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            companyId: companyId,
          },
        });

        setUsuarios(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener la lista de usuarios.');
      }
    };

    fetchUsuarios();
  }, []);

  const handleUserClick = (userId) => {
    // Redirige al chat de mensajes
    navigate(`/dashboard/mensajes/${userId}`);
  };

  return (
    <div className="dashboard-container">
      <div className="content">
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
                  marginBottom: '0.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleUserClick(user._id)} // Evento de clic
              >
                <strong>{user.name}</strong> — {user.email}
              </li>
            ))}
          </ul>
        ) : (
          !error && <p>No se encontraron usuarios.</p>
        )}
        <Outlet />
      </div>
      <nav className="navbar">
        <Link to="/dashboard">Home</Link>
        <Link to="/dashboard/historial">Historial</Link>
        <Link to="/dashboard/lista">Lista de Usuarios</Link>
        <Link to="/dashboard/busqueda">Búsqueda</Link>
        <Link to="/dashboard/mensajes">Mensajes</Link>
      </nav>
    </div>
  );
};

export default Dashboard;
