import { useEffect } from 'react';
import { ControlsSidebar } from '@/components/ControlsSidebar';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { useTokenStore } from '@/store/useTokenStore';
import { injectTokensAsCSS } from '@/lib/injectTokens';

export default function BuilderPage() {
  const tokens = useTokenStore((state) => state.tokens);

  // Inject tokens on initial mount
  useEffect(() => {
    injectTokensAsCSS(tokens);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <ControlsSidebar />
      <main className="flex-1 ml-80">
        <PreviewCanvas />
      </main>
    </div>
  );
}
