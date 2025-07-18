import React, { useState } from 'react';
import { BlockchainTimeline } from '@/components/BlockchainTimeline';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Section with animated introduction */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'float 20s ease-in-out infinite'
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-cyber font-black text-primary neon-glow mb-4">
              0xDeveloper
            </h1>
            <div className="text-xl md:text-2xl text-secondary font-mono mb-6">
              Blockchain Engineer & Smart Contract Architect
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore my journey through the blockchain ecosystem. Each block below represents 
              a milestone in my evolution from curious student to expert blockchain developer.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center space-y-3">
            <div className="text-sm text-muted-foreground font-mono">
              Scroll or use mouse wheel to navigate
            </div>
            <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
              <div className="w-1 h-2 bg-primary rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Timeline */}
      <BlockchainTimeline />
    </div>
  );
};

export default Index;
