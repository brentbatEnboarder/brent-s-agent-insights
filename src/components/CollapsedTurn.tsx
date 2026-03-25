interface CollapsedTurnProps {
  userMessage: string;
  agentResponse: string;
  toolCount: number;
  duration: string;
}

const CollapsedTurn = ({ userMessage, agentResponse, toolCount, duration }: CollapsedTurnProps) => (
  <div className="group rounded-lg bg-card/60 border border-border/50 px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors opacity-70 hover:opacity-90">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <span className="text-sm">📱</span>
      <span className="text-sm text-foreground truncate">&quot;{userMessage}&quot;</span>
      <span className="text-muted-foreground text-sm">→</span>
      <span className="text-sm">🤖</span>
      <span className="text-sm text-muted-foreground truncate">&quot;{agentResponse}&quot;</span>
    </div>
    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
      <span className="text-xs font-mono text-muted-foreground">{toolCount} tool{toolCount !== 1 ? 's' : ''} · {duration}</span>
      <span className="text-muted-foreground text-xs">▾</span>
    </div>
  </div>
);

export default CollapsedTurn;
