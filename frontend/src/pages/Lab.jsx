import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import StatusChip from '../components/StatusChip';

// R9 and R12: add headsets, then decide on what students have asked for
const Lab = () => {
  const [headsets, setHeadsets] = useState([]);
  const [pending, setPending] = useState([]);
  const [form, setForm] = useState({ assetTag: '', model: '', notes: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');

  const load = async () => {
    try {
      const [h, p] = await Promise.all([
        axiosInstance.get('/api/headsets'),
        axiosInstance.get('/api/loans/pending'),
      ]);
      setHeadsets(h.data);
      setPending(p.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load the lab');
    }
  };

  useEffect(() => { load(); }, []);

  const addHeadset = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');
    try {
      await axiosInstance.post('/api/headsets', form);
      setNotice(`${form.model} added.`);
      setForm({ assetTag: '', model: '', notes: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add that headset');
    }
  };

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

  const reject = async (id) => {
    setError(''); setNotice('');
    try {
      await axiosInstance.put(`/api/loans/${id}/reject`, { reason });
      setNotice('Request rejected.');
      setRejecting(null); setReason('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject that request');
    }
  };

  const field = 'w-full h-[50px] px-3.5 border border-[#DFE1DF] rounded-lg bg-white text-base';
  const label = 'block text-[10.5px] tracking-[0.08em] uppercase text-[#6A6F73] mb-1.5 font-mono';
  const card  = 'border border-[#DFE1DF] bg-white rounded-lg p-3.5 mb-2.5';

  return (
    <div className="max-w-lg mx-auto mt-8 px-4 pb-16">
      <h1 className="text-[28px] font-semibold tracking-tight mb-5">Lab overview</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-[#F9EBE9] text-[#9C2E26] border-l-[3px] border-[#9C2E26] px-3.5 py-3 text-sm">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-4 rounded-lg bg-[#E7F2EB] text-[#1C6440] border-l-[3px] border-[#1C6440] px-3.5 py-3 text-sm">
          {notice}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-3">Requests waiting ({pending.length})</h2>
      {pending.length === 0 && (
        <p className="text-sm text-[#6A6F73] mb-6">Nothing waiting. The queue is clear.</p>
      )}
      {pending.map((l) => (
        <div key={l._id} className={card}>
          <p className="font-semibold">{l.student?.name}</p>
          <p className="font-mono text-[12.5px] text-[#6A6F73] mt-1 mb-3">
            {l.headset?.assetTag} · {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
          </p>

          {rejecting === l._id ? (
            <>
              <label className={label}>Reason the student will see</label>
              <textarea className="w-full h-20 p-3 border border-[#DFE1DF] rounded-lg text-sm mb-2"
                value={reason} onChange={(e) => setReason(e.target.value)} />
              <div className="flex gap-2.5">
                <button onClick={() => reject(l._id)}
                  className="flex-1 h-10 bg-[#16181C] text-white rounded-md text-sm font-semibold">
                  Reject request
                </button>
                <button onClick={() => { setRejecting(null); setReason(''); }}
                  className="flex-1 h-10 border border-[#16181C] rounded-md text-sm font-semibold">
                  Keep waiting
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2.5">
              <button onClick={() => approve(l._id)}
                className="flex-1 h-10 bg-[#16181C] text-white rounded-md text-sm font-semibold">
                Approve
              </button>
              <button onClick={() => setRejecting(l._id)}
                className="flex-1 h-10 border border-[#16181C] rounded-md text-sm font-semibold">
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-10 mb-3">Add a headset</h2>
      <form onSubmit={addHeadset} className="mb-8">
        <div className="mb-3">
          <label className={label}>Asset tag</label>
          <input className={field} placeholder="XR-014"
            value={form.assetTag} onChange={(e) => setForm({ ...form, assetTag: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className={label}>Model</label>
          <input className={field} placeholder="Meta Quest 3"
            value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
        </div>
        <button type="submit"
          className="w-full h-[50px] bg-[#16181C] text-white rounded-lg font-semibold">Add a headset</button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Headsets ({headsets.length})</h2>
      {headsets.map((h) => (
        <div key={h._id} className={`${card} flex items-center gap-3`}>
          <div className="flex-1">
            <p className="font-semibold">{h.model}</p>
            <p className="font-mono text-[12.5px] text-[#6A6F73] mt-1">{h.assetTag}</p>
          </div>
          <StatusChip status={h.status} />
        </div>
      ))}
    </div>
  );
};

export default Lab;
