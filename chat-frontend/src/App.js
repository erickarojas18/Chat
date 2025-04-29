import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import ListaUsuarios from './pages/ListaUsuarios';
import Busqueda from './pages/Busqueda';
import Mensajes from './pages/Mensajes'; // 👈 Importamos el componente de mensajes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta para Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/historial" element={<Historial />} />
        <Route path="/dashboard/lista" element={<ListaUsuarios />} />
        <Route path="/dashboard/busqueda" element={<Busqueda />} />
        <Route path="/dashboard/mensajes" element={<Mensajes />} /> {/* 👈 Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
