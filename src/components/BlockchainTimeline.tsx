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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile touch navigation
  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) return;
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || touchStart === null || isScrolling) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile || touchStart === null || isScrolling) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      setIsScrolling(true);
      const direction = diff > 0 ? 1 : -1;
      const nextBlock = Math.max(0, Math.min(blockchainData.length - 1, activeBlock + direction));
      
      if (nextBlock !== activeBlock) {
        setActiveBlock(nextBlock);
        // Use immediate scroll for mobile
        window.scrollTo({
          top: nextBlock * window.innerHeight,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => setIsScrolling(false), 600);
    }
    
    setTouchStart(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling || isMobile) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentBlockIndex = Math.round(scrollY / windowHeight);
      
      if (currentBlockIndex !== activeBlock && currentBlockIndex < blockchainData.length) {
        setActiveBlock(currentBlockIndex);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isMobile) return; // Let mobile handle touch events
      e.preventDefault();
      if (isScrolling) return;

      const newAccumulator = scrollAccumulator + e.deltaY;
      setScrollAccumulator(newAccumulator);

      const threshold = 50;
      
      if (Math.abs(newAccumulator) > threshold) {
        setIsScrolling(true);
        const direction = newAccumulator > 0 ? 1 : -1;
        const nextBlock = Math.max(0, Math.min(blockchainData.length - 1, activeBlock + direction));
        
        if (nextBlock !== activeBlock) {
          setActiveBlock(nextBlock);
          window.scrollTo({
            top: nextBlock * window.innerHeight,
            behavior: 'smooth'
          });
        }

        setScrollAccumulator(0);
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    if (!isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      // Mobile touch events
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeBlock, isScrolling, isMobile, scrollAccumulator, touchStart]);

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
    <div className={`relative ${isMobile ? 'h-screen overflow-hidden' : ''}`}>
      {/* Transaction Game - Hidden on mobile */}
      <div className="hidden lg:block">
        <TransactionGame
          onTransactionValidated={handleTransactionValidated}
          onFraudDetected={handleFraudDetected}
        />

        {/* Transaction Feedback */}
        <TransactionFeedback
          validatedTransaction={validatedTransaction}
          fraudulentTransaction={fraudulentTransaction}
        />
      </div>

      {/* Timeline Navigation & Progress Indicator */}
      <div className="fixed top-4 right-2 md:right-4 z-50 flex flex-col space-y-1 md:space-y-2">
        {blockchainData.map((block, index) => (
          <button
            key={block.id}
            onClick={() => {
              setActiveBlock(index);
              if (!isMobile) {
                window.scrollTo({
                  top: index * window.innerHeight,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full border transition-all duration-300 ${
              activeBlock === index
                ? 'bg-primary border-primary shadow-[0_0_10px_hsl(var(--primary))]'
                : 'bg-transparent border-muted-foreground hover:border-primary'
            }`}
            title={`Block ${block.blockNumber}: ${block.title}`}
          />
        ))}
      </div>

      {/* Mobile Progress Bar */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2">
          <div className="text-xs text-muted-foreground mb-1">
            {activeBlock + 1} / {blockchainData.length}
          </div>
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((activeBlock + 1) / blockchainData.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Mobile Swipe Indicator */}
      {isMobile && activeBlock === 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 text-center animate-bounce">
          <div className="text-muted-foreground text-sm mb-2">Swipe up to explore</div>
          <div className="w-6 h-8 border border-muted-foreground rounded-full mx-auto flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-muted-foreground rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Main Timeline */}
      <div ref={timelineRef} className={`relative ${isMobile ? '' : 'px-4 md:px-8'}`}>
        {blockchainData.map((block, index) => (
          <div
            key={block.id}
            ref={(el) => blockRefs.current[index] = el}
            className={`${isMobile ? 'h-screen mobile-scroll-item' : 'min-h-[80vh] md:min-h-screen'} flex items-center justify-center relative`}
            style={{ 
              // Mobile: Only show active block with cinematic transitions
              opacity: isMobile 
                ? (activeBlock === index ? 1 : 0) 
                : (Math.abs(index - activeBlock) > 2 ? 0.3 : 1),
              transform: isMobile 
                ? (activeBlock === index 
                    ? 'translateY(0) scale(1)' 
                    : `translateY(${(index - activeBlock) * 100}vh) scale(0.8)`)
                : `translateZ(${(index - activeBlock) * 50}px)`,
              // Mobile: Smooth cinematic transitions
              transition: isMobile 
                ? 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                : 'none',
              // Mobile: Ensure blocks are positioned properly
              ...(isMobile && {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: activeBlock === index ? 10 : 1
              })
            }}
          >
            {/* Timeline Connector - Hidden on mobile */}
            {index < blockchainData.length - 1 && !isMobile && (
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
                transform: isMobile 
                  ? `perspective(800px) rotateX(${activeBlock === index ? 0 : 10}deg) scale(${activeBlock === index ? 0.9 : 0.7})`
                  : `
                      perspective(1000px)
                      rotateX(${(index - activeBlock) * 10}deg)
                      rotateY(${(index - activeBlock) * 5}deg)
                      translateX(${block.position.x}px)
                      translateY(${block.position.y}px)
                      translateZ(${block.position.z + (index - activeBlock) * 100}px)
                      scale(${activeBlock === index ? 1 : 0.8})
                    `,
                transition: isMobile ? 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                // Mobile: Ensure proper sizing and centering
                ...(isMobile && {
                  maxWidth: '90vw',
                  maxHeight: '70vh',
                  margin: 'auto'
                })
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