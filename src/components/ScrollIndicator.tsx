export function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none flex flex-col items-center gap-3 text-ivory/80"
      aria-hidden
    >
      <span className="text-eyebrow text-[0.65rem] text-ivory/70">Scorri</span>
      <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
        <span className="scroll-line absolute left-0 top-0 block h-full w-full bg-ivory" />
      </span>
      <style>{`
        @keyframes scroll-line {
          0%   { transform: translateY(-100%); }
          50%  { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
        .scroll-line {
          animation: scroll-line 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </div>
  );
}
