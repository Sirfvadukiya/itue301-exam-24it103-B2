import { createContext, useContext, useState } from 'react';

// Global auth state: { attendee, token, role }.
// Saved in localStorage so a page refresh does not log the user out.
const AuthContext = createContext(null);

const loadSaved = () => {
  try {
    return JSON.parse(localStorage.getItem('eventhub_auth')) || { attendee: null, token: null, role: null };
  } catch {
    return { attendee: null, token: null, role: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadSaved);

  const login = ({ attendee, token, role }) => {
    const next = { attendee, token, role };
    setAuth(next);
    localStorage.setItem('eventhub_auth', JSON.stringify(next));
  };

  const logout = () => {
    setAuth({ attendee: null, token: null, role: null });
    localStorage.removeItem('eventhub_auth');
  };

  return <AuthContext.Provider value={{ ...auth, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
