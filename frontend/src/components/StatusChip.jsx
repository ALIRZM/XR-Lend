// One chip, one variant per status. Colours taken from the Figma file.
const styles = {
  Pending:     'bg-[#fbf1df] text-[#8f5a00]',
  Approved:    'bg-[#e7f2eb] text-[#1c6440]',
  Rejected:    'bg-[#f9ebe9] text-[#9c2e26]',
  Cancelled:   'bg-[#f1f1f1] text-[#555555]',
  Collected:   'bg-[#e7eff7] text-[#1a5793]',
  Returned:    'bg-[#f1f1f1] text-[#555555]',
  Available:   'bg-[#e7f2eb] text-[#1c6440]',
  Maintenance: 'bg-[#fbf1df] text-[#8f5a00]',
  Retired:     'bg-[#f1f1f1] text-[#555555]',
};
const StatusChip = ({ status }) => (
  <div className={`rounded-lg px-3 py-[3px] whitespace-nowrap ${styles[status] || styles.Cancelled}`}>
    <span className="text-base text-center">{status}</span>
  </div>
);
export default StatusChip;
