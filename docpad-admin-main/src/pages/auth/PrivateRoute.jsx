import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");

  // token nahi hai → login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // token hai → allow
  return children;
}
