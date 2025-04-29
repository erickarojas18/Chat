import { Link, Outlet } from 'react-router-dom';
import '../Css/Login.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <Link to="/dashboard">Home</Link>
        <Link to="/dashboard/historial">Historial</Link>
        <Link to="/dashboard/lista">Lista de Usuarios</Link>
        <Link to="/dashboard/busqueda">Búsqueda</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default Dashboard;
