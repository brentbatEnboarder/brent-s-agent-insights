import { useState, useEffect, useRef } from 'react';

const thinkingText = `The user is asking about the hospital project. Let me check OpenBrain for any stored context about this... I found relevant entries about Enboarder's AI agent platform pivot. The key details are: it's an internal codename, the vision is transforming Enboarder from workflow automation to an AI agent platform, and the tagline from their brainstorming session was "The Canva for AI agents." Let me synthesize this into a clear summary.`;

const ReasoningSection = () => {
  const [expanded, setExpanded] = useState(false);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startStreaming = () => {
    setDisplayedChars(0);
    setStreaming(true);
  };

  useEffect(() => {
    if (!streaming) return;
    intervalRef.current = setInterval(() => {
      setDisplayedChars(prev => {
        if (prev >= thinkingText.length) {
          clearInterval(intervalRef.current);
          setStreaming(false);
          return thinkingText.length;
        }
        return prev + 1;
      });
    }, 1000 / 30); // 30 chars/sec
    return () => clearInterval(intervalRef.current);
  }, [streaming]);

  const handleToggle = () => {
    if (!expanded) {
      setExpanded(true);
      startStreaming();
    } else {
      setExpanded(false);
      setStreaming(false);
    }
  };

  return (
    <section>
      {/* Phase header with toggle */}
      <div className="flex items-center gap-3 mb-3 cursor-pointer group" onClick={handleToggle}>
        <span className="flex-1 h-px bg-divider" />
        <span className="text-[11px] uppercase tracking-[2px] text-text-muted font-semibold select-none">Reasoning</span>
        <span className="flex-1 h-px bg-divider" />
        <button className="text-cyan text-[11px] opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0 select-none">
          {expanded ? '▾ hide thinking' : '▸ view thinking'}
        </button>
      </div>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: expanded ? '300px' : '0',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div
          className="rounded-md border-l-2 px-4 py-3.5 ml-1"
          style={{
            backgroundColor: 'rgba(206, 147, 216, 0.05)',
            borderLeftColor: 'rgba(206, 147, 216, 0.3)',
          }}
        >
          <p
            className="text-[14px] font-light italic leading-[1.8] select-text"
            style={{ color: '#B0A0C0' }}
          >
            {expanded ? thinkingText.slice(0, displayedChars) : ''}
            {streaming && (
              <span
                className="inline-block w-[1.5px] h-[1em] ml-[1px] align-text-bottom"
                style={{
                  backgroundColor: '#B0A0C0',
                  animation: 'cursor-blink 1s step-end infinite',
                }}
              />
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReasoningSection;
