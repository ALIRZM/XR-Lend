import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

// R5: start a session and open the dashboard for the role
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/auth/login', form);
      login(data);
      navigate(data.role === 'technician' ? '/lab' : '/find');
    } catch (err) {
      // Never say which of the two was wrong
      setError('That email and password do not match. Check both and try again.');
    }
  };

  const field = `w-full h-[50px] px-3.5 rounded-lg text-base bg-white border ${
    error ? 'border-[#9C2E26] border-[1.5px]' : 'border-[#DFE1DF]'}`;
  const label = 'block text-[10.5px] tracking-[0.08em] uppercase text-[#6A6F73] mb-1.5 font-mono';

  return (
    <div className="max-w-md mx-auto mt-24 px-4">
      <h1 className="text-[28px] font-semibold tracking-tight mb-1">Log in</h1>
      <p className="text-[#6A6F73] text-sm mb-6">Borrow XR headsets from the lab.</p>

      {error && (
        <div className="mb-4 rounded-lg bg-[#F9EBE9] text-[#9C2E26] border-l-[3px] border-[#9C2E26] px-3.5 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={label}>University email</label>
          <input type="email" className={field}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="mb-5">
          <label className={label}>Password</label>
          <input type="password" className={field}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit"
          className="w-full h-[50px] bg-[#16181C] text-white rounded-lg font-semibold text-base">
          Log in
        </button>
      </form>

      <p className="text-center text-[13px] text-[#6A6F73] mt-4">
        New here? <Link to="/register" className="text-[#0E6F72]">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
