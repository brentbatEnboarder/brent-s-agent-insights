import { useState, useEffect, useRef } from 'react';
import PerformanceBar from './PerformanceBar';

const toolCalls = [
  { icon: '🔍', name: 'ToolSearch', color: 'text-amber', summary: '→ found semantic_search', time: '1.1s', active: false },
  { icon: '🧠', name: 'semantic_search', color: 'text-cyan', summary: '→ hospital project query → 3 results', time: '2.4s', active: false },
  { icon: '📄', name: 'Read', color: 'text-foreground', summary: '→ hospital-brief.md (847 lines)', time: '', active: true },
];

const LiveCounter = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 100);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[10px] font-mono text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded tabular-nums">
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
    // Stagger tool appearances by 800ms
    toolCalls.forEach((_, i) => {
      setTimeout(() => setVisibleTools(i + 1), 800 * (i + 1));
    });
    // Show response after tools
    setTimeout(() => setShowResponse(true), 800 * toolCalls.length + 600);
  }, []);

  return (
    <div className="rounded-xl bg-card border border-border/70 overflow-hidden">
      {/* User Message */}
      <div className="border-l-[3px] border-l-cyan m-4 rounded-lg bg-secondary/50 px-5 py-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-sm mt-0.5">📱</span>
          <p className="text-sm text-foreground">"What can you tell me about the hospital project?"</p>
        </div>
        <span className="text-xs font-mono text-muted-foreground flex-shrink-0 ml-4 mt-0.5">11:38:03</span>
      </div>

      <div className="px-6 pb-6 space-y-5">
        {/* Understanding */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex-1 h-px bg-border/50" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Understanding</span>
            <span className="flex-1 h-px bg-border/50" />
          </div>
          <div className="space-y-1.5 pl-1">
            <p className="text-xs"><span className="text-purple">🟣 Classified: safe · matched rule: what</span></p>
            <p className="text-xs">
              <span className="text-green">🟢 4 memories loaded</span>
              <button className="ml-2 text-cyan text-[11px] hover:underline">▸ view context</button>
            </p>
          </div>
        </section>

        {/* Working */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex-1 h-px bg-border/50" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Working</span>
            <span className="ml-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-live/15 text-red-live text-[10px] font-semibold animate-live-pulse">
              🔴 LIVE
            </span>
            <span className="flex-1 h-px bg-border/50" />
          </div>

          <div className="relative pl-5">
            {/* Connecting line — grows as tools appear */}
            <div
              className="absolute left-[9px] top-2 w-px bg-border/60 origin-top transition-all duration-500 ease-out"
              style={{
                height: visibleTools === 0 ? 0 : `calc(100% - 16px)`,
                opacity: visibleTools === 0 ? 0 : 1,
              }}
            />

            <div className="space-y-4">
              {toolCalls.map((tool, i) => {
                if (i >= visibleTools) return null;
                const isActive = tool.active;
                return (
                  <div
                    key={i}
                    className={`relative flex items-start gap-3 rounded-md px-2 py-1.5 -mx-2 ${isActive ? 'animate-amber-glow' : ''}`}
                    style={{
                      animation: `slide-in-left 250ms ease-out both${isActive ? ', amber-glow 2.5s ease-in-out infinite' : ''}`,
                    }}
                  >
                    <div className={`absolute -left-[9px] top-2.5 w-2 h-2 rounded-full border-2 ${isActive ? 'bg-amber border-amber/60' : 'bg-secondary border-muted-foreground/40'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">
                          <span className="mr-1.5">{tool.icon}</span>
                          <span className={`font-semibold ${tool.color}`}>{tool.name}</span>
                        </span>
                        {isActive ? (
                          <LiveCounter />
                        ) : (
                          <span className="text-[10px] font-mono text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">{tool.time}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 pl-6">{tool.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Thinking dots — wave animation */}
            {visibleTools >= toolCalls.length && (
              <div className="mt-4 pl-2 dot-wave flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan mx-0.5" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan mx-0.5" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan mx-0.5" />
                <span className="text-xs text-muted-foreground ml-2">thinking...</span>
              </div>
            )}
          </div>
        </section>

        {/* Reasoning */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex-1 h-px bg-border/50" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Reasoning</span>
            <span className="flex-1 h-px bg-border/50" />
          </div>
          <button className="text-cyan text-[11px] hover:underline pl-1">▸ view thinking</button>
        </section>

        {/* Agent Response — landing animation */}
        <div
          className="border-l-[3px] border-l-cyan-dim rounded-lg bg-secondary/50 px-5 py-4"
          style={{
            animation: showResponse ? 'land-in 300ms ease-out both' : 'none',
            opacity: showResponse ? undefined : 0,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-sm mt-0.5">🤖</span>
              <div className="text-sm text-foreground space-y-2">
                <h2 className="text-base font-semibold text-foreground">What It Is</h2>
                <p className="text-sm leading-relaxed text-foreground/85">
                  The Hospital Project is a large-scale digital transformation initiative aimed at modernizing
                  patient records management across three regional facilities. It was kicked off in Q2 2024 and
                  involves migrating legacy HL7v2 interfaces to FHIR R4, deploying a new patient portal, and
                  integrating real-time bed-management dashboards. The project is currently in Phase 2 (of 4),
                  with an expected completion date of March 2026.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground flex-shrink-0 ml-4 mt-0.5">11:38:31</span>
          </div>
        </div>

        <PerformanceBar animate={showResponse} />
      </div>
    </div>
  );
};

export default ExpandedTurn;
