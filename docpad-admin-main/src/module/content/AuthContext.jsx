import React, { createContext, useState, useEffect } from "react";
import { apiGet } from "../../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");

    //token hi nahi → direct logout state
    if (!access) {
      setUser(null);
      setLoading(false);
      return;
    }

    // token hai → verify user
    apiGet("/api/auth/user/")
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("role", res.user.role);

          if (res.user.image) {
            localStorage.setItem("image", res.user.image);
          } else {
            localStorage.removeItem("image");
          }
        } else {
          throw new Error("No user");
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("image");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
