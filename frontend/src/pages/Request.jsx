import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import { BTN, FIELD, CARD, MUTED, TITLE, ERRBOX, PAGE } from '../components/ui';

const pretty = (d) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });

// R11 and R13: the request runs the overlap check a second time before it saves.
// A clash can appear while the student is filling in this form. Decision D5.
const Request = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  if (!state?.headset) return <Navigate to="/find" replace />;
  const { headset, dates } = state;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/loans', {
        headsetId: headset._id, startDate: dates.start, endDate: dates.end, purpose,
      });
      navigate('/sent', { state: { loan: data, headset } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send the request');
    }
  };

  return (
    <Shell>
      <TopBar title="Request" role={user?.role} back />
      <form onSubmit={submit} className={PAGE}>
        <div className={`${CARD} flex items-start gap-2.5`}>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <span className={TITLE}>{headset.model}</span>
            <span className={MUTED}>{headset.assetTag}</span>
          </div>
          <div className="w-[101px] bg-[#e7f2eb] rounded-xl px-[18px] py-1 text-center">
            <span className="text-[#1c6440] text-base font-medium leading-6">Available</span>
          </div>
        </div>

        <div className="flex justify-between w-full">
          {[['start', 'From'], ['end', 'To']].map(([k, label]) => (
            <div key={k} className="flex flex-col w-[171px] gap-0.5 py-[11px]">
              <span className={MUTED}>{label}</span>
              <div className={FIELD}>{pretty(dates[k])}</div>
            </div>
          ))}
        </div>

        <label className="w-full text-[#7b7d82] text-sm uppercase">What you need it for?</label>
        <input className={FIELD} value={purpose} onChange={(e) => setPurpose(e.target.value)} />

        {error && <div className={ERRBOX} role="alert">{error}</div>}

        <p className={`${MUTED} self-start`}>Wait for a technician to answer.</p>
        <div className="flex-1" />
        <button type="submit" className={BTN}>Send request</button>
      </form>
    </Shell>
  );
};
export default Request;
