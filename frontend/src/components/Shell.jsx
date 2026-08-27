// The 390 x 812 frame from Figma, centred on wider screens.
const Shell = ({ children }) => (
  <div className="min-h-screen w-full flex justify-center bg-[#bebebe]">
    <div className="w-[390px] min-h-screen flex flex-col
      bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(190,190,190,1)_100%)]">
      {children}
    </div>
  </div>
);
export default Shell;
