import React, { createContext, useState, useEffect } from "react";
import { apiGet } from "../../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      apiGet("/api/auth/user/")
        .then((res) => {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        })
        .catch(() => {
          setUser(null);
          localStorage.clear();
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
