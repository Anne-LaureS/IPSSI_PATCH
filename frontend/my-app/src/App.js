import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, authHeader);
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, name: form.name };

      const res = await axios.post(`${API_URL}/auth/${endpoint}`, payload);
      const { token: newToken, user } = res.data.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      setForm({ email: '', password: '', name: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la requête');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCurrentUser(null);
    setUsers([]);
  };

  if (!token) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>IPSSI Patch</h1>

          <section style={{ border: '2px solid #61dafb', padding: '1.5rem', borderRadius: '8px', minWidth: '300px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <button onClick={() => setMode('login')} disabled={mode === 'login'} style={{ marginRight: '0.5rem' }}>
                Connexion
              </button>
              <button onClick={() => setMode('register')} disabled={mode === 'register'}>
                Inscription
              </button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {mode === 'register' && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">{mode === 'login' ? 'Se connecter' : "S'inscrire"}</button>
            </form>

            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
          </section>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>IPSSI Patch</h1>
        <p>Connecté en tant que {currentUser?.email || 'utilisateur'}</p>
        <button onClick={handleLogout} style={{ marginBottom: '2rem' }}>Se déconnecter</button>

        <section style={{ border: '2px solid #61dafb', padding: '1rem', borderRadius: '8px', minWidth: '300px' }}>
          <h3>Utilisateurs</h3>
          {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
          {users.map(u => (
            <p key={u.id}>{u.name} — {u.email}</p>
          ))}
        </section>
      </header>
    </div>
  );
}

export default App;
