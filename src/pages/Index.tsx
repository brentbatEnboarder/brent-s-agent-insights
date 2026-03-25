import Header from '@/components/Header';
import CollapsedTurn from '@/components/CollapsedTurn';
import ExpandedTurn from '@/components/ExpandedTurn';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-16 pb-12 px-4 max-w-4xl mx-auto space-y-3">
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
      <ExpandedTurn />
    </main>
  </div>
);

export default Index;
