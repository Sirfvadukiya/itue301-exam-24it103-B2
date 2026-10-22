import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// <NavLink> changes the route without a full page reload
function Navbar() {
  const { token, attendee, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <span className="brand">🎫 EventHub</span>
      <div className="links">
        <NavLink to="/" end>Login</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/my-tickets">My Tickets</NavLink>
        <NavLink to="/organizer">Organizer</NavLink>
      </div>
      {token && (
        <div className="user">
          <span>{attendee?.name} ({role})</span>
          <button className="btn small" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
