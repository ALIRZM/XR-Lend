// One component, six variants, straight from the LoanStatus enumeration
const styles = {
  Pending:   'text-[#8F5A00] bg-[#FBF1DF]',
  Approved:  'text-[#1C6440] bg-[#E7F2EB]',
  Rejected:  'text-[#9C2E26] bg-[#F9EBE9]',
  Cancelled: 'text-[#5F6468] bg-[#EEEFEE]',
  Collected: 'text-[#1A5793] bg-[#E7EFF7]',
  Returned:  'text-[#414B58] bg-[#EBEDF1]',
  Available: 'text-[#1C6440] bg-[#E7F2EB]',
};

const StatusChip = ({ status }) => (
  <span className={`font-mono text-[11px] tracking-[0.05em] uppercase px-2 py-1 rounded ${
    styles[status] || styles.Cancelled}`}>
    {status}
  </span>
);

export default StatusChip;
