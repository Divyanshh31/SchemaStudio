import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('schemastudio_user') || localStorage.getItem('datalens_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('schemastudio_token') || localStorage.getItem('datalens_token') || null;
  });

  const [userWorkspace, setUserWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync user & workspace state on login
  useEffect(() => {
    if (user && user.id) {
      fetchUserWorkspace(user.id);
    }
  }, [user?.id]);

  const fetchUserWorkspace = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/user/workspace/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserWorkspace(data);
      }
    } catch (e) {
      console.warn('Workspace sync warning:', e);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('schemastudio_user', JSON.stringify(data.user));
      localStorage.setItem('schemastudio_token', data.token);

      await fetchUserWorkspace(data.user.id);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role, institution }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, institution })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('schemastudio_user', JSON.stringify(data.user));
      localStorage.setItem('schemastudio_token', data.token);

      await fetchUserWorkspace(data.user.id);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserWorkspace(null);
    localStorage.removeItem('schemastudio_user');
    localStorage.removeItem('schemastudio_token');
    localStorage.removeItem('datalens_user');
    localStorage.removeItem('datalens_token');
  };

  const saveWorkspaceState = async (updates) => {
    if (!user || !user.id) return;
    try {
      const res = await fetch(`http://localhost:3001/api/user/workspace/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setUserWorkspace(data.workspace);
      }
    } catch (e) {
      console.warn('Save workspace error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        userWorkspace,
        loading,
        authError,
        login,
        register,
        logout,
        saveWorkspaceState,
        refreshWorkspace: () => user && fetchUserWorkspace(user.id)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
