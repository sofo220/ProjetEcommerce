import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();


  if (!token || !user) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (requireAdmin) {

    if (user.is_admin !== true) {

      return <Navigate to="/" replace />;
    }
  }

  return children;
}
