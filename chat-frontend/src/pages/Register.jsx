import { useState } from 'react';
import axios from 'axios';
import '../Css/Login.css';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    companyId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        'https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/register',
        form
      );
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una empresa</option>
            <option value="comp_123">Empresa 123</option>
          </select>
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'lightgreen' }}>{success}</p>}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => window.location.href = '/Login'}
        >
          ¿Ya tienes cuenta? Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default Register;
