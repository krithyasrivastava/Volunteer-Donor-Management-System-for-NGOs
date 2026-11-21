import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/resources';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('gh_role'));
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem('gh_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.me();
      setUser(data.user);
      setRole(data.role);
    } catch {
      localStorage.removeItem('gh_token');
      localStorage.removeItem('gh_role');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = async (payload) => {
    const data = await authService.login(payload);
    localStorage.setItem('gh_token', data.token);
    localStorage.setItem('gh_role', data.role);
    setUser(data.user);
    setRole(data.role);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('gh_token', data.token);
    localStorage.setItem('gh_role', data.role);
    setUser(data.user);
    setRole(data.role);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('gh_token');
    localStorage.removeItem('gh_role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
