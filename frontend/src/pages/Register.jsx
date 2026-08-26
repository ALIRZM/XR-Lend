import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

// R1, R2, R3: create an account and pick a role.
// The technician role needs the staff code, checked on the server.
const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', staffCode: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/auth/register', form);
      login(data);
      navigate(data.role === 'technician' ? '/lab' : '/find');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the account');
    }
  };

  const field = 'w-full h-[50px] px-3.5 border border-[#DFE1DF] rounded-lg text-base bg-white';
  const label = 'block text-[10.5px] tracking-[0.08em] uppercase text-[#6A6F73] mb-1.5 font-mono';

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <h1 className="text-[28px] font-semibold tracking-tight mb-1">Create your account</h1>
      <p className="text-[#6A6F73] text-sm mb-6">Borrow XR headsets from the lab.</p>

      {error && (
        <div className="mb-4 rounded-lg bg-[#F9EBE9] text-[#9C2E26] border-l-[3px] border-[#9C2E26] px-3.5 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={label}>Full name</label>
          <input className={field} value={form.name} onChange={set('name')} required />
        </div>
        <div className="mb-4">
          <label className={label}>University email</label>
          <input type="email" className={field} value={form.email} onChange={set('email')} required />
        </div>
        <div className="mb-4">
          <label className={label}>Password</label>
          <input type="password" className={field} value={form.password} onChange={set('password')} required />
        </div>

        <div className="mb-4">
          <label className={label}>I am a</label>
          <div className="flex border border-[#DFE1DF] rounded-lg overflow-hidden h-[50px]">
            {['student', 'technician'].map((r) => (
              <button key={r} type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 text-[15px] ${form.role === r
                  ? 'bg-[#16181C] text-white font-semibold' : 'bg-white text-[#6A6F73]'}`}>
                {r === 'student' ? 'Student' : 'Technician'}
              </button>
            ))}
          </div>
        </div>

        {form.role === 'technician' && (
          <div className="mb-4 rounded-lg border border-dashed border-[#0E6F72] bg-[#E4EFEF] p-3">
            <label className={label} style={{ color: '#0E6F72' }}>Staff code</label>
            <input className={field} value={form.staffCode} onChange={set('staffCode')} />
            <p className="text-[13px] text-[#0E6F72] mt-2">Ask the lab manager for this code.</p>
          </div>
        )}

        <button type="submit"
          className="w-full h-[50px] bg-[#16181C] text-white rounded-lg font-semibold text-base">
          Create account
        </button>
      </form>

      <p className="text-center text-[13px] text-[#6A6F73] mt-4">
        Already have an account? <Link to="/login" className="text-[#0E6F72]">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
