import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { CARD, BTN_ALT, MUTED, TITLE, PAGE } from '../components/ui';

// The technician landing page. Two counts, then a way into the inventory.
const LabOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ waiting: 0, oldest: null, total: 0, available: 0 });

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/api/loans/pending'),
      axiosInstance.get('/api/headsets'),
    ]).then(([p, h]) => {
      setStats({
        waiting: p.data.length,
        oldest: p.data[0]?.createdAt || null,
        total: h.data.length,
        available: h.data.filter((x) => x.status === 'Available').length,
      });
    }).catch(() => {});
  }, []);

  const daysAgo = (d) => {
    if (!d) return 'The queue is clear';
    const n = Math.floor((Date.now() - new Date(d)) / 86400000);
    return n < 1 ? 'Oldest came in today' : `Oldest has been waiting ${n} day${n > 1 ? 's' : ''}`;
  };

  const cards = [
    { title: `${stats.waiting} requests waiting`, desc: daysAgo(stats.oldest), to: '/requests' },
    { title: `${stats.total} headsets`, desc: `${stats.available} available, ${stats.total - stats.available} out`, to: '/headsets' },
  ];

  return (
    <Shell>
      <TopBar title="Lab overview" role={user?.role} />
      <div className={PAGE}>
        {cards.map((c) => (
          <button key={c.to} type="button" onClick={() => navigate(c.to)}
            className={`${CARD} h-[82px] flex flex-col items-start justify-center gap-2 text-left`}>
            <span className={TITLE}>{c.title}</span>
            <span className={MUTED}>{c.desc}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button type="button" onClick={() => navigate('/headsets')} className={BTN_ALT}>Add a headset</button>
      </div>
      <BottomNav />
    </Shell>
  );
};
export default LabOverview;
