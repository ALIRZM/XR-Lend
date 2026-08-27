import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { CARD, FIELD, BTN, BTN_ALT, MUTED, TITLE, H2, SUB, ERRBOX, OKBOX, PAGE } from '../components/ui';

const pretty = (d) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
const ago = (d) => {
  const n = Math.floor((Date.now() - new Date(d)) / 86400000);
  return n < 1 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`;
};

// R12 and R13: a technician decides. Approve checks for a clash one last time.
const Requests = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');

  const load = () => axiosInstance.get('/api/loans/pending')
    .then(({ data }) => setPending(data))
    .catch((err) => setError(err.response?.data?.message || 'Could not load the queue'));

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    setError(''); setNotice('');
    try {
      await axiosInstance.put(`/api/loans/${id}/approve`);
      setNotice('Request approved.');
      load();
    } catch (err) {
      // 409 means a clash appeared since the request was made. Decision D5.
      setError(err.response?.data?.message || 'Could not approve that request');
    }
  };

  const reject = async () => {
    setError(''); setNotice('');
    try {
      await axiosInstance.put(`/api/loans/${rejecting._id}/reject`, { reason });
      setNotice('Request rejected.');
      setRejecting(null); setReason('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject that request');
    }
  };

  return (
    <Shell>
      <TopBar title="Requests waiting" role={user?.role} />
      <div className={PAGE}>
        {error && <div className={ERRBOX} role="alert">{error}</div>}
        {notice && <div className={OKBOX} role="status">{notice}</div>}
        {pending.length === 0 && !error && (
          <p className={`${MUTED} self-start`}>Nothing waiting. The queue is clear.</p>
        )}

        {pending.map((l) => (
          <div key={l._id} className={`${CARD} flex flex-col gap-2.5`}>
            <div className="flex flex-col justify-center gap-2">
              <span className={TITLE}>{l.student?.name}</span>
              <span className={MUTED}>
                {l.headset?.assetTag}&nbsp;&nbsp;.&nbsp;&nbsp;{pretty(l.startDate)} - {pretty(l.endDate)}
                &nbsp;&nbsp;.&nbsp;&nbsp;{ago(l.createdAt)}
              </span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => approve(l._id)} className={BTN}>Approve</button>
              <button type="button" onClick={() => { setRejecting(l); setReason(''); }} className={BTN_ALT}>Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* The reject sheet slides up over the queue, as in the design */}
      {rejecting && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40">
          <section className="w-[390px] bg-white rounded-t-[15px] px-[15px] py-[11px] flex flex-col gap-[11px]">
            <div className="flex flex-col gap-1">
              <h2 className={H2}>Reject this request</h2>
              <p className={SUB}>
                {rejecting.student?.name}&nbsp;&nbsp;.&nbsp;&nbsp;{rejecting.headset?.assetTag}
                &nbsp;&nbsp;.&nbsp;&nbsp;{pretty(rejecting.startDate)} - {pretty(rejecting.endDate)}
              </p>
              <p className="text-[#a7a7a7] text-base font-medium tracking-[-0.48px] leading-[21px]">
                Reason the student will see
              </p>
            </div>
            <textarea className={`${FIELD} h-[82px] text-black resize-none`} value={reason}
              onChange={(e) => setReason(e.target.value)} required />
            <button type="button" onClick={reject} className={BTN}>Reject request</button>
            <button type="button" onClick={() => { setRejecting(null); setReason(''); }} className={BTN_ALT}>
              Keep waiting
            </button>
          </section>
        </div>
      )}
      <BottomNav />
    </Shell>
  );
};
export default Requests;
