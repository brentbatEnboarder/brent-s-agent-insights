import { useState, useEffect, useRef } from 'react';

interface Segment {
  label: string;
  duration: string;
  color: string;
  flex: number;
}

const segments: Segment[] = [
  { label: 'understand', duration: '0.4s', color: 'bg-purple', flex: 0.4 },
  { label: 'tools', duration: '3.8s', color: 'bg-amber', flex: 3.8 },
  { label: 'think', duration: '18s', color: 'bg-violet', flex: 18 },
  { label: 'respond', duration: '6s', color: 'bg-cyan', flex: 6 },
];

const totalValue = segments.reduce((s, seg) => s + seg.flex, 0);

const PerformanceBar = ({ animate = true }: { animate?: boolean }) => {
  const [activeSegment, setActiveSegment] = useState(animate ? -1 : segments.length);
  const [displayTotal, setDisplayTotal] = useState(animate ? 0 : totalValue);
  const counterRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!animate) return;
    segments.forEach((_, i) => {
      setTimeout(() => setActiveSegment(i), i * 400);
    });
    const totalDuration = segments.length * 400;
    const steps = 40;
    let step = 0;
    counterRef.current = setInterval(() => {
      step++;
      setDisplayTotal(Math.min(totalValue, (totalValue * step) / steps));
      if (step >= steps) clearInterval(counterRef.current);
    }, totalDuration / steps);
    return () => clearInterval(counterRef.current);
  }, [animate]);

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-[2px] h-[6px]">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className={`${seg.color} rounded-sm h-full transition-all duration-400 ease-out`}
            style={{
              flex: i <= activeSegment ? seg.flex : 0,
              opacity: i <= activeSegment ? 0.85 : 0,
              width: i <= activeSegment ? undefined : 0,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          {segments.map((seg) => (
            <span key={seg.label} className="text-[10px] text-text-muted font-mono">
              <span className={`inline-block w-[6px] h-[6px] rounded-sm ${seg.color} mr-1.5 opacity-85 align-middle`} />
              {seg.label} {seg.duration}
            </span>
          ))}
        </div>
        <span className="text-[11px] font-mono text-text-secondary font-medium tabular-nums">
          {displayTotal.toFixed(1)}s
        </span>
      </div>
    </div>
  );
};

export default PerformanceBar;
