import { RotateCcw, Unplug } from 'lucide-react';

interface HeaderProps {
  onReplay?: () => void;
  onDisconnect?: () => void;
  connected?: boolean;
}

const Header = ({ onReplay, onDisconnect, connected = true }: HeaderProps) => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background/95 backdrop-blur-md border-b border-border">
    <h1 className="text-[16px] font-semibold tracking-tight text-foreground">
      🧠 BrentsOCTypeAgent
    </h1>
    <div className="flex items-center gap-3">
      {onReplay && (
        <button
          onClick={onReplay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/80 text-text-secondary text-[12px] font-medium hover:text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw size={13} />
          Replay
        </button>
      )}
      {onDisconnect && (
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/80 text-text-secondary text-[12px] font-medium hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Unplug size={13} />
          Disconnect
        </button>
      )}
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium transition-all duration-500 ${
          connected ? 'bg-secondary/80 text-green' : 'bg-red-live/10 text-red-live'
        }`}
      >
        <span
          className={`w-[7px] h-[7px] rounded-full transition-colors duration-500 ${
            connected ? 'bg-green animate-heartbeat' : 'bg-red-live animate-live-pulse'
          }`}
        />
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  </header>
);

export default Header;
