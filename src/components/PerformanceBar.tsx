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

const PerformanceBar = () => {
  const total = segments.reduce((s, seg) => s + seg.flex, 0);

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-1 h-7">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} rounded-md h-full flex items-center justify-center px-2 min-w-0`}
            style={{ flex: seg.flex }}
          >
            <span className="text-[10px] font-medium text-background truncate">
              {seg.label} {seg.duration}
            </span>
          </div>
        ))}
        <span className="ml-2 text-xs font-mono text-muted-foreground flex-shrink-0">
          {total.toFixed(1)}s
        </span>
      </div>
    </div>
  );
};

export default PerformanceBar;
