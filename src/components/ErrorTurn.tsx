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

const stackTrace = `Error: connect ETIMEDOUT 10.0.3.42:443
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1278:16)
    at DeployService.push (/app/src/deploy/service.ts:142:11)
    at async StagingPipeline.run (/app/src/pipeline/staging.ts:87:5)
    at async CommandHandler.execute (/app/src/handlers/deploy.ts:34:9)`;

const ErrorCard = () => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div
      className="rounded-md overflow-hidden flex"
      style={{
        animation: 'land-in 300ms ease-out both',
        boxShadow: 'inset 4px 0 12px -4px hsl(4 82% 63% / 0.2)',
      }}
    >
      <div className="w-[3px] bg-red-live flex-shrink-0" />
      <div className="flex-1 bg-red-live/[0.04] px-4 py-3.5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">❌</span>
          <span className="text-[13px] font-semibold text-red-live">Error</span>
        </div>
        <p className="text-[14px] text-foreground/85 leading-relaxed">
          Deployment failed: connection timed out
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-red-live text-[11px] opacity-80 hover:opacity-100 transition-opacity"
        >
          {showDetails ? '▾ hide details' : '▸ view details'}
        </button>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: showDetails ? '200px' : '0', opacity: showDetails ? 1 : 0 }}
        >
          <pre className="font-mono text-[11px] text-red-live/70 leading-[1.6] mt-1 p-3 rounded bg-red-live/[0.05] overflow-x-auto">
            {stackTrace}
          </pre>
        </div>
      </div>
    </div>
  );
};

interface ErrorTurnProps {
  startDelay: number;
  runKey: number;
}

export const ErrorTurn = ({ startDelay, runKey }: ErrorTurnProps) => {
  const [phase, setPhase] = useState<'idle' | 'user' | 'understand' | 'approval' | 'approved' | 'working' | 'error' | 'done'>('idle');
  const [tool, setTool] = useState<ToolState>(
    { icon: '💻', name: 'Bash', summary: '', visible: false, completed: false, finalTime: '3.0s', startedAt: null }
  );
  const [showLive, setShowLive] = useState(false);
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

  useEffect(() => {
    clearTimeouts();
    setPhase('idle');
    setTool({ icon: '💻', name: 'Bash', summary: '', visible: false, completed: false, finalTime: '3.0s', startedAt: null });
    setShowLive(false);
    setShowPerf(false);

    const t0 = startDelay;

    schedule(() => setPhase('user'), t0);
    schedule(() => setPhase('understand'), t0 + 300);
    schedule(() => setPhase('approval'), t0 + 800);
    schedule(() => setPhase('approved'), t0 + 2000);

    // Working + tool
    schedule(() => {
      setPhase('working');
      setShowLive(true);
      setTool(t => ({ ...t, visible: true, startedAt: Date.now(), summary: '→ npm run deploy' }));
    }, t0 + 2500);

    // Tool completes with error
    schedule(() => {
      setTool(t => ({ ...t, completed: true }));
      setShowLive(false);
      setPhase('error');
    }, t0 + 5500);

    // Perf bar
    schedule(() => {
      setShowPerf(true);
      setPhase('done');
    }, t0 + 6200);

    return clearTimeouts;
  }, [runKey, startDelay, clearTimeouts, schedule]);

  if (phase === 'idle') return null;

  return (
    <div
      className="rounded-lg bg-card border border-border overflow-hidden"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)', animation: 'fade-section 400ms ease-out both' }}
    >
      {/* User Message */}
      <div className="m-4 rounded-md overflow-hidden flex" style={{ boxShadow: 'inset 4px 0 12px -4px hsl(199 91% 64% / 0.12)', animation: 'land-in 300ms ease-out both' }}>
        <div className="w-[3px] bg-cyan flex-shrink-0" />
        <div className="flex-1 bg-secondary/30 px-4 py-3.5 flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <span className="text-[14px] mt-0.5">📱</span>
            <p className="text-[15px] text-foreground leading-relaxed">"Deploy the latest build to staging"</p>
          </div>
          <span className="text-[11px] font-mono text-text-muted flex-shrink-0 ml-4 mt-1">
            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">
        {/* Understanding */}
        {phase !== 'user' && (
          <section style={{ animation: 'fade-section 250ms ease-out both' }}>
            <PhaseHeader label="Understanding" visible />
            <div className="space-y-1.5 pl-1">
              <p className="text-[12px]"><span className="text-purple">🟣 Classified: consequential · matched rule: deploy</span></p>
            </div>
          </section>
        )}

        {/* Approval */}
        {(phase === 'approval' || phase === 'approved') && (
          <section style={{ animation: 'fade-section 250ms ease-out both' }}>
            <PhaseHeader label="Authorization" visible />
            <div className="pl-1">
              {phase === 'approval' ? (
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-amber">⏳ Awaiting approval</span>
                  <div className="flex gap-2 ml-2">
                    <button className="px-3 py-1 rounded-md bg-green/15 text-green text-[11px] font-medium border border-green/20">
                      ✓ Approve
                    </button>
                    <button className="px-3 py-1 rounded-md bg-red-live/10 text-red-live text-[11px] font-medium border border-red-live/15">
                      ✗ Deny
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-green">✓ Approved by user</p>
              )}
            </div>
          </section>
        )}

        {/* Working */}
        {(['working', 'error', 'done'].includes(phase)) && (
          <section style={{ animation: 'fade-section 250ms ease-out both' }}>
            <PhaseHeader label="Working" visible>
              {showLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-live/10 text-red-live text-[10px] font-semibold animate-live-pulse">
                  ● LIVE
                </span>
              )}
            </PhaseHeader>
            <div className="relative pl-5">
              <div className="absolute left-[9px] top-2 w-px bg-divider" style={{ height: 'calc(100% - 16px)' }} />
              {tool.visible && (
                <div
                  className="relative flex items-start gap-3 rounded-md px-2.5 py-2 -mx-2.5"
                  style={{
                    animation: `slide-in-left 250ms ease-out both${!tool.completed ? ', amber-glow 2.5s ease-in-out infinite' : ''}`,
                  }}
                >
                  <div className={`absolute -left-[9px] top-3 w-[7px] h-[7px] rounded-full transition-colors duration-300 ${!tool.completed ? 'bg-amber' : 'bg-red-live'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px]">
                        <span className="mr-1.5">{tool.icon}</span>
                        <span className="font-mono text-[13px] font-semibold text-amber">{tool.name}</span>
                      </span>
                      {!tool.completed && tool.startedAt ? (
                        <ToolCounter startedAt={tool.startedAt} />
                      ) : (
                        <span className="text-[11px] font-mono text-text-muted bg-secondary/60 px-2 py-0.5 rounded font-medium">{tool.finalTime}</span>
                      )}
                    </div>
                    {tool.summary && <p className="font-mono text-[12px] text-text-secondary mt-0.5 pl-6">{tool.summary}</p>}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Error */}
        {(['error', 'done'].includes(phase)) && <ErrorCard />}

        {/* Perf bar */}
        {showPerf && (
          <PerformanceBar
            animate
            segments={[
              { label: 'understand', duration: '0.3s', color: 'bg-purple', flex: 0.3 },
              { label: 'approval', duration: '1.2s', color: 'bg-amber', flex: 1.2 },
              { label: 'tools', duration: '3.0s', color: 'bg-amber', flex: 3.0 },
              { label: 'error', duration: '0.1s', color: 'bg-red-live', flex: 0.4 },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ErrorTurn;
