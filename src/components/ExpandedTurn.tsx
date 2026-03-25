import { useState, useEffect, useRef } from 'react';
import PerformanceBar from './PerformanceBar';

const toolCalls = [
  { icon: '🔍', name: 'ToolSearch', summary: '→ found semantic_search', time: '1.1s', active: false },
  { icon: '🧠', name: 'semantic_search', summary: '→ hospital project query → 3 results', time: '2.4s', active: false },
  { icon: '📄', name: 'Read', summary: '→ hospital-brief.md (847 lines)', time: '', active: true },
];

const PhaseHeader = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="flex-1 h-px bg-divider" />
    <span className="text-[11px] uppercase tracking-[2px] text-text-muted font-semibold select-none">{label}</span>
    {children}
    <span className="flex-1 h-px bg-divider" />
  </div>
);

const LiveCounter = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 100);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[11px] font-mono text-text-muted bg-secondary/60 px-2 py-0.5 rounded font-medium tabular-nums">
      {(count / 10).toFixed(1)}s
    </span>
  );
};

const ExpandedTurn = () => {
  const [visibleTools, setVisibleTools] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    toolCalls.forEach((_, i) => {
      setTimeout(() => setVisibleTools(i + 1), 800 * (i + 1));
    });
    setTimeout(() => setShowResponse(true), 800 * toolCalls.length + 600);
  }, []);

  return (
    <div
      className="rounded-lg bg-card border border-border overflow-hidden"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
    >
      {/* User Message */}
      <div className="m-4 rounded-md overflow-hidden flex" style={{ boxShadow: 'inset 4px 0 12px -4px hsl(199 91% 64% / 0.12)' }}>
        <div className="w-[3px] bg-cyan flex-shrink-0" />
        <div className="flex-1 bg-secondary/30 px-4 py-3.5 flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <span className="text-[14px] mt-0.5">📱</span>
            <p className="text-[15px] text-foreground leading-relaxed">"What can you tell me about the hospital project?"</p>
          </div>
          <span className="text-[11px] font-mono text-text-muted flex-shrink-0 ml-4 mt-1">11:38:03</span>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">
        {/* Understanding */}
        <section>
          <PhaseHeader label="Understanding" />
          <div className="space-y-1.5 pl-1">
            <p className="text-[12px]"><span className="text-purple">🟣 Classified: safe · matched rule: what</span></p>
            <p className="text-[12px]">
              <span className="text-green">🟢 4 memories loaded</span>
              <button className="ml-2 text-cyan text-[11px] hover:underline opacity-80 hover:opacity-100 transition-opacity">▸ view context</button>
            </p>
          </div>
        </section>

        {/* Working */}
        <section>
          <PhaseHeader label="Working">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-live/10 text-red-live text-[10px] font-semibold animate-live-pulse">
              ● LIVE
            </span>
          </PhaseHeader>

          <div className="relative pl-5">
            <div
              className="absolute left-[9px] top-2 w-px bg-divider origin-top transition-all duration-500 ease-out"
              style={{
                height: visibleTools === 0 ? 0 : `calc(100% - 16px)`,
                opacity: visibleTools === 0 ? 0 : 1,
              }}
            />

            <div className="space-y-3">
              {toolCalls.map((tool, i) => {
                if (i >= visibleTools) return null;
                const isActive = tool.active;
                return (
                  <div
                    key={i}
                    className="relative flex items-start gap-3 rounded-md px-2.5 py-2 -mx-2.5"
                    style={{
                      animation: `slide-in-left 250ms ease-out both${isActive ? ', amber-glow 2.5s ease-in-out infinite' : ''}`,
                    }}
                  >
                    <div className={`absolute -left-[9px] top-3 w-[7px] h-[7px] rounded-full ${isActive ? 'bg-amber' : 'bg-divider'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px]">
                          <span className="mr-1.5">{tool.icon}</span>
                          <span className="font-mono text-[13px] font-semibold text-amber">{tool.name}</span>
                        </span>
                        {isActive ? <LiveCounter /> : (
                          <span className="text-[11px] font-mono text-text-muted bg-secondary/60 px-2 py-0.5 rounded font-medium">{tool.time}</span>
                        )}
                      </div>
                      <p className="font-mono text-[12px] text-text-secondary mt-0.5 pl-6">{tool.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleTools >= toolCalls.length && (
              <div className="mt-4 pl-2 dot-wave flex items-center">
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-cyan mx-[3px]" />
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-cyan mx-[3px]" />
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-cyan mx-[3px]" />
                <span className="text-[12px] text-text-secondary ml-2">thinking...</span>
              </div>
            )}
          </div>
        </section>

        {/* Reasoning */}
        <section>
          <PhaseHeader label="Reasoning" />
          <button className="text-cyan text-[11px] hover:underline pl-1 opacity-80 hover:opacity-100 transition-opacity">▸ view thinking</button>
        </section>

        {/* Agent Response */}
        <div
          className="rounded-md overflow-hidden flex"
          style={{
            animation: showResponse ? 'land-in 300ms ease-out both' : 'none',
            opacity: showResponse ? undefined : 0,
            boxShadow: 'inset 4px 0 12px -4px hsl(207 72% 68% / 0.12)',
          }}
        >
          <div className="w-[3px] bg-cyan-agent flex-shrink-0" />
          <div className="flex-1 bg-secondary/30 px-4 py-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-[14px] mt-0.5">🤖</span>
                <div className="space-y-2">
                  <h2 className="text-[15px] font-semibold text-foreground">What It Is</h2>
                  <p className="text-[14px] leading-[1.7] text-foreground/85">
                    The Hospital Project is a large-scale digital transformation initiative aimed at modernizing
                    patient records management across three regional facilities. It was kicked off in Q2 2024 and
                    involves migrating legacy HL7v2 interfaces to FHIR R4, deploying a new patient portal, and
                    integrating real-time bed-management dashboards. The project is currently in Phase 2 (of 4),
                    with an expected completion date of March 2026.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-text-muted flex-shrink-0 ml-4 mt-1">11:38:31</span>
            </div>
          </div>
        </div>

        <PerformanceBar animate={showResponse} />
      </div>
    </div>
  );
};

export default ExpandedTurn;
