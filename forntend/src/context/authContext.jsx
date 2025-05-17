import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    // Save token and user to localStorage when they change
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
