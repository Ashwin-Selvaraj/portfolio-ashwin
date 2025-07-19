import React, { useState } from 'react';
import { BlockchainTimeline } from '@/components/BlockchainTimeline';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-card to-background">
      {/* 3D Blockchain Portfolio */}
      <BlockchainTimeline />
    </div>
  );
};

export default Index;
