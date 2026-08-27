import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import StatusChip from '../components/StatusChip';
import { CARD, FIELD, BTN, BTN_ALT, MUTED, TITLE, H2, ERRBOX, OKBOX, PAGE } from '../components/ui';

// R9: a technician adds headsets and sees the inventory
const Headsets = () => {
  const { user } = useAuth();
  const [headsets, setHeadsets] = useState([]);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ model: '', assetTag: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => axiosInstance.get('/api/headsets')
    .then(({ data }) => setHeadsets(data))
    .catch((err) => setError(err.response?.data?.message || 'Could not load the inventory'));

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = submitted.trim().toLowerCase();
    if (!q) return headsets;
    return headsets.filter((h) =>
      h.model.toLowerCase().includes(q) ||
      h.assetTag.toLowerCase().includes(q) ||
      h.status.toLowerCase().includes(q));
  }, [headsets, submitted]);

  const add = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');
    try {
      await axiosInstance.post('/api/headsets', form);
      setNotice(`${form.model} added.`);
      setForm({ model: '', assetTag: '' });
      setAdding(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add that headset');
    }
  };

  return (
    <Shell>
      <TopBar title="Headsets" role={user?.role} />
      <div className={PAGE}>
        {error && <div className={ERRBOX} role="alert">{error}</div>}
        {notice && <div className={OKBOX} role="status">{notice}</div>}

        <input className={FIELD} type="search" placeholder="Search for headset"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="button" onClick={() => setSubmitted(query)} className={BTN_ALT}>Search</button>

        <p className={`${MUTED} self-start`}>Tap a headset to see its model, asset tag and status.</p>

        <button type="button" onClick={() => setAdding(!adding)} className={BTN}>Add a headset</button>

        {adding && (
          <form onSubmit={add} className={`${CARD} flex flex-col gap-3`}>
            <h2 className={H2}>Add a headset</h2>
            <input className={FIELD} required placeholder="Model"
              value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <input className={FIELD} required placeholder="Asset tag"
              value={form.assetTag} onChange={(e) => setForm({ ...form, assetTag: e.target.value })} />
            <button type="submit" className={BTN}>Add headset</button>
          </form>
        )}

        {filtered.map((h) => (
          <div key={h._id} className={`${CARD} flex items-center gap-2.5`}>
            <div className="flex-1 flex flex-col justify-center gap-2">
              <span className={TITLE}>{h.model}</span>
              <span className={MUTED}>{h.assetTag}</span>
            </div>
            <StatusChip status={h.status} />
          </div>
        ))}

        {filtered.length === 0 && !error && (
          <p className={`${MUTED} w-full text-center py-4`}>No headsets found.</p>
        )}
      </div>
      <BottomNav />
    </Shell>
  );
};
export default Headsets;
