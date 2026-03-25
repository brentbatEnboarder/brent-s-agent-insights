import { useState } from 'react';

interface TurnData {
  userMessage: string;
  agentResponse: string;
  toolCount: number;
  duration: string;
}

interface CollapsedTurnProps extends TurnData {
  expandedContent?: React.ReactNode;
}

const CollapsedTurn = ({ userMessage, agentResponse, toolCount, duration }: CollapsedTurnProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg bg-card/60 border border-border/50 overflow-hidden transition-all duration-300">
      <div
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors opacity-70 hover:opacity-90"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-sm">📱</span>
          <span className="text-sm text-foreground truncate">&quot;{userMessage}&quot;</span>
          <span className="text-muted-foreground text-sm">→</span>
          <span className="text-sm">🤖</span>
          <span className="text-sm text-muted-foreground truncate">&quot;{agentResponse}&quot;</span>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className="text-xs font-mono text-muted-foreground">{toolCount} tool{toolCount !== 1 ? 's' : ''} · {duration}</span>
          <span className={`text-muted-foreground text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </div>

      {/* Expandable content area */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: expanded ? '400px' : '0',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="px-5 pb-4 pt-1 border-t border-border/30 space-y-2">
          <div className="border-l-[3px] border-l-cyan rounded-md bg-secondary/40 px-4 py-3">
            <p className="text-sm text-foreground/85">{agentResponse}</p>
          </div>
          <div className="flex justify-end">
            <span className="text-[10px] font-mono text-muted-foreground">{duration} total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsedTurn;
