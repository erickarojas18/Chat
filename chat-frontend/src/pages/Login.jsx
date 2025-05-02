import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Resetea el mensaje de éxito al intentar un login

    try {
      const response = await axios.post('https://814ooupswb.execute-api.us-east-1.amazonaws.com/dev/login', {
        email,
        password
      });

      const { token, userId} = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); 
      setSuccessMessage('Login exitoso');
      console.log('Login exitoso - userId:', userId);

      // Mostrar el mensaje de éxito durante 3 segundos y luego redirigir
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error de login');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => window.location.href = '/register'}
        >
          ¿Aún no tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
};

export default Login;
