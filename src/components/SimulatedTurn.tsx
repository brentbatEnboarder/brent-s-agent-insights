import { useState, useEffect, useRef, useCallback } from 'react';
import PerformanceBar from './PerformanceBar';

interface ToolState {
  icon: string;
  name: string;
  summary: string;
  visible: boolean;
  completed: boolean;
  finalTime: string;
  startedAt: number | null;
}

const PhaseHeader = ({ label, children, visible }: { label: string; children?: React.ReactNode; visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="flex items-center gap-3 mb-3" style={{ animation: 'fade-section 300ms ease-out both' }}>
      <span className="flex-1 h-px bg-divider" />
      <span className="text-[11px] uppercase tracking-[2px] text-text-muted font-semibold select-none">{label}</span>
      {children}
      <span className="flex-1 h-px bg-divider" />
    </div>
  );
};

const ToolCounter = ({ startedAt }: { startedAt: number }) => {
  const [display, setDisplay] = useState('0.0');
  useEffect(() => {
    const id = setInterval(() => {
      setDisplay(((Date.now() - startedAt) / 1000).toFixed(1));
    }, 100);
    return () => clearInterval(id);
  }, [startedAt]);
  return (
    <span className="text-[11px] font-mono text-text-muted bg-secondary/60 px-2 py-0.5 rounded font-medium tabular-nums">
      {display}s
    </span>
  );
};

const responseText = `The API migration is progressing well. Based on the recent commits, the team has completed the v2 endpoint refactoring and the new authentication middleware is in place. The migration script for legacy data has been tested against staging and is ready for the production cutover scheduled for next Thursday. There are two remaining edge cases around pagination in the /users endpoint that need attention before the final deploy.`;

interface SimulatedTurnProps {
  runKey: number; // change this to re-run
}

const SimulatedTurn = ({ runKey }: SimulatedTurnProps) => {
  const [phase, setPhase] = useState<'idle' | 'user' | 'understand' | 'working' | 'thinking' | 'response' | 'done'>('idle');
  const [tools, setTools] = useState<ToolState[]>([
    { icon: '🔍', name: 'ToolSearch', summary: '', visible: false, completed: false, finalTime: '1.2s', startedAt: null },
    { icon: '💻', name: 'Bash', summary: '', visible: false, completed: false, finalTime: '2.5s', startedAt: null },
    { icon: '📄', name: 'Read', summary: '', visible: false, completed: false, finalTime: '0.7s', startedAt: null },
  ]);
  const [showLive, setShowLive] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showPerf, setShowPerf] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  const updateTool = useCallback((index: number, update: Partial<ToolState>) => {
    setTools(prev => prev.map((t, i) => i === index ? { ...t, ...update } : t));
  }, []);

  useEffect(() => {
    clearTimeouts();
    // Reset state
    setPhase('idle');
    setTools([
      { icon: '🔍', name: 'ToolSearch', summary: '', visible: false, completed: false, finalTime: '1.2s', startedAt: null },
      { icon: '💻', name: 'Bash', summary: '', visible: false, completed: false, finalTime: '2.5s', startedAt: null },
      { icon: '📄', name: 'Read', summary: '', visible: false, completed: false, finalTime: '0.7s', startedAt: null },
    ]);
    setShowLive(false);
    setShowThinking(false);
    setShowResponse(false);
    setShowPerf(false);

    const t0 = 2000; // initial delay

    // Step 1: User message
    schedule(() => setPhase('user'), t0);

    // Step 2: Understanding
    schedule(() => setPhase('understand'), t0 + 300);

    // Step 3: Working + first tool
    schedule(() => {
      setPhase('working');
      setShowLive(true);
      updateTool(0, { visible: true, startedAt: Date.now() });
    }, t0 + 1000);

    // Step 4: ToolSearch completes
    schedule(() => {
      updateTool(0, { completed: true, summary: '→ found Bash tool' });
    }, t0 + 2200);

    // Step 5: Bash starts
    schedule(() => {
      updateTool(1, { visible: true, startedAt: Date.now(), summary: '→ git log --oneline -5' });
    }, t0 + 2500);

    // Step 6: Bash completes
    schedule(() => {
      updateTool(1, { completed: true, summary: '→ 5 recent commits' });
    }, t0 + 5000);

    // Step 7: Read starts
    schedule(() => {
      updateTool(2, { visible: true, startedAt: Date.now(), summary: '→ src/api/migration.ts' });
    }, t0 + 5300);

    // Step 8: Read completes, LIVE off
    schedule(() => {
      updateTool(2, { completed: true });
      setShowLive(false);
    }, t0 + 6000);

    // Step 9: Thinking dots
    schedule(() => {
      setShowThinking(true);
    }, t0 + 6500);

    // Step 10: Response
    schedule(() => {
      setShowThinking(false);
      setShowResponse(true);
    }, t0 + 12000);

    // Step 11: Performance bar
    schedule(() => {
      setShowPerf(true);
      setPhase('done');
    }, t0 + 13000);

    return clearTimeouts;
  }, [runKey, clearTimeouts, schedule, updateTool]);

  if (phase === 'idle') return null;

  const visibleToolCount = tools.filter(t => t.visible).length;

  return (
    <div
      className="rounded-lg bg-card border border-border overflow-hidden"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)', animation: 'fade-section 400ms ease-out both' }}
    >
      {/* User Message */}
      <div
        className="m-4 rounded-md overflow-hidden flex"
        style={{ boxShadow: 'inset 4px 0 12px -4px hsl(199 91% 64% / 0.12)', animation: 'land-in 300ms ease-out both' }}
      >
        <div className="w-[3px] bg-cyan flex-shrink-0" />
        <div className="flex-1 bg-secondary/30 px-4 py-3.5 flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <span className="text-[14px] mt-0.5">📱</span>
            <p className="text-[15px] text-foreground leading-relaxed">"What's the status of the API migration?"</p>
          </div>
          <span className="text-[11px] font-mono text-text-muted flex-shrink-0 ml-4 mt-1">
            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">
        {/* Understanding */}
        {(phase !== 'user') && (
          <section style={{ animation: 'fade-section 250ms ease-out both' }}>
            <PhaseHeader label="Understanding" visible />
            <div className="space-y-1.5 pl-1">
              <p className="text-[12px]"><span className="text-purple">🟣 Classified: safe · matched rule: status</span></p>
              <p className="text-[12px]">
                <span className="text-green">🟢 2 memories loaded</span>
                <button className="ml-2 text-cyan text-[11px] hover:underline opacity-80 hover:opacity-100 transition-opacity">▸ view context</button>
              </p>
            </div>
          </section>
        )}

        {/* Working */}
        {(['working', 'thinking', 'response', 'done'].includes(phase)) && (
          <section style={{ animation: 'fade-section 250ms ease-out both' }}>
            <PhaseHeader label="Working" visible>
              {showLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-live/10 text-red-live text-[10px] font-semibold animate-live-pulse">
                  ● LIVE
                </span>
              )}
            </PhaseHeader>

            <div className="relative pl-5">
              <div
                className="absolute left-[9px] top-2 w-px bg-divider origin-top transition-all duration-500 ease-out"
                style={{
                  height: visibleToolCount === 0 ? 0 : `calc(100% - 16px)`,
                  opacity: visibleToolCount === 0 ? 0 : 1,
                }}
              />

              <div className="space-y-3">
                {tools.map((tool, i) => {
                  if (!tool.visible) return null;
                  const isActive = !tool.completed;
                  return (
                    <div
                      key={i}
                      className="relative flex items-start gap-3 rounded-md px-2.5 py-2 -mx-2.5"
                      style={{
                        animation: `slide-in-left 250ms ease-out both${isActive ? ', amber-glow 2.5s ease-in-out infinite' : ''}`,
                      }}
                    >
                      <div className={`absolute -left-[9px] top-3 w-[7px] h-[7px] rounded-full transition-colors duration-300 ${isActive ? 'bg-amber' : 'bg-divider'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px]">
                            <span className="mr-1.5">{tool.icon}</span>
                            <span className="font-mono text-[13px] font-semibold text-amber">{tool.name}</span>
                          </span>
                          {isActive && tool.startedAt ? (
                            <ToolCounter startedAt={tool.startedAt} />
                          ) : (
                            <span className="text-[11px] font-mono text-text-muted bg-secondary/60 px-2 py-0.5 rounded font-medium">{tool.finalTime}</span>
                          )}
                        </div>
                        {tool.summary && (
                          <p className="font-mono text-[12px] text-text-secondary mt-0.5 pl-6">{tool.summary}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showThinking && (
                <div className="mt-4 pl-2 dot-wave flex items-center" style={{ animation: 'fade-section 300ms ease-out both' }}>
                  <span className="inline-block w-[5px] h-[5px] rounded-full bg-cyan mx-[3px]" />
                  <span className="inline-block w-[5px] h-[5px] rounded-full bg-cyan mx-[3px]" />
                  <span className="inline-block w-[5px] h-[5px] rounded-full bg-cyan mx-[3px]" />
                  <span className="text-[12px] text-text-secondary ml-2">thinking...</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Agent Response */}
        {showResponse && (
          <div
            className="rounded-md overflow-hidden flex"
            style={{
              animation: 'land-in 300ms ease-out both',
              boxShadow: 'inset 4px 0 12px -4px hsl(207 72% 68% / 0.12)',
            }}
          >
            <div className="w-[3px] bg-cyan-agent flex-shrink-0" />
            <div className="flex-1 bg-secondary/30 px-4 py-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="text-[14px] mt-0.5">🤖</span>
                  <div className="space-y-2">
                    <p className="text-[14px] leading-[1.7] text-foreground/85">
                      {responseText}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-text-muted flex-shrink-0 ml-4 mt-1">
                  {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        )}

        {showPerf && (
          <PerformanceBar
            animate
            segments={[
              { label: 'understand', duration: '0.3s', color: 'bg-purple', flex: 0.3 },
              { label: 'tools', duration: '5.7s', color: 'bg-amber', flex: 5.7 },
              { label: 'think', duration: '5.5s', color: 'bg-violet', flex: 5.5 },
              { label: 'respond', duration: '1.5s', color: 'bg-cyan', flex: 1.5 },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default SimulatedTurn;
