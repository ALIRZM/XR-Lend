import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Shell from '../components/Shell';
import TopBar from '../components/TopBar';
import StatusChip from '../components/StatusChip';
import { BTN, BTN_ALT, CARD, MUTED, TITLE, OKBOX } from '../components/ui';

const pretty = (d) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });

const RequestSent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.loan) return <Navigate to="/find" replace />;
  const { loan, headset } = state;

  return (
    <Shell>
      <TopBar title="Request sent" role={user?.role} />
      <div className="flex-1 mx-[17px] flex flex-col items-center gap-[11px] py-[101px]">
        <div className={OKBOX} role="status">
          Request Sent! Wait for a technician to response
        </div>

        <div className={`${CARD} flex items-start gap-2.5`}>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <span className={TITLE}>{headset.model}</span>
            <span className={MUTED}>
              {headset.assetTag}&nbsp;&nbsp;.&nbsp;&nbsp;{pretty(loan.startDate)} - {pretty(loan.endDate)}
            </span>
          </div>
          <StatusChip status={loan.status} />
        </div>

        <button type="button" onClick={() => navigate('/loans')} className={BTN}>See my loans</button>
        <button type="button" onClick={() => navigate('/find')} className={BTN_ALT}>Find another headset</button>
      </div>
    </Shell>
  );
};
export default RequestSent;
