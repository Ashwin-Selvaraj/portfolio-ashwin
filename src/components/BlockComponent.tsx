import React from 'react';
import { BlockData } from '@/types/blockchain';
import { Clock, Hash, Database, ArrowRight } from 'lucide-react';

interface BlockComponentProps {
  block: BlockData;
  isActive: boolean;
  isPrevious: boolean;
  isNext: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const BlockComponent: React.FC<BlockComponentProps> = ({
  block,
  isActive,
  isPrevious,
  isNext,
  onClick,
  style
}) => {
  return (
    <div
      className={`
        blockchain-block cursor-pointer
        transition-all duration-700 ease-out
        ${isActive ? 'active scale-105 md:scale-110' : ''}
        ${isPrevious ? 'opacity-70' : ''}
        ${isNext ? 'opacity-50' : ''}
        transform-gpu
        hash-flow
        w-[280px] sm:w-[320px] md:w-auto
        mx-auto
      `}
      style={style}
      onClick={onClick}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Database className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          </div>
          <div>
            <div className="text-[10px] md:text-xs text-muted-foreground font-mono">
              Block #{block.blockNumber}
            </div>
            <div className="text-xs md:text-sm text-primary font-bold truncate max-w-[150px] md:max-w-none">
              {block.title}
            </div>
          </div>
        </div>
        {isActive && (
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary animate-bounce" />
        )}
      </div>

      {/* Block Content */}
      <div className="space-y-2 md:space-y-3">
        <h3 className="text-sm md:text-lg font-cyber text-foreground neon-glow">
          {block.subtitle}
        </h3>
        
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">
          {block.description}
        </p>

        {/* Timestamp */}
        <div className="flex items-center space-x-2 text-[10px] md:text-xs text-muted-foreground">
          <Clock className="w-2 h-2 md:w-3 md:h-3" />
          <span className="font-mono">
            {new Date(block.timestamp).toLocaleDateString()}
          </span>
        </div>

        {/* Hash Display */}
        <div className="flex items-center space-x-2 text-[10px] md:text-xs">
          <Hash className="w-2 h-2 md:w-3 md:h-3 text-primary" />
          <span className="font-mono text-primary">
            {block.hash.substring(0, window.innerWidth < 768 ? 12 : 20)}...
          </span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
      
      {/* Active Block Glow */}
      {isActive && (
        <div className="absolute inset-0 -z-10 bg-primary/10 blur-xl rounded-lg animate-pulse-glow" />
      )}
    </div>
  );
};