import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Asegúrate de tener este archivo

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />  {/* Ruta raíz para Register */}
        <Route path="/login" element={<Login />} />  {/* Ruta explícita para Login */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
