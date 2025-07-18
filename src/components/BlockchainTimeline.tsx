import React, { useState, useEffect, useRef } from 'react';
import { BlockData } from '@/types/blockchain';
import { blockchainData } from '@/data/blockchainData';
import { BlockComponent } from './BlockComponent';
import { TimelineConnector } from './TimelineConnector';
import { BlockModal } from './BlockModal';

export const BlockchainTimeline: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentBlockIndex = Math.round(scrollY / windowHeight);
      
      if (currentBlockIndex !== activeBlock && currentBlockIndex < blockchainData.length) {
        setActiveBlock(currentBlockIndex);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      setIsScrolling(true);
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextBlock = Math.max(0, Math.min(blockchainData.length - 1, activeBlock + direction));
      
      if (nextBlock !== activeBlock) {
        setActiveBlock(nextBlock);
        window.scrollTo({
          top: nextBlock * window.innerHeight,
          behavior: 'smooth'
        });
      }

      setTimeout(() => setIsScrolling(false), 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeBlock, isScrolling]);

  const handleBlockClick = (blockId: string) => {
    setExpandedBlock(blockId);
  };

  return (
    <div className="relative">
      {/* Background Matrix Rain Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary opacity-20 text-xs font-mono animate-matrix"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          >
            {Array.from({ length: 10 }, () => 
              Math.random().toString(16).charAt(0)
            ).join('\n')}
          </div>
        ))}
      </div>

      {/* Timeline Navigation */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {blockchainData.map((block, index) => (
          <button
            key={block.id}
            onClick={() => {
              setActiveBlock(index);
              window.scrollTo({
                top: index * window.innerHeight,
                behavior: 'smooth'
              });
            }}
            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
              activeBlock === index
                ? 'bg-primary border-primary shadow-[0_0_10px_hsl(var(--primary))]'
                : 'bg-transparent border-muted-foreground hover:border-primary'
            }`}
            title={`Block ${block.blockNumber}: ${block.title}`}
          />
        ))}
      </div>

      {/* Main Timeline */}
      <div ref={timelineRef} className="relative">
        {blockchainData.map((block, index) => (
          <div
            key={block.id}
            ref={(el) => blockRefs.current[index] = el}
            className="min-h-screen flex items-center justify-center relative"
            style={{ 
              transform: `translateZ(${(index - activeBlock) * 50}px)`,
              opacity: Math.abs(index - activeBlock) > 2 ? 0.3 : 1
            }}
          >
            {/* Timeline Connector */}
            {index < blockchainData.length - 1 && (
              <TimelineConnector
                startBlock={block}
                endBlock={blockchainData[index + 1]}
                isActive={activeBlock >= index}
              />
            )}

            {/* Block Component */}
            <BlockComponent
              block={block}
              isActive={activeBlock === index}
              isPrevious={activeBlock > index}
              isNext={activeBlock < index}
              onClick={() => handleBlockClick(block.id)}
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${(index - activeBlock) * 10}deg)
                  rotateY(${(index - activeBlock) * 5}deg)
                  translateX(${block.position.x}px)
                  translateY(${block.position.y}px)
                  translateZ(${block.position.z + (index - activeBlock) * 100}px)
                  scale(${activeBlock === index ? 1 : 0.8})
                `
              }}
            />
          </div>
        ))}
      </div>

      {/* Block Details Modal */}
      {expandedBlock && (
        <BlockModal
          block={blockchainData.find(b => b.id === expandedBlock)!}
          onClose={() => setExpandedBlock(null)}
        />
      )}

      {/* Current Block Info */}
      <div className="fixed bottom-4 left-4 z-40 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 max-w-sm">
        <div className="text-sm text-muted-foreground font-mono">
          Block #{blockchainData[activeBlock]?.blockNumber}
        </div>
        <div className="text-primary font-cyber font-bold">
          {blockchainData[activeBlock]?.title}
        </div>
        <div className="text-xs text-muted-foreground">
          Hash: {blockchainData[activeBlock]?.hash.substring(0, 16)}...
        </div>
      </div>
    </div>
  );
};