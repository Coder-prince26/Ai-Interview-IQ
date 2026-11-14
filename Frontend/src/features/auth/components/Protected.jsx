import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="auth-loading">
        <div className="auth-loading__spinner" />
        <h1>Preparing your workspace...</h1>
        <p>The server may take up to a minute to wake up on the first visit.</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;