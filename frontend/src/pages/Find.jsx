import { useState } from 'react';
import axiosInstance from '../axiosConfig';
import StatusChip from '../components/StatusChip';

// R10, R11, R13: search the dates, then request one of what comes back
const Find = () => {
  const [dates, setDates] = useState({ start: '', end: '' });
  const [results, setResults] = useState(null);   // null = not searched yet
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [myLoans, setMyLoans] = useState([]);

  const search = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');

    // Validation runs here, so nothing is sent until both dates are valid
    if (!dates.start || !dates.end) return setError('Pick both dates first.');
    if (new Date(dates.end) < new Date(dates.start)) {
      return setError('The return date is before the pick-up date. Choose a later return date.');
    }
    try {
      const { data } = await axiosInstance.get('/api/headsets/available', { params: dates });
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not search right now');
    }
  };

  const request = async (headsetId) => {
    setError(''); setNotice('');
    try {
      await axiosInstance.post('/api/loans', {
        headsetId, startDate: dates.start, endDate: dates.end,
      });
      setNotice('Request sent. It is waiting on a technician.');
      setResults(results.filter((h) => h._id !== headsetId));
      loadMine();
    } catch (err) {
      // 409 is the second overlap check refusing. Decision D5.
      setError(err.response?.data?.message || 'Could not send the request');
    }
  };

  const loadMine = async () => {
    try {
      const { data } = await axiosInstance.get('/api/loans/mine');
      setMyLoans(data);
    } catch { /* not fatal */ }
  };

  const field = 'w-full h-[50px] px-3.5 border border-[#DFE1DF] rounded-lg bg-white font-mono text-sm';
  const label = 'block text-[10.5px] tracking-[0.08em] uppercase text-[#6A6F73] mb-1.5 font-mono';

  return (
    <div className="max-w-lg mx-auto mt-8 px-4 pb-16">
      <h1 className="text-[28px] font-semibold tracking-tight mb-5">Find a headset</h1>

      <form onSubmit={search}>
        <div className="flex gap-2.5 mb-3">
          <div className="flex-1">
            <label className={label}>From</label>
            <input type="date" className={field}
              value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} />
          </div>
          <div className="flex-1">
            <label className={label}>To</label>
            <input type="date" className={field}
              value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })} />
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-[#F9EBE9] text-[#9C2E26] border-l-[3px] border-[#9C2E26] px-3.5 py-3 text-sm">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-3 rounded-lg bg-[#E7F2EB] text-[#1C6440] border-l-[3px] border-[#1C6440] px-3.5 py-3 text-sm">
            {notice}
          </div>
        )}

        <button type="submit"
          className="w-full h-[50px] bg-[#16181C] text-white rounded-lg font-semibold">Search</button>
      </form>

      {results !== null && results.length === 0 && (
        <div className="mt-5 rounded-lg border border-dashed border-[#DFE1DF] bg-white p-8 text-center">
          <p className="font-semibold mb-1.5">Nothing free for those dates</p>
          <p className="text-sm text-[#6A6F73]">
            Every headset is booked. Try a shorter stay or a different week.
          </p>
        </div>
      )}

      {results !== null && results.length > 0 && (
        <>
          <p className={`${label} mt-6`}>{results.length} free</p>
          {results.map((h) => (
            <div key={h._id}
              className="flex items-center gap-3 border border-[#DFE1DF] bg-white rounded-lg p-3.5 mb-2.5">
              <div className="flex-1">
                <p className="font-semibold text-base">{h.model}</p>
                <p className="font-mono text-[12.5px] text-[#6A6F73] mt-1">{h.assetTag}</p>
              </div>
              <button onClick={() => request(h._id)}
                className="h-10 px-4 bg-[#16181C] text-white rounded-md text-sm font-semibold">
                Request
              </button>
            </div>
          ))}
        </>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">My loans</h2>
          <button onClick={loadMine} className="text-sm text-[#0E6F72]">Refresh</button>
        </div>
        {myLoans.length === 0 && (
          <p className="text-sm text-[#6A6F73]">No loans yet. Search some dates to get started.</p>
        )}
        {myLoans.map((l) => (
          <div key={l._id} className="border border-[#DFE1DF] bg-white rounded-lg p-3.5 mb-2.5">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-semibold">{l.headset?.model}</p>
                <p className="font-mono text-[12.5px] text-[#6A6F73] mt-1">
                  {l.headset?.assetTag} · {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                </p>
              </div>
              <StatusChip status={l.status} />
            </div>
            {l.rejectionReason && (
              <div className="mt-2.5 rounded bg-[#F9EBE9] text-[#9C2E26] px-3 py-2 text-[12.5px]">
                {l.rejectionReason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Find;
