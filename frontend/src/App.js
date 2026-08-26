import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Find from './pages/Find';
import Lab from './pages/Lab';

// R14 is enforced on the server. This only keeps the wrong page out of view.
const RequireRole = ({ role, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'technician' ? '/lab' : '/find'} replace />;
  return children;
};

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'technician' ? '/lab' : '/find'} replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find" element={<RequireRole role="student"><Find /></RequireRole>} />
        <Route path="/lab" element={<RequireRole role="technician"><Lab /></RequireRole>} />
      </Routes>
    </Router>
  );
}

export default App;
