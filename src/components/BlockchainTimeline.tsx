import React, { useState, useEffect, useRef } from 'react';
import { BlockData } from '@/types/blockchain';
import { blockchainData } from '@/data/blockchainData';
import { BlockComponent } from './BlockComponent';
import { TimelineConnector } from './TimelineConnector';
import { BlockModal } from './BlockModal';
import { TransactionGame } from './TransactionGame';
import { TransactionFeedback } from './TransactionFeedback';

export const BlockchainTimeline: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [validatedTransaction, setValidatedTransaction] = useState<any>(null);
  const [fraudulentTransaction, setFraudulentTransaction] = useState<any>(null);
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isMobile || isScrolling) return;
      e.preventDefault();

      const newAccumulator = scrollAccumulator + e.deltaY;
      setScrollAccumulator(newAccumulator);

      const threshold = 100;
      if (Math.abs(newAccumulator) > threshold) {
        const direction = newAccumulator > 0 ? 1 : -1;
        const nextBlock = Math.max(0, Math.min(blockchainData.length - 1, activeBlock + direction));

        if (nextBlock !== activeBlock) {
          setIsScrolling(true);
          setActiveBlock(nextBlock);
          window.scrollTo({
            top: nextBlock * window.innerHeight,
            behavior: 'smooth',
          });
          setScrollAccumulator(0);
          setTimeout(() => setIsScrolling(false), 700);
        }
      }
    };

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobile) return;
      touchStartY = e.changedTouches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isMobile || isScrolling) return;
      touchEndY = e.changedTouches[0].clientY;
      const swipe = touchStartY - touchEndY;

      if (Math.abs(swipe) > 50) {
        const direction = swipe > 0 ? 1 : -1;
        const nextBlock = Math.max(0, Math.min(blockchainData.length - 1, activeBlock + direction));
        if (nextBlock !== activeBlock) {
          setIsScrolling(true);
          setActiveBlock(nextBlock);
          setTimeout(() => setIsScrolling(false), 700);
        }
      }
    };

    if (!isMobile) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeBlock, isMobile, isScrolling, scrollAccumulator]);

  useEffect(() => {
    window.scrollTo({
      top: activeBlock * window.innerHeight,
      behavior: 'smooth',
    });
  }, [activeBlock]);

  const handleBlockClick = (blockId: string) => {
    setExpandedBlock(blockId);
  };

  const handleTransactionValidated = (transaction: any) => {
    setValidatedTransaction(transaction);
    setTimeout(() => setValidatedTransaction(null), 100);
  };

  const handleFraudDetected = (transaction: any) => {
    setFraudulentTransaction(transaction);
    setTimeout(() => setFraudulentTransaction(null), 100);
  };

  return (
    <div className="relative">
      <div className="hidden lg:block">
        <TransactionGame
          onTransactionValidated={handleTransactionValidated}
          onFraudDetected={handleFraudDetected}
        />
        <TransactionFeedback
          validatedTransaction={validatedTransaction}
          fraudulentTransaction={fraudulentTransaction}
        />
      </div>

      <div className="fixed top-4 right-2 md:right-4 z-50 flex flex-col space-y-2">
        {blockchainData.map((block, index) => (
          <button
            key={block.id}
            onClick={() => setActiveBlock(index)}
            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
              activeBlock === index
                ? 'bg-primary border-primary shadow-[0_0_10px_hsl(var(--primary))]'
                : 'bg-transparent border-muted-foreground hover:border-primary'
            }`}
            title={`Block ${block.blockNumber}: ${block.title}`}
          />
        ))}
      </div>

      <div
        ref={timelineRef}
        className="relative px-4 md:px-8"
        style={{
          height: `${blockchainData.length * 100}vh`,
          overflow: 'hidden',
        }}
      >
        {blockchainData.map((block, index) => (
          <div
            key={block.id}
            ref={(el) => (blockRefs.current[index] = el)}
            className="min-h-screen flex items-center justify-center relative"
            style={{
              transform: isMobile
                ? `translateY(${(index - activeBlock) * 100}vh)`
                : `translateZ(${(index - activeBlock) * 50}px)`,
              opacity: isMobile ? (activeBlock === index ? 1 : 0) : 1,
              position: isMobile ? 'absolute' : 'relative',
              transition: 'transform 0.8s ease, opacity 0.8s ease',
              width: '100%',
              top: 0,
            }}
          >
            {index < blockchainData.length - 1 && !isMobile && (
              <TimelineConnector
                startBlock={block}
                endBlock={blockchainData[index + 1]}
                isActive={activeBlock >= index}
              />
            )}
            <BlockComponent
              block={block}
              isActive={activeBlock === index}
              isPrevious={activeBlock > index}
              isNext={activeBlock < index}
              onClick={() => handleBlockClick(block.id)}
              style={{
                transform: isMobile
                  ? 'none'
                  : `
                    perspective(1000px)
                    rotateX(${(index - activeBlock) * 10}deg)
                    rotateY(${(index - activeBlock) * 5}deg)
                    translateX(${block.position.x}px)
                    translateY(${block.position.y}px)
                    translateZ(${block.position.z + (index - activeBlock) * 100}px)
                    scale(${activeBlock === index ? 1 : 0.8})
                  `,
              }}
            />
          </div>
        ))}
      </div>

      {expandedBlock && (
        <BlockModal
          block={blockchainData.find((b) => b.id === expandedBlock)!}
          onClose={() => setExpandedBlock(null)}
        />
      )}

      <div className="fixed bottom-4 left-2 md:left-4 z-40 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 md:p-4 max-w-[200px] md:max-w-sm">
        <div className="text-xs md:text-sm text-muted-foreground font-mono">
          Block #{blockchainData[activeBlock]?.blockNumber}
        </div>
        <div className="text-primary font-cyber font-bold text-sm md:text-base truncate">
          {blockchainData[activeBlock]?.title}
        </div>
        <div className="text-[10px] md:text-xs text-muted-foreground">
          Hash: {blockchainData[activeBlock]?.hash.substring(0, 12)}...
        </div>
      </div>
    </div>
  );
};
