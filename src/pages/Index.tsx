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
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 md:px-6">
          <div className="mb-6 md:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-cyber font-black text-primary neon-glow mb-2 md:mb-4">
              0xDeveloper
            </h1>
            <div className="text-lg sm:text-xl md:text-2xl text-secondary font-mono mb-4 md:mb-6">
              Blockchain Engineer & Smart Contract Architect
            </div>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore my journey through the blockchain ecosystem. Each block below represents 
              a milestone in my evolution from curious student to expert blockchain developer.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center space-y-2 md:space-y-3">
            <div className="text-xs md:text-sm text-muted-foreground font-mono">
              Scroll or use <span className="hidden md:inline">mouse wheel to</span> navigate
            </div>
            <div className="w-4 h-8 md:w-6 md:h-10 border-2 border-primary rounded-full flex justify-center">
              <div className="w-0.5 h-1 md:w-1 md:h-2 bg-primary rounded-full mt-1 md:mt-2 animate-bounce" />
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
