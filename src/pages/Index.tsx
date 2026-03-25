import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import CollapsedTurn from '@/components/CollapsedTurn';
import SimulatedTurn from '@/components/SimulatedTurn';
import { ErrorTurn } from '@/components/ErrorTurn';
import DisconnectOverlay from '@/components/DisconnectOverlay';

const Index = () => {
  const [simKey, setSimKey] = useState(0);
  const [connected, setConnected] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleReplay = useCallback(() => {
    setSimKey(k => k + 1);
  }, []);

  const handleDisconnect = useCallback(() => {
    if (disconnecting) return;
    setConnected(false);
    setDisconnecting(true);
  }, [disconnecting]);

  const handleReconnected = useCallback(() => {
    setConnected(true);
    setDisconnecting(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onReplay={handleReplay} onDisconnect={handleDisconnect} connected={connected} />
      <main className="pt-16 pb-16 px-4 max-w-4xl mx-auto space-y-3">
        <CollapsedTurn
          userMessage="Check my calendar for today"
          agentResponse="You have 3 meetings…"
          toolCount={3}
          duration="12.4s"
        />
        <CollapsedTurn
          userMessage="What about tomorrow?"
          agentResponse="Tomorrow looks clear…"
          toolCount={1}
          duration="8.1s"
        />
        <SimulatedTurn key={`sim-${simKey}`} runKey={simKey} />
        <ErrorTurn key={`err-${simKey}`} runKey={simKey} startDelay={16000} />
      </main>
      <DisconnectOverlay active={disconnecting} onReconnected={handleReconnected} />
    </div>
  );
};

export default Index;
