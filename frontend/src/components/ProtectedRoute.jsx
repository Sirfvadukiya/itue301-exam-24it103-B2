import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// 1) No token       -> send to "/" (Login)
// 2) Wrong role -> send to "/events" and keep the user logged in
// The two redirect targets are deliberately DIFFERENT so the two failures are easy to tell apart.
function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/" replace />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/events" replace />;

  return children;
}

export default ProtectedRoute;
