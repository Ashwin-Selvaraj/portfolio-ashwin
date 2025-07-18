import React from 'react';
import { BlockData } from '@/types/blockchain';

interface TimelineConnectorProps {
  startBlock: BlockData;
  endBlock: BlockData;
  isActive: boolean;
}

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({
  startBlock,
  endBlock,
  isActive
}) => {
  const calculateConnectorPath = () => {
    const startX = startBlock.position.x;
    const startY = startBlock.position.y;
    const endX = endBlock.position.x;
    const endY = endBlock.position.y;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    
    return {
      distance,
      angle: angle * (180 / Math.PI),
      midX: (startX + endX) / 2,
      midY: (startY + endY) / 2
    };
  };

  const { distance, angle, midX, midY } = calculateConnectorPath();
  const deltaX = endBlock.position.x - startBlock.position.x;
  const deltaY = endBlock.position.y - startBlock.position.y;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Main Connector Line */}
      <div
        className={`
          absolute h-0.5 bg-gradient-to-r from-primary via-secondary to-primary
          transition-all duration-1000 ease-out
          ${isActive ? 'opacity-100 shadow-[0_0_10px_hsl(var(--primary))]' : 'opacity-30'}
        `}
        style={{
          width: `${distance * 0.7}px`,
          left: `50%`,
          top: `50%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          transformOrigin: 'left center'
        }}
      />
      
      {/* Animated Data Flow */}
      {isActive && (
        <>
          <div
            className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'flow-pulse 2s ease-in-out infinite'
            }}
          />
          <div
            className="absolute w-1 h-1 bg-secondary rounded-full"
            style={{
              left: '45%',
              top: '45%',
              animation: 'flow-pulse 2s ease-in-out infinite 0.5s'
            }}
          />
        </>
      )}
      
      {/* Hash Verification Indicators */}
      <div
        className={`
          absolute w-1 h-6 bg-gradient-to-b from-transparent via-accent to-transparent
          transition-opacity duration-500
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          left: '25%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: isActive ? 'hash-pulse 1.5s ease-in-out infinite' : undefined
        }}
      />
    </div>
  );
};