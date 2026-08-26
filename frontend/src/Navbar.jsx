import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white border-b border-[#DFE1DF] px-4 h-[54px] flex justify-between items-center">
      <Link to="/" className="text-lg font-semibold tracking-tight">XRLend</Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="font-mono text-[9.5px] tracking-[0.08em] uppercase text-[#0E6F72] bg-[#E4EFEF] px-2 py-1 rounded">
              {user.role}
            </span>
            <Link to={user.role === 'technician' ? '/lab' : '/find'}>
              {user.role === 'technician' ? 'Lab' : 'Find'}
            </Link>
            <button onClick={handleLogout} className="text-[#6A6F73]">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="bg-[#16181C] text-white px-3.5 py-1.5 rounded-md">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
