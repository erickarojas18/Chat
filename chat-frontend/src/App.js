import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import ListaUsuarios from './pages/ListaUsuarios';
import Busqueda from './pages/Busqueda';
import Mensajes from './pages/Mensajes'; 

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
        <Route path="/dashboard/mensajes/:userId" element={<Mensajes />} />
      </Routes>
    </Router>
  );
}

export default App;
