import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { CARD, MUTED, TITLE, PAGE } from '../components/ui';

// The student landing page. Two cards, then the note about the counter.
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ pending: 0, approved: 0 });

  useEffect(() => {
    axiosInstance.get('/api/loans/mine').then(({ data }) => {
      setCounts({
        pending: data.filter((l) => l.status === 'Pending').length,
        approved: data.filter((l) => l.status === 'Approved').length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { title: 'Find a headset', desc: 'Pick your date and see what is free', to: '/find' },
    { title: 'My loans', desc: `${counts.pending} pending, ${counts.approved} approved`, to: '/loans' },
  ];

  return (
    <Shell>
      <TopBar title={`Hi ${user?.name?.split(' ')[0] || ''}!`} role={user?.role} />
      <div className={PAGE}>
        {cards.map((c) => (
          <button key={c.to} type="button" onClick={() => navigate(c.to)}
            className={`${CARD} h-[102px] flex flex-col items-start justify-center gap-2 text-left`}>
            <span className={TITLE}>{c.title}</span>
            <span className={MUTED}>{c.desc}</span>
          </button>
        ))}
        <div className="flex-1" />
        <p className={`${MUTED} self-start`}>
          Headsets are lent by the day. Collect and return at the lab counter.
        </p>
      </div>
      <BottomNav />
    </Shell>
  );
};
export default Home;
