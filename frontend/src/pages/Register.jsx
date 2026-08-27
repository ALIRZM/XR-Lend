import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import { BTN, FIELD_P, ERRBOX } from '../components/ui';

// R1, R2, R3: create an account and pick a role.
// The technician role needs the staff code, which the server checks.
const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', staffCode: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/auth/register', form);
      login(data);
      navigate(data.role === 'technician' ? '/lab' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the account');
    }
  };

  return (
    <Shell>
      <TopBar title="Create account" back />
      <form onSubmit={submit} className="mx-[17px] mt-[25px] flex flex-col gap-3">
        {error && <div className={ERRBOX} role="alert">{error}</div>}

        <input className={FIELD_P} required placeholder="Full Name" value={form.name} onChange={set('name')} />
        <input className={FIELD_P} type="email" required placeholder="University Email"
          value={form.email} onChange={set('email')} />
        <input className={FIELD_P} type="password" required minLength={8} placeholder="Password"
          value={form.password} onChange={set('password')} />

        <p className="text-[#2d2d2d] text-[15px] text-center w-[78px]">I Am A</p>
        <div className="flex bg-white rounded-2xl">
          {['student', 'technician'].map((r) => (
            <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
              aria-pressed={form.role === r}
              className={`flex-1 h-[46px] rounded-2xl px-[21px] text-base text-left capitalize ${
                form.role === r ? 'bg-[#343434] text-white' : 'bg-white text-[#667085]'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className={`${FIELD_P} ${form.role !== 'technician' ? 'opacity-60' : ''}`}>
          <input className="w-full text-[#667085] text-sm bg-transparent"
            placeholder="Provide Staff Code here if you are Technician"
            disabled={form.role !== 'technician'} required={form.role === 'technician'}
            value={form.staffCode} onChange={set('staffCode')} />
        </div>

        <button type="submit" className={`${BTN} mt-4`}>Create Account</button>

        <p className="text-center text-[#98a2b3] text-base font-medium mt-2">
          Already have an account? <Link to="/login" className="text-black text-xs">Login &rarr;</Link>
        </p>
      </form>
    </Shell>
  );
};
export default Register;
