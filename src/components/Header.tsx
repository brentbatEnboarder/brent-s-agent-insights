const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border">
    <h1 className="text-lg font-semibold tracking-tight text-foreground">
      🧠 BrentsOCTypeAgent
    </h1>
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-green text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-green animate-heartbeat" />
      Connected
    </div>
  </header>
);

export default Header;
