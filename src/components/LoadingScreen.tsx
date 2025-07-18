import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const hashInterval = setInterval(() => {
      const chars = '0123456789abcdef';
      const hash = '0x' + Array.from({ length: 64 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      setCurrentHash(hash);
    }, 100);

    return () => clearInterval(hashInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-cyber text-primary neon-glow mb-2">
            0xDeveloper
          </h1>
          <div className="text-sm text-muted-foreground font-mono">
            Initializing blockchain portfolio...
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/20 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hash Generation */}
        <div className="text-xs font-mono text-muted-foreground mb-4">
          Generating hash: {currentHash.substring(0, 20)}...
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-left">
          {[
            { step: 'Connecting to blockchain network', threshold: 20 },
            { step: 'Loading smart contract data', threshold: 40 },
            { step: 'Verifying block integrity', threshold: 60 },
            { step: 'Rendering 3D timeline', threshold: 80 },
            { step: 'Portfolio ready', threshold: 100 }
          ].map((item, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
                progress >= item.threshold ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                progress >= item.threshold ? 'bg-primary' : 'bg-muted'
              }`} />
              <span>{item.step}</span>
              {progress >= item.threshold && (
                <span className="text-xs text-accent">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress Percentage */}
        <div className="mt-6 text-2xl font-cyber text-primary">
          {progress}%
        </div>
      </div>
    </div>
  );
};