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

interface PerformanceBarProps {
  animate?: boolean;
}

const PerformanceBar = ({ animate = true }: PerformanceBarProps) => {
  const [activeSegment, setActiveSegment] = useState(animate ? -1 : segments.length);
  const [displayTotal, setDisplayTotal] = useState(animate ? 0 : totalValue);
  const counterRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!animate) return;

    // Stagger segment reveals — each takes 400ms, sequential
    segments.forEach((_, i) => {
      setTimeout(() => setActiveSegment(i), i * 400);
    });

    // Count up total
    const totalDuration = segments.length * 400; // time to reveal all
    const steps = 40;
    const stepTime = totalDuration / steps;
    let step = 0;
    counterRef.current = setInterval(() => {
      step++;
      setDisplayTotal(Math.min(totalValue, (totalValue * step) / steps));
      if (step >= steps) clearInterval(counterRef.current);
    }, stepTime);

    return () => clearInterval(counterRef.current);
  }, [animate]);

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-1 h-7">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className={`${seg.color} rounded-md h-full flex items-center justify-center px-2 min-w-0 overflow-hidden transition-all duration-400 ease-out`}
            style={{
              flex: i <= activeSegment ? seg.flex : 0,
              opacity: i <= activeSegment ? 1 : 0,
              width: i <= activeSegment ? undefined : 0,
              padding: i <= activeSegment ? undefined : 0,
            }}
          >
            <span className="text-[10px] font-medium text-background truncate whitespace-nowrap">
              {seg.label} {seg.duration}
            </span>
          </div>
        ))}
        <span className="ml-2 text-xs font-mono text-muted-foreground flex-shrink-0 tabular-nums">
          {displayTotal.toFixed(1)}s
        </span>
      </div>
    </div>
  );
};

export default PerformanceBar;
