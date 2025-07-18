import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  amount: number;
  from: string;
  to: string;
  isFraudulent: boolean;
  position: { x: number; y: number };
  animationDelay: number;
}

interface TransactionGameProps {
  onTransactionValidated: (transaction: Transaction) => void;
  onFraudDetected: (transaction: Transaction) => void;
}

export const TransactionGame: React.FC<TransactionGameProps> = ({
  onTransactionValidated,
  onFraudDetected
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [validatedCount, setValidatedCount] = useState(0);
  const [fraudCount, setFraudCount] = useState(0);

  const generateTransactionHash = () => {
    return Array.from({ length: 12 }, () => 
      Math.random().toString(16).charAt(0)
    ).join('');
  };

  const generateRandomAddress = () => {
    return '0x' + Array.from({ length: 8 }, () => 
      Math.random().toString(16).charAt(0)
    ).join('');
  };

  const createTransaction = useCallback((): Transaction => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      hash: generateTransactionHash(),
      amount: Math.random() * 10,
      from: generateRandomAddress(),
      to: generateRandomAddress(),
      isFraudulent: Math.random() < 0.15, // 15% chance of fraud
      position: {
        x: Math.random() * (window.innerWidth - 120), // Smaller width for smaller boxes
        y: -100 // Start from above the screen
      },
      animationDelay: Math.random() * 2
    };
  }, []);

  useEffect(() => {
    // Generate initial transactions
    const initialTransactions = Array.from({ length: 4 }, createTransaction);
    setTransactions(initialTransactions);

    // Continuously spawn new transactions
    const interval = setInterval(() => {
      setTransactions(prev => {
        if (prev.length < 8) {
          return [...prev, createTransaction()];
        }
        return prev;
      });
    }, 2000);

    // Auto-remove transactions that fall off screen
    const cleanupInterval = setInterval(() => {
      setTransactions(prev => prev.filter(t => {
        const element = document.getElementById(`transaction-${t.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top < window.innerHeight + 100; // Remove when off screen
        }
        return true;
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [createTransaction]);

  const handleTransactionClick = (transaction: Transaction) => {
    // Remove transaction from display
    setTransactions(prev => prev.filter(t => t.id !== transaction.id));

    if (transaction.isFraudulent) {
      setFraudCount(prev => prev + 1);
      onFraudDetected(transaction);
    } else {
      setValidatedCount(prev => prev + 1);
      onTransactionValidated(transaction);
    }
  };

  return (
    <>
      {/* Game Stats */}
      <div className="fixed top-20 left-4 z-40 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
        <div className="text-xs text-muted-foreground font-mono">Validator Stats</div>
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">{validatedCount}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-bold">{fraudCount}</span>
        </div>
      </div>

      {/* Floating Transactions */}
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          id={`transaction-${transaction.id}`}
          className="fixed pointer-events-auto cursor-pointer z-20 group animate-fall"
          style={{
            left: transaction.position.x,
            top: transaction.position.y,
            animationDelay: `${transaction.animationDelay}s`,
            animationDuration: '8s',
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards'
          }}
          onClick={() => handleTransactionClick(transaction)}
        >
          <div
            className={`
              relative p-2 rounded border backdrop-blur-sm
              transition-all duration-200 hover:scale-110
              font-mono text-[10px] w-20 h-16
              ${transaction.isFraudulent 
                ? 'bg-red-900/20 border-red-400/30 text-red-300 hover:bg-red-800/30' 
                : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
              }
            `}
          >
            {/* Transaction Header */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] opacity-60">TX</span>
              {transaction.isFraudulent && (
                <AlertTriangle className="w-2 h-2 text-red-400 opacity-60" />
              )}
            </div>

            {/* Transaction Hash - shortened */}
            <div className="font-bold mb-1 text-[8px] truncate">
              {transaction.hash.substring(0, 8)}
            </div>

            {/* Amount */}
            <div className="text-[8px] opacity-80 truncate">
              {transaction.amount.toFixed(2)} ETH
            </div>

            {/* Hover tooltip */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card border border-border rounded px-1 py-0.5 text-[8px] whitespace-nowrap z-10">
              Click to validate
            </div>

            {/* Glow effect for fraudulent transactions */}
            {transaction.isFraudulent && (
              <div className="absolute inset-0 -z-10 bg-red-400/20 blur-sm rounded animate-pulse" />
            )}
          </div>
        </div>
      ))}
    </>
  );
};