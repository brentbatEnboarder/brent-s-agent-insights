import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DisconnectOverlayProps {
  active: boolean;
  onReconnected: () => void;
}

const DisconnectOverlay = ({ active, onReconnected }: DisconnectOverlayProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const id = setTimeout(() => {
        setVisible(false);
        onReconnected();
      }, 4000);
      return () => clearTimeout(id);
    } else {
      setVisible(false);
    }
  }, [active, onReconnected]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ animation: 'fade-section 300ms ease-out both' }}>
      <div className="bg-background/90 backdrop-blur-md border-t border-border px-6 py-4 flex items-center justify-center gap-3">
        <Loader2 size={14} className="text-red-live animate-spin" />
        <span className="text-[13px] text-text-secondary">Connection lost — reconnecting…</span>
      </div>
    </div>
  );
};

export default DisconnectOverlay;
