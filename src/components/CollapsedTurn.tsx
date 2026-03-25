import { useState } from 'react';

interface CollapsedTurnProps {
  userMessage: string;
  agentResponse: string;
  toolCount: number;
  duration: string;
}

const CollapsedTurn = ({ userMessage, agentResponse, toolCount, duration }: CollapsedTurnProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg bg-card border border-border overflow-hidden transition-all duration-300"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
    >
      <div
        className="flex items-center cursor-pointer transition-colors hover:bg-secondary/30"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Left muted border accent */}
        <div className="w-[2px] self-stretch bg-divider flex-shrink-0" />
        <div className="flex-1 px-4 py-3.5 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-[13px]">📱</span>
            <span className="text-[13px] text-text-secondary truncate">&quot;{userMessage}&quot;</span>
            <span className="text-text-muted text-[13px]">→</span>
            <span className="text-[13px]">🤖</span>
            <span className="text-[13px] text-text-secondary truncate">&quot;{agentResponse}&quot;</span>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <span className="text-[11px] font-mono text-text-muted font-medium">{toolCount} tool{toolCount !== 1 ? 's' : ''} · {duration}</span>
            <span className={`text-text-muted text-[11px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▾</span>
          </div>
        </div>
      </div>

      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? '400px' : '0', opacity: expanded ? 1 : 0 }}
      >
        <div className="px-5 pb-4 pt-2 border-t border-border space-y-2">
          <div className="border-l-[3px] border-l-cyan rounded-md bg-secondary/30 px-4 py-3">
            <p className="text-[13px] text-text-secondary">{agentResponse}</p>
          </div>
          <div className="flex justify-end">
            <span className="text-[11px] font-mono text-text-muted">{duration} total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsedTurn;
